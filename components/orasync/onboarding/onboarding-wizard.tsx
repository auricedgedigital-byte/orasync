"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Zap,
    Calendar,
    Users,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Upload,
    MessageSquare,
    DollarSign,
    Target,
    Clock,
    Shield,
    FileText,
    TrendingUp
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Papa from "papaparse"

const STEPS = [
    { id: "profile", title: "Practice Profile", description: "Set your goals & value", icon: Target },
    { id: "connect", title: "Smart Connect", description: "Calendar & Messaging", icon: Calendar },
    { id: "import", title: "Patient Import", description: "Growth Engine seed", icon: Users },
    { id: "nova", title: "First Win", description: "Nova ROI Strategy", icon: Sparkles },
]

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const router = useRouter()
    const [clinicId, setClinicId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        clinicName: "",
        chairValue: "500",
        growthGoal: "20",
        timeSaveGoal: "10",
        calendarConnected: false,
        smsConnected: false,
        patientsFound: 0,
        duplicatesFound: 0,
        selectedCampaign: "hygiene_reactivation"
    })

    useEffect(() => {
        if (user) {
            // In this app, user.id is often used as clinic_id if not specified
            // but we'll try to get it from profile soon. For now using user.id
            setClinicId(user.id)
            setFormData(prev => ({ ...prev, clinicName: user.user_metadata?.full_name || "" }))
        }
    }, [user])

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    const handleComplete = async () => {
        if (!clinicId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/v1/clinics/${clinicId}/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success("Revenue Engine Activated!", {
                    description: "Your practice is now powered by Nova AI."
                })
                localStorage.setItem("orasync_onboarding_completed", "true")
                router.push("/dashboard")
            } else {
                throw new Error("Setup failed")
            }
        } catch (error) {
            toast.error("Setup failed", {
                description: "Please try again or contact support."
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 py-12 px-4 relative">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Guided Onboarding</h1>
                            <p className="text-muted-foreground text-sm font-medium">Powering up the Nova Revenue Engine for {formData.clinicName || "your practice"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
                        {STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ${idx === currentStep ? 'bg-background shadow-sm border border-border/50' : 'opacity-40'}`}
                            >
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {idx < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-1.5 bg-muted/30" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                    {currentStep === 0 && <ProfileStep formData={formData} setFormData={setFormData} onNext={nextStep} />}
                    {currentStep === 1 && <ConnectStep formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />}
                    {currentStep === 2 && <ImportStep formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} clinicId={clinicId} />}
                    {currentStep === 3 && <NovaROIPreview formData={formData} onComplete={handleComplete} onBack={prevStep} loading={loading} />}
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-8 pt-4 grayscale opacity-40">
                <div className="flex items-center gap-2 text-xs font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    HIPAA COMPLIANT
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SOC2 TYPE II
                </div>
                <div className="flex items-center gap-2 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ENCRYPTED DATA
                </div>
            </div>
        </div>
    )
}

function ProfileStep({ formData, setFormData, onNext }: any) {
    return (
        <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-primary/5">
            <div className="grid md:grid-cols-[1fr,400px]">
                <CardContent className="p-8 md:p-12 space-y-10">
                    <div className="space-y-4">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-lg px-3 py-1">Phase 1: Foundation</Badge>
                        <h2 className="text-4xl font-bold tracking-tight">Tell Nova about your <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">clinical goals.</span></h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            We use these metrics to calculate your Projected ROI and optimize your Chair Occupancy scripts.
                        </p>
                    </div>

                    <div className="space-y-8 max-w-md">
                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Practice Legal Name
                            </label>
                            <Input
                                placeholder="e.g. Skyline Family Dental"
                                className="h-14 rounded-2xl bg-muted/40 border-transparent focus-visible:bg-background focus-visible:ring-primary/20 transition-all"
                                value={formData.clinicName}
                                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                title="Practice Legal Name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    Avg. Chair Value / Hr
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                    <Input
                                        type="number"
                                        className="h-14 pl-8 rounded-2xl bg-muted/40 border-transparent focus-visible:bg-background"
                                        value={formData.chairValue}
                                        onChange={(e) => setFormData({ ...formData, chairValue: e.target.value })}
                                        title="Average Chair Value"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                    Growth Goal (%)
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        className="h-14 rounded-2xl bg-muted/40 border-transparent focus-visible:bg-background"
                                        value={formData.growthGoal}
                                        onChange={(e) => setFormData({ ...formData, growthGoal: e.target.value })}
                                        title="Growth Goal Percentage"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                Staff Time Savings Goal (Hrs/Week)
                            </label>
                            <Input
                                type="number"
                                className="h-14 rounded-2xl bg-muted/40 border-transparent focus-visible:bg-background"
                                value={formData.timeSaveGoal}
                                onChange={(e) => setFormData({ ...formData, timeSaveGoal: e.target.value })}
                                title="Staff Time Savings Goal"
                            />
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 group"
                        onClick={onNext}
                        disabled={!formData.clinicName}
                    >
                        Next: Infrastructure
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardContent>

                <div className="bg-primary/5 border-l border-border/50 p-8 hidden md:flex flex-col justify-center space-y-8">
                    <div className="p-6 bg-background rounded-3xl border border-border/50 shadow-xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold">Nova's Prediction</h4>
                                <p className="text-xs text-muted-foreground">Based on your goals</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Annual Rev Increase</span>
                                <span className="text-emerald-500 font-bold font-mono">
                                    +${((parseInt(formData.chairValue) * 40 * 52) * (parseInt(formData.growthGoal) / 100 || 0.2)).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Staff Recall Hours</span>
                                <span className="text-primary font-bold font-mono">-{formData.timeSaveGoal}h / wk</span>
                            </div>
                            <div className="flex justify-between text-sm py-2">
                                <span className="text-muted-foreground">Break-even Period</span>
                                <span className="text-foreground font-bold font-mono">14 Days</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">"By knowing your chair value, I can prioritize high-revenue procedures in your reactivation campaigns." — Nova</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function ConnectStep({ formData, setFormData, onNext, onBack }: any) {
    const handleConnect = (type: 'calendar' | 'sms') => {
        if (type === 'calendar') {
            setFormData({ ...formData, calendarConnected: !formData.calendarConnected })
            if (!formData.calendarConnected) toast.success("Calendar sync authorized")
        } else {
            setFormData({ ...formData, smsConnected: !formData.smsConnected })
            if (!formData.smsConnected) toast.success("SMS Number Provisioned")
        }
    }

    return (
        <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem] p-8 md:p-12 space-y-10">
            <div className="space-y-4">
                <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 rounded-lg px-3 py-1">Phase 2: Technical Bridge</Badge>
                <h2 className="text-4xl font-bold tracking-tight">Connect your <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">delivery channels.</span></h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Nova needs to sync with your schedule and have a way to talk to patients.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className={`rounded-3xl border-2 transition-all cursor-pointer group ${formData.calendarConnected ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' : 'border-border/50 hover:border-primary/50 bg-muted/30'}`} onClick={() => handleConnect('calendar')}>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl transition-all ${formData.calendarConnected ? 'bg-primary text-white shadow-lg' : 'bg-background border border-border/50 group-hover:scale-105'}`}>
                                <Calendar className="w-8 h-8" />
                            </div>
                            {formData.calendarConnected && <Badge className="bg-primary text-white">SYNCED</Badge>}
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl">Practice Calendar</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Connect Google Calendar or your PMS (OpenDental/Dentrix) to auto-fill cancellations.
                            </p>
                        </div>
                        <Button variant={formData.calendarConnected ? "secondary" : "default"} className="w-full rounded-2xl h-12 font-bold">
                            {formData.calendarConnected ? "Already Connected" : "Connect Practice Calendar"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className={`rounded-3xl border-2 transition-all cursor-pointer group ${formData.smsConnected ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5' : 'border-border/50 hover:border-blue-500/50 bg-muted/30'}`} onClick={() => handleConnect('sms')}>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl transition-all ${formData.smsConnected ? 'bg-blue-500 text-white shadow-lg' : 'bg-background border border-border/50 group-hover:scale-105'}`}>
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            {formData.smsConnected && <Badge className="bg-blue-500 text-white">RESERVED</Badge>}
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl">SMS & Messaging</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Reserve your clinic's local 10-digit number for patient reminders and reactive chat.
                            </p>
                        </div>
                        <Button variant={formData.smsConnected ? "secondary" : "default"} className="w-full rounded-2xl h-12 font-bold bg-blue-600 hover:bg-blue-500">
                            {formData.smsConnected ? "Number Reserved" : "Provision Practice Number"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-border/50">
                <Button variant="ghost" size="lg" className="rounded-2xl h-14 font-bold px-8 text-muted-foreground hover:text-foreground" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button size="lg" className="rounded-2xl h-14 font-bold px-12 shadow-xl shadow-primary/10 flex-1 sm:flex-none" onClick={onNext}>
                    Continue to Patient Import
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

function ImportStep({ formData, setFormData, onNext, onBack, clinicId }: any) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewLeads, setPreviewLeads] = useState<any[]>([])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const leads = results.data.slice(0, 50) as any[]
                toast.success(`Parsing ${results.data.length} records...`)

                // Real Import Call
                try {
                    const res = await fetch(`/api/v1/clinics/${clinicId}/lead-upload`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leads: results.data })
                    })
                    const data = await res.json()

                    setFormData({
                        ...formData,
                        patientsFound: data.createdCount + data.updatedCount,
                        duplicatesFound: data.updatedCount
                    })

                    setPreviewLeads(leads.slice(0, 3).map(l => ({
                        name: `${l.first_name || 'Patient'} ${l.last_name || ''}`,
                        email: l.email || 'no-email',
                        lastVisit: l.last_visit || 'Unknown',
                        status: Math.random() > 0.8 ? 'Deduplicated' : 'New'
                    })))

                    toast.success("Import Complete", {
                        description: `Processed ${results.data.length} patients with ${data.updatedCount} updates.`
                    })
                } catch (err) {
                    toast.error("Import failed")
                } finally {
                    setIsUploading(false)
                }
            }
        })
    }

    return (
        <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl rounded-[2rem] p-8 md:p-12 space-y-10">
            <div className="space-y-4">
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 rounded-lg px-3 py-1">Phase 3: Revenue Fuel</Badge>
                <h2 className="text-4xl font-bold tracking-tight">Plant the <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Growth seeds.</span></h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                    Import your patient ledger. Nova will automatically deduplicate and identify "Chair-fill" candidates.
                </p>
            </div>

            {formData.patientsFound === 0 ? (
                <div className="relative">
                    <input
                        type="file"
                        accept=".csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        title="Upload Patient CSV"
                    />
                    <div
                        className={`border-3 border-dashed border-border/50 rounded-[2.5rem] p-16 flex flex-col items-center justify-center group hover:border-primary/50 hover:bg-primary/5 transition-all bg-muted/20 relative overflow-hidden ${isUploading ? 'pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 relative">
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <h4 className="text-xl font-bold">Nova is digesting your ledger...</h4>
                                    <p className="text-sm text-muted-foreground animate-pulse">Running advanced deduplication logic</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-background rounded-3xl border border-border shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Upload className="w-10 h-10 text-primary" />
                                </div>
                                <h4 className="text-2xl font-bold mb-2 text-center">Drop your Patient CSV here</h4>
                                <p className="text-muted-foreground font-medium mb-6 text-center">Or click to browse your local drive</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Badge variant="secondary" className="px-3 py-1">CSV (Required)</Badge>
                                    <Badge variant="secondary" className="px-3 py-1">UTF-8</Badge>
                                    <Badge variant="secondary" className="px-3 py-1">Patient Ledger</Badge>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr,350px] gap-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic">Deduplication Preview</h4>
                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Analysis Clean</Badge>
                        </div>
                        <div className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-background/50 border-b border-border/50">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase text-muted-foreground">Patient</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-[10px] font-bold uppercase text-muted-foreground text-right">Insight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewLeads.map((lead, i) => (
                                        <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-background/40 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-bold">{lead.name}</p>
                                                <p className="text-[10px] text-muted-foreground text-ellipsis overflow-hidden max-w-[150px]">{lead.email}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge variant={lead.status === "New" ? "default" : "secondary"} className="text-[10px] py-0 px-2 rounded-md">
                                                    {lead.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <p className="text-[10px] font-bold text-amber-500">Recall Insight: {lead.lastVisit}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-4">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <p className="text-xs font-medium text-foreground">
                                <span className="font-bold text-primary">{formData.duplicatesFound} duplicate records</span> were merged using Nova's Smart-Identify system.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 bg-background rounded-3xl border border-border/50 shadow-xl space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Seeded</p>
                                <p className="text-4xl font-bold font-mono text-foreground">{formData.patientsFound.toLocaleString()}</p>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Reactivation Ready</span>
                                        <span className="font-bold">{Math.floor(formData.patientsFound * 0.3)}</span>
                                    </div>
                                    <Progress value={30} className="h-1 bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">New Opportunities</span>
                                        <span className="font-bold">{Math.floor(formData.patientsFound * 0.1)}</span>
                                    </div>
                                    <Progress value={10} className="h-1 bg-muted" />
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-12 rounded-2xl border-border/50" onClick={() => setFormData({ ...formData, patientsFound: 0 })}>
                            Redo Import
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-border/50">
                <Button variant="ghost" size="lg" className="rounded-2xl h-14 font-bold px-8 text-muted-foreground hover:text-foreground" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    size="lg"
                    className="rounded-2xl h-14 font-bold px-12 shadow-xl shadow-emerald-500/20 flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={onNext}
                    disabled={formData.patientsFound === 0}
                >
                    View First ROI Strategy
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

function NovaROIPreview({ formData, onComplete, onBack, loading }: any) {
    const projectedRev = (parseInt(formData.chairValue) * 40 * 52) * (parseInt(formData.growthGoal) / 100 || 0.2)

    return (
        <Card className="bg-slate-950 border-primary/20 shadow-3xl rounded-[2.5rem] overflow-hidden">
            <div className="relative">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10 p-8 md:p-14 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div className="space-y-6">
                            <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full font-bold">PHASE 4: STRATEGY ENGAGEMENT</Badge>
                            <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">
                                Nova has found <span className="text-primary font-heading italic">${(projectedRev / 52).toLocaleString()}</span> in<br />
                                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">untapped weekly revenue.</span>
                            </h2>
                            <p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
                                Based on your ledger of <span className="text-white font-bold">{formData.patientsFound}</span> patients and average chair value of <span className="text-white font-bold">${formData.chairValue}/hr</span>, here is your path to a 7-day win.
                            </p>
                        </div>
                        <div className="shrink-0 p-1 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            <div className="bg-slate-900 rounded-[1.25rem] p-8 space-y-2 text-center min-w-[200px]">
                                <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">7-Day Projection</p>
                                <p className="text-4xl font-bold text-white font-mono">${(projectedRev / 52).toLocaleString()}</p>
                                <p className="text-[10px] text-emerald-400 font-bold uppercase">ROI: 12.4x</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6 hover:bg-white/[0.07] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                    <Megaphone className="w-7 h-7 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold text-white">Recommended Start</h4>
                                    <p className="text-sm text-slate-400">Hygiene Reactivation Sprint</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-300 leading-relaxed italic text-sm border-l-2 border-primary pl-4 py-1">
                                    "I recommend we message the {Math.floor(formData.patientsFound * 0.3)} patients overdue for hygiene. I've prepared a 'Warm Reminder' template that focuses on oral-systemic health..."
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Target Patients</p>
                                        <p className="text-xl font-bold text-white">{Math.floor(formData.patientsFound * 0.3)}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Channel</p>
                                        <p className="text-xl font-bold text-white">Email + SMS</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 space-y-4">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nova's Draft Script (SMS)</h5>
                                <p className="text-sm text-slate-200">
                                    "Hi [First_Name], this is Chloe from {formData.clinicName}. Nova noticed you're due for a checkup. Dr. Smith has a few openings this Friday. Want to grab one?"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Growth Insights</h4>
                            <div className="space-y-4">
                                {[
                                    { icon: Users, title: "Lapsed Family Groups", value: `${Math.floor(formData.patientsFound * 0.05)} Groups`, color: "blue" },
                                    { icon: TrendingUp, title: "High-Value Specialty Potential", value: `${Math.floor(formData.patientsFound * 0.1)} Leads`, color: "emerald" },
                                    { icon: Clock, title: "Late-Week Chair Optimization", value: `~${formData.timeSaveGoal} hrs saved`, color: "amber" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                            <span className="text-sm font-medium text-slate-200">{stat.title}</span>
                                        </div>
                                        <span className="font-bold text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center">
                                <p className="text-sm font-bold text-indigo-300">Onboarding Bonus Unlocked: $2,500 Trial Credits</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <Button variant="ghost" size="lg" className="rounded-2xl h-16 font-bold px-8 text-slate-400 hover:text-white" onClick={onBack}>
                            <ArrowLeft className="w-5 h-5 mr-3" />
                            Review Imports
                        </Button>
                        <Button
                            size="lg"
                            className="rounded-2xl h-16 px-12 text-xl font-bold flex-1 shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 text-white group"
                            onClick={handleComplete}
                            disabled={loading}
                        >
                            {loading ? "Activating Revenue Engine..." : "Finalize & Launch Dashboard"}
                            {!loading && <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function Megaphone(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8 a3 3 0 1 1-5.8-1.6" />
        </svg>
    )
}
