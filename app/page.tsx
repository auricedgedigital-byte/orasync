"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import OrasyncLogo from "@/components/orasync/logo"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
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
  const [auditPracticeName, setAuditPracticeName] = useState("")
  const [auditEmail, setAuditEmail] = useState("")
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false)

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
            <Link href="https://auricedge.site/audit" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="font-black text-xs px-6 h-12 rounded-2xl border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all uppercase tracking-widest">
                Start Audit
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
              <Link href="https://auricedge.site/audit" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-20 px-10 rounded-[2rem] font-black text-lg tracking-tight border-primary/30 text-primary hover:bg-primary/10 transition-all hover:scale-[1.05] active:scale-95">
                  Get Your Free Dental Practice Audit
                  <Sparkles className="ml-3 h-5 w-5" />
                </Button>
              </Link>
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
        <section className="py-40 bg-slate-50/50" id="features">
...
        </section>

        {/* Audit Section */}
        <section className="py-40 bg-white" id="audit">
          <div className="container max-w-7xl px-6 lg:px-10 mx-auto">
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/20 rounded-full border border-primary/30">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">Practice Intelligence</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                    Get Your <br /><span className="text-primary italic">Free Practice Audit</span>
                  </h2>
                  <p className="text-xl text-slate-400 font-bold leading-relaxed tracking-tight">
                    Our Nova engine will analyze your current patient pipeline and identify exactly how much revenue is sitting dormant in your practice.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Patient Reactivation Potential",
                      "Schedule Gap Analysis",
                      "Reputation Benchmarking",
                      "ROI Projections"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 p-10 space-y-8">
                  <h3 className="text-2xl font-black text-white tracking-tight">Request Your Analysis</h3>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault()
                    if (!auditPracticeName || !auditEmail) {
                      toast.error("Please fill in all fields")
                      return
                    }
                    setIsSubmittingAudit(true)
                    try {
                      const res = await fetch("/api/audit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          practice_name: auditPracticeName,
                          contact_email: auditEmail,
                          source: "landing_page_audit"
                        })
                      })
                      if (res.ok) {
                        toast.success("Audit Requested!", {
                          description: "Our engine is analyzing your practice. We will email you the results shortly."
                        })
                        setAuditPracticeName("")
                        setAuditEmail("")
                      } else {
                        throw new Error("Failed to submit")
                      }
                    } catch (error) {
                      toast.error("Submission failed. Please try again.")
                    } finally {
                      setIsSubmittingAudit(false)
                    }
                  }}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Practice Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-primary transition-colors" 
                        placeholder="e.g. Skyline Dental" 
                        value={auditPracticeName}
                        onChange={(e) => setAuditPracticeName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-primary transition-colors" 
                        placeholder="doctor@practice.com" 
                        value={auditEmail}
                        onChange={(e) => setAuditEmail(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmittingAudit}
                      className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 mt-4 group"
                    >
                      {isSubmittingAudit ? "Analyzing..." : "Run Diagnostic"}
                      {!isSubmittingAudit && <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>
                  <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">No credit card required. HIPAA Compliant.</p>
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
