import { Client } from "pg";
import * as dotenv from "dotenv";

// Load env vars
dotenv.config({ path: ".env.local" });

interface TableInfo {
    table_name: string;
    column_count: number;
}

async function verifyDatabase() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL is missing");
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Connected to database successfully\n");

        // Expected tables
        const expectedTables = [
            "clinics",
            "users",
            "trial_credits",
            "usage_logs",
            "webhooks",
            "campaigns",
            "campaign_messages",
            "leads",
            "appointments",
            "orders",
            "jobs"
        ];

        console.log("Verifying database schema...\n");

        // Check if all tables exist
        const tableResult = await client.query(
            `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_type = 'BASE TABLE'
       ORDER BY table_name`
        );

        const existingTables = tableResult.rows.map((row: any) => row.table_name);

        console.log("📊 Existing Tables:");
        existingTables.forEach((table: string) => {
            const isExpected = expectedTables.includes(table);
            console.log(`  ${isExpected ? "✅" : "⚠️ "} ${table}`);
        });

        // Check for missing tables
        const missingTables = expectedTables.filter(t => !existingTables.includes(t));
        if (missingTables.length > 0) {
            console.log("\n❌ Missing Tables:");
            missingTables.forEach(table => console.log(`  - ${table}`));
        } else {
            console.log("\n✅ All expected tables exist!");
        }

        // Verify each table structure
        console.log("\n📋 Table Details:");
        for (const table of expectedTables) {
            if (existingTables.includes(table)) {
                const columnResult = await client.query(
                    `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`,
                    [table]
                );

                console.log(`\n  ${table} (${columnResult.rows.length} columns):`);
                columnResult.rows.forEach((col: any) => {
                    console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
                });
            }
        }

        // Check indexes
        console.log("\n📑 Indexes:");
        const indexResult = await client.query(
            `SELECT tablename, indexname
       FROM pg_indexes
       WHERE schemaname = 'public'
       ORDER BY tablename, indexname`
        );

        let currentTable = "";
        indexResult.rows.forEach((row: any) => {
            if (row.tablename !== currentTable) {
                console.log(`\n  ${row.tablename}:`);
                currentTable = row.tablename;
            }
            console.log(`    - ${row.indexname}`);
        });

        // Check for test data
        console.log("\n\n🔍 Test Data Check:");

        const clinicCount = await client.query("SELECT COUNT(*) FROM clinics");
        console.log(`  Clinics: ${clinicCount.rows[0].count}`);

        const testClinic = await client.query("SELECT * FROM clinics WHERE id = 'clinic-001'");
        if (testClinic.rows.length > 0) {
            console.log(`  ✅ Test clinic (clinic-001) exists: ${testClinic.rows[0].name}`);
        } else {
            console.log(`  ⚠️  Test clinic (clinic-001) not found`);
        }

        const creditsCount = await client.query("SELECT COUNT(*) FROM trial_credits");
        console.log(`  Trial Credits Records: ${creditsCount.rows[0].count}`);

        const testCredits = await client.query("SELECT * FROM trial_credits WHERE clinic_id = 'clinic-001'");
        if (testCredits.rows.length > 0) {
            console.log(`  ✅ Test clinic credits exist:`);
            console.log(`     - Emails: ${testCredits.rows[0].reactivation_emails}`);
            console.log(`     - SMS: ${testCredits.rows[0].reactivation_sms}`);
            console.log(`     - Campaigns: ${testCredits.rows[0].campaigns_started}`);
        } else {
            console.log(`  ⚠️  Test clinic credits not found`);
        }

        const leadsCount = await client.query("SELECT COUNT(*) FROM leads WHERE clinic_id = 'clinic-001'");
        console.log(`  Test Leads: ${leadsCount.rows[0].count}`);

        console.log("\n✅ Database verification complete!");

    } catch (err) {
        console.error("❌ Error verifying database:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

verifyDatabase();
