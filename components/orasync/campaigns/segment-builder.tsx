"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Users, Loader2, Save, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"

interface FilterCondition {
    id: string
    type: "last_visit" | "tags" | "treatment" | "age" | "status"
    operator: "gt" | "lt" | "eq" | "includes" | "excludes"
    value: string
    label?: string
}

interface SegmentBuilderProps {
    onSegmentChange?: (conditions: FilterCondition[], matchCount: number) => void
    initialConditions?: FilterCondition[]
}

export function SegmentBuilder({ onSegmentChange, initialConditions = [] }: SegmentBuilderProps) {
    const { user } = useUser()
    const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions)
    const [matchCount, setMatchCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [segmentName, setSegmentName] = useState("")
    const [saving, setSaving] = useState(false)

    // Fetch match count when conditions change
    useEffect(() => {
        if (conditions.length === 0) {
            setMatchCount(null)
            return
        }

        const timer = setTimeout(() => {
            fetchMatchCount()
        }, 500) // Debounce

        return () => clearTimeout(timer)
    }, [conditions])

    const fetchMatchCount = async () => {
        if (!user?.id || conditions.length === 0) return

        setLoading(true)
        try {
            const res = await fetch(`/api/v1/clinics/${user.id}/segments/preview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conditions })
            })

            if (res.ok) {
                const data = await res.json()
                setMatchCount(data.count)
                onSegmentChange?.(conditions, data.count)
            }
        } catch (error) {
            console.error('Failed to fetch match count:', error)
        } finally {
            setLoading(false)
        }
    }

    const addCondition = () => {
        const newCondition: FilterCondition = {
            id: Date.now().toString(),
            type: "last_visit",
            operator: "gt",
            value: "180" // Default: 6 months
        }
        setConditions([...conditions, newCondition])
    }

    const removeCondition = (id: string) => {
        setConditions(conditions.filter(c => c.id !== id))
    }

    const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
        setConditions(conditions.map(c =>
            c.id === id ? { ...c, ...updates } : c
        ))
    }

    const applySuggestion = (type: "reactivation" | "new_patients" | "high_value") => {
        let newConditions: FilterCondition[] = []

        switch (type) {
            case "reactivation":
                newConditions = [
                    {
                        id: Date.now().toString(),
                        type: "last_visit",
                        operator: "gt",
                        value: "180", // 6 months
                        label: "Last visit more than 6 months ago"
                    },
                    {
                        id: (Date.now() + 1).toString(),
                        type: "status",
                        operator: "excludes",
                        value: "no-show",
                        label: "Exclude no-shows"
                    }
                ]
                setSegmentName("Reactivation Campaign")
                break

            case "new_patients":
                newConditions = [
                    {
                        id: Date.now().toString(),
                        type: "last_visit",
                        operator: "lt",
                        value: "30", // Last 30 days
                        label: "First visit within 30 days"
                    }
                ]
                setSegmentName("New Patients")
                break

            case "high_value":
                newConditions = [
                    {
                        id: Date.now().toString(),
                        type: "last_visit",
                        operator: "lt",
                        value: "90", // Last 3 months
                        label: "Active patients"
                    },
                    {
                        id: (Date.now() + 1).toString(),
                        type: "treatment",
                        operator: "includes",
                        value: "crown,implant,veneer",
                        label: "High-value treatments"
                    }
                ]
                setSegmentName("High-Value Patients")
                break
        }

        setConditions(newConditions)
    }

    const saveSegment = async () => {
        if (!user?.id || !segmentName || conditions.length === 0) return

        setSaving(true)
        try {
            const res = await fetch(`/api/v1/clinics/${user.id}/segments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: segmentName,
                    conditions
                })
            })

            if (res.ok) {
                // Success feedback (you can add toast notification here)
                console.log('Segment saved successfully')
            }
        } catch (error) {
            console.error('Failed to save segment:', error)
        } finally {
            setSaving(false)
        }
    }

    const getConditionLabel = (condition: FilterCondition): string => {
        if (condition.label) return condition.label

        const typeLabels = {
            last_visit: "Last visit",
            tags: "Tags",
            treatment: "Treatment",
            age: "Age",
            status: "Status"
        }

        const operatorLabels = {
            gt: "more than",
            lt: "less than",
            eq: "equals",
            includes: "includes",
            excludes: "excludes"
        }

        let valueLabel = condition.value
        if (condition.type === "last_visit") {
            const days = parseInt(condition.value)
            valueLabel = days >= 365
                ? `${Math.floor(days / 365)} years`
                : days >= 30
                    ? `${Math.floor(days / 30)} months`
                    : `${days} days`
        }

        return `${typeLabels[condition.type]} ${operatorLabels[condition.operator]} ${valueLabel}`
    }

    return (
        <div className="space-y-6">
            {/* Nova Suggestions */}
            <Card className="glass-card p-5 border-primary/20">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm text-foreground mb-1">Nova's Smart Segments</h3>
                        <p className="text-xs text-muted-foreground">Start with a proven template</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                        variant="outline"
                        className="h-auto p-3 flex-col items-start text-left hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => applySuggestion("reactivation")}
                    >
                        <span className="font-bold text-sm">Reactivation</span>
                        <span className="text-xs text-muted-foreground">Last visit &gt; 6 months</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-3 flex-col items-start text-left hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => applySuggestion("new_patients")}
                    >
                        <span className="font-bold text-sm">New Patients</span>
                        <span className="text-xs text-muted-foreground">First visit within 30 days</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-3 flex-col items-start text-left hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => applySuggestion("high_value")}
                    >
                        <span className="font-bold text-sm">High-Value</span>
                        <span className="text-xs text-muted-foreground">Premium treatments</span>
                    </Button>
                </div>
            </Card>

            {/* Segment Name */}
            <Card className="glass-card p-5">
                <Label htmlFor="segment-name" className="text-sm font-bold mb-2 block">
                    Segment Name
                </Label>
                <Input
                    id="segment-name"
                    placeholder="e.g., Reactivation Campaign Q1 2026"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="bg-background/50"
                />
            </Card>

            {/* Filters */}
            <Card className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm">Filters</h3>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={addCondition}
                        className="h-8"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Filter
                    </Button>
                </div>

                {conditions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No filters yet. Add a filter to define your segment.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {conditions.map((condition, index) => (
                            <div
                                key={condition.id}
                                className="flex items-center gap-2 p-3 rounded-lg bg-muted/5 border border-border/50"
                            >
                                {index > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        AND
                                    </Badge>
                                )}

                                <Select
                                    value={condition.type}
                                    onValueChange={(value) => updateCondition(condition.id, {
                                        type: value as FilterCondition["type"],
                                        value: value === "last_visit" ? "180" : ""
                                    })}
                                >
                                    <SelectTrigger className="w-[140px] h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="last_visit">Last Visit</SelectItem>
                                        <SelectItem value="tags">Tags</SelectItem>
                                        <SelectItem value="treatment">Treatment</SelectItem>
                                        <SelectItem value="age">Age</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={condition.operator}
                                    onValueChange={(value) => updateCondition(condition.id, {
                                        operator: value as FilterCondition["operator"]
                                    })}
                                >
                                    <SelectTrigger className="w-[120px] h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {condition.type === "last_visit" || condition.type === "age" ? (
                                            <>
                                                <SelectItem value="gt">More than</SelectItem>
                                                <SelectItem value="lt">Less than</SelectItem>
                                                <SelectItem value="eq">Equals</SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="includes">Includes</SelectItem>
                                                <SelectItem value="excludes">Excludes</SelectItem>
                                                <SelectItem value="eq">Equals</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder={
                                        condition.type === "last_visit" ? "Days" :
                                            condition.type === "age" ? "Years" :
                                                condition.type === "tags" ? "Tag name" :
                                                    condition.type === "treatment" ? "Treatment code" :
                                                        "Value"
                                    }
                                    value={condition.value}
                                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                    className="flex-1 h-9"
                                />

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => removeCondition(condition.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Match Count */}
            {conditions.length > 0 && (
                <Card className="glass-card p-5 border-primary/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">Matching Patients</h3>
                                <p className="text-xs text-muted-foreground">
                                    {conditions.map(getConditionLabel).join(" AND ")}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            ) : matchCount !== null ? (
                                <div>
                                    <p className="text-3xl font-black text-primary">
                                        {matchCount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">patients</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Card>
            )}

            {/* Save Segment */}
            {segmentName && conditions.length > 0 && (
                <Button
                    className="w-full"
                    onClick={saveSegment}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Segment
                        </>
                    )}
                </Button>
            )}
        </div>
    )
}
