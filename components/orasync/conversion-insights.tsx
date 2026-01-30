"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Eye, Calendar, Download } from "lucide-react"
import { useState } from "react"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"

export default function ConversionInsights() {
  const [activeTab, setActiveTab] = useState("funnel")
  const { scrollToSection } = useScrollToSection()

  const handleExportReport = () => {
    alert("Exporting conversion insights report...")
  }

  const handleMetricClick = (tab: string, sectionId: string) => {
    setActiveTab(tab)
    scrollToSection(sectionId)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conversion Insights</h1>
          <p className="text-muted-foreground">Track and optimize your patient acquisition funnel</p>
        </div>
        <Button size="sm" onClick={handleExportReport}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("funnel", "funnel-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("funnel", "funnel-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">398</div>
            <p className="text-xs text-muted-foreground">3.2% conversion</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("funnel", "funnel-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Booked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">39% of leads</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
          onClick={() => handleMetricClick("funnel", "funnel-section")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8.50</div>
            <p className="text-xs text-muted-foreground">-15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-6">
          <Card id="funnel-section">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { stage: "Website Visitors", count: 12456, percentage: 100 },
                { stage: "Form Submissions", count: 398, percentage: 3.2 },
                { stage: "Appointments Booked", count: 156, percentage: 39 },
                { stage: "Completed Appointments", count: 142, percentage: 91 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{item.stage}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card id="sources-section">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { source: "Organic Search", visitors: 5234, percentage: 42 },
                { source: "Direct", visitors: 3456, percentage: 28 },
                { source: "Social Media", visitors: 2145, percentage: 17 },
                { source: "Paid Ads", visitors: 1621, percentage: 13 },
              ].map((source, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{source.source}</div>
                    <div className="text-xs text-muted-foreground">{source.visitors.toLocaleString()} visitors</div>
                  </div>
                  <Badge>{source.percentage}%</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card id="pages-section">
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { page: "Home", views: 4567, conversions: 156, rate: 3.4 },
                { page: "Services", views: 3234, conversions: 98, rate: 3.0 },
                { page: "Contact", views: 2145, conversions: 89, rate: 4.1 },
                { page: "About", views: 1512, conversions: 45, rate: 3.0 },
              ].map((page, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{page.page}</div>
                    <div className="text-xs text-muted-foreground">{page.views.toLocaleString()} views</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{page.conversions} conversions</div>
                    <div className="text-xs text-muted-foreground">{page.rate}% rate</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
