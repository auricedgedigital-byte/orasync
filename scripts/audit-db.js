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

async function audit() {
    try {
        await client.connect();
        const tables = ['leads', 'campaigns', 'campaign_messages', 'campaign_steps', 'campaign_patient_progress'];
        for (const table of tables) {
            try {
                const res = await client.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1
                `, [table]);
                console.log(`--- ${table} ---`);
                console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));
            } catch (e) {
                console.log(`${table} does not exist or error: ${e.message}`);
            }
        }
    } catch (err) {
        console.error("Audit failed:", err);
    } finally {
        await client.end();
    }
}

audit();
