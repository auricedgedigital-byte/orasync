"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, DollarSign, Clock, FileText, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { PatientProfile } from "@/lib/mock-inbox-data"

interface PatientSidebarProps {
    patient: PatientProfile
}

export function PatientSidebar({ patient }: PatientSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-muted/10 border-l overflow-y-auto">
            <div className="p-6 text-center border-b bg-background">
                <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-muted">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="text-xl bg-primary/5 text-primary">
                        {patient.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-lg">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">{patient.phone}</p>
                <div className="flex justify-center gap-2 mt-4">
                    <Button size="sm" variant="outline" className="h-8 text-xs rounded-full">
                        Profile
                    </Button>
                    <Button size="sm" className="h-8 text-xs rounded-full shadow-sm shadow-primary/20">
                        Book Appt
                    </Button>
                </div>
            </div>

            <div className="p-5 space-y-6">
                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Patient Details</h4>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Next Visit</p>
                            <p className="font-medium text-foreground">{patient.nextVisit || "Unscheduled"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Lifetime Value</p>
                            <p className="font-medium text-foreground">${patient.ltv.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Last Visit</p>
                            <p className="font-medium text-foreground">{patient.lastVisit}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold">Clinical Notes</h4>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-xs text-amber-900 leading-relaxed">
                        {patient.notes}
                    </div>
                </div>
            </div>
        </div>
    )
}
