"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Search, Bot, Palette, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Palette,
    title: "Professional Templates",
    description: "Choose from AI-optimized dental website templates designed for patient conversion",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Get found by local patients with our comprehensive SEO and local search optimization",
  },
  {
    icon: Bot,
    title: "Chatbot Integration",
    description: "Seamlessly integrate booking chatbots directly into your new website",
  },
]

export function WebsiteUpsellSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Website Add-On
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Need a High-Performing Website?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            If you don't have one, choose from templates we optimize with AI for SEO, branding, and patient bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-background rounded-2xl p-8 lg:p-12 border shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Complete Website Solution</h3>
              <p className="text-muted-foreground mb-6">
                Each service comes with add-on pricing and includes everything you need to establish a strong online
                presence for your dental practice.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Mobile-responsive dental website templates</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Local SEO optimization for dental practices</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Integrated booking system and chatbot</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Professional branding and design</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex items-center gap-2">
                  Explore Templates
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-muted/50 rounded-xl p-6 border">
                <div className="space-y-4">
                  <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-20 bg-primary/10 rounded border-2 border-dashed border-primary/30"></div>
                    <div className="h-20 bg-secondary/20 rounded border-2 border-dashed border-secondary/30"></div>
                  </div>
                  <div className="h-8 bg-primary rounded w-1/2 mt-4"></div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Globe className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Add-on pricing available. Contact our team for custom website solutions tailored to your practice.
          </p>
        </div>
      </div>
    </section>
  )
}
