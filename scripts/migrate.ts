
import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load env vars
dotenv.config({ path: ".env.local" });

async function runMigration(client: Client, filePath: string) {
  console.log(`Running migration: ${filePath}`);
  try {
    const sqlContent = fs.readFileSync(filePath, "utf-8");
    await client.query(sqlContent);
    console.log(`✅ Successfully ran ${filePath}`);
  } catch (error) {
    console.error(`❌ Error running ${filePath}:`, error);
    process.exit(1);
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is missing");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase/Neon
  });

  try {
    await client.connect();
    console.log("Connected to database successfully");

    const scriptsDir = path.join(process.cwd(), "scripts");
    const files = [
      "000-create-base-tables.sql",
      "001-create-trial-credits-tables.sql",
      "002-add-campaigns-tables.sql",
      "003-add-orders-table.sql"
    ];

    for (const file of files) {
      await runMigration(client, path.join(scriptsDir, file));
    }

    console.log("All migrations completed.");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
