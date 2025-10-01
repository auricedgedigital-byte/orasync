"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Database, MessageSquare, Calendar } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Database,
    title: "Connect your patient list or ad campaigns",
    description:
      "Seamlessly integrate your existing patient database and Google/Facebook ad campaigns with Orasync's platform.",
    color: "text-blue-600",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Orasync reactivates past patients & nurtures new leads",
    description:
      "Our AI-powered system automatically sends personalized SMS and email follow-ups to re-engage dormant patients and convert new leads.",
    color: "text-green-600",
  },
  {
    step: "03",
    icon: Calendar,
    title: "Leads are converted into confirmed bookings automatically",
    description:
      "Patients can book appointments directly through our chatbot or calendar sync, turning conversations into confirmed appointments.",
    color: "text-purple-600",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 bg-background" aria-labelledby="how-it-works-heading">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="how-it-works-heading" className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your dental practice growth with our simple 3-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative">
                <Card className="h-full border-2 hover:border-primary/20 transition-colors">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${step.color}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-muted-foreground">{step.step}</div>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-4 text-balance">{step.title}</h3>

                    <p className="text-muted-foreground text-pretty">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Visual flow diagram */}
        <div className="mt-16 lg:mt-20">
          <div className="bg-muted/50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Simple 3-Step Flow Diagram</h3>
              <p className="text-muted-foreground">See how Orasync transforms your patient engagement process</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-foreground">Patient Data</div>
                <div className="text-xs text-muted-foreground">& Ad Campaigns</div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-sm font-medium text-foreground">AI Engagement</div>
                <div className="text-xs text-muted-foreground">SMS & Email</div>
              </div>

              <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-foreground">Confirmed</div>
                <div className="text-xs text-muted-foreground">Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
