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
});

async function runMigration() {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected successfully.");

        const sqlPath = path.resolve(__dirname, '020-complete-production-schema.sql');
        console.log(`Reading migration file: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("Executing SQL migration...");
        // Split by semicolons for safer execution if needed, but pg can often handle blocks.
        // However, simplest is to run the whole block if it's transaction-safe or idempotent-ish.
        // Our script uses IF NOT EXISTS, so should be safe.
        await client.query(sql);

        console.log("Migration executed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
