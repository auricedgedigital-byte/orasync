"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Download, FileBarChart } from "lucide-react"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { ReportConfig, ReportType } from "./types"

interface ReportBuilderProps {
    onGenerate: (config: ReportConfig) => void
}

export function ReportBuilder({ onGenerate }: ReportBuilderProps) {
    const [type, setType] = useState<ReportType>("production")
    const [date, setDate] = useState<{ from: Date; to: Date } | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })

    const handleGenerate = () => {
        if (date?.from && date?.to) {
            onGenerate({
                type,
                dateRange: { from: date.from, to: date.to },
                includeCharts: true
            })
        }
    }

    return (
        <div className="bg-card border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <FileBarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold">Report Configuration</h3>
                    <p className="text-sm text-muted-foreground">Customize your data view</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="production">Production & Revenue</SelectItem>
                            <SelectItem value="collections">Collections & AR</SelectItem>
                            <SelectItem value="marketing">Marketing Performance</SelectItem>
                            <SelectItem value="hygiene">Hygiene Re-care</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 col-span-2">
                    <Label>Date Range</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={(range: any) => setDate(range)}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
                <Button onClick={handleGenerate}>
                    Generate Report
                </Button>
            </div>
        </div>
    )
}
