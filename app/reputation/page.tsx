"use client"

import { ReviewRequestGenerator } from "@/components/orasync/reputation/review-request-generator"
import { FeedbackIntercept } from "@/components/orasync/reputation/feedback-intercept"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp } from "lucide-react"

export default function ReputationPage() {
    const reviews = [
        { id: 1, author: "Sarah M.", rating: 5, text: "Best dental experience ever!", platform: "Google", date: "2 days ago" },
        { id: 2, author: "Mike T.", rating: 5, text: "Dr. Smith is so gentle.", platform: "Google", date: "1 week ago" },
        { id: 3, author: "Anonymous", rating: 3, text: "Long wait time.", platform: "Internal", date: "2 weeks ago" },
    ]

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reputation Manager</h1>
                    <p className="text-muted-foreground mt-2">
                        Automate review collection and intercept negative feedback.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Request Generator */}
                <div className="space-y-6">
                    <ReviewRequestGenerator />

                    <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <TrendingUp className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Google Rating</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-bold">4.9</span>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-muted-foreground">(128 reviews)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Col: Recent Reviews */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="flex gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary shrink-0">
                                            {review.rating}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{review.author}</span>
                                                <Badge variant="outline" className="text-[10px] h-5">
                                                    {review.platform}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{review.date}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">"{review.text}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Demo of what the patient sees */}
                    <div className="pt-8">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Patient Experience Preview</h3>
                        <FeedbackIntercept />
                    </div>
                </div>
            </div>
        </div>
    )
}
