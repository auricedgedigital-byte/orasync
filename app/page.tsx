"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import OrasyncLogo from "@/components/orasync/logo"
import {
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Zap,
  MessageSquare,
  Calendar,
  MoveUpRight,
  Shield,
  Star as StarIcon
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { user, loading } = useUser()

  if (loading) return null // Don't redirect while loading

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <OrasyncLogo />
          <div className="hidden lg:flex items-center gap-10">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors tracking-tight uppercase"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hidden sm:inline-flex font-bold text-sm tracking-tight hover:bg-primary/5 hover:text-primary transition-all rounded-xl">
                Log in
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="font-black text-sm tracking-tight px-6 h-11 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-black tracking-widest text-primary uppercase">New: AI Patient Reactivation v2.0</span>
          </div>

          <h1 className="text-6xl lg:text-8xl font-black text-foreground tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Fill Empty Chairs <br />
            <span className="text-primary italic">Automatically.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Orasync is the AI Revenue Engine for dental practices. Reactivate lost patients on autopilot and reclaim 5–15 hours of staff time every week.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-2xl font-black text-lg tracking-tight shadow-2xl shadow-primary/30 hover:scale-105 hover:rotate-1 active:scale-95 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-2xl font-bold text-lg border-border/60 hover:bg-muted transition-all bg-transparent">
              Book a Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-12 border-t border-border/40 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-16 gap-y-8 grayscale opacity-50">
            <div className="font-black text-2xl tracking-tighter">SMILESTUDIO</div>
            <div className="font-black text-2xl tracking-tighter underline decoration-primary">DENTALCORP</div>
            <div className="font-black text-2xl tracking-tighter italic">ORTHOFLOW</div>
            <div className="font-black text-2xl tracking-tighter opacity-80">PREMIERCARE</div>
          </div>
        </div>
      </section>

      {/* Feature Grid - 'Alohi' Style */}
      <section id="features" className="py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-6">Capabilities</h2>
            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter">Everything your practice <br /> needs to scale.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Reactivation",
                desc: "Smart agents detect inactive patients and reach out via clinical, high-conversion channels.",
                icon: Zap,
                color: "indigo"
              },
              {
                title: "Unified Inbox",
                desc: "One place for SMS, Email, and Social leads. Never lose a conversation again.",
                icon: MessageSquare,
                color: "blue"
              },
              {
                title: "Ad Optimization",
                desc: "Detailed attribution for Google & FB ads. See exactly where your bookings come from.",
                icon: BarChart3,
                color: "purple"
              },
              {
                title: "Safe & Secure",
                desc: "HIPAA-compliant, SOC2 ready infrastructure ensures patient data stays private.",
                icon: Shield,
                color: "emerald"
              },
              {
                title: "Auto-Scheduling",
                desc: "Patients click a link, pick a time, and it syncs directly to your practice management system.",
                icon: Calendar,
                color: "rose"
              },
              {
                title: "Patient CRM",
                desc: "Deep profiles for every patient. Known their history, value, and next appointment in a click.",
                icon: Users,
                color: "amber"
              }
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-background border border-border/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500`}>
                  <f.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-2xl font-black tracking-tighter mb-4">{f.title}</h4>
                <p className="text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-6">Patient Stories</h2>
              <h3 className="text-5xl font-black tracking-tighter leading-tight mb-8">Loved by the world's most <span className="italic">efficient</span> clinics.</h3>
              <p className="text-xl text-muted-foreground font-medium mb-10">
                Over 120+ dental practices have switched to OraSync to reclaim their schedule and delight their patients.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest mt-1">4.9/5 from 2k+ Reviews</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                {
                  quote: "OraSync brought back 120 patients in just 30 days. It solved our reactivation problem overnight.",
                  author: "Dr. Sarah Johnson",
                  role: "Owner, Smile Dental Studio"
                },
                {
                  quote: "The interface is beautiful and my staff actually enjoys using it. The conversion tracking is elite.",
                  author: "Dr. Mike Chen",
                  role: "Partner, Premier Dental"
                }
              ].map((t, i) => (
                <div key={i} className="p-10 bg-muted/40 rounded-[2.5rem] border border-border/40 relative">
                  <span className="text-6xl text-primary/20 font-serif absolute top-4 right-10">""</span>
                  <p className="text-xl font-bold tracking-tight mb-8 relative z-10">"{t.quote}"</p>
                  <div>
                    <p className="font-black tracking-tighter">{t.author}</p>
                    <p className="text-sm text-muted-foreground font-bold uppercase">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-6">Plans & Pricing</h2>
            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">Simple pricing, <br className="hidden md:block" />exponential growth.</h3>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Start with the essentials and scale as your practice grows. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter Plan */}
            <div className="p-8 rounded-[2rem] bg-background border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-muted rounded-full">Essentials</span>
              </div>
              <h4 className="text-3xl font-black tracking-tight mb-2">Starter</h4>
              <p className="text-muted-foreground font-medium mb-6">For solo dentists testing automated growth.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black">$149</span>
                <span className="text-muted-foreground font-bold">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Unified Inbox (SMS/Email)",
                  "AI Chatbot Assistant",
                  "Reputation Management",
                  "Auto-Booking Links",
                  "Basic Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login?plan=starter">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold tracking-tight border-primary/20 hover:bg-primary hover:text-white transition-all">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Growth Plan - Highlighted */}
            <div className="p-8 rounded-[2rem] bg-primary/5 border-2 border-primary/20 relative shadow-2xl shadow-primary/10 scale-105 z-10">
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-2xl rounded-tr-xl">
                Most Popular
              </div>
              <div className="mb-6">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary rounded-full">Growth</span>
              </div>
              <h4 className="text-3xl font-black tracking-tight mb-2">Growth</h4>
              <p className="text-muted-foreground font-medium mb-6">The Core Revenue Engine for high-volume practices.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black">$349</span>
                <span className="text-muted-foreground font-bold">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Starter",
                  "Reactivation Campaigns",
                  "Ads Management Dashboard",
                  "Advanced Analytics (ROI)",
                  "Priority Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/login?plan=growth">
                <Button className="w-full h-12 rounded-xl font-black tracking-tight shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-[2rem] bg-background border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-muted rounded-full">DSO / Group</span>
              </div>
              <h4 className="text-3xl font-black tracking-tight mb-2">Pro</h4>
              <p className="text-muted-foreground font-medium mb-6">Custom automation for multi-location groups.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black">$699</span>
                <span className="text-muted-foreground font-bold">+</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Multi-Location Dashboard",
                  "Dedicated Success Manager",
                  "Custom EMR Integrations",
                  "White-label Options",
                  "SLA Guarantee"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-sm">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold tracking-tight border-border/60 hover:bg-muted transition-all">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-primary p-16 lg:p-24 rounded-[3.5rem] text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40 group">
            <div className="absolute inset-0 bg-ai-gradient opacity-0 lg:group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic">Ready to optimize your practice pulse?</h2>
              <p className="text-xl opacity-90 font-medium mb-12">
                Join the high-growth practices using OraSync. Start your 30-day free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white text-primary hover:bg-white/90 hover:scale-105 active:scale-95 transition-all font-black text-xl tracking-tight">
                    GET STARTED FREE
                  </Button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-12 rounded-2xl border-white/30 text-white hover:bg-white/10 transition-all font-bold text-lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 border-b border-border/40 pb-20">
            <div className="col-span-2 lg:col-span-1">
              <OrasyncLogo className="w-7 h-7" textClassName="text-xl" />
              <p className="mt-8 text-sm text-muted-foreground font-medium max-w-xs leading-relaxed">
                The high-fidelity operating system for modern dental practices. Built for growth, powered by AI.
              </p>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-8">Platform</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Features</a>
                <a href="#" className="hover:text-primary transition-colors">Campaigns</a>
                <a href="#" className="hover:text-primary transition-colors">Integrations</a>
                <a href="#" className="hover:text-primary transition-colors">AI Assistant</a>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Case Studies</a>
                <a href="#" className="hover:text-primary transition-colors">Help Center</a>
                <a href="#" className="hover:text-primary transition-colors">Developer API</a>
                <a href="#" className="hover:text-primary transition-colors">Blog</a>
              </div>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-8">Company</h5>
              <div className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">About</a>
                <a href="#" className="hover:text-primary transition-colors">Careers</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Security</a>
              </div>
            </div>
          </div>
          <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              © 2025 OraSync Inc. All rights reserved. Made with love for dentists.
            </p>
            <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-all">Twitter</a>
              <a href="#" className="hover:text-primary transition-all">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-all shadow-sm">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
