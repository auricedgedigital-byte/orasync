"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, Clock, User, Star, Plus } from "lucide-react"

export default function TrainingVideos() {
  const handleUploadVideo = () => {
    alert("Opening video upload dialog...")
  }

  const handleWatchVideo = (title: string) => {
    alert(`Playing video: ${title}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Videos</h1>
          <p className="text-muted-foreground">Learn how to use Orasync features effectively</p>
        </div>
        <Button size="sm" onClick={handleUploadVideo}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Training modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">By your team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Dashboard Overview", duration: "5:30", views: 234, rating: 4.8 },
              { title: "Managing Appointments", duration: "8:15", views: 189, rating: 4.7 },
              { title: "Patient CRM Basics", duration: "6:45", views: 156, rating: 4.9 },
              { title: "Marketing Campaigns", duration: "10:20", views: 145, rating: 4.6 },
              { title: "Billing & Payments", duration: "7:50", views: 123, rating: 4.8 },
              { title: "Analytics Reports", duration: "9:10", views: 98, rating: 4.7 },
            ].map((video, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="bg-muted h-32 flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
                <CardContent className="pt-4 space-y-3">
                  <div>
                    <div className="font-medium text-sm">{video.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{video.views} views</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                  <Button className="w-full" size="sm" onClick={() => handleWatchVideo(video.title)}>
                    <Play className="w-3 h-3 mr-2" />
                    Watch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started Videos</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Getting started videos would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Tutorials</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Feature tutorial videos would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Tutorials</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Advanced tutorial videos would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
