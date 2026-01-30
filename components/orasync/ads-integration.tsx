"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Upload, Plus, Trash2 } from "lucide-react"

interface AdCampaign {
  id: string
  platform: string
  name: string
  spend: number
  leads: number
  bookings: number
}

export function AdsIntegration() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    { id: "1", platform: "Google Ads", name: "Spring Cleaning", spend: 500, leads: 45, bookings: 12 },
    { id: "2", platform: "Facebook", name: "Teeth Whitening", spend: 300, leads: 28, bookings: 8 },
  ])

  const [showUploadCSV, setShowUploadCSV] = useState(false)
  const [csvFile, setCSVFile] = useState<File | null>(null)

  const handleUploadCSV = () => {
    if (csvFile) {
      alert(`Uploaded ${csvFile.name}. Processing leads...`)
      setShowUploadCSV(false)
      setCSVFile(null)
    }
  }

  const calculateMetrics = (campaign: AdCampaign) => {
    const cpl = campaign.leads > 0 ? (campaign.spend / campaign.leads).toFixed(2) : "N/A"
    const cpb = campaign.bookings > 0 ? (campaign.spend / campaign.bookings).toFixed(2) : "N/A"
    const conversionRate = campaign.leads > 0 ? ((campaign.bookings / campaign.leads) * 100).toFixed(1) : "0"

    return { cpl, cpb, conversionRate }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ads Integration</h1>
        <p className="text-muted-foreground">Track ad performance and lead attribution</p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analytics</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadCSV(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          </div>

          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const metrics = calculateMetrics(campaign)
              return (
                <Card key={campaign.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>{campaign.platform}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCampaigns(campaigns.filter((c) => c.id !== campaign.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Spend</p>
                        <p className="text-lg font-bold">${campaign.spend}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Leads</p>
                        <p className="text-lg font-bold">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bookings</p>
                        <p className="text-lg font-bold">{campaign.bookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost/Lead</p>
                        <p className="text-lg font-bold">${metrics.cpl}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost/Booking</p>
                        <p className="text-lg font-bold">${metrics.cpb}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Conversion Rate:</span>
                        <span className="font-medium ml-2">{metrics.conversionRate}%</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CSV Upload Dialog */}
          <Dialog open={showUploadCSV} onOpenChange={setShowUploadCSV}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Lead CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with columns: first_name, last_name, email, phone, ad_campaign_id
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCSVFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadCSV(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadCSV} disabled={!csvFile}>
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Funnel Analytics Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track leads through the booking process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { stage: "Impressions", count: 5000, rate: "100%" },
                  { stage: "Clicks", count: 450, rate: "9%" },
                  { stage: "Leads", count: 73, rate: "16.2%" },
                  { stage: "Contacted", count: 58, rate: "79.5%" },
                  { stage: "Booked", count: 20, rate: "34.5%" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.stage}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${100 - idx * 20}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground">{item.rate} conversion</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
