export type ReportType = "production" | "collections" | "marketing" | "hygiene"

export interface DateRange {
    from: Date
    to: Date
}

export interface MetricData {
    label: string
    value: number | string
    change: number
    trend: "up" | "down" | "neutral"
}

export interface ReportConfig {
    type: ReportType
    dateRange: DateRange
    includeCharts: boolean
}
