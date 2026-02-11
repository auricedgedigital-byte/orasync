# Orasync - Complete Project Specification
## Production-Ready Dental Operating System

---

## 1 — Short Summary / Mission

Orasync is an AI-augmented Dental Operating System whose core job is to **return time and revenue to dental practices** by automating:
- Patient reactivation
- Bookings  
- Reputation management
- Basic practice operations

**Business Model:** Single product with task-based free credits model, AI-assisted onboarding and operations, and reliable, auditable execution of paid automation (campaigns, messages, bookings).

**Core Requirements:** Safe, auditable, and production-grade.

---

## 2 — Top-Level Architecture

### Component Stack
```
Clients (Web, PWA, Mobile wrapper)
        ↕ HTTPS (Auth + API)
Next.js App (Frontend + API Routes)
        ↕
API Layer (Next.js API routes or Node microservice)
        ↕
DB / Redis
- Managed Postgres (Supabase / Neon) — canonical data
- Redis (BullMQ) — job queue
        ↕
Worker Pool (Node processes)
- campaignRunner
- leadImporter
- inboundProc
        ↕
Provider Integrations
- PayPal (payments)
- Twilio (SMS)
- SMTP (SendGrid)
- Google Calendar
- n8n (optional, hosted) — non-critical visual automations that call Orasync APIs
- Vector DB / memory (Qdrant) — AI memory & retrieval
- LLM providers — OpenAI (production); Ollama local fallback for experiments
        ↕
Monitoring & Logging
- Sentry (error tracking)
- Prometheus + Grafana (metrics)
- ELK (logs)
```

### Key Rules:
1. **Orasync backend is the source of truth** (credits, orders, campaign state)
2. **n8n can execute only via authenticated calls to Orasync APIs**; n8n must never be relied upon for core decisions (credits, payments)
3. **Payments are handled in-app** (server-to-PayPal); orders + captures are idempotent
4. **Workers orchestrate heavy tasks**; queue ensures throttling, retries and backpressure

---

## 3 — Design Goals

### Trust, Clarity, Progress, Low-Effort Control

**Clarity First**
- Always show what will happen and what will cost credits before an action runs
- Be explicit: "This campaign will send 500 emails and use 500 email credits"

**Progress & Wins**
- Show immediate impact metrics from free trials: bookings, conversion, estimated revenue
- Celebrate wins (toast, modal) and show next simple step

**Loss Aversion & Safety Nets**
- Pause campaigns automatically on credit depletion (don't fail silently)
- Offer micro-upgrades to continue a paused run without forcing larger purchases

**Control + Handoff**
- Offer 2 modes: AI-assisted (auto) and Human-in-the-loop (review before send)
- Always allow the clinic to "take over" a conversation or campaign

**Transparency and Auditability**
- Usage_logs are visible and exportable
- Dentists can see "who/what sent X messages and when"
- Receipts and capture logs are saved for payments

**Simplicity**
- Reduce steps for initial activation
- Use plain language (no dev speak) in UX copy

**Trust via Identity & Persona**
- Orasync's in-product AI agent is friendly, local-practice-aware, and explains actions
- Not a mysterious "bot"
- CEO/Kai Asher persona used for external branding/content only, not core sensitive actions

---

## 4 — Core UX Flows (Detailed, Step-by-Step)

### 4.1 Onboarding & First-Run
**Goal:** Run first free campaign in ≤ 15 minutes

**Flow:**
1. **Sign up** (quick form) → Create clinic and primary user
2. **Wizard:** Ask for:
   - Clinic hours
   - Timezone
   - Average appointment length
   - Lead sources
   - Choosing a campaign objective (reactivate, new patient)
3. **Import leads** (CSV / Google Sheets / upload)
   - Show count + dedupe preview
   - Indicate lead_upload_rows credit consumption before confirming
4. **Suggest campaign template**
   - Pre-filled subject/CTA
   - Recommended channels
   - Show estimated credits usage
5. **Option:** "Run as demo (simulate sends)" or "Run live (consume credits)"
6. **Start campaign** → Show progress modal + live results (bookings attributed)

**UX Constraints:**
- Must require explicit consent for live sends
- Must show "Pause" and "Cancel" clearly
- Show expected outcomes and fallback options

### 4.2 Campaign Building & Execution

**Campaign Builder UI:**
- Segment builder (filters for last visit date, tags)
- Template editor (tokens)
- Channel toggles (email, SMS, WhatsApp)
- Send schedule (now, immediate or scheduled)
- Cost/credits estimator

**Execution Flow:**
1. Frontend calls `POST /api/v1/clinics/:cid/campaigns` to create campaign (status=draft)
2. Frontend calls `POST /api/v1/clinics/:cid/campaigns/:id/start`
   - Backend estimates & reserves credits for first batch
3. Backend enqueues campaign_run job into queue
   - Job payload: campaign_id, batch window info
4. Worker processes batches:
   - Calls `checkAndDecrementCredits` per batch
   - Sends messages via provider SDK
   - Logs each send
   - Handles retries
5. If `checkAndDecrementCredits` returns false mid-run:
   - Pause campaign
   - Notify user with option to top-up
   - Show exactly how many were sent vs remaining

### 4.3 Unified Inbox & AI Assistant

**Core Features:**
- Single stream for SMS, Email, WhatsApp, Chat
- AI pre-categorizes (booking intent, complaint, question)
- One-click reply templates + AI suggest
- Escalation rules (sentiment detection → human alert)

**AI Handoff Rules:**
- AI can suggest responses but only send if:
  - User explicitly clicks "Send AI reply" OR
  - Auto-reply is enabled for that channel + intent category
- Always show "Take over" button

### 4.4 Reactivation Engine

**Automated Detection:**
- Daily job scans for patients with no appointment in N days
- Segments by treatment history (cleaning vs high-value)
- Generates personalized messages via AI template
- Queues sends respecting daily rate limits

**Tracking:**
- Attribution: if patient books within 14 days of reactivation send, mark as "attributed"
- Show estimated revenue in dashboard

### 4.5 Billing & Credits

**Credit Types:**
- reactivation_emails
- reactivation_sms
- reactivation_whatsapp
- campaigns_started
- lead_upload_rows
- booking_confirms
- ai_suggestions
- seo_applies
- chatbot_installs

**Purchase Flow:**
1. User selects pack (Starter, Growth, or à la carte)
2. Frontend calls `POST /api/v1/clinics/:cid/paypal/create-order`
3. User pays via PayPal SDK (in-app)
4. PayPal webhook or frontend calls `POST /api/v1/clinics/:cid/paypal/capture-order`
5. Backend:
   - Idempotent order check
   - Top-up credits via `incrementCredits`
   - Resume any paused campaigns
6. Show receipt + confirmation

**Trial Mode:**
- New clinics get starter credits (e.g., 200 emails, 50 SMS)
- Credits displayed prominently in sidebar (depleting bar)
- When credits < 10% of any type, show upgrade nudge
- When depleted, pause active campaigns gracefully

### 4.6 Settings & Integrations

**Configuration Panel:**
- Connect Twilio (SMS sender)
- Connect SendGrid/SMTP (email)
- Connect Google Calendar (sync)
- Webhook URL for n8n/automation
- Team management (invite users, roles)

**Webhook System:**
- Rotatable webhook tokens
- Endpoints for lead import, campaign trigger, inbound message
- Signature verification (HMAC)

---

## 5 — Data Model (Critical Tables)

### Core Entities
- `clinics` — practice identity, timezone, settings
- `users` — staff accounts, roles
- `credits` — current balances per clinic
- `usage_logs` — immutable audit trail

### Campaigns
- `campaigns` — config, status, metrics
- `campaign_batches` — execution tracking
- `messages` — individual sends with status

### Calendar
- `appointments` — synced or manually entered
- `availability` — free/busy for booking widget

### Inbox
- `threads` — conversation container
- `messages` — individual messages (SMS, email, chat)

### Integrations
- `integration_configs` — credentials (encrypted)
- `webhook_configs` — tokens, endpoints

---

## 6 — AI Design Principles

### AI Persona: "Practice Assistant"
- Friendly, helpful, not overly familiar
- Uses practice name and context naturally
- Explains what it's doing ("I'll send 3 follow-up messages to patients who haven't visited in 6 months")
- Never pretends to be human (transparent about AI)

### Capabilities
- **Suggest:** Draft messages, campaign ideas, responses
- **Automate:** Send on approval or within configured auto-rules
- **Analyze:** Surface insights ("Your reactivation rate is 12%, similar practices average 8%")
- **Guide:** Onboarding wizard, explain features

### Boundaries
- No medical advice (always defer to dentist)
- No storage of PHI in AI provider logs (use HIPAA-compliant providers for production)
- Audit trail for all AI actions

---

## 7 — Security & Compliance

### Authentication
- NextAuth.js with Google OAuth (primary)
- Email/password optional
- Session JWT with clinic_id scope

### Authorization
- Row Level Security (RLS) in Postgres
- Users can only access their clinic's data
- Admin roles for practice owners

### Data Protection
- PHI encrypted at rest (AES-256)
- TLS 1.3 for all connections
- Webhook signatures verified
- API keys encrypted in DB

### Audit
- All credit decrements logged
- All campaign sends logged
- All AI suggestions logged
- Exportable compliance reports

---

## 8 — Technical Implementation Notes

### API Design
- RESTful with clear resource naming
- Idempotent operations where possible (orders, captures)
- Standard HTTP status codes
- JSON request/response

### Queue System (BullMQ)
- Jobs: campaign_run, lead_import, message_send, appointment_sync
- Retry with exponential backoff
- Dead letter queue for failures
- Rate limiting per provider

### Error Handling
- User-friendly error messages (not stack traces)
- Sentry for tracking
- Graceful degradation (show cached data if live fails)

### Performance
- API responses < 500ms (p95)
- Dashboard loads initial data quickly, streams updates
- Worker throughput: 1000 messages/minute per clinic (throttled)

---

## 9 — Deployment & Operations

### Infrastructure
- Vercel (Next.js hosting)
- Supabase/Neon (Postgres)
- Upstash/Redis Cloud (Redis)
- Docker Compose (local development)

### Environment Variables
```
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Providers
OPENAI_API_KEY=
TOGETHER_API_KEY=
OPENCODE_API_KEY=

# Payment
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=

# Integrations
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
SENDGRID_API_KEY=

# Infrastructure
REDIS_URL=
SENTRY_DSN=
```

### Monitoring
- Uptime checks on critical endpoints
- Credit balance alerts (low credits)
- Campaign failure alerts
- Daily summary reports

---

## 10 — Success Metrics (Engineering)

- **Onboarding completion:** 80% of signups complete wizard
- **First campaign:** 70% send within 24 hours of signup
- **Retention:** 60% monthly active (use at least one feature)
- **Conversion:** 15% free → paid within 30 days
- **System reliability:** 99.9% uptime
- **API latency:** p95 < 500ms
- **Campaign throughput:** Process 10K messages/hour at peak

---

*Document Version: 1.0*
*Created: Production specification for OraSync dental operating system*
*Status: Authoritative reference for engineering implementation*
