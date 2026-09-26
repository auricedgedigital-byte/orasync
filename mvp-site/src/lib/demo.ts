export const DEMO_STORAGE_KEY = "orasync_demo_workspace_v1";

export type PracticeSetup = {
  practiceName: string;
  location: string;
  contact: string;
  timezone: string;
  bookingDestination: string;
  completedAt: string;
};

export function readPracticeSetup(): PracticeSetup | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PracticeSetup>;
    if (!parsed.practiceName || !parsed.completedAt) return null;
    return {
      practiceName: parsed.practiceName,
      location: parsed.location ?? "",
      contact: parsed.contact ?? "",
      timezone: parsed.timezone ?? "America/New_York",
      bookingDestination: parsed.bookingDestination ?? "",
      completedAt: parsed.completedAt,
    };
  } catch {
    return null;
  }
}

export function savePracticeSetup(
  setup: Omit<PracticeSetup, "completedAt">,
): PracticeSetup {
  const next: PracticeSetup = {
    ...setup,
    completedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}

export function resetPracticeSetup() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  }
}
