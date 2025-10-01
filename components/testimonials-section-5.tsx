"use client"

import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Orasync brought back 120 patients in 30 days. The AI follow-ups are incredible - patients actually respond and book appointments!",
    author: "Dr. Sarah Mitchell",
    role: "Family Dentist, Mitchell Dental Care",
    image: "/placeholder.svg?height=56&width=56&text=SM",
    rating: 5,
    metric: "120 patients reactivated",
  },
  {
    quote:
      "Our booking rate increased by 300% after implementing Orasync. The automated campaigns save us hours every week.",
    author: "Dr. James Rodriguez",
    role: "Cosmetic Dentist, Smile Studio",
    image: "/placeholder.svg?height=56&width=56&text=JR",
    rating: 5,
    metric: "300% booking increase",
  },
]

export function TestimonialsSection5() {
  return (
    <section className="py-16 md:py-24 bg-background" aria-labelledby="testimonial-title">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 md:gap-5 max-w-2xl text-center mx-auto">
            <p className="text-sm md:text-base font-semibold text-primary leading-[20px] md:leading-6">Testimonials</p>
            <h2 id="testimonial-title" className="text-3xl md:text-4xl font-bold">
              Trusted by dental professionals nationwide
            </h2>
            <p className="text-muted-foreground">
              See how Orasync is helping dentists grow their practices and reactivate patients
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <>
                    <div className="hidden md:block w-[1px] self-stretch bg-border" />
                    <Separator className="md:hidden bg-border" orientation="horizontal" />
                  </>
                )}
                <div className="flex flex-col gap-8">
                  <div className="flex justify-center md:justify-start">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-foreground text-lg font-medium leading-7 md:text-left text-center">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex md:flex-row flex-col items-center gap-5">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.author} />
                      <AvatarFallback>
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 md:text-left text-center">
                      <p className="text-foreground text-base font-semibold leading-6">{testimonial.author}</p>
                      <p className="text-muted-foreground text-base leading-6">{testimonial.role}</p>
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mt-2">
                        {testimonial.metric}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
