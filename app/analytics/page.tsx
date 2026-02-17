"use client"

import { useState, useEffect } from "react"
import { AnalyticsReporting } from "@/components/orasync/analytics-reporting"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Download, Filter, RefreshCcw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
    const { user } = useUser()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
        from: subDays(new Date(), 30),
        to: new Date()
    })

    const fetchAnalytics = async () => {
        if (!user?.id) return
        setLoading(true)
        try {
            const query = new URLSearchParams()
            if (dateRange?.from) query.set("from", dateRange.from.toISOString())
            if (dateRange?.to) query.set("to", dateRange.to.toISOString())

            const res = await fetch(`/api/v1/clinics/${user.id}/analytics?${query.toString()}`)
            if (res.ok) {
                const json = await res.json()
                setData(json)
            }
        } catch (err) {
            console.error("Failed to fetch analytics", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [user?.id, dateRange]) // Refetch on date change

    return (
        <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Analytics & Reporting
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time insights into your practice performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>{format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}</>
                                    ) : (
                                        format(dateRange.from, "LLL dd")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={(range: any) => setDateRange(range)}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="icon" onClick={fetchAnalytics}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <AnalyticsReporting data={data} loading={loading} />
        </div>
    )
}
