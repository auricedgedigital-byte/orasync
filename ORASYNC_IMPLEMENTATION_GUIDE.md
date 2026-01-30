# Orasync Platform Implementation Guide

## Overview
This document outlines the complete implementation of the Orasync trial credits system, PayPal billing integration, and n8n workflow automation.

## Database Schema
The following tables have been created:
- `trial_credits`: Tracks trial usage quotas per clinic
- `usage_logs`: Records all credit consumption events
- `webhooks`: Stores webhook tokens for n8n integration

Run the migration script to create these tables:
\`\`\`bash
npm run db:migrate -- scripts/001-create-trial-credits-tables.sql
\`\`\`

## API Routes Implemented

### Trial Check & Credits
- **GET** `/api/v1/clinics/[cid]/trial-check`
  - Without params: Returns current trial credits
  - With `action` & `amount`: Atomically checks and decrements credits
  - Returns 402 if insufficient credits

### Usage Logs
- **GET** `/api/v1/clinics/[cid]/usage-logs` - Fetch usage history
- **POST** `/api/v1/clinics/[cid]/usage-logs` - Log custom usage events

### Lead Upload
- **POST** `/api/v1/clinics/[cid]/lead-upload`
  - Accepts JSON array of leads
  - Normalizes phone/email
  - Decrements `lead_upload_rows` credits
  - Calls n8n webhook for processing
  - Returns created/updated counts

### Campaigns
- **POST** `/api/v1/clinics/[cid]/campaigns/[campaign_id]/start`
  - Decrements `campaigns_started` credits
  - Triggers n8n campaign runner workflow
  - Returns campaign status and remaining credits

### Booking Confirmation
- **POST** `/api/v1/clinics/[cid]/booking-confirm`
  - Decrements `booking_confirms` credits
  - Creates appointment record
  - Supports Google Calendar integration (placeholder)
  - Returns appointment and remaining credits

### AI Suggestions
- **POST** `/api/v1/clinics/[cid]/ai-suggest`
  - Decrements `ai_suggestions` credits
  - Returns rule-based suggestions (LLM integration ready)
  - Logs usage for analytics

### PayPal Integration
- **POST** `/api/v1/clinics/[cid]/paypal/create-order`
  - Creates PayPal order for credit packs
  - Returns approval link for checkout

- **POST** `/api/v1/clinics/[cid]/paypal/capture-order`
  - Captures completed PayPal payment
  - Increments trial credits based on pack type
  - Triggers campaign resume webhook
  - Logs transaction in usage_logs

### Top-up
- **POST** `/api/v1/clinics/[cid]/topup`
  - Direct credit top-up (admin/internal use)
  - Increments credits atomically
  - Triggers campaign resume webhook

## Credit Packs & Pricing

### Monthly Plans
- **Starter** ($99/mo): 500 emails, 100 SMS, 10 campaigns, 5,000 leads
- **Growth** ($299/mo): 2,000 emails, 500 SMS, unlimited campaigns, 50,000 leads

### One-off Packs
- **Email Pack** ($29): +500 emails
- **SMS Pack** ($49): +200 SMS
- **Campaign Pack** ($19): +5 campaigns
- **Lead Pack** ($99): +5,000 leads

## Trial Quotas (Default)
- Reactivation Emails: 200
- Reactivation SMS: 50
- WhatsApp: 20
- Campaigns Started: 3
- Lead Upload Rows: 1,000
- Booking Confirms: 50
- AI Suggestions: 100
- SEO Applies: 1
- Chatbot Installs: 1

## n8n Workflow Integration

### Required Environment Variables
- `N8N_WEBHOOK_BASE`: Base URL for n8n webhooks (e.g., https://n8n.example.com)
- `API_KEY` or `BACKEND_API_KEY`: Bearer token for API authentication

### Webhook Endpoints
All n8n workflows must call the trial-check API before executing paid actions:

\`\`\`bash
GET ${APP_BASE_URL}/api/v1/clinics/${clinicId}/trial-check?action=${action}&amount=${amount}
Authorization: Bearer ${API_KEY}
\`\`\`

### Campaign Runner Workflow
- Receives webhook at `/webhook/campaign-trigger`
- Checks trial credits before sending
- Processes recipients in batches
- Logs completion/pause status
- Resumes on credit top-up via `/webhook/campaign-resume`

### Lead Upload Workflow
- Receives webhook at `/webhook/lead-upload`
- Processes uploaded leads
- Logs upload completion

## Atomic Operations & Race Conditions

All credit decrements use database transactions with row-level locks (FOR UPDATE) to prevent race conditions:

\`\`\`sql
SELECT * FROM trial_credits WHERE clinic_id = ${clinicId} FOR UPDATE
\`\`\`

This ensures:
- Only one request can decrement credits at a time
- Credits are never over-spent
- Usage logs are always consistent with credit state

## Fallback & Simulation

When provider credentials are missing or trial credits are insufficient:
1. Messages are marked with `status: 'simulated'`
2. No external provider calls are made
3. Trial credits are NOT decremented
4. Campaign is paused and user is notified
5. Workflow stops gracefully

## UI Component Wiring

### Trial Credits Header
- Fetches current credits on mount
- Refreshes every 30 seconds
- Shows low credit warnings (>80% usage)
- Opens upgrade modal on "Buy More" click

### Upgrade Modal
- Displays monthly plans and one-off packs
- Initiates PayPal checkout flow
- Redirects to PayPal approval page
- Returns to billing page after capture

### Campaign Builder
- Calls trial-check before starting campaign
- Shows expected credit consumption
- Displays remaining credits after start

## Testing Checklist

- [ ] Lead upload: POST 50 leads → credits decremented, n8n webhook called
- [ ] Campaign start: Decrement campaigns_started, trigger n8n workflow
- [ ] Booking confirm: Decrement booking_confirms, create appointment
- [ ] AI suggest: Decrement ai_suggestions, return suggestions
- [ ] PayPal checkout: Create order → approve → capture → increment credits
- [ ] Campaign resume: Top-up triggers n8n resume webhook
- [ ] Low credits: Header shows warning at 80% usage
- [ ] Insufficient credits: API returns 402, campaign pauses
- [ ] Atomic operations: Concurrent requests don't over-spend credits

## Deployment Notes

1. Run database migrations before deploying
2. Set all required environment variables in Vercel
3. Configure n8n webhooks with correct base URL
4. Test PayPal sandbox integration before going live
5. Monitor usage_logs table for analytics and debugging
6. Set up alerts for campaigns that pause due to insufficient credits

## Future Enhancements

- LLM integration for AI suggestions (OpenAI/Claude)
- Google Calendar event creation for bookings
- SMS/WhatsApp provider integration (Twilio)
- Email provider integration (SendGrid/Mailgun)
- Advanced analytics dashboard
- Subscription management UI
- Credit rollover policies
- Usage forecasting
