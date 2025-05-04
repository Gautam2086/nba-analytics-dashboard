/**
 * NBA Database Setup Script
 * 
 * This script sets up the NBA database schema on the remote Tembo.io PostgreSQL instance
 * It will import the schema and data from the create.sql and load.sql files
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database configuration for Tembo.io
const dbConfig = {
  user: 'postgres',
  password: 'y5XNtw6SISxqJQXt',
  host: 'impurely-accepting-reptile.data-1.use1.tembo.io',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

async function setupDatabase() {
  console.log('Starting database setup...');
  const client = await pool.connect();

  try {
    // Create the nba schema if it doesn't exist
    console.log('Creating NBA schema...');
    await client.query('CREATE SCHEMA IF NOT EXISTS nba');
    
    // Read the create.sql file from the project root
    console.log('Reading create.sql file...');
    const createSqlPath = path.join(__dirname, '../../create.sql');
    const createSql = fs.readFileSync(createSqlPath, 'utf8');
    
    // Execute the create.sql script
    console.log('Executing create.sql script...');
    await client.query(createSql);
    
    // Read the load.sql file from the project root
    console.log('Reading load.sql file...');
    const loadSqlPath = path.join(__dirname, '../../load.sql');
    const loadSql = fs.readFileSync(loadSqlPath, 'utf8');
    
    // Execute the load.sql script
    console.log('Executing load.sql script...');
    await client.query(loadSql);
    
    // Execute the advanced features script
    console.log('Reading advanced_features.sql file...');
    const advancedFeaturesPath = path.join(__dirname, '../../advanced_features.sql');
    const advancedFeaturesSql = fs.readFileSync(advancedFeaturesPath, 'utf8');
    
    console.log('Executing advanced_features.sql script...');
    await client.query(advancedFeaturesSql);
    
    console.log('Database setup completed successfully!');
    
    // Verify setup by counting records in major tables
    const teamCount = await client.query('SELECT COUNT(*) FROM nba.team');
    const playerCount = await client.query('SELECT COUNT(*) FROM nba.player');
    const gameCount = await client.query('SELECT COUNT(*) FROM nba.game');
    
    console.log(`Verification: ${teamCount.rows[0].count} teams, ${playerCount.rows[0].count} players, ${gameCount.rows[0].count} games`);
    
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

setupDatabase(); 