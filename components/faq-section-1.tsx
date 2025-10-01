"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqs = [
  {
    question: "How quickly can I see results with Orasync?",
    answer:
      "Most dental practices see patient reactivation within the first 7-14 days. Our AI campaigns typically generate bookings within 30 days of launch.",
  },
  {
    question: "Do I need technical skills to use Orasync?",
    answer:
      "Not at all! Orasync is designed for busy dental professionals. Simply connect your patient list and ad campaigns - our AI handles the rest automatically.",
  },
  {
    question: "How does Orasync integrate with my existing practice management software?",
    answer:
      "Orasync works with most practice management systems. We can import your patient data and sync with popular platforms like Dentrix, Eaglesoft, and Open Dental.",
  },
  {
    question: "What's included in the free trial?",
    answer:
      "The free trial includes full access to our patient reactivation campaigns for up to 500 contacts, basic analytics, and email support for 14 days.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Orasync subscription at any time with no long-term commitments. Your campaigns will continue until the end of your billing period.",
  },
  {
    question: "Is my patient data secure with Orasync?",
    answer:
      "Absolutely. We're HIPAA compliant and use enterprise-grade security to protect all patient information. Your data is encrypted and stored securely.",
  },
]

export function FaqSection1() {
  return (
    <section className="bg-background py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="max-w-3xl gap-12 mx-auto px-6 flex flex-col">
        <div className="flex flex-col text-center gap-5">
          <p className="text-sm md:text-base text-primary font-semibold">FAQ</p>
          <h1 id="faq-heading" className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Everything you need to know about Orasync and how it can grow your dental practice. Can't find what you're
            looking for?{" "}
            <Link href="mailto:support@orasync.com" className="text-primary underline">
              Contact our team.
            </Link>
          </p>
        </div>

        <Accordion type="single" defaultValue="item-1" aria-label="FAQ items">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-base font-medium text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="bg-gradient-to-br from-primary/5 to-secondary/10 w-full rounded-xl p-6 md:p-8 flex flex-col items-center gap-6 border">
          <div className="flex flex-col text-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Ready to grow your practice?</h2>
            <p className="text-base text-muted-foreground">
              Start your free trial today and see how Orasync can reactivate your patients and boost bookings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="https://app.orasync.com/signup">
              <Button size="lg" aria-label="Start free trial">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" aria-label="Schedule a demo">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
