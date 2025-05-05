// NBA Analytics Dashboard - Server
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Database configuration
let dbConfig;

// Check if DATABASE_URL environment variable exists (for deployment)
if (process.env.DATABASE_URL) {
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      // Additional ssl options to handle self-signed certificates
      checkServerIdentity: () => undefined
    }
  };
} else {
  // Local database configuration using remote Tembo.io database
  dbConfig = {
    user: 'postgres',
    host: 'impurely-accepting-reptile.data-1.use1.tembo.io',
    database: 'postgres',
    password: 'y5XNtw6SlSxqJQXt',
    port: 5432,
    schema: 'nba',
    ssl: {
      rejectUnauthorized: false,
      // Additional ssl options to handle self-signed certificates
      checkServerIdentity: () => undefined
    }
  };
}

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve files from the root directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for deployment platforms
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

// API Routes

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nba.team ORDER BY full_name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Error fetching teams' });
  }
});

// Get team statistics
app.get('/api/team/:teamId/stats', async (req, res) => {
  const teamId = req.params.teamId;
  
  try {
    // Get team statistics from games where team played as home
    const homeGamesQuery = `
      SELECT
        AVG(pts_home) as avg_points,
        AVG(ast_home) as avg_assists,
        AVG(reb_home) as avg_rebounds,
        COUNT(*) as games_played,
        SUM(CASE WHEN wl_home = 'W' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN wl_home = 'L' THEN 1 ELSE 0 END) as losses
      FROM nba.game
      WHERE team_id_home = $1
    `;
    
    // Get team statistics from games where team played as away
    const awayGamesQuery = `
      SELECT
        AVG(pts_away) as avg_points,
        AVG(ast_away) as avg_assists,
        AVG(reb_away) as avg_rebounds,
        COUNT(*) as games_played,
        SUM(CASE WHEN wl_away = 'W' THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN wl_away = 'L' THEN 1 ELSE 0 END) as losses
      FROM nba.game
      WHERE team_id_away = $1
    `;
    
    const homeStats = await pool.query(homeGamesQuery, [teamId]);
    const awayStats = await pool.query(awayGamesQuery, [teamId]);
    
    // Combine and average stats
    const homeData = homeStats.rows[0];
    const awayData = awayStats.rows[0];
    
    const totalGames = parseInt(homeData.games_played) + parseInt(awayData.games_played);
    const totalWins = parseInt(homeData.wins) + parseInt(awayData.wins);
    const totalLosses = parseInt(homeData.losses) + parseInt(awayData.losses);
    
    // Calculate weighted averages
    const avgPoints = (parseFloat(homeData.avg_points) * parseInt(homeData.games_played) + 
                      parseFloat(awayData.avg_points) * parseInt(awayData.games_played)) / totalGames;
    
    const avgAssists = (parseFloat(homeData.avg_assists) * parseInt(homeData.games_played) + 
                       parseFloat(awayData.avg_assists) * parseInt(awayData.games_played)) / totalGames;
    
    const avgRebounds = (parseFloat(homeData.avg_rebounds) * parseInt(homeData.games_played) + 
                        parseFloat(awayData.avg_rebounds) * parseInt(awayData.games_played)) / totalGames;
    
    res.json({
      team_id: teamId,
      avg_points: avgPoints.toFixed(1),
      avg_assists: avgAssists.toFixed(1),
      avg_rebounds: avgRebounds.toFixed(1),
      games_played: totalGames,
      wins: totalWins,
      losses: totalLosses,
      win_percentage: (totalWins / totalGames * 100).toFixed(1)
    });
  } catch (err) {
    console.error('Error fetching team stats:', err);
    res.status(500).json({ error: 'Error fetching team stats' });
  }
});

// Get top scorers
app.get('/api/players/top-scorers', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.player_id,
        p.full_name,
        COUNT(g.game_id) as games_played,
        ROUND(AVG(CASE 
          WHEN g.team_id_home = cpi.team_id THEN g.pts_home / 5  -- Approximation, dividing team points
          WHEN g.team_id_away = cpi.team_id THEN g.pts_away / 5  -- by average starters (5)
          ELSE 0 
        END), 1) as ppg
      FROM nba.player p
      JOIN nba.common_player_info cpi ON p.player_id = cpi.person_id
      JOIN nba.game g ON (cpi.team_id = g.team_id_home OR cpi.team_id = g.team_id_away)
      WHERE p.is_active = 1
      GROUP BY p.player_id, p.full_name
      HAVING COUNT(g.game_id) > 20
      ORDER BY ppg DESC
      LIMIT 10
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top scorers:', err);
    res.status(500).json({ error: 'Error fetching top scorers' });
  }
});

// Execute custom SQL query
app.post('/api/execute-query', async (req, res) => {
  console.log('API endpoint hit: /api/execute-query');
  console.log('Request body:', req.body);
  
  const { query } = req.body;
  
  // Simple validation
  if (!query) {
    console.log('Error: Query is required');
    return res.status(400).json({ error: 'Query is required' });
  }
  
  // For security, restrict to only SELECT queries
  if (!query.trim().toLowerCase().startsWith('select')) {
    console.log('Error: Only SELECT queries are allowed');
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }
  
  try {
    console.log('Executing query:', query);
    const result = await pool.query(query);
    console.log('Query result:', { rowCount: result.rowCount, fields: result.fields.map(f => f.name) });
    
    const response = {
      success: true,
      rowCount: result.rowCount,
      fields: result.fields.map(f => f.name),
      rows: result.rows
    };
    
    console.log('Sending response:', JSON.stringify(response).substring(0, 200) + '...');
    res.json(response);
  } catch (err) {
    console.error('Error executing custom query:', err);
    res.status(500).json({ 
      error: 'Error executing query', 
      message: err.message,
      success: false
    });
  }
});

// Get game data for comparison
app.get('/api/games/comparison', async (req, res) => {
  const { team1, team2 } = req.query;
  
  if (!team1 || !team2) {
    return res.status(400).json({ error: 'Two team IDs are required' });
  }
  
  try {
    const query = `
      SELECT 
        g.game_id,
        g.game_date,
        CASE
          WHEN g.team_id_home = $1 AND g.team_id_away = $2 THEN g.pts_home
          WHEN g.team_id_home = $2 AND g.team_id_away = $1 THEN g.pts_away
        END AS team1_points,
        CASE
          WHEN g.team_id_home = $1 AND g.team_id_away = $2 THEN g.pts_away
          WHEN g.team_id_home = $2 AND g.team_id_away = $1 THEN g.pts_home
        END AS team2_points,
        CASE
          WHEN (g.team_id_home = $1 AND g.wl_home = 'W') OR (g.team_id_away = $1 AND g.wl_away = 'W') THEN 1
          ELSE 0
        END AS team1_won
      FROM nba.game g
      WHERE (g.team_id_home = $1 AND g.team_id_away = $2) OR (g.team_id_home = $2 AND g.team_id_away = $1)
      ORDER BY g.game_date DESC
      LIMIT 10
    `;
    
    const result = await pool.query(query, [team1, team2]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching game comparison:', err);
    res.status(500).json({ error: 'Error fetching game comparison' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`NBA Analytics Dashboard server running on port ${port}`);
}); 