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
  BarChart3,
  Zap,
  MessageSquare,
  Calendar,
  MoveUpRight,
  Shield,
  Star as StarIcon,
  Play,
  Globe,
  Heart
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <OrasyncLogo className="w-9 h-9" textClassName="text-2xl" />

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Testimonials", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors tracking-tight"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="font-bold text-sm rounded-xl">
                Log in
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="font-black text-sm px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center">
        {/* Background Dental Image Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
          <Image
            src="/placeholder.jpg"
            alt="Dental Clinic"
            fill
            className="object-cover opacity-30 grayscale-[20%]"
            priority
          />
        </div>

        <div className="container relative z-20 max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">OraSync Revenue Engine v2.0</span>
            </div>

            {/* Main Glassmorphic Card */}
            <div className="max-w-4xl p-10 lg:p-16 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(var(--primary),0.05)] animate-in zoom-in-95 duration-1000">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-8">
                Reclaim <span className="text-primary italic">Time</span> & <br />
                <span className="bg-gradient-to-r from-primary to-ai-secondary bg-clip-text text-transparent">Revenue</span> for Your <br />
                Dental Practice.
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium mb-12">
                The AI-powered Dental Operating System. Reactivate lost patients, automate unified messaging, and grow your reputation—all on autopilot.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black text-lg tracking-tight shadow-xl shadow-primary/30 hover:scale-[1.03] transition-all">
                    Get Started Free
                  </Button>
                </Link>
                <div className="text-sm font-bold text-muted-foreground">
                  Your Credit Balance: <span className="text-primary">$50 Trial</span>
                </div>
              </div>
            </div>

            {/* Trusted By Section */}
            <div className="mt-20 w-full animate-in fade-in duration-1000 delay-500">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">TRUSTED BY LEADING DENTISTS</p>
              <div className="flex overflow-hidden relative group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 grayscale opacity-40 group-hover:opacity-100 transition-opacity">
                  {["SMILESTUDIO", "DENTALCORP", "ORTHOFLOW", "PREMIERCARE", "CITYDENTAL", "ELITEORTHO"].map(brand => (
                    <span key={brand} className="text-2xl font-black tracking-tighter">{brand}</span>
                  ))}
                </div>
                {/* Secondary for infinite loop */}
                <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-16 grayscale opacity-40 group-hover:opacity-100 transition-opacity ml-16">
                  {["SMILESTUDIO", "DENTALCORP", "ORTHOFLOW", "PREMIERCARE", "CITYDENTAL", "ELITEORTHO"].map(brand => (
                    <span key={`${brand}-2`} className="text-2xl font-black tracking-tighter">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Designs Reference */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Anya Sharma",
                quote: "OraSync's AI brought back patients I thought were lost forever. Our bookings increased by 30% in a month!",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anya"
              },
              {
                name: "Dr. Mark Davis",
                quote: "The unified inbox is a game-changer. No more missed messages from different platforms. It saves my front desk hours daily.",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
              },
              {
                name: "Dr. Kenji Tanaka",
                quote: "My online reputation has never been better. OraSync automates review requests, and patients are actually responding!",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji"
              }
            ].map((t, idx) => (
              <div key={idx} className="p-8 rounded-[2rem] bg-background border border-border/50 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={t.image} alt={t.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">{t.name}</h4>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section id="features" className="py-32 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-6">FEATURES</h2>
            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter">Smart solutions to optimize <br /> every patient touchpoint.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Reactivation Campaigns",
                desc: "Automated text & email to dormant patients. Seamlessly fill empty chairs.",
                icon: Zap,
                benefit: "+25% average revenue boost"
              },
              {
                title: "Unified Inbox",
                desc: "Centralize all messages (SMS, email, social). Respond faster from one dashboard.",
                icon: MessageSquare,
                benefit: "Zero missed communications"
              },
              {
                title: "AI Chatbot",
                desc: "24/7 scheduling & FAQs for patients. Handles inquiries after hours.",
                icon: Globe,
                benefit: "60% reduction in phone calls"
              },
              {
                title: "Reputation Management",
                desc: "Automate review requests & monitor feedback. Attract more new patients.",
                icon: StarIcon,
                benefit: "Attract more new patients"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/40 hover:bg-card transition-all duration-500 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-xl font-black tracking-tight mb-4">{feature.title}</h4>
                <p className="text-muted-foreground text-sm font-medium mb-6 leading-relaxed">{feature.desc}</p>
                <div className="mt-auto px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest">
                  Benefit: {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-y border-border/40 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12">
          {[
            { icon: Shield, label: "HIPAA Compliant" },
            { icon: Zap, label: "99.9% Uptime" },
            { icon: Users, label: "24/7 Support" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              <item.icon className="w-4 h-4 text-primary" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Flexible Billing & Plans */}
      <section id="pricing" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">Ready to Transform Your Practice?</h3>
            <Link href="/auth/login">
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                Get Started Free
              </Button>
            </Link>
            <p className="mt-4 text-xs font-bold text-muted-foreground tracking-widest">Your Credit Balance: $50 Trial</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="p-10 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-border/50 hover:border-primary/20 transition-all">
              <h4 className="text-xl font-black mb-2 tracking-tight">Starter Credit Pack</h4>
              <p className="text-muted-foreground text-sm mb-6">Ideal for small clinics testing the waters.</p>
              <div className="text-4xl font-black mb-6">$45<span className="text-lg text-muted-foreground">/month</span></div>
              <ul className="text-sm font-semibold space-y-3 mb-8 text-left max-w-[200px] mx-auto">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 1,000 Credits</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> All features included</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> AI Nova basic access</li>
              </ul>
              <Button variant="outline" className="w-full rounded-xl font-bold">Choose Starter</Button>
            </div>

            <div className="p-10 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest">Best Value</div>
              <h4 className="text-xl font-black mb-2 tracking-tight">Growth Subscription</h4>
              <p className="opacity-80 text-sm mb-6">Perfect for high-growth practices.</p>
              <div className="text-4xl font-black mb-6">$199<span className="opacity-70 text-lg font-bold">/month</span></div>
              <ul className="text-sm font-bold space-y-3 mb-8 text-left max-w-[200px] mx-auto">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> 5,000 Credits</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Priority AI Nova</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Advanced analytics</li>
              </ul>
              <Button className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-black">Choose Growth</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-20 border-t border-border/40 bg-card/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <OrasyncLogo className="w-10 h-10 mx-auto mb-10" />
          <div className="flex flex-wrap justify-center gap-10 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-16">
            <a href="#" className="hover:text-primary transition-colors">Product</a>
            <a href="#" className="hover:text-primary transition-colors">Solutions</a>
            <a href="#" className="hover:text-primary transition-colors">Resources</a>
            <a href="#" className="hover:text-primary transition-colors">Company</a>
          </div>
          <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground mb-8 uppercase">© 2024 ORASYNC. ALL RIGHTS RESERVED.</p>
          <div className="flex justify-center gap-6 opacity-60">
            {/* Simple social icon placeholders */}
            <div className="w-8 h-8 rounded-full bg-border" />
            <div className="w-8 h-8 rounded-full bg-border" />
            <div className="w-8 h-8 rounded-full bg-border" />
          </div>
        </div>
      </footer>
    </div>
  )
}
