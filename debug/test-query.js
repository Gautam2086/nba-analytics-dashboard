/**
 * Test script to directly execute a query against the database
 */

const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  user: 'postgres',
  password: 'y5XNtw6SlSxqJQXt',
  host: 'impurely-accepting-reptile.data-1.use1.tembo.io',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

// Set of test queries
const testQueries = [
  {
    name: "Simple Team Query",
    query: "SELECT * FROM nba.team LIMIT 5"
  },
  {
    name: "Player Query",
    query: "SELECT player_id, full_name FROM nba.player LIMIT 5"
  },
  {
    name: "Game Query",
    query: "SELECT game_id, team_name_home, team_name_away FROM nba.game LIMIT 5"
  },
  {
    name: "Join Query",
    query: `
      SELECT p.full_name, t.full_name as team_name
      FROM nba.player p
      JOIN nba.common_player_info cpi ON p.player_id = cpi.person_id
      JOIN nba.team t ON cpi.team_id = t.team_id
      LIMIT 5
    `
  }
];

async function runTests() {
  const client = await pool.connect();
  
  try {
    // Set search_path to nba schema to ensure queries work
    await client.query('SET search_path TO nba, public');
    
    // Run all test queries
    for (const test of testQueries) {
      console.log(`\n--- Running Test: ${test.name} ---`);
      console.log(`Query: ${test.query}`);
      
      try {
        const startTime = new Date();
        const result = await client.query(test.query);
        const endTime = new Date();
        const executionTime = endTime - startTime;
        
        console.log(`Execution time: ${executionTime}ms`);
        console.log(`Rows returned: ${result.rows.length}`);
        console.log('Sample result:', JSON.stringify(result.rows[0], null, 2));
        console.log('Success! ✅');
      } catch (err) {
        console.error('Error executing query:', err.message);
        console.log('Failed! ❌');
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test script failed:', err);
}); 