"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import Link from "next/link"

export function HeroSection7() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-16 lg:py-24" aria-labelledby="hero-heading">
      <div className="container px-6 flex flex-col items-center gap-12 lg:gap-16 mx-auto">
        <div className="flex gap-12 lg:gap-16">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
            <h1 id="hero-heading" className="text-foreground text-3xl lg:text-5xl font-bold flex-1 text-balance">
              Turn Patients into Bookings, <span className="text-primary">Effortlessly</span>
            </h1>
            <div className="flex-1 w-full flex flex-col gap-8">
              <p className="text-muted-foreground text-base lg:text-lg text-pretty">
                Orasync helps dentists reactivate old patients, convert new leads, and manage campaigns — all in one
                place. Grow your practice with AI-powered patient engagement and automated booking systems.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="https://app.orasync.com/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <Play className="mr-2 h-4 w-4" />
                  Book a Demo
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border bg-background shadow-xl">
          <AspectRatio ratio={16 / 9}>
            <Image
              src="/modern-dental-practice-dashboard-showing-patient-r.jpg"
              alt="Orasync dashboard interface showing patient reactivation campaigns, booking analytics, and dental practice growth metrics"
              fill
              priority
              className="object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  )
}
