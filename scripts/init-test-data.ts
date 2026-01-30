import { Client } from "pg";
import * as dotenv from "dotenv";

// Load env vars
dotenv.config({ path: ".env.local" });

async function initTestData() {
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
        console.log("Connected to database successfully");

        // Use a well-known UUID for testing
        const testClinicId = "00000000-0000-0000-0000-000000000001";
        const testUserId = "00000000-0000-0000-0000-000000000002";

        // 1. Create test clinic
        console.log("\n1. Creating test clinic...");
        const clinicResult = await client.query(
            `INSERT INTO clinics (id, name, created_at)
       VALUES ($1, 'Test Clinic', NOW())
       ON CONFLICT (id) DO UPDATE SET name = 'Test Clinic'
       RETURNING *`,
            [testClinicId]
        );
        console.log("✅ Test clinic created:", clinicResult.rows[0]);

        // 2. Initialize trial credits for test clinic
        console.log("\n2. Initializing trial credits for test clinic...");
        const creditsResult = await client.query(
            `INSERT INTO trial_credits (
        clinic_id, 
        reactivation_emails, 
        reactivation_sms, 
        reactivation_whatsapp, 
        campaigns_started, 
        lead_upload_rows, 
        booking_confirms, 
        ai_suggestions, 
        seo_applies, 
        chatbot_installs, 
        modified_at
      )
      VALUES ($1, 200, 50, 20, 3, 1000, 50, 100, 1, 1, NOW())
      ON CONFLICT (clinic_id) 
      DO UPDATE SET 
        reactivation_emails = 200,
        reactivation_sms = 50,
        reactivation_whatsapp = 20,
        campaigns_started = 3,
        lead_upload_rows = 1000,
        booking_confirms = 50,
        ai_suggestions = 100,
        seo_applies = 1,
        chatbot_installs = 1,
        modified_at = NOW()
      RETURNING *`,
            [testClinicId]
        );
        console.log("✅ Trial credits initialized:", creditsResult.rows[0]);

        // 3. Create sample leads
        console.log("\n3. Creating sample leads...");
        const sampleLeads = [
            { first_name: "John", last_name: "Doe", email: "john.doe@example.com", phone: "555-0101" },
            { first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", phone: "555-0102" },
            { first_name: "Bob", last_name: "Johnson", email: "bob.johnson@example.com", phone: "555-0103" },
            { first_name: "Alice", last_name: "Williams", email: "alice.williams@example.com", phone: "555-0104" },
            { first_name: "Charlie", last_name: "Brown", email: "charlie.brown@example.com", phone: "555-0105" }
        ];

        for (const lead of sampleLeads) {
            await client.query(
                `INSERT INTO leads (clinic_id, first_name, last_name, email, phone, source, created_at)
         VALUES ($1, $2, $3, $4, $5, 'test_data', NOW())
         ON CONFLICT DO NOTHING`,
                [testClinicId, lead.first_name, lead.last_name, lead.email, lead.phone]
            );
        }
        console.log(`✅ Created ${sampleLeads.length} sample leads`);

        // 4. Create a test user
        console.log("\n4. Creating test user...");
        const userResult = await client.query(
            `INSERT INTO users (id, email, clinic_id, created_at)
       VALUES ($1, 'admin@testclinic.com', $2, NOW())
       ON CONFLICT (id) DO UPDATE SET email = 'admin@testclinic.com'
       RETURNING *`,
            [testUserId, testClinicId]
        );
        console.log("✅ Test user created:", userResult.rows[0]);

        console.log("\n✅ All test data initialized successfully!");
        console.log("\n📋 Test Credentials:");
        console.log(`  - Clinic ID: ${testClinicId}`);
        console.log(`  - User ID: ${testUserId}`);
        console.log("  - Trial Credits: 200 emails, 50 SMS, 3 campaigns, etc.");
        console.log("  - Sample Leads: 5 test leads available");
        console.log("\n⚠️  IMPORTANT: Update frontend components to use this clinic ID:");
        console.log(`     Replace 'clinic-001' with '${testClinicId}' in:`);
        console.log("     - components/orasync/trial-credits-header.tsx (line 49)");
        console.log("     - components/orasync/upgrade-modal.tsx (line 30)");

    } catch (err) {
        console.error("Error initializing test data:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

initTestData();
