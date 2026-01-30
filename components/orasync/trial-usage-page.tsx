"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

interface UsageLog {
  id: string
  action_type: string
  amount: number
  created_at: string
  details?: Record<string, unknown>
}

const ACTION_LABELS: Record<string, string> = {
  reactivation_emails: "Reactivation Emails",
  reactivation_sms: "Reactivation SMS",
  reactivation_whatsapp: "WhatsApp Messages",
  campaigns_started: "Campaigns Started",
  lead_upload_rows: "Lead Uploads",
  booking_confirms: "Booking Confirmations",
  ai_suggestions: "AI Suggestions",
  seo_applies: "SEO Applies",
  chatbot_installs: "Chatbot Installs",
}

export function TrialUsagePage() {
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{ date: string; [key: string]: number | string }>>([])

  useEffect(() => {
    const fetchUsageLogs = async () => {
      try {
        const response = await fetch("/api/v1/clinics/clinic-001/usage-logs?limit=100")
        if (response.ok) {
          const data = await response.json()
          setUsageLogs(data.logs || [])
          processChartData(data.logs || [])
        }
      } catch (error) {
        console.error("Error fetching usage logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsageLogs()
  }, [])

  const processChartData = (logs: UsageLog[]) => {
    // Group by date and action type
    const grouped: Record<string, Record<string, number>> = {}

    logs.forEach((log) => {
      const date = new Date(log.created_at).toLocaleDateString()
      if (!grouped[date]) {
        grouped[date] = {}
      }
      const label = ACTION_LABELS[log.action_type] || log.action_type
      grouped[date][label] = (grouped[date][label] || 0) + log.amount
    })

    const data = Object.entries(grouped)
      .map(([date, actions]) => ({
        date,
        ...actions,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setChartData(data)
  }

  const totalByAction = usageLogs.reduce(
    (acc, log) => {
      const label = ACTION_LABELS[log.action_type] || log.action_type
      acc[label] = (acc[label] || 0) + log.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trial Usage</h1>
        <p className="text-muted-foreground">Track your credit usage and historical activity</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="topup">Top Up</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(totalByAction).map(([action, total]) => (
              <Card key={action}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{action}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{total}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total used</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Trend</CardTitle>
                <CardDescription>Daily credit consumption over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(totalByAction).map((action, index) => (
                      <Line
                        key={action}
                        type="monotone"
                        dataKey={action}
                        stroke={`hsl(${(index * 360) / Object.keys(totalByAction).length}, 70%, 50%)`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading usage history...</p>
              </CardContent>
            </Card>
          ) : usageLogs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No usage history yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {usageLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{ACTION_LABELS[log.action_type] || log.action_type}</div>
                        <div className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">-{log.amount}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Top Up Tab */}
        <TabsContent value="topup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>Buy additional credits to continue using Orasync</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="font-medium mb-2">Email Pack</div>
                  <div className="text-2xl font-bold mb-2">$29</div>
                  <div className="text-sm text-muted-foreground mb-4">+500 Emails</div>
                  <Button className="w-full">Buy Now</Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="font-medium mb-2">SMS Pack</div>
                  <div className="text-2xl font-bold mb-2">$49</div>
                  <div className="text-sm text-muted-foreground mb-4">+200 SMS</div>
                  <Button className="w-full">Buy Now</Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="font-medium mb-2">Campaign Pack</div>
                  <div className="text-2xl font-bold mb-2">$19</div>
                  <div className="text-sm text-muted-foreground mb-4">+5 Campaigns</div>
                  <Button className="w-full">Buy Now</Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="font-medium mb-2">Upgrade to a Plan</div>
                <p className="text-sm text-muted-foreground mb-4">Get better value with a monthly subscription plan</p>
                <Button variant="outline">View Plans</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const TrialUsagePageComponent = TrialUsagePage
