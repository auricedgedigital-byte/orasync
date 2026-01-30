#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests all Orasync API endpoints with the test clinic data
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CLINIC_ID = "00000000-0000-0000-0000-000000000001";

const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        log(`\n🧪 Testing: ${name}`, colors.blue);
        log(`   ${method} ${url}`);

        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            log(`   ✅ Success (${response.status})`, colors.green);
            log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
            return { success: true, data };
        } else {
            log(`   ❌ Failed (${response.status})`, colors.red);
            log(`   Error: ${JSON.stringify(data, null, 2)}`);
            return { success: false, data };
        }
    } catch (error) {
        log(`   ❌ Error: ${error.message}`, colors.red);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    log("=".repeat(60), colors.yellow);
    log("  Orasync API Endpoint Tests", colors.yellow);
    log("=".repeat(60), colors.yellow);
    log(`\nBase URL: ${BASE_URL}`);
    log(`Clinic ID: ${CLINIC_ID}\n`);

    const results = {
        passed: 0,
        failed: 0
    };

    // Test 1: Get Trial Credits
    const test1 = await testEndpoint(
        "Get Trial Credits",
        "GET",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/trial-check`
    );
    test1.success ? results.passed++ : results.failed++;

    // Test 2: Get Usage Logs
    const test2 = await testEndpoint(
        "Get Usage Logs",
        "GET",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/usage-logs`
    );
    test2.success ? results.passed++ : results.failed++;

    // Test 3: Create PayPal Order
    const test3 = await testEndpoint(
        "Create PayPal Order",
        "POST",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/paypal/create-order`,
        {
            pack_type: "starter_plan",
            amount: "99"
        }
    );
    test3.success ? results.passed++ : results.failed++;

    // Test 4: Upload Leads
    const test4 = await testEndpoint(
        "Upload Leads",
        "POST",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/lead-upload`,
        {
            leads: [
                {
                    first_name: "Test",
                    last_name: "Lead",
                    email: "testlead@example.com",
                    phone: "555-9999"
                }
            ]
        }
    );
    test4.success ? results.passed++ : results.failed++;

    // Test 5: Get Campaigns
    const test5 = await testEndpoint(
        "Get Campaigns",
        "GET",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/campaigns`
    );
    test5.success ? results.passed++ : results.failed++;

    // Test 6: Create Campaign
    const test6 = await testEndpoint(
        "Create Campaign",
        "POST",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/campaigns`,
        {
            name: "Test Campaign",
            segment_criteria: {},
            channels: ["email"]
        }
    );
    test6.success ? results.passed++ : results.failed++;

    // Test 7: AI Suggestions
    const test7 = await testEndpoint(
        "Get AI Suggestions",
        "POST",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/ai-suggest`,
        {
            type: "email_subject",
            count: 3
        }
    );
    test7.success ? results.passed++ : results.failed++;

    // Test 8: Booking Confirmation
    const test8 = await testEndpoint(
        "Book Appointment",
        "POST",
        `${BASE_URL}/api/v1/clinics/${CLINIC_ID}/booking-confirm`,
        {
            patientEmail: "patient@example.com",
            providerId: "provider-1",
            scheduledTime: new Date(Date.now() + 86400000).toISOString()
        }
    );
    test8.success ? results.passed++ : results.failed++;

    // Summary
    log("\n" + "=".repeat(60), colors.yellow);
    log("  Test Summary", colors.yellow);
    log("=".repeat(60), colors.yellow);
    log(`\n✅ Passed: ${results.passed}`, colors.green);
    log(`❌ Failed: ${results.failed}`, colors.red);
    log(`📊 Total: ${results.passed + results.failed}\n`);

    if (results.failed === 0) {
        log("🎉 All tests passed!", colors.green);
    } else {
        log("⚠️  Some tests failed. Check the output above for details.", colors.yellow);
    }
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch(BASE_URL);
        return true;
    } catch (error) {
        log(`\n❌ Server is not running at ${BASE_URL}`, colors.red);
        log("   Please start the development server with: npm run dev\n", colors.yellow);
        return false;
    }
}

// Main execution
(async () => {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runTests();
    } else {
        process.exit(1);
    }
})();
