"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp, MessageSquare, AlertCircle, Reply, Share2, Eye } from "lucide-react"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

export default function ReputationManagement() {
  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      text: "Excellent service! Dr. Smith was very professional and caring.",
      platform: "Google",
      date: "2 days ago",
      responded: true,
    },
    {
      id: "2",
      author: "Mike Chen",
      rating: 5,
      text: "Best dental experience I've had. Highly recommend!",
      platform: "Yelp",
      date: "1 week ago",
      responded: true,
    },
    {
      id: "3",
      author: "Emma Davis",
      rating: 4,
      text: "Good service, but wait time was a bit long.",
      platform: "Google",
      date: "1 week ago",
      responded: false,
    },
    {
      id: "4",
      author: "John Smith",
      rating: 5,
      text: "Very friendly staff and clean facility!",
      platform: "Facebook",
      date: "2 weeks ago",
      responded: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("reviews")
  const { scrollToSection } = useScrollToSection()

  const handleReplyToReview = (reviewId: string) => {
    alert("Reply to review dialog would open here")
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, responded: true } : r)))
  }

  const handleRequestReview = () => {
    alert("Request review dialog would open here")
  }

  const handleConnectPlatform = (platform: string) => {
    alert(`Connect ${platform} platform`)
  }

  const handleManagePlatform = (platform: string) => {
    alert(`Manage ${platform} platform`)
  }

  const handleEditTemplate = (templateName: string) => {
    alert(`Edit template: ${templateName}`)
  }

  const handleMetricClick = (tab: string, sectionId: string) => {
    setActiveTab(tab)
    scrollToSection(sectionId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reputation Management</h1>
          <p className="text-muted-foreground">Monitor and manage your online reviews</p>
        </div>
        <Button size="sm" onClick={handleRequestReview}>
          <Share2 className="w-4 h-4 mr-2" />
          Request Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("reviews", "reviews-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("reviews", "reviews-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18 this month</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("reviews", "reviews-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">4-5 star ratings</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("reviews", "reviews-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Reviews responded to</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="responses">Response Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-6">
          <Card id="reviews-section">
            <CardHeader>
              <CardTitle>Latest Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{review.author}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {review.platform}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </div>
                  <p className="text-sm">{review.text}</p>
                  <div className="flex gap-2">
                    {!review.responded && (
                      <Button size="sm" variant="outline" onClick={() => handleReplyToReview(review.id)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onClick={() =>
                      platform.connected ? handleManagePlatform(platform.name) : handleConnectPlatform(platform.name)
                    }
                  >
                    {platform.connected ? "Manage" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Thank You - Positive", uses: 45 },
                { name: "Address Concern - Negative", uses: 12 },
                { name: "Follow-up - Neutral", uses: 8 },
              ].map((template, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.uses} uses</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(template.name)}>
                    Edit
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
