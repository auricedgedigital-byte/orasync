const { Pool } = require('pg');

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Database tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check specific tables we need
    const requiredTables = ['clinics', 'trial_credits', 'usage_logs', 'orders', 'jobs'];
    console.log('\n✅ Required tables status:');
    
    for (const table of requiredTables) {
      const exists = result.rows.some(row => row.table_name === table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    }

  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await pool.end();
  }
}

require('dotenv').config({ path: '.env.production' });
checkTables();