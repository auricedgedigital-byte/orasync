"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Plus,
  Building,
  Zap
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  order_id: string
  amount_cents: number
  currency: string
  status: string
  created_at: string
  pack_id?: string
}

interface Credits {
  reactivation_emails: number
  reactivation_sms: number
  campaigns_started: number
  lead_upload_rows: number
}

export default function BillingFinance() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      try {
        const res = await fetch(`/api/v1/clinics/${user.id}/billing`)
        if (res.ok) {
          const data = await res.json()
          setCredits(data.credits)
          setTransactions(data.transactions || [])
        }
      } catch (err) {
        console.error("Failed to fetch billing data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.id])

  const handleBuyCredits = () => {
    // Integration with PayPal/Stripe would go here
    alert("Opening secure payment gateway...")
  }

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
            Billing & Credits
          </h1>
          <p className="text-muted-foreground mt-1">Manage your subscription, credits, and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
          <Button size="sm" onClick={handleBuyCredits} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Credits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Email Credits</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.reactivation_emails || 0}</div>
            <p className="text-xs text-muted-foreground">Available for campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.reactivation_sms || 0}</div>
            <p className="text-xs text-muted-foreground">Text messages remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign Limits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits?.campaigns_started || 0}</div>
            <p className="text-xs text-muted-foreground">Active campaigns allowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Growth</div>
            <p className="text-xs text-muted-foreground text-green-500">Active • Renews Oct 24</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background border border-border/50 p-1">
          <TabsTrigger value="overview">Transaction History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your credit purchases and subscription payments</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No transactions found.</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold">Order #{tx.order_id}</div>
                          <div className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${(tx.amount_cents / 100).toFixed(2)}</div>
                        <Badge variant={tx.status === 'captured' ? 'default' : 'secondary'} className="capitalize">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Download past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                No invoices generated yet.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved cards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                Integrated via PayPal/Stripe (Managed externally)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
