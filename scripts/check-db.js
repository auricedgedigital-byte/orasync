const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const connectionString = process.env.DATABASE_URL || 'postgresql://orasync:orasync123@localhost:5432/orasync';

const client = new Client({
    connectionString: connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function check() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Current tables:", res.rows.map(r => r.table_name));
    } catch (err) {
        console.error("Check failed:", err);
    } finally {
        await client.end();
    }
}

check();
