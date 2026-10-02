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
    if (
      typeof parsed.practiceName !== "string" ||
      !parsed.practiceName.trim() ||
      typeof parsed.completedAt !== "string"
    ) {
      return null;
    }
    return {
      practiceName: parsed.practiceName.trim(),
      location: typeof parsed.location === "string" ? parsed.location : "",
      contact: typeof parsed.contact === "string" ? parsed.contact : "",
      timezone:
        typeof parsed.timezone === "string"
          ? parsed.timezone
          : "America/New_York",
      bookingDestination:
        typeof parsed.bookingDestination === "string"
          ? parsed.bookingDestination
          : "",
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
    try {
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing and storage policies can make localStorage unavailable.
    }
  }

  return next;
}

export function resetPracticeSetup() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // Reset remains safe even when browser storage is unavailable.
    }
  }
}
