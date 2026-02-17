-- Create segments table for saved audience filters
CREATE TABLE IF NOT EXISTS segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filters JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_segments_clinic_id ON segments(clinic_id);
-- Create campaign_steps table for multi-channel sequencing
CREATE TABLE IF NOT EXISTS campaign_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    channel VARCHAR(50) NOT NULL,
    -- 'email', 'sms', 'whatsapp'
    template_id UUID,
    delay_hours INT DEFAULT 0,
    -- Delay after previous step
    fallback_condition VARCHAR(100),
    -- 'no_open', 'no_reply', 'always', null
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_campaign_steps_campaign_id ON campaign_steps(campaign_id);
-- Add columns to campaigns table for worker tracking
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_recipients INT,
    ADD COLUMN IF NOT EXISTS sent_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS failed_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS reply_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS booking_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS paused_reason TEXT,
    ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
-- Add idempotency tracking to campaign_messages
ALTER TABLE campaign_messages
ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS send_status VARCHAR(50) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS send_attempts INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS error_message TEXT;
CREATE INDEX IF NOT EXISTS idx_campaign_messages_idempotency ON campaign_messages(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_send_status ON campaign_messages(send_status);