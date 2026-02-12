"use client"

import { DollarSign, CreditCard, TrendingUp, Calendar, ArrowUp, ArrowDown, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BillingOverviewProps {}

const creditData = [
  { date: "01 Jan", credits: 250 },
  { date: "01 Feb", credits: 400 },
  { date: "11 Mar", credits: 150 },
  { date: "13 Mar", credits: 400 },
  { date: "15 Mar", credits: 200 },
  { date: "17 Jan", credits: 500 },
  { date: "09 Jan", credits: 350 }
]

const paymentHistory = [
  { date: "27 Jan 2024", description: "Monthly Subscription", amount: "$89.00", status: "paid" },
  { date: "27 Jan 2024", description: "Monthly Subscription", amount: "$89.00", status: "paid" },
  { date: "27 Jan 2024", description: "Monthly Subscription", amount: "$89.00", status: "paid" },
  { date: "37 Jan 2024", description: "Reputation", amount: "-$3.50", status: "paid" }
]

const creditPacks = [
  { name: "Starter", credits: 1000, price: "$49", popular: false },
  { name: "Growth", credits: 5000, price: "$95", popular: true },
  { name: "Pro", credits: 10000, price: "$189", popular: false },
  { name: "Enterprise", credits: "Custom", price: "Contact Us", popular: false }
]

export default function BillingOverview({}: BillingOverviewProps) {
  const totalCredits = 10000
  const usedCredits = 7500
  const remainingCredits = 2500
  const usagePercentage = (usedCredits / totalCredits) * 100

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Billing & Credits</h1>
          <p className="text-muted-foreground text-lg">Manage your credits and subscription</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button className="rounded-xl px-6 h-11 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
            <CreditCard className="w-4 h-4 mr-2" />
            Top Up Credits
          </Button>
          <Button variant="outline" className="rounded-xl px-6 h-11 font-semibold border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
            View Plans
          </Button>
        </div>
      </div>

      {/* Credit Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Credits */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Total Credits</p>
            <DollarSign className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold mb-3">{totalCredits.toLocaleString()}</p>
          <p className="text-xs opacity-80">Credits available</p>
        </div>

        {/* Used Credits */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Used Credits</p>
            <ArrowUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold mb-3">{usedCredits.toLocaleString()}</p>
          <p className="text-xs opacity-80">{usagePercentage.toFixed(0)}% of total</p>
        </div>

        {/* Remaining Credits */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium opacity-80">Remaining</p>
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-4xl font-bold mb-3">{remainingCredits.toLocaleString()}</p>
          <p className="text-xs opacity-80">Credits left this month</p>
        </div>

        {/* Credit Usage */}
        <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Credit Usage</p>
          <p className="text-3xl font-bold text-foreground mb-3">{usagePercentage.toFixed(0)}%</p>
          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Billing Activity Chart */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-foreground">Credit Usage Trends</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={creditData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(209, 213, 219, 0.3)" />
            <XAxis dataKey="date" stroke="rgba(107, 114, 128, 0.5)" />
            <YAxis stroke="rgba(107, 114, 128, 0.5)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                color: "#e2e8f0"
              }}
            />
            <Line type="monotone" dataKey="credits" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Credit Packs */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-2">Credit Packs</h3>
          <p className="text-muted-foreground">Choose a credit pack to extend your usage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPacks.map((pack, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${
                pack.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white">Most Popular</Badge>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <p className="font-bold text-lg text-foreground">{pack.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{pack.credits}</p>
                  <p className="text-xs text-muted-foreground mt-1">credits</p>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/30 pt-4">
                  <p className="text-2xl font-bold text-primary mb-4">{pack.price}</p>
                  <Button 
                    className={`w-full rounded-xl font-semibold transition-all ${
                      pack.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 text-foreground hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700/30 flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground">Payment History</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700/30">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{payment.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{payment.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-semibold ${payment.amount.startsWith("-") ? "text-red-600" : "text-emerald-600"}`}>
                      {payment.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 border">
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
