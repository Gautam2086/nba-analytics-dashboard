// Export NBA Database Schema
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration (same as server.js)
const dbConfig = {
  user: 'postgres',
  host: 'impurely-accepting-reptile.data-1.use1.tembo.io',
  database: 'postgres',
  password: 'y5XNtw6SlSxqJQXt',
  port: 5432,
  schema: 'nba',
  ssl: { rejectUnauthorized: false } // Add SSL configuration for remote database
};

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

async function exportSchema() {
  console.log('Exporting NBA database schema...');
  
  try {
    // Get all tables in the nba schema
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'nba' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables in the nba schema.`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'schema');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Export schema for each table
    let fullSchema = '';
    
    for (const table of tables) {
      console.log(`Exporting schema for table: ${table}`);
      
      // Get column definitions
      const columnsResult = await pool.query(`
        SELECT 
          column_name, 
          data_type, 
          character_maximum_length,
          column_default,
          is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'nba' 
        AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      
      // Generate CREATE TABLE statement
      let createTable = `CREATE TABLE IF NOT EXISTS nba.${table} (\n`;
      
      columnsResult.rows.forEach((column, i) => {
        createTable += `  ${column.column_name} ${column.data_type}`;
        
        // Add length for character types
        if (column.character_maximum_length) {
          createTable += `(${column.character_maximum_length})`;
        }
        
        // Add default value if exists
        if (column.column_default) {
          createTable += ` DEFAULT ${column.column_default}`;
        }
        
        // Add NOT NULL if applicable
        if (column.is_nullable === 'NO') {
          createTable += ' NOT NULL';
        }
        
        // Add comma if not the last column
        if (i < columnsResult.rows.length - 1) {
          createTable += ',\n';
        }
      });
      
      // Get primary key constraints
      const pkResult = await pool.query(`
        SELECT 
          tc.constraint_name, 
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'nba'
        AND tc.table_name = $1
        ORDER BY kcu.ordinal_position
      `, [table]);
      
      if (pkResult.rows.length > 0) {
        const pkColumns = pkResult.rows.map(row => row.column_name).join(', ');
        createTable += `,\n  PRIMARY KEY (${pkColumns})`;
      }
      
      createTable += '\n);\n\n';
      
      // Add to full schema
      fullSchema += createTable;
      
      // Write individual table schema
      fs.writeFileSync(
        path.join(outputDir, `${table}.sql`),
        createTable,
        'utf8'
      );
    }
    
    // Get all indexes
    const indexesResult = await pool.query(`
      SELECT 
        indexname, 
        tablename, 
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'nba'
      ORDER BY tablename, indexname
    `);
    
    // Add indexes to schema
    if (indexesResult.rows.length > 0) {
      fullSchema += '-- Indexes\n';
      
      indexesResult.rows.forEach(index => {
        // Skip primary key indexes as they're created with the tables
        if (!index.indexname.endsWith('_pkey')) {
          fullSchema += `${index.indexdef};\n`;
        }
      });
      
      fullSchema += '\n';
    }
    
    // Write full schema to file
    fs.writeFileSync(
      path.join(outputDir, 'full_schema.sql'),
      fullSchema,
      'utf8'
    );
    
    console.log(`Schema exported successfully to ${path.join(outputDir, 'full_schema.sql')}`);
  } catch (err) {
    console.error('Error exporting schema:', err);
  } finally {
    await pool.end();
  }
}

// Run the export
exportSchema(); 