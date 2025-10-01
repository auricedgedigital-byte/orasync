"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { UserPlus, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: UserPlus,
    title: "Connect your patient data",
    description: "Import your existing patient list and connect your Google/Facebook ad campaigns in minutes.",
  },
  {
    icon: MessageCircle,
    title: "AI starts engaging patients",
    description:
      "Our intelligent system automatically sends personalized messages to reactivate past patients and nurture new leads.",
  },
  {
    icon: Calendar,
    title: "Watch bookings roll in",
    description: "Patients book appointments directly through our system, turning conversations into confirmed visits.",
  },
]

export function FeatureSection3() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-4 md:gap-5">
            <p className="text-sm md:text-base font-semibold text-primary">Getting Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Start growing your practice today</h2>
            <p className="text-base text-muted-foreground">Get up and running with Orasync in just 3 simple steps:</p>
          </div>
          <div className="flex flex-col gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  <div className="flex justify-center items-center w-10 h-10 shrink-0 rounded-md bg-primary/10 border">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="https://app.orasync.com/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="overflow-hidden rounded-xl border bg-background shadow-xl">
            <AspectRatio ratio={1 / 1}>
              <Image
                src="/placeholder.svg?height=400&width=400&text=Orasync+Dashboard"
                alt="Orasync dashboard showing patient reactivation campaigns and booking analytics for dental practices"
                fill
                className="object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  )
}
