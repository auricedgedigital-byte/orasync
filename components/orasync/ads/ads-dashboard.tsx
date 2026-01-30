"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { TrendingUp, DollarSign, Users, MousePointer } from "lucide-react"

const mockData = [
    { name: "Mon", spend: 120, revenue: 0 },
    { name: "Tue", spend: 135, revenue: 150 },
    { name: "Wed", spend: 110, revenue: 0 },
    { name: "Thu", spend: 140, revenue: 450 },
    { name: "Fri", spend: 180, revenue: 300 },
    { name: "Sat", spend: 90, revenue: 150 },
    { name: "Sun", spend: 85, revenue: 0 },
]

export function AdsDashboard() {
    const totalSpend = 860
    const totalRevenue = 1050
    const roi = ((totalRevenue - totalSpend) / totalSpend) * 100

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Total Spend</span>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">${totalSpend}</div>
                        <div className="text-xs text-muted-foreground mt-1">Last 7 days</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Revenue</span>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
                        <div className="text-xs text-muted-foreground mt-1">From 7 bookings</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">ROI</span>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">+{roi.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground mt-1">Positive trend</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Cost per Lead</span>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">$24.50</div>
                        <div className="text-xs text-muted-foreground mt-1">Target: $30.00</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="h-[400px]">
                <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            <Bar dataKey="spend" name="Ad Spend" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="revenue" name="Booked Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
