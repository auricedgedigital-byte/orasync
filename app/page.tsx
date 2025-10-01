import { LpNavbar1 as Navbar } from "@/components/lp-navbar-1"
import { HeroSection7 as Hero } from "@/components/hero-section-7"
import { FeatureSection3 as Features } from "@/components/feature-section-3"
import { HowItWorksSection as HowItWorks } from "@/components/how-it-works-section"
import { PricingSection4 as Pricing } from "@/components/pricing-section-4"
import { Footer2 as Footer } from "@/components/footer-2"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  )
}
