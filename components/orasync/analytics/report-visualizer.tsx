"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReportConfig, MetricData } from "./types"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface ReportVisualizerProps {
    config: ReportConfig
}

export function ReportVisualizer({ config }: ReportVisualizerProps) {
    // Mock data generation based on type
    const getMetrics = (): MetricData[] => {
        switch (config.type) {
            case "production":
                return [
                    { label: "Gross Production", value: "$45,230", change: 12.5, trend: "up" },
                    { label: "Net Production", value: "$38,100", change: 8.2, trend: "up" },
                    { label: "Adjustments", value: "$7,130", change: -2.1, trend: "down" }, // down is good for adjustments usually, but simplifying logic
                ]
            case "marketing":
                return [
                    { label: "Total Leads", value: "145", change: 24.0, trend: "up" },
                    { label: "Conversion Rate", value: "18.5%", change: 1.2, trend: "up" },
                    { label: "Cost Per Acquisition", value: "$42", change: -5.0, trend: "down" }, // cost down is good
                ]
            default:
                return [
                    { label: "Active Patients", value: "2,450", change: 3.4, trend: "up" },
                    { label: "Recall Rate", value: "76%", change: 0.0, trend: "neutral" },
                    { label: "No-Show Rate", value: "4.2%", change: -0.5, trend: "down" },
                ]
        }
    }

    const metrics = getMetrics()

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.map((m) => (
                    <Card key={m.label}>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium text-muted-foreground">{m.label}</div>
                            <div className="flex items-baseline justify-between mt-2">
                                <div className="text-2xl font-bold">{m.value}</div>
                                <div className={`flex items-center text-xs ${m.trend === "up" ? "text-green-600" : m.trend === "down" ? "text-red-600" : "text-gray-500"
                                    }`}>
                                    {m.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> :
                                        m.trend === "down" ? <ArrowDownRight className="h-3 w-3 mr-1" /> :
                                            <Minus className="h-3 w-3 mr-1" />}
                                    {Math.abs(m.change)}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Breakdown ({config.type})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Provider / Source</TableHead>
                                <TableHead>Metric A</TableHead>
                                <TableHead>Metric B</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Dr. Smith</TableCell>
                                <TableCell>124</TableCell>
                                <TableCell>85%</TableCell>
                                <TableCell className="text-right">$12,450</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Dr. Jones</TableCell>
                                <TableCell>98</TableCell>
                                <TableCell>92%</TableCell>
                                <TableCell className="text-right">$10,120</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Hygiene Dept</TableCell>
                                <TableCell>245</TableCell>
                                <TableCell>100%</TableCell>
                                <TableCell className="text-right">$8,200</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
