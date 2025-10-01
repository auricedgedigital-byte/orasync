"use client"

import { MessageSquare, ExternalLink, Calendar, BarChart3, Bot } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Patient Reactivation Campaigns",
    description:
      "AI-powered SMS and email follow-ups automatically re-engage dormant patients and bring them back to your practice.",
  },
  {
    icon: ExternalLink,
    title: "Ads Integration",
    description: "Google and Facebook ads connect directly to Orasync for seamless lead capture and nurturing.",
  },
  {
    icon: Calendar,
    title: "Booking Automation",
    description:
      "Patients auto-book through intelligent chatbot or calendar sync, converting conversations into confirmed appointments.",
  },
  {
    icon: BarChart3,
    title: "CRM Dashboard",
    description: "Manage all leads, conversations, and campaigns in one centralized, easy-to-use dashboard.",
  },
  {
    icon: Bot,
    title: "Analytics & ROI Tracking",
    description: "See patient lifetime value, conversion rates, and campaign performance with detailed analytics.",
  },
]

export function FeatureSection9() {
  return (
    <section className="bg-background py-16 md:py-24" id="features">
      <div className="container mx-auto px-6 flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col gap-4 md:gap-5 max-w-2xl mx-auto text-center">
          <p className="text-sm md:text-base font-semibold text-primary">Key Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything you need to grow your dental practice
          </h2>
          <p className="text-base text-muted-foreground">
            Powerful tools designed specifically for dental professionals to maximize patient engagement and bookings
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex flex-col gap-5 items-start text-left p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center items-center w-12 h-12 shrink-0 rounded-md bg-primary/10 border">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
