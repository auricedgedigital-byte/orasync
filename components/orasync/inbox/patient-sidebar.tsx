"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, DollarSign, Clock, FileText, User, Mail, Phone } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Patient } from "@/types/inbox"
import { formatDistanceToNow } from "date-fns"

interface PatientSidebarProps {
    patient: Patient
}

export function PatientSidebar({ patient }: PatientSidebarProps) {
    const patientName = `${patient.first_name} ${patient.last_name}`
    const initials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <div className="flex flex-col h-full bg-muted/5 border-l border-border/40 overflow-y-auto">
            <div className="p-8 text-center border-b border-border/40 bg-background/50 backdrop-blur-sm">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background ring-1 ring-border shadow-xl shadow-black/5">
                    <AvatarImage src={patient.avatar} />
                    <AvatarFallback className="text-2xl font-black bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-xl tracking-tight text-foreground">{patientName}</h2>
                <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
                    {patient.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{patient.phone}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-3 mt-6">
                    <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-bold rounded-xl border-border/60 hover:bg-background shadow-sm">
                        View Profile
                    </Button>
                    <Button size="sm" className="h-9 px-4 text-xs font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Book Appt
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest pl-1">Patient Overview</h4>

                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Next Visit</p>
                            <p className="font-bold text-foreground text-sm mt-0.5">{patient.next_due ? new Date(patient.next_due).toLocaleDateString() : "Unscheduled"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                        <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 border border-green-500/20">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Lifetime Value</p>
                            <p className="font-bold text-foreground text-sm mt-0.5">${(patient.ltv || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default">
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Last Visit</p>
                            <p className="font-bold text-foreground text-sm mt-0.5">
                                {patient.last_visit ? formatDistanceToNow(new Date(patient.last_visit), { addSuffix: true }) : "Never"}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-3">
                    <div className="flex items-center gap-2 pl-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Notes</h4>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs font-medium text-amber-900/80 dark:text-amber-200/80 leading-relaxed italic">
                        {patient.notes || "No notes available for this patient."}
                    </div>
                </div>
            </div>
        </div>
    )
}
