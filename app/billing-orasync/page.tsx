'use client'

import Header from '@/components/orasync/layout/Header'
import Sidebar from '@/components/orasync/layout/Sidebar'
import QuickActions from '@/components/orasync/layout/QuickActions'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CreditCard, Zap, BarChart3, TrendingUp } from 'lucide-react'

const creditPlans = [
  {
    name: 'Starter Pack',
    credits: '5,000 Credits',
    price: '$49',
    features: ['5,000 Credits', 'Valid for 90 days'],
    popular: false,
  },
  {
    name: 'Growth Plan',
    credits: '10,000 Credits',
    price: '$95',
    features: ['10,000 Credits', 'Valid for 90 days'],
    popular: true,
  },
  {
    name: 'Pro Plan',
    credits: '25,000 Credits',
    price: '$195',
    features: ['25,000 Credits', 'Valid for 180 days'],
    popular: false,
  },
  {
    name: 'Enterprise',
    credits: 'Custom',
    price: 'Contact us',
    features: ['Custom credits', 'Dedicated support'],
    popular: false,
  },
]

const billingHistory = [
  { date: '2024-01-24', description: 'Monthly Subscription', amount: '$89.00', status: 'Paid' },
  { date: '2024-01-24', description: 'Monthly Subscription', amount: '$89.00', status: 'Paid' },
  { date: '2024-01-15', description: 'Auto-Recharge', amount: '+1000', status: 'Paid' },
  { date: '2024-01-10', description: 'Campaign Run', amount: '-$3.30', status: 'Completed' },
  { date: '2024-01-07', description: 'Campaign Run', amount: '-10,000', status: 'Pending' },
]

const billingActivityData = [
  { date: '01 Jan', used: 250 },
  { date: '05 Jan', used: 450 },
  { date: '10 Jan', used: 380 },
  { date: '15 Jan', used: 520 },
  { date: '20 Jan', used: 680 },
  { date: '25 Jan', used: 590 },
  { date: '30 Jan', used: 750 },
]

export default function BillingPage() {
  return (
    <div className="orasync-container">
      <Sidebar />
      <div className="orasync-main">
        <Header />
        <div className="orasync-content max-w-7xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Credits</h1>
            <p className="text-muted-foreground">Manage your credit balance and billing information</p>
          </div>

          {/* Credits Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Total Credits</h3>
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10,000</div>
              <p className="text-sm text-muted-foreground">Available for use</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Used Credits</h3>
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">7,500</div>
              <p className="text-sm text-muted-foreground">Used this month</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Remaining</h3>
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">2,500</div>
              <p className="text-sm text-muted-foreground">Credits remaining</p>
            </div>
          </div>

          {/* Credit Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border transition-all transform hover:scale-105 ${
                    plan.popular
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border bg-card hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="mb-4 inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-foreground">{plan.credits}</div>
                    <div className="text-lg text-primary font-semibold mt-2">{plan.price}</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:shadow-lg'
                        : 'bg-secondary text-foreground hover:bg-border'
                    }`}
                  >
                    {plan.price === 'Contact us' ? 'Contact Sales' : 'Buy Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Activity Chart */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Billing Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={billingActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="used"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Billing History */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((transaction, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-4 px-4 text-foreground">{transaction.date}</td>
                      <td className="py-4 px-4 text-foreground">{transaction.description}</td>
                      <td className="py-4 px-4 font-medium text-foreground">{transaction.amount}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`status-badge text-xs ${
                            transaction.status === 'Paid'
                              ? 'status-completed'
                              : transaction.status === 'Pending'
                                ? 'status-pending'
                                : 'status-active'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="fixed right-8 bottom-8 w-64 space-y-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
