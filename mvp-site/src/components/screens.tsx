import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  readPracticeSetup,
  savePracticeSetup,
  type PracticeSetup,
} from "~/lib/demo";
import {
  Button,
  EmptyState,
  Icon,
  PageHeader,
  ResetDemoButton,
} from "~/components/ui";

export function SetupScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    practiceName: "",
    location: "",
    contact: "",
    timezone: "America/New_York",
    bookingDestination: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = readPracticeSetup();
    if (existing)
      setForm({
        practiceName: existing.practiceName,
        location: existing.location,
        contact: existing.contact,
        timezone: existing.timezone,
        bookingDestination: existing.bookingDestination,
      });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.practiceName.trim()) return;
    savePracticeSetup({ ...form, practiceName: form.practiceName.trim() });
    setSaved(true);
    window.setTimeout(() => navigate({ to: "/dashboard" }), 250);
  }

  return (
    <div className="setup-layout">
      <div className="setup-intro">
        <div className="setup-kicker">
          <span className="brand-mark small">
            <span />
            <span />
            <span />
          </span>
          Orasync workspace
        </div>
        <h1>Set up your practice workspace.</h1>
        <p>
          Start with a few details so your demo feels like your own. Everything
          stays in this browser for now.
        </p>
        <div className="setup-points">
          <div>
            <span className="point-icon">
              <Icon name="shield" size={16} />
            </span>
            <span>
              <strong>Private by default</strong>
              <small>No account or external service is connected.</small>
            </span>
          </div>
          <div>
            <span className="point-icon">
              <Icon name="check" size={16} />
            </span>
            <span>
              <strong>Ready in a minute</strong>
              <small>Change these details later in Settings.</small>
            </span>
          </div>
        </div>
      </div>
      <form className="setup-card" onSubmit={submit}>
        <div className="mb-7">
          <p className="eyebrow">Practice details</p>
          <h2>Make it yours</h2>
          <p className="mt-2 text-sm text-slate-500">
            These details are saved only as demo state on this device.
          </p>
        </div>
        <label className="field-label">
          Practice name <span>Required</span>
          <input
            required
            autoFocus
            value={form.practiceName}
            onChange={(event) =>
              setForm({ ...form, practiceName: event.target.value })
            }
            placeholder="e.g. Brightline Dental"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label">
            Location
            <input
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              placeholder="City, State"
            />
          </label>
          <label className="field-label">
            Primary contact
            <input
              type="email"
              value={form.contact}
              onChange={(event) =>
                setForm({ ...form, contact: event.target.value })
              }
              placeholder="you@example.com"
            />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field-label">
            Timezone
            <select
              value={form.timezone}
              onChange={(event) =>
                setForm({ ...form, timezone: event.target.value })
              }
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </label>
          <label className="field-label">
            Booking destination
            <input
              value={form.bookingDestination}
              onChange={(event) =>
                setForm({ ...form, bookingDestination: event.target.value })
              }
              placeholder="e.g. /book or booking URL"
            />
            <small className="field-help">
              Where a future booking button should send patients.
            </small>
          </label>
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <span className="text-xs text-slate-400">
            No clinical data required.
          </span>
          <Button type="submit">
            {saved ? "Opening workspace…" : "Continue to workspace"}
            <Icon name="arrow" size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export function DashboardScreen() {
  const [setup, setSetup] = useState<PracticeSetup | null>(null);
  useEffect(() => setSetup(readPracticeSetup()), []);
  const practiceName = setup?.practiceName ?? "your practice";
  return (
    <>
      <PageHeader
        eyebrow="Workspace overview"
        title={`Good morning, ${practiceName}.`}
        description="A calm starting point for the conversations and follow-ups that keep your practice moving."
        action={
          <Link to="/workflows" className="button button-primary">
            <Icon name="plus" size={16} />
            Explore workflow
          </Link>
        }
      />
      <div className="notice-banner">
        <div className="notice-icon">
          <Icon name="shield" size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">
            You’re exploring Orasync in Demo mode
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Nothing is being sent to patients, and no clinical records are being
            stored. The examples below are labeled demo data.
          </p>
        </div>
        <Link to="/settings" className="notice-link">
          Review settings <Icon name="arrow" size={14} />
        </Link>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Patients to revisit"
          value="24"
          hint="Demo data · 8 due this week"
          tone="teal"
        />
        <StatCard
          label="Open leads"
          value="7"
          hint="Demo data · 3 need a reply"
          tone="blue"
        />
        <StatCard
          label="Booking signals"
          value="12"
          hint="Demo data · not connected"
          tone="violet"
        />
        <StatCard
          label="Active workflows"
          value="1"
          hint="1 free workflow available"
          tone="amber"
        />
      </div>
      <div className="content-grid mt-6">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Next best actions</h2>
            </div>
            <span className="demo-tag">Demo data</span>
          </div>
          <div className="action-list">
            <ActionRow
              icon="users"
              title="Review reactivation list"
              description="8 patients have a demo follow-up due this week."
              href="/patients"
            />
            <ActionRow
              icon="chat"
              title="Triage new conversations"
              description="3 sample leads are waiting for a reply."
              href="/conversations"
            />
            <ActionRow
              icon="flow"
              title="Preview your workflow"
              description="See how a free reactivation workflow is structured."
              href="/workflows"
            />
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Workspace health</p>
              <h2>Ready when you are</h2>
            </div>
            <span className="health-orb">
              <Icon name="check" size={17} />
            </span>
          </div>
          <div className="health-list">
            <HealthItem title="Practice setup" detail="Saved locally" />
            <HealthItem title="Patient data" detail="No import yet" />
            <HealthItem title="Messaging" detail="Not connected" muted />
          </div>
          <Link to="/settings" className="panel-footer-link">
            Manage workspace settings <Icon name="arrow" size={14} />
          </Link>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Planned areas</p>
          <h2>Build from one shared view</h2>
        </div>
        <span className="text-xs text-slate-400">
          Demo data is clearly labeled
        </span>
      </div>
      <div className="quick-grid">
        <QuickCard
          icon="users"
          title="Patients"
          text="A simple list for follow-ups and reactivation."
          href="/patients"
        />
        <QuickCard
          icon="spark"
          title="Leads"
          text="Keep lead-to-booking signals visible."
          href="/leads"
        />
        <QuickCard
          icon="chat"
          title="Conversations"
          text="One place to review future patient conversations."
          href="/conversations"
        />
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-${tone}`}>
        <Icon
          name={
            tone === "teal"
              ? "users"
              : tone === "blue"
                ? "spark"
                : tone === "violet"
                  ? "arrow"
                  : "flow"
          }
          size={17}
        />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-400">{hint}</p>
    </div>
  );
}
function ActionRow({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href} className="action-row">
      <span className="row-icon">
        <Icon name={icon} size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <Icon name="arrow" size={16} />
    </Link>
  );
}
function HealthItem({
  title,
  detail,
  muted = false,
}: {
  title: string;
  detail: string;
  muted?: boolean;
}) {
  return (
    <div className="health-item">
      <span className={`health-check ${muted ? "health-muted" : ""}`}>
        <Icon name={muted ? "arrow" : "check"} size={13} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span className="ml-auto text-xs text-slate-400">
        {muted ? "Soon" : "Ready"}
      </span>
    </div>
  );
}
function QuickCard({
  icon,
  title,
  text,
  href,
}: {
  icon: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link to={href} className="quick-card">
      <span className="row-icon">
        <Icon name={icon} size={17} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <Icon name="arrow" size={16} />
    </Link>
  );
}

const areaCopy: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
    icon: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  patients: {
    eyebrow: "Patient workspace",
    title: "Patients",
    description:
      "A focused view for follow-ups, reactivation, and the details your team chooses to bring into Orasync.",
    icon: "users",
    emptyTitle: "Your patient list starts here",
    emptyDescription:
      "Import a CSV when you’re ready. For now, this area is intentionally empty so no real clinical records are implied.",
  },
  leads: {
    eyebrow: "Growth workspace",
    title: "Leads",
    description:
      "Track the next step from first interest to a booked appointment without pretending a booking system is connected.",
    icon: "spark",
    emptyTitle: "No live leads yet",
    emptyDescription:
      "This demo can show the shape of lead tracking, but it does not receive forms, calls, or messages yet.",
  },
  conversations: {
    eyebrow: "Shared inbox",
    title: "Conversations",
    description:
      "A future home for patient and lead conversations across the channels your practice uses.",
    icon: "chat",
    emptyTitle: "No conversations connected",
    emptyDescription:
      "There are no external messages here. Connect a provider in a future increment to bring opted-in conversations into this view.",
  },
  workflows: {
    eyebrow: "Automation workspace",
    title: "Workflows",
    description:
      "Start with one free reactivation workflow and make each handoff visible to your team.",
    icon: "flow",
    emptyTitle: "One workflow is ready to explore",
    emptyDescription:
      "The free reactivation workflow is a demo outline. It does not send messages or schedule anything yet.",
  },
};

export function AreaScreen({ area }: { area: keyof typeof areaCopy }) {
  const copy = areaCopy[area];
  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
          area === "workflows" ? (
            <Button variant="secondary">
              <Icon name="plus" size={16} />
              New workflow <span className="soon-label">Soon</span>
            </Button>
          ) : (
            <span className="demo-tag">Demo data only</span>
          )
        }
      />
      {area === "workflows" ? (
        <WorkflowPreview />
      ) : (
        <EmptyState
          icon={copy.icon}
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          action={
            <Link to="/settings" className="button button-secondary">
              View demo settings <Icon name="arrow" size={15} />
            </Link>
          }
        />
      )}
    </>
  );
}
function WorkflowPreview() {
  return (
    <div className="workflow-card">
      <div className="panel-heading">
        <div>
          <span className="workflow-status">Available in demo</span>
          <h2 className="mt-3">Reactivation · 90 day follow-up</h2>
          <p className="mt-2 text-sm text-slate-500">
            A gentle, consent-aware starting point for patients who may be ready
            to return.
          </p>
        </div>
        <span className="stat-icon stat-teal">
          <Icon name="flow" size={18} />
        </span>
      </div>
      <div className="workflow-steps">
        <div>
          <span>01</span>
          <strong>Identify</strong>
          <small>Filter demo patients with no visit in 90 days.</small>
        </div>
        <div>
          <span>02</span>
          <strong>Review</strong>
          <small>A team member checks the list before any action.</small>
        </div>
        <div>
          <span>03</span>
          <strong>Follow up</strong>
          <small>Messaging is not connected in this demo.</small>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="soft-chip">Free workflow</span>
        <span className="soft-chip">Human review</span>
        <span className="soft-chip">No sending enabled</span>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  const [setup, setSetup] = useState<PracticeSetup | null>(null);
  useEffect(() => setSetup(readPracticeSetup()), []);
  return (
    <>
      <PageHeader
        eyebrow="Workspace settings"
        title="Settings"
        description="Keep your demo workspace details clear and ready for the next increment."
      />
      <div className="settings-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Practice profile</p>
              <h2>{setup?.practiceName ?? "Not set up"}</h2>
            </div>
            <span className="demo-tag">Local demo</span>
          </div>
          <dl className="details-list">
            <Detail label="Location" value={setup?.location || "Not added"} />
            <Detail
              label="Primary contact"
              value={setup?.contact || "Not added"}
            />
            <Detail label="Timezone" value={setup?.timezone || "Not added"} />
            <Detail
              label="Booking destination"
              value={setup?.bookingDestination || "Not added"}
            />
          </dl>
          <Link to="/setup" className="button button-secondary mt-6">
            Edit practice details <Icon name="arrow" size={15} />
          </Link>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Environment</p>
              <h2>Demo mode</h2>
            </div>
            <span className="health-orb">
              <Icon name="shield" size={17} />
            </span>
          </div>
          <p className="text-sm leading-6 text-slate-500">
            This workspace uses browser-only storage. No authentication, PMS,
            messaging provider, billing, or external database is connected.
          </p>
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            Demo state key
            <br />
            <code className="font-mono text-slate-700">
              orasync_demo_workspace_v1
            </code>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="text-sm font-semibold text-slate-800">Start over</p>
            <p className="mt-1 text-sm text-slate-500">
              Clear this browser’s demo setup and return to the welcome screen.
            </p>
            <div className="mt-4">
              <ResetDemoButton />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
