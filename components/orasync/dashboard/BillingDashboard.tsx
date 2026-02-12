"use client"

import React, { useState } from 'react'
import { Zap, TrendingUp, BarChart3, CreditCard } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const creditStats = [
  {
    icon: Zap,
    label: 'Total Credits',
    value: '10,000',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: BarChart3,
    label: 'Used Credits',
    value: '7,500',
    color: 'from-purple-400 to-purple-600',
    status: '75% Usage'
  },
  {
    icon: TrendingUp,
    label: 'Remaining Credits',
    value: '2,500',
    color: 'from-emerald-400 to-emerald-600'
  },
  {
    icon: CreditCard,
    label: 'Credit Balance',
    value: '2,500',
    color: 'from-orange-400 to-orange-600',
    status: 'Credits'
  },
]

const billingActivityData = [
  { date: '01 Jan', value: 250 },
  { date: 'P1 Feb', value: 450 },
  { date: '11 Mar', value: 350 },
  { date: '13 Mar', value: 150 },
  { date: '15 Mar', value: 200 },
  { date: '17 Jan', value: 100 },
  { date: '09 Jan', value: 350 },
]

const creditPacks = [
  {
    title: 'Starter Pack',
    credits: '5,000 Credits',
    price: '$49',
    features: ['5,000 Credits', '10,000 Credits - $95'],
    action: 'Buy Now'
  },
  {
    title: 'Pro Pack',
    credits: '10,000 Credits',
    price: '$95',
    features: ['11,000 Credits - $77'],
    action: 'Buy Now',
    highlighted: true
  },
  {
    title: 'Pro Subscription',
    credits: 'Pro Subscriptions: Pro',
    price: '$89/mo',
    features: ['Credit Usage: 56%...'],
    action: 'Upgrade Options'
  },
  {
    title: 'Business',
    credits: 'Subscriptions: Plan',
    price: 'Contact',
    features: ['Credit Usage: 1045%'],
    action: 'Upgrade Options'
  },
]

const paymentHistory = [
  {
    date: '2023-10-24',
    description: 'Monthly Subscription',
    amount: '$89.00',
    status: 'Paid'
  },
  {
    date: '2023-10-24',
    description: 'Monthly Subscription',
    amount: '$89.00',
    status: 'Paid'
  },
  {
    date: '2023-10-13',
    description: 'Monthly Subscription',
    amount: '$89.00',
    status: 'Paid'
  },
]

export default function BillingDashboard() {
  const [activeTab, setActiveTab] = useState('creditpacks')

  return (
    <div className="space-y-8">
      {/* Credit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {creditStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-sm opacity-90 font-medium mb-1">{stat.label}</div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              {stat.status && (
                <div className="text-xs opacity-80">{stat.status}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Billing Activities Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Billing activities</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={billingActivityData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Recent</div>
              <div className="text-lg font-bold text-foreground">Connector: 10,000</div>
              <div className="text-xs text-muted-foreground mt-2">USD Now</div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Billing</div>
              <div className="text-lg font-bold text-foreground">Connection: 8,450</div>
              <div className="text-xs text-muted-foreground mt-2">USD Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packs & Subscription Plans */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Billing Management</h3>
          <div className="flex gap-4 border-b border-border">
            {['creditpacks', 'subscriptionplans', 'paymenthistory', 'upgradeoptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-medium transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'creditpacks' && 'Credit Packs'}
                {tab === 'subscriptionplans' && 'Subscription Plans'}
                {tab === 'paymenthistory' && 'Payment History'}
                {tab === 'upgradeoptions' && 'Upgrade Options'}
              </button>
            ))}
          </div>
        </div>

        {/* Credit Packs Grid */}
        {activeTab === 'creditpacks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 border transition-all ${
                  pack.highlighted
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-500 shadow-lg'
                    : 'bg-secondary border-border hover:shadow-md'
                }`}
              >
                <h4 className="font-semibold mb-2">{pack.title}</h4>
                <div className={`text-2xl font-bold mb-3 ${pack.highlighted ? '' : 'text-primary'}`}>
                  {pack.price}
                </div>
                <ul className="text-sm mb-4 space-y-2 opacity-80">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-xs">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  pack.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}>
                  {pack.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Payment History */}
        {activeTab === 'paymenthistory' && (
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
                {paymentHistory.map((payment, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-4 px-4 text-foreground">{payment.date}</td>
                    <td className="py-4 px-4 text-foreground">{payment.description}</td>
                    <td className="py-4 px-4 text-foreground font-medium">{payment.amount}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
