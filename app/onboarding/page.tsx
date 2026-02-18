"use client"

import { OnboardingWizard } from "@/components/orasync/onboarding/onboarding-wizard"
import OrasyncLogo from "@/components/orasync/logo"

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />

            <header className="p-6 md:p-8 flex items-center justify-between z-20">
                <OrasyncLogo className="h-8 shadow-sm" />
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">Support: +1 (800) ORA-SYNC</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center py-12 z-10">
                <OnboardingWizard />
            </main>

            <footer className="p-8 text-center text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] z-10">
                &copy; {new Date().getFullYear()} Orasync AI Revenue Engine. All Rights Reserved. HIPAA & SOC2 Compliant.
            </footer>
        </div>
    )
}
