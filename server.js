// NBA Analytics Dashboard - Server
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Load environment variables from .env file if present
if (fs.existsSync('.env')) {
  require('dotenv').config();
}

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Database configuration
let dbConfig;

// Check if DATABASE_URL environment variable exists (for deployment)
if (process.env.DATABASE_URL) {
  // For render.com deployment - use the simplest possible configuration
  console.log('Using DATABASE_URL for connection');
  
  // Parse the connection string to extract components
  const connectionString = process.env.DATABASE_URL;
  const match = connectionString.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (match) {
    const [, user, password, host, port, database] = match;
    
    // Use direct configuration instead of connection string
    dbConfig = {
      user,
      password,
      host,
      port: parseInt(port, 10),
      database: database.split('?')[0], // Remove query parameters
      ssl: {
        rejectUnauthorized: false
      }
    };
    
    console.log('Parsed DATABASE_URL into direct configuration (password redacted)');
  } else {
    // Fallback to connection string if parsing fails
    dbConfig = {
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    };
    console.log('Using connection string directly with SSL disabled');
  }
} else {
  // Local database configuration using remote Tembo.io database
  console.log('Using local database configuration');
  dbConfig = {
    user: 'postgres',
    host: 'impurely-accepting-reptile.data-1.use1.tembo.io',
    database: 'postgres',
    password: 'y5XNtw6SlSxqJQXt',
    port: 5432,
    schema: 'nba',
    ssl: {
      rejectUnauthorized: false
    }
  };
}

console.log('Database configuration (without sensitive data):', {
  host: dbConfig.host || 'from connection string',
  database: dbConfig.database || 'from connection string',
  ssl: !!dbConfig.ssl
});

// Create a PostgreSQL connection pool with a limited number of clients
const pool = new Pool({
  ...dbConfig,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000 // Return an error after 10 seconds if connection not established
});

// Connection error handler
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't crash the server on connection errors
  console.error('Database connection error occurred, but server will continue running');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint for deployment platforms
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Database connected successfully:', result.rows[0]);
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database connection error:', err.stack);
    
    if (err.message && (
      err.message.includes('self-signed certificate') || 
      err.message.includes('certificate') || 
      err.message.includes('SSL') || 
      err.message.includes('EOF')
    )) {
      console.error('SSL Certificate Error. Please check your DATABASE_URL configuration.');
      console.error('If using render.com, try setting the DATABASE_URL with sslmode=no-verify');
      console.error('Example: postgres://user:password@host:port/database?sslmode=no-verify');
    }
    
    return false;
  }
}

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
  const { query } = req.body;
  
  // Simple validation
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  // For security, restrict to only SELECT queries
  if (!query.trim().toLowerCase().startsWith('select')) {
    return res.status(403).json({ error: 'Only SELECT queries are allowed' });
  }
  
  let client;
  try {
    console.log('Executing query:', query);
    
    // Get a client from the pool with a timeout
    try {
      client = await pool.connect();
    } catch (connErr) {
      console.error('Failed to get database client:', connErr.message);
      return res.status(500).json({
        error: 'Database connection error',
        message: 'Could not connect to the database. Please try again later.',
        success: false
      });
    }
    
    // Execute the query with a timeout
    let result;
    try {
      // Set a query timeout of 10 seconds
      result = await Promise.race([
        client.query(query),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
        )
      ]);
      
      console.log('Query executed successfully with', result.rowCount, 'rows');
    } catch (queryErr) {
      console.error('Query execution error:', queryErr.message);
      throw queryErr; // Re-throw to be caught by the outer catch
    } finally {
      // Always release the client back to the pool
      if (client) {
        client.release();
        console.log('Database client released back to pool');
      }
    }
    
    // Send the successful response
    res.json({
      success: true,
      rowCount: result.rowCount,
      fields: result.fields.map(f => f.name),
      rows: result.rows
    });
  } catch (err) {
    console.error('Error executing custom query:', err);
    
    // Check for SSL certificate errors
    if (err.message && (
      err.message.includes('self-signed certificate') || 
      err.message.includes('certificate') || 
      err.message.includes('SSL') || 
      err.message.includes('EOF')
    )) {
      console.error('SSL Certificate Error. This is likely due to SSL configuration issues.');
      
      return res.status(500).json({ 
        error: 'Database SSL connection error', 
        message: 'Could not establish a secure connection to the database. Please try again later.',
        success: false
      });
    }
    
    // Handle timeout errors
    if (err.message && err.message.includes('timeout')) {
      return res.status(504).json({
        error: 'Query timeout',
        message: 'The query took too long to execute. Please try a simpler query.',
        success: false
      });
    }
    
    // General error response
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
const server = app.listen(port, async () => {
  console.log(`NBA Analytics Dashboard server running on port ${port}`);
  
  // Test the database connection after server starts
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.warn('Server is running but database connection failed. Some features may not work correctly.');
  }
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});