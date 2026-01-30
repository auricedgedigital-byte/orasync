const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Running database migrations...');
    
    // List of migration files in order
    const migrations = [
      '000-create-base-tables.sql',
      '001-create-trial-credits-tables.sql',
      '002-add-campaigns-tables.sql', 
      '003-add-orders-tables.sql',
      '010-production-schema.sql'
    ];

    for (const migration of migrations) {
      const filePath = path.join(__dirname, 'scripts', migration);
      
      if (fs.existsSync(filePath)) {
        console.log(`Running migration: ${migration}`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await pool.query(sql);
        console.log(`✓ Completed: ${migration}`);
      } else {
        console.log(`⚠ Migration not found: ${migration}`);
      }
    }

    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Set environment to production
process.env.NODE_ENV = 'production';
require('dotenv').config({ path: '.env.production' });

runMigrations().catch(console.error);