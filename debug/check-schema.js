/**
 * Script to test schema access for tables
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

// Test queries to run
const tests = [
  {
    name: "With schema prefix",
    query: "SELECT * FROM nba.player LIMIT 3"
  },
  {
    name: "Without schema prefix",
    query: "SELECT * FROM player LIMIT 3"
  },
  {
    name: "With search_path set",
    setup: "SET search_path TO nba, public",
    query: "SELECT * FROM player LIMIT 3"
  },
  {
    name: "Schema check",
    query: "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name"
  },
  {
    name: "Tables in NBA schema",
    query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'nba' ORDER BY table_name"
  }
];

async function runTests() {
  const client = await pool.connect();
  
  try {
    for (const test of tests) {
      console.log(`\n--- Running Test: ${test.name} ---`);
      
      // Run any setup queries
      if (test.setup) {
        console.log(`Running setup: ${test.setup}`);
        await client.query(test.setup);
      }
      
      // Run the test query
      console.log(`Query: ${test.query}`);
      
      try {
        const result = await client.query(test.query);
        console.log(`Success! Rows returned: ${result.rows.length}`);
        if (result.rows.length > 0) {
          console.log('Sample row:', JSON.stringify(result.rows[0], null, 2));
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Script failed:', err);
}); 