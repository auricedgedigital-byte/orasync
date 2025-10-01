"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"

const pricingData = {
  plans: [
    {
      name: "Reactivation Campaign",
      description: "Perfect for getting started with patient reactivation.",
      features: [
        {
          name: "AI-powered SMS & Email campaigns",
          tooltip: "Automated follow-ups to reactivate dormant patients",
        },
        {
          name: "Up to 500 patient contacts",
          tooltip: "Reach up to 500 patients per month",
        },
        {
          name: "Basic analytics dashboard",
          tooltip: "Track campaign performance and patient responses",
        },
        {
          name: "Email support",
          tooltip: "Get help when you need it via email",
        },
      ],
      pricing: {
        monthly: 0,
        annually: 0,
      },
      trialNote: "Free Trial → $97/month after",
      variant: "secondary",
    },
    {
      name: "Full Growth Suite",
      description: "Complete solution for growing dental practices.",
      badge: "Most popular",
      features: [
        {
          name: "Everything in Reactivation Campaign",
          tooltip: "All features from the basic plan included",
        },
        {
          name: "CRM & Lead Management",
          tooltip: "Manage all leads, conversations, and campaigns in one place",
        },
        {
          name: "Google & Facebook Ads Integration",
          tooltip: "Connect your ad campaigns directly to Orasync",
        },
        {
          name: "Booking Automation & Chatbot",
          tooltip: "Patients can book appointments automatically",
        },
        {
          name: "Advanced Analytics & ROI Tracking",
          tooltip: "See patient lifetime value and conversion rates",
        },
        {
          name: "Priority phone support",
          tooltip: "Get priority support via phone and email",
        },
      ],
      pricing: {
        monthly: 297,
        annually: 2970,
      },
      variant: "default",
    },
    {
      name: "Custom Website + Marketing Boost",
      description: "Complete online presence with high-converting website.",
      features: [
        {
          name: "Everything in Full Growth Suite",
          tooltip: "All features from the growth suite included",
        },
        {
          name: "Custom Dental Website Design",
          tooltip: "Professional website optimized for patient conversion",
        },
        {
          name: "SEO Optimization & Local Search",
          tooltip: "Get found by local patients searching for dental services",
        },
        {
          name: "Integrated Booking System",
          tooltip: "Seamless appointment booking on your website",
        },
        {
          name: "Dedicated Account Manager",
          tooltip: "Personal support and strategy guidance",
        },
      ],
      pricing: {
        monthly: 597,
        annually: 5970,
      },
      addOnNote: "Add-on pricing available",
      variant: "secondary",
    },
  ],
}

export function PricingSection4() {
  const [billingPeriod, setBillingPeriod] = React.useState("monthly")

  return (
    <section className="py-16 md:py-24 pattern-1 bg-muted/30" aria-labelledby="pricing-section-title-4" id="pricing">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 md:gap-5 max-w-2xl text-center">
            <p className="text-base font-semibold text-primary">Pricing</p>
            <h2 id="pricing-section-title-4" className="text-3xl md:text-4xl font-bold">
              Choose the right plan for your practice
            </h2>
            <p className="text-base text-muted-foreground">
              Start with our free trial and scale as your practice grows
            </p>
          </div>

          <Tabs value={billingPeriod} onValueChange={setBillingPeriod} className="w-fit">
            <TabsList className="bg-black/30 h-10 p-1 rounded-[40px]">
              <TabsTrigger
                value="monthly"
                className="rounded-full px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="annually"
                className="rounded-full px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Annually
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col lg:flex-row gap-6 lg:max-w-6xl w-full mx-auto">
            {pricingData.plans.map((plan, index) => (
              <Card key={plan.name} className={`p-8 space-y-8 ${index === 1 ? "border-2 border-primary" : ""}`}>
                <div className="space-y-6">
                  {plan.badge && (
                    <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {plan.badge}
                    </div>
                  )}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold leading-7">{plan.name}</h3>
                    <p className="text-sm leading-5 text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="flex items-end gap-0.5">
                    <span className="text-4xl font-semibold leading-10">
                      ${billingPeriod === "monthly" ? plan.pricing.monthly : plan.pricing.annually}
                    </span>
                    <span className="text-base leading-6 text-muted-foreground">
                      {plan.pricing.monthly === 0 ? "" : `/${billingPeriod === "monthly" ? "month" : "year"}`}
                    </span>
                  </div>

                  {plan.trialNote && <p className="text-sm text-muted-foreground">{plan.trialNote}</p>}
                  {plan.addOnNote && <p className="text-sm text-muted-foreground">{plan.addOnNote}</p>}

                  <Link href="https://app.orasync.com/signup">
                    <Button variant={index === 1 ? "default" : "secondary"} className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium">What's included:</p>
                  <div className="flex flex-col gap-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm flex-1 text-muted-foreground">{feature.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground opacity-70" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
