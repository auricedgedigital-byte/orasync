# Orasync Platform Implementation State

## Overview
Complete Orasync platform with trial credits, PayPal integration, atomic credit management, job queue/workers, and full frontend wiring. Supports demo mode when provider credentials are missing.

## Environment Variables Required

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `EMAIL_FROM` - Email sender address

### Optional (used if present, demo mode fallback if missing)
- `PAYPAL_CLIENT_ID` - PayPal client ID (demo mode if missing)
- `PAYPAL_SECRET` - PayPal secret key (demo mode if missing)
- `PAYPAL_API_URL` - PayPal API URL (defaults to sandbox)
- `REDIS_URL` - Redis connection for job queue (DB polling fallback if missing)
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS` - SMTP config
- `OPENAI_API_KEY` - OpenAI API key for AI suggestions (template fallback if missing)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` - Twilio SMS (simulation if missing)

## Files Modified

### Database
- `scripts/003-add-orders-table.sql` - Orders table and jobs table for worker queue

### Backend Core
- `lib/db.ts` - Added order functions, job queue functions, topup logic, campaign resume

### API Routes
- `app/api/v1/clinics/[cid]/paypal/capture-order/route.ts` - PayPal capture with idempotency
- `app/api/v1/clinics/[cid]/usage-logs/route.ts` - GET/POST usage logs
- `app/api/v1/clinics/[cid]/booking-confirm/route.ts` - Book appointments with credit check
- `app/api/v1/clinics/[cid]/ai-suggest/route.ts` - AI suggestions with template fallback
- `app/api/v1/clinics/[cid]/topup/route.ts` - Get topup information
- `app/api/v1/clinics/[cid]/campaigns/estimate/route.ts` - Estimate campaign credits needed
- `app/api/webhooks/paypal/route.ts` - PayPal webhook receiver

### Workers
- `workers/campaignRunner.ts` - Process campaign batches with credit checking
- `workers/leadImporter.ts` - Import leads in background
- `workers/inboundProcessor.ts` - Handle inbound messages
- `workers/workerBootstrap.ts` - Main worker process with Redis + DB fallback

### Frontend Components
- `components/orasync/trial-credits-header.tsx` - Display and refresh trial credits
- `components/orasync/upgrade-modal.tsx` - PayPal checkout flow

## New API Endpoints

### Trial & Credits
- `GET /api/v1/clinics/:cid/trial-check` - Get current trial credits
- `GET /api/v1/clinics/:cid/usage-logs` - Get usage history
- `POST /api/v1/clinics/:cid/topup` - Get topup information

### Campaigns
- `POST /api/v1/clinics/:cid/campaigns/estimate` - Estimate credits needed
- `POST /api/v1/clinics/:cid/campaigns/:campaign_id/start` - Start campaign (enqueues worker job)

### Bookings & AI
- `POST /api/v1/clinics/:cid/booking-confirm` - Create appointment with credit check
- `POST /api/v1/clinics/:cid/ai-suggest` - Get AI suggestions or templates

### PayPal
- `POST /api/v1/clinics/:cid/paypal/create-order` - Create PayPal order
- `POST /api/v1/clinics/:cid/paypal/capture-order` - Capture order and topup credits
- `POST /api/webhooks/paypal` - PayPal webhook receiver

## Worker System

### Job Types
- `campaign_batch` - Process campaign recipients in batch
- `campaign_resume` - Resume paused campaigns after topup
- `lead_import` - Import leads in background
- `inbound_message` - Process inbound SMS/WhatsApp

### Running Workers
\`\`\`bash
# Start worker process (uses Redis if REDIS_URL set, otherwise DB polling)
node -r ts-node workers/workerBootstrap.ts
\`\`\`

### Database Polling Fallback
If `REDIS_URL` is not set, workers automatically fall back to polling the `jobs` table every 5 seconds.

## Demo/Simulation Mode

### Activation
- PayPal: Use if `PAYPAL_CLIENT_ID` is "test_client_id" or missing
- SMS/Email: Use if `EMAIL_SMTP_HOST` is missing or `DEMO_MODE=true`
- AI: Use templates if `OPENAI_API_KEY` is missing or "test_key"

### Behavior
- PayPal orders still create credits but with `mode: "demo"`
- Campaign messages marked as `status: "simulated"`
- AI suggestions return templates instead of calling OpenAI
- All audit logs include `mode: "simulated"` for tracking

## Credit System

### Atomic Transactions
- All credit decrements use SELECT ... FOR UPDATE locking
- Prevents race conditions under concurrent requests
- Returns remaining credits after each operation

### Credit Types
- `reactivation_emails` - Email send credits (1 per recipient)
- `reactivation_sms` - SMS credits (2 per recipient)
- `reactivation_whatsapp` - WhatsApp credits (3 per recipient)
- `campaigns_started` - Campaign start allowance
- `lead_upload_rows` - Lead import row limit
- `booking_confirms` - Appointment confirmation limit
- `ai_suggestions` - AI suggestion limit
- `seo_applies` - SEO optimization limit
- `chatbot_installs` - Chatbot install limit

### Pack Pricing
- **Starter ($29)**: 500 emails, 100 SMS, 5 campaigns
- **Professional ($99)**: 2000 emails, 500 SMS, 20 campaigns, 5000 lead rows
- **Enterprise ($299)**: 10000 emails, 2000 SMS, 100 campaigns, 50000 lead rows

## Acceptance Tests

### 1. Get Trial Credits
\`\`\`bash
curl http://localhost:3000/api/v1/clinics/clinic-123/trial-check
# Expected: 200 OK with current credits
\`\`\`

### 2. Create PayPal Order
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{"pack_type":"professional","amount":"99.00","currency":"USD"}'
# Expected: 200 OK with approval_link and order_id
\`\`\`

### 3. Capture PayPal Order (Demo Mode)
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/paypal/capture-order \
  -H "Content-Type: application/json" \
  -d '{"orderId":"PAYPAL_ORDER_ID"}'
# Expected: 200 OK with updated credits and resumed campaigns
\`\`\`

### 4. Upload Leads
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/lead-upload \
  -H "Content-Type: application/json" \
  -d '{"leads":[{"first_name":"John","email":"john@example.com","phone":"555-1234"}]}'
# Expected: 200 OK with created count and remaining credits
\`\`\`

### 5. Start Campaign
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/campaigns/campaign-456/start \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 202 with campaign marked active and worker job enqueued
\`\`\`

### 6. Estimate Campaign Credits
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/campaigns/estimate \
  -H "Content-Type: application/json" \
  -d '{"channels":["email","sms"]}'
# Expected: 200 OK with estimated credit needs
\`\`\`

### 7. Book Appointment
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/booking-confirm \
  -H "Content-Type: application/json" \
  -d '{"patientEmail":"patient@example.com","providerId":"provider-1","scheduledTime":"2025-01-20T10:00:00Z"}'
# Expected: 200 OK with appointment created and credits decremented
\`\`\`

### 8. Get AI Suggestions
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/clinics/clinic-123/ai-suggest \
  -H "Content-Type: application/json" \
  -d '{"type":"email_subject","count":3}'
# Expected: 200 OK with suggestions (templates if demo mode)
\`\`\`

## Key Features

### Atomic Credit Management
- SELECT ... FOR UPDATE prevents double-spending
- Atomic topup after PayPal capture
- Campaign pause on insufficient credits mid-run

### Idempotent Orders
- `orders` table tracks all orders uniquely by `order_id`
- Duplicate captures return error with existing order data
- Safe replay of failed requests

### Worker Queue with Fallback
- Prefers Redis (fast, scalable)
- Falls back to database polling if Redis unavailable
- Automatic retry with exponential backoff

### Campaign Batching
- Process recipients in configurable batches (default 100)
- Pause and resume campaigns based on credits
- Track message status per channel

### Multi-Channel Support
- Email (1 credit per recipient)
- SMS (2 credits per recipient)
- WhatsApp (3 credits per recipient)
- Extensible to add more channels

## Future Enhancements

1. **SMS/WhatsApp Integration**
   - Add Twilio SDK when `TWILIO_ACCOUNT_SID` provided
   - Current: simulated sends

2. **Calendar Integration**
   - Add Google Calendar sync when `GOOGLE_CLIENT_ID` present
   - Add Zoom meeting scheduling

3. **Email Service**
   - Add SMTP when `EMAIL_SMTP_HOST` present
   - Current: simulated sends

4. **Advanced Analytics**
   - Campaign performance metrics
   - ROI tracking per channel
   - Conversion funnel analysis

5. **Webhooks & Automations**
   - Inbound message routing
   - Automated follow-up sequences
   - Lead scoring and segmentation

## Database Schema

### trial_credits
- `clinic_id` (PK) - Reference to clinic
- `reactivation_emails`, `reactivation_sms`, etc. - Credit balances
- `modified_at` - Last modification timestamp

### usage_logs
- `id` (PK) - Unique log entry
- `clinic_id` - Reference to clinic
- `action_type` - Type of action (send:email, reserve:campaigns_started, etc.)
- `amount` - Credits used/reserved
- `related_id` - Reference to campaign, order, etc.
- `details` - JSON extra data

### orders
- `id` (PK) - Unique order
- `order_id` (UNIQUE) - PayPal order ID
- `clinic_id` - Reference to clinic
- `pack_id` - Pack type (starter, professional, enterprise)
- `status` - created → captured
- `paypal_tx_id` - PayPal transaction ID for idempotency
- `captured_at` - When order was captured

### jobs
- `id` (PK) - Unique job
- `clinic_id` - Reference to clinic
- `type` - Job type (campaign_batch, lead_import, etc.)
- `payload` - JSON job data
- `status` - pending → processing → completed/failed
- `created_at` - When job was queued

## Notes

- All API routes validate clinic_id from URL params
- All database queries use parameterized queries (SQL injection safe)
- All worker jobs are idempotent and can be safely retried
- Demo mode is automatic based on missing env vars
- No additional npm packages required beyond existing dependencies

EOF
