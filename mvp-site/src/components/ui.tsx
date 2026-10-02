import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  readPracticeSetup,
  resetPracticeSetup,
  type PracticeSetup,
} from "~/lib/demo";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: "grid" },
  { label: "Patients", to: "/patients", icon: "users" },
  { label: "Leads", to: "/leads", icon: "spark" },
  { label: "Conversations", to: "/conversations", icon: "chat" },
  { label: "Workflows", to: "/workflows", icon: "flow" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {!compact && (
        <span className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
          orasync
        </span>
      )}
    </div>
  );
}

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3-1.7 5.3L5 10l5.3 1.7L12 17l1.7-5.3L19 10l-5.3-1.7L12 3Z" />
        <path d="m19 16-.8 2.2L16 19l2.2.8L19 22l.8-2.2L22 19l-2.2-.8L19 16Z" />
      </>
    ),
    chat: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.7-.9L3 20l1.7-4.3A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    flow: (
      <>
        <rect x="3" y="4" width="6" height="5" rx="1" />
        <rect x="15" y="15" width="6" height="5" rx="1" />
        <path d="M9 6.5h3a3 3 0 0 1 3 3v5.5" />
        <path d="m12 12 3 3 3-3" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9h.1v2.5H21a1.7 1.7 0 0 0-1.6 1.4Z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [setup, setSetup] = useState<PracticeSetup | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setSetup(readPracticeSetup()), [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="min-h-dvh bg-[#f6f8fb] text-slate-900">
      {mobileOpen && (
        <button
          type="button"
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        id="primary-navigation"
        className={`app-sidebar ${mobileOpen ? "app-sidebar-open" : ""}`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            to="/"
            aria-label="Orasync home"
            onClick={() => setMobileOpen(false)}
          >
            <Logo />
          </Link>
          <button
            type="button"
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="mx-5 mb-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="practice-avatar">
              {setup?.practiceName?.slice(0, 1).toUpperCase() ?? "O"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {setup?.practiceName ?? "Your practice"}
              </p>
              <p className="text-xs text-slate-500">Demo workspace</p>
            </div>
          </div>
        </div>
        <nav className="px-3" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`nav-link ${location.pathname === item.to || (item.to === "/dashboard" && location.pathname === "/") ? "nav-link-active" : ""}`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </Link>
          ))}
          <p className="nav-label mt-7">Manage</p>
          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={`nav-link ${location.pathname === "/settings" ? "nav-link-active" : ""}`}
          >
            <Icon name="settings" size={17} />
            Settings
          </Link>
        </nav>
        <div className="mt-auto px-5 pb-5">
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">
              <span className="status-dot" />
              Demo mode
            </div>
            <p className="text-xs leading-5 text-slate-300">
              No external messages or clinical records are being sent or stored.
            </p>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <button
            type="button"
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-controls="primary-navigation"
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" />
          </button>
          <div className="flex items-center gap-3">
            <span className="demo-pill">
              <span className="status-dot" />
              Demo mode
            </span>
            <span className="hidden text-sm text-slate-400 sm:inline">
              Preview workspace
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-700">
                {setup?.practiceName ?? "Orasync practice"}
              </p>
              <p className="text-[11px] text-slate-400">Local demo only</p>
            </div>
            <span className="user-avatar">
              {setup?.practiceName?.slice(0, 1).toUpperCase() ?? "O"}
            </span>
          </div>
        </header>
        <main className="page-wrap">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon = "spark",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={22} />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button className={`button button-${variant}`} {...props}>
      {children}
    </button>
  );
}

export function ResetDemoButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        resetPracticeSetup();
        navigate({ to: "/setup" });
      }}
    >
      Reset demo workspace
    </Button>
  );
}
