-- Migration to support Advanced Campaign Dynamics
-- Supports: Multi-day drips, conditional fallbacks (Email -> SMS), and progress tracking
-- 1. Create campaign_patient_progress table
CREATE TABLE IF NOT EXISTS campaign_patient_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    patient_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    current_step_index int DEFAULT 0,
    last_action_at timestamptz DEFAULT now(),
    next_action_at timestamptz DEFAULT now(),
    status text DEFAULT 'active',
    -- 'active', 'completed', 'converted', 'paused'
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(campaign_id, patient_id)
);
-- 2. Add indexes for the worker to poll efficiently
CREATE INDEX IF NOT EXISTS idx_campaign_progress_next_action ON campaign_patient_progress(next_action_at)
WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_campaign_progress_clinic_campaign ON campaign_patient_progress(clinic_id, campaign_id);
-- 3. Add sequence support to campaigns table (if not already handled by JSONB)
-- We already have 'template' and 'channels' JSONB columns. 
-- We will use 'template' to store the array of steps.
-- 4. Function to update campaign stats based on progress
CREATE OR REPLACE FUNCTION update_campaign_stats_from_progress() RETURNS TRIGGER AS $$ BEGIN IF (
        TG_OP = 'UPDATE'
        AND OLD.status != NEW.status
    ) THEN IF (NEW.status = 'completed') THEN
UPDATE campaigns
SET stats = jsonb_set(
        stats,
        '{completed}',
        (COALESCE((stats->>'completed')::int, 0) + 1)::text::jsonb
    )
WHERE id = NEW.campaign_id;
ELSIF (NEW.status = 'converted') THEN
UPDATE campaigns
SET stats = jsonb_set(
        stats,
        '{converted}',
        (COALESCE((stats->>'converted')::int, 0) + 1)::text::jsonb
    )
WHERE id = NEW.campaign_id;
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_campaign_progress_stats
AFTER
UPDATE ON campaign_patient_progress FOR EACH ROW EXECUTE FUNCTION update_campaign_stats_from_progress();