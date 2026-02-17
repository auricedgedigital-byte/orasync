"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, MessageSquare, AlertCircle, Reply, Share2, Eye, ExternalLink } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"

interface Review {
  id: string
  author: string
  rating: number
  text: string
  platform: string
  date: string
  responded: boolean
}

export default function ReputationManagement() {
  const { user } = useUser()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("reviews")

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return
      try {
        const res = await fetch(`/api/v1/clinics/${user.id}/reputation/reviews`)
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews || [])
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [user?.id])

  const handleReplyToReview = (reviewId: string) => {
    // Mock response logic
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, responded: true } : r)))
    toast.success("Response posted successfully")
  }

  const handleRequestReview = () => {
    // Integration with Campaigns or SMS API would go here
    toast.info("Opening review request campaign builder...", {
      description: "This feature will allow you to send bulk review requests via SMS/Email."
    })
  }

  const handleManagePlatform = (platform: string) => {
    window.open(`https://www.${platform.toLowerCase()}.com`, "_blank")
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  const positiveReviews = reviews.filter(r => r.rating >= 4).length
  const positivePercentage = reviews.length > 0 ? Math.round((positiveReviews / reviews.length) * 100) : 0
  const responseRate = reviews.length > 0
    ? Math.round((reviews.filter(r => r.responded).length / reviews.length) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Reputation Management
          </h1>
          <p className="text-muted-foreground mt-1">Monitor reviews and grow your practice's online presence</p>
        </div>
        <Button onClick={handleRequestReview} className="shadow-lg shadow-primary/20">
          <Share2 className="w-4 h-4 mr-2" />
          Request Reviews
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positivePercentage}%</div>
            <p className="text-xs text-muted-foreground">4-5 star ratings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <p className="text-xs text-muted-foreground">Reviews responded to</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background border border-border/50 p-1">
          <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="responses">Response Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="transition-all hover:bg-muted/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-semibold text-lg">{review.author}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">• {review.date}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {review.platform}
                      </Badge>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">"{review.text}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      {!review.responded ? (
                        <Button size="sm" onClick={() => handleReplyToReview(review.id)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3 py-1">
                          Responded
                        </Badge>
                      )}
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on {review.platform}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Review Trends</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                    Chart Placeholder
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Google", rating: 4.9, reviews: 156, connected: true },
              { name: "Yelp", rating: 4.7, reviews: 89, connected: true },
              { name: "Facebook", rating: 4.8, reviews: 67, connected: true },
              { name: "Healthgrades", rating: 4.6, reviews: 30, connected: false },
            ].map((platform) => (
              <Card key={platform.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <Badge variant={platform.connected ? "default" : "secondary"}>
                      {platform.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">{platform.rating}</div>
                    <div className="text-sm text-muted-foreground">{platform.reviews} reviews</div>
                  </div>
                  <Button
                    className="w-full"
                    variant={platform.connected ? "outline" : "default"}
                    onClick={() => handleManagePlatform(platform.name)}
                  >
                    {platform.connected ? "Manage" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Templates Logic Placeholder */}
            <Card>
              <CardHeader><CardTitle>Response Templates</CardTitle><CardDescription>Quick responses for reviews</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {["Thank You - Positive", "Address Concern - Negative", "Standard Follow-up"].map((t, i) => (
                  <div key={i} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center bg-card">
                    <span className="font-medium text-sm">{t}</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
