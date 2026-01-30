const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.production explicitly
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
if (envConfig.error) {
    console.error("Error loading .env.production:", envConfig.error);
    process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL not found in .env.production");
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function runMigration() {
    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected successfully.");

        const sqlPath = path.resolve(__dirname, '010-production-schema.sql');
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
