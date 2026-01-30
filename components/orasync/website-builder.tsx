"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Eye, Edit2, Settings, Zap, BarChart3 } from "lucide-react"

export default function WebsiteBuilder() {
  const [selectedColorScheme, setSelectedColorScheme] = useState("primary")
  const [selectedFont, setSelectedFont] = useState("Modern Sans")

  const handlePreview = () => {
    alert("Opening website preview in new window...")
  }

  const handleEditWebsite = () => {
    alert("Opening website editor...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website Builder</h1>
          <p className="text-muted-foreground">Create and manage your dental practice website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleEditWebsite}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Website
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge>Live</Badge>
            <p className="text-xs text-muted-foreground mt-2">www.yourpractice.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">Visitor to lead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87/100</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Home", status: "published", visitors: 1245 },
                { name: "Services", status: "published", visitors: 456 },
                { name: "About Us", status: "published", visitors: 234 },
                { name: "Contact", status: "published", visitors: 567 },
                { name: "Blog", status: "draft", visitors: 0 },
              ].map((page, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{page.name}</div>
                    <div className="text-xs text-muted-foreground">{page.visitors} visitors</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => alert(`Editing ${page.name} page...`)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedColorScheme("primary")}
                    className={`w-10 h-10 bg-primary rounded-lg cursor-pointer border-2 ${
                      selectedColorScheme === "primary" ? "border-primary" : "border-transparent"
                    }`}
                  />
                  <button
                    onClick={() => setSelectedColorScheme("blue")}
                    className={`w-10 h-10 bg-blue-600 rounded-lg cursor-pointer border-2 ${
                      selectedColorScheme === "blue" ? "border-blue-600" : "border-transparent"
                    }`}
                  />
                  <button
                    onClick={() => setSelectedColorScheme("green")}
                    className={`w-10 h-10 bg-green-600 rounded-lg cursor-pointer border-2 ${
                      selectedColorScheme === "green" ? "border-green-600" : "border-transparent"
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Font</label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border"
                >
                  <option>Modern Sans</option>
                  <option>Classic Serif</option>
                  <option>Professional</option>
                </select>
              </div>
              <Button className="w-full" onClick={() => alert("Opening advanced settings...")}>
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { item: "Meta Descriptions", status: "complete" },
                { item: "Keywords", status: "complete" },
                { item: "Mobile Friendly", status: "complete" },
                { item: "Page Speed", status: "warning" },
                { item: "Sitemap", status: "complete" },
              ].map((seo, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="text-sm">{seo.item}</div>
                  <Badge variant={seo.status === "complete" ? "default" : "secondary"}>
                    {seo.status === "complete" ? "✓" : "⚠"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
