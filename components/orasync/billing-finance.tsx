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
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
            Billing & Credits
          </h1>
          <p className="text-muted-foreground font-medium">Manage your subscription, credits, and invoices.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl px-6 h-12 font-bold border-border/60 hover:bg-muted/50 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
          <Button onClick={handleBuyCredits} className="rounded-xl px-6 h-12 font-black shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4 mr-2" />
            Add Credits
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-primary/20 bg-primary/5 ring-1 ring-primary/10 transition-all hover:ring-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Email Credits</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">{credits?.reactivation_emails?.toLocaleString() || 0}</div>
            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight opacity-70">Available for campaigns</p>
          </CardContent>
        </Card>

        <Card className="glass-card ring-1 ring-blue-500/5 hover:ring-blue-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">SMS Credits</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">{credits?.reactivation_sms?.toLocaleString() || 0}</div>
            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight opacity-70">Text messages remaining</p>
          </CardContent>
        </Card>

        <Card className="glass-card ring-1 ring-purple-500/5 hover:ring-purple-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Campaign Limits</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">{credits?.campaigns_started || 0}</div>
            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-tight opacity-70">Active campaigns allowed</p>
          </CardContent>
        </Card>

        <Card className="glass-card ring-1 ring-green-500/5 hover:ring-green-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Current Plan</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-black">Growth</div>
            <p className="text-xs font-bold text-green-500 mt-1 uppercase tracking-tight">Active • Renews Oct 24</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-2xl h-14 w-fit px-2">
          <TabsTrigger value="overview" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">History</TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods" className="rounded-xl h-10 px-8 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="glass-card rounded-[2rem] border-border/50 overflow-hidden shadow-2xl shadow-primary/5">
            <CardHeader className="p-8 border-b border-border/40">
              <CardTitle className="text-xl font-black">Recent Transactions</CardTitle>
              <CardDescription className="text-sm font-medium">Your credit purchases and subscription payments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {transactions.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-lg">No transactions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-8 hover:bg-muted/10 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-background border border-border/50 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                          <Receipt className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-base font-black text-foreground group-hover:text-primary transition-colors">Order #{tx.order_id}</div>
                          <div className="text-xs font-bold text-muted-foreground uppercase mt-1">{new Date(tx.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-foreground mb-1">${(tx.amount_cents / 100).toFixed(2)}</div>
                        <Badge variant={tx.status === 'captured' ? 'default' : 'secondary'} className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">
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
          <Card className="glass-card rounded-[2rem] border-border/50 p-20 text-center">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 opacity-30" />
              </div>
              <h3 className="text-xl font-black">Invoices Coming Soon</h3>
              <p className="text-muted-foreground font-medium">Your first invoice will be generated automatically at the end of the billing cycle.</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card className="glass-card rounded-[2rem] border-border/50 p-20 text-center">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 opacity-30" />
              </div>
              <h3 className="text-xl font-black">Secure Payment Gateway</h3>
              <p className="text-muted-foreground font-medium">Payment methods are securely managed through our trusted provider.</p>
              <Button variant="outline" className="rounded-xl font-bold mt-4" onClick={handleBuyCredits}>Configure Payment</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
