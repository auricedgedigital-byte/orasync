const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Try to load any existing .env file
const envPaths = ['.env.production', '.env.local', '.env'];
let envLoaded = false;

for (const envPath of envPaths) {
    const fullPath = path.resolve(process.cwd(), envPath);
    if (fs.existsSync(fullPath)) {
        dotenv.config({ path: fullPath });
        console.log(`Loaded environment from ${envPath}`);
        envLoaded = true;
        break;
    }
}

const connectionString = process.env.DATABASE_URL || 'postgresql://orasync:orasync123@localhost:5432/orasync';

if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not found in env, using fallback default.");
}

const client = new Client({
    connectionString: connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function runMigration(fileName = '021-campaign-sequence-support.sql') {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected successfully.");

        const sqlPath = path.resolve(__dirname, fileName);
        console.log(`Reading migration file: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log(`Executing SQL migration from ${fileName}...`);
        await client.query(sql);

        console.log("Migration executed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
