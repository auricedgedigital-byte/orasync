"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import OrasyncLogo from "@/components/orasync/logo"
import Image from "next/image"
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  MessageSquare,
  Globe,
  Star as StarIcon,
  Shield,
  Play,
  Sparkles
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { user, loading } = useUser()

  if (loading) return null

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <OrasyncLogo className="w-9 h-9" textClassName="text-2xl font-black tracking-tighter" />

          <div className="hidden md:flex items-center gap-10">
            {["About Us", "Features", "Pricing", "Blog"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-black text-slate-400 hover:text-primary transition-all tracking-tight uppercase tracking-[0.1em]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button className="font-black text-xs px-8 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] uppercase tracking-widest">
                Start Growing
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Structured Single Column Flow */}
      <main>
        {/* Core Hero Section */}
        <section className="relative pt-40 pb-0 lg:pt-64 overflow-hidden bg-white">
          <div className="container max-w-5xl px-6 mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/5 rounded-full border border-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">The New Standard in Dental OS</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
                Automate <span className="text-primary italic">Growth</span><br />
                Reclaim <span className="text-primary">Revenue</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 font-bold leading-relaxed tracking-tight group">
                Fill empty clinical chairs with the <span className="text-slate-600 transition-colors group-hover:text-primary">Nova Soul</span> autonomous engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/auth/login">
                <Button size="lg" className="h-20 px-12 rounded-[2rem] font-black text-xl tracking-tight shadow-[0_20px_50px_-10px_rgba(var(--primary),0.3)] bg-primary hover:bg-primary/95 transition-all hover:scale-[1.05] active:scale-95 group">
                  Start Your Expedition
                  <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pre-Loaded Grant</p>
                  <p className="text-lg font-black text-primary">50 AI Credits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seamless Continuation - The "Other Part" (Hero Image) */}
          <div className="relative mt-24 max-w-7xl mx-auto px-6 lg:px-10">
            <div className="relative w-full aspect-[21/10] lg:aspect-[21/9] rounded-t-[4rem] overflow-hidden shadow-[0_-40px_100px_-20px_rgba(0,0,0,0.1)] border-t border-x border-slate-100 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
              <Image
                src="/hero.png"
                alt="High-Fidelity Practice Environment"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/50 to-transparent" />

              {/* Security Float Badge */}
              <div className="absolute top-12 left-12 p-8 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-2xl hidden lg:flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-black text-slate-900 text-xl leading-tight uppercase tracking-tighter">HIPAA Sovereign</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Enterprise Standard 2.4</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Network Sequence */}
        <section className="py-32 bg-white relative z-10 border-b border-slate-50">
          <div className="container max-w-7xl px-6 mx-auto">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-20 italic">Driving the performance of world-class clinics</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-20 items-center justify-items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 cursor-default">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-primary/20 transition-all mb-2" />
                  <span className="font-black text-slate-200 tracking-tighter text-xs uppercase">CLINIC NODE {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Narrative - Continuous flow into the Intelligence Engine */}
        <section className="py-40 bg-slate-50/50">
          <div className="container max-w-7xl px-6 lg:px-10 mx-auto">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="relative h-[750px] rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white">
                <Image src="/dentist.png" alt="Clinical Precision" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-16 left-16 right-16 p-10 bg-white/20 backdrop-blur-3xl rounded-[3rem] border border-white/30 shadow-2xl">
                  <p className="text-white text-2xl font-black italic tracking-tight leading-snug">"Orasync has completely overhauled our practice ROI. It's the partner we've always needed for re-engagement."</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/40" />
                    <div>
                      <p className="text-white text-base font-black uppercase tracking-widest">Dr. Sarah Jenkins</p>
                      <p className="text-white/70 text-[10px] font-black tracking-[0.2em] uppercase">Founder, Smile Studio</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-20">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">The Intelligence Engine</span>
                  </div>
                  <h2 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
                    Autonomous <br /><span className="text-primary italic">Clinical Precision</span>
                  </h2>
                  <p className="text-2xl text-slate-400 font-bold leading-relaxed tracking-tight max-w-xl">Nova handles the weight of clinical communication so your team can focus on the patient experience.</p>
                </div>

                <div className="space-y-12">
                  {[
                    { title: "Smart Reactivations", desc: "Autonomous sequences that re-ignite dormant patient pipelines on autopilot.", icon: Users },
                    { title: "Unified Command Hub", desc: "A high-fidelity cockpit for SMS, WhatsApp, and Web Chat integration.", icon: MessageSquare },
                    { title: "Reputation Guardian", desc: "Automate your social proof with clinical review generation and monitoring.", icon: StarIcon }
                  ].map((f, i) => (
                    <div key={i} className="flex gap-10 group">
                      <div className="h-20 w-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center border border-slate-100 group-hover:border-primary/50 transition-all flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3">
                        <f.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2 pt-4">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{f.title}</h4>
                        <p className="text-xl font-bold text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global CTA Climax */}
        <section className="py-64 bg-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[160px] rounded-full" />
          <div className="container max-w-5xl px-6 mx-auto text-center space-y-16 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-6">
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85]">Ready to start<br /><span className="text-primary italic">Your Ascension?</span></h2>
              <p className="text-3xl text-slate-400 font-bold max-w-2xl mx-auto tracking-tight">Join the elite network of dental leaders scaling with Orasync.</p>
            </div>

            <div className="flex flex-col items-center gap-10">
              <Link href="/auth/login">
                <Button size="lg" className="h-24 px-20 lg:px-24 rounded-[3rem] font-black text-3xl shadow-[0_30px_100px_-20px_rgba(var(--primary),0.5)] bg-primary hover:bg-primary/95 transition-all hover:scale-[1.05] active:scale-95">
                  Claim Your Seat
                  <ArrowRight className="ml-8 h-10 w-10" />
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-4">
                <div className="flex -space-x-5">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-14 h-14 rounded-full bg-slate-100 border-8 border-white shadow-xl" />)}
                </div>
                <span className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated across 500+ clinics worldwide</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-50 bg-slate-50/50 relative z-20">
        <div className="container max-w-7xl px-6 lg:px-10 mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <OrasyncLogo className="w-10 h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" textClassName="text-2xl font-black opacity-40 tracking-tighter" />
          <div className="flex gap-16">
            {["Terms", "Privacy", "HIPAA"].map(l => (
              <a key={l} href="#" className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary transition-all">{l}</a>
            ))}
          </div>
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-200">© 2026 Orasync Laboratory. High Fidelity Growth.</p>
        </div>
      </footer>
    </div>
  )
}
