"use client"

import { useState } from "react"
import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DEFAULT_REPUTATION_CONFIG } from "./types"

export function FeedbackIntercept() {
    const [rating, setRating] = useState<number>(0)
    const [submitted, setSubmitted] = useState(false)
    const [feedback, setFeedback] = useState("")

    const handleRating = (r: number) => {
        setRating(r)
        if (r >= DEFAULT_REPUTATION_CONFIG.minPositiveRating) {
            // Redirect to Google
            // In a real app we might show a "Thanks, please post this on Google" interstitial
            setTimeout(() => {
                window.open(DEFAULT_REPUTATION_CONFIG.googleReviewLink, "_blank")
                setSubmitted(true)
            }, 1500)
        }
    }

    const handleSubmitFeedback = () => {
        // Submit internal feedback mock
        setSubmitted(true)
    }

    if (submitted && rating >= DEFAULT_REPUTATION_CONFIG.minPositiveRating) {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <h2 className="text-2xl font-bold text-primary">Thank You!</h2>
                <p className="text-muted-foreground">Redirecting you to Google Reviews...</p>
                <p className="text-sm">If not redirected, <a href={DEFAULT_REPUTATION_CONFIG.googleReviewLink} className="underline">click here</a>.</p>
            </div>
        )
    }

    if (submitted && rating < DEFAULT_REPUTATION_CONFIG.minPositiveRating) {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <h2 className="text-xl font-bold">Thank you for your feedback.</h2>
                <p className="text-muted-foreground">We value your input and management has been notified to address your concerns.</p>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-primary/5">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">How was your visit?</CardTitle>
                <CardDescription>Please rate your experience with us today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="transition-all hover:scale-110 focus:outline-none"
                            onMouseEnter={() => !rating && setRating(0)} // Hover effect logic could be here
                            onClick={() => handleRating(star)}
                        >
                            <Star
                                className={cn(
                                    "w-10 h-10 transition-colors",
                                    (rating >= star) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400"
                                )}
                            />
                        </button>
                    ))}
                </div>

                {rating > 0 && rating < DEFAULT_REPUTATION_CONFIG.minPositiveRating && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="font-semibold text-sm mb-2">We're sorry we missed the mark.</p>
                            <p className="text-xs text-muted-foreground mb-4">Please tell us how we can improve. This goes directly to the owner.</p>
                            <Textarea
                                placeholder="What went wrong?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="mb-3"
                            />
                            <Button size="sm" onClick={handleSubmitFeedback} className="w-full">
                                Submit Feedback
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
