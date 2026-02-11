"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    Calendar,
    Users,
    Sparkles,
    Rocket,
    ArrowRight,
    Upload,
    Globe,
    Clock
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const STEPS = [
    { id: "welcome", title: "Welcome", icon: Rocket },
    { id: "practice", title: "Practice Info", icon: Calendar },
    { id: "patients", title: "Import Patients", icon: Users },
    { id: "nova", title: "Nova Analysis", icon: Sparkles },
    { id: "launch", title: "Launch", icon: CheckCircle2 },
]

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [clinicName, setClinicName] = useState("")

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

    return (
        <div className="min-h-screen bg-[#050510] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-4xl z-10 space-y-8">
                {/* Progress Header */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                <Globe className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-heading">Orasync Onboarding</h1>
                                <p className="text-xs text-slate-400">Powering your practice Revenue Engine</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-blue-400">Step {currentStep + 1} of {STEPS.length}</span>
                            <p className="text-xs text-slate-500">{STEPS[currentStep].title}</p>
                        </div>
                    </div>
                    <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-2 bg-slate-800" />

                    <div className="flex justify-between px-1">
                        {STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-1 transition-all duration-300 ${idx <= currentStep ? 'text-blue-400' : 'text-slate-600'}`}
                            >
                                <step.icon className={`w-4 h-4 ${idx === currentStep ? 'animate-pulse' : ''}`} />
                                <span className="text-[10px] hidden sm:block font-medium uppercase tracking-wider">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {currentStep === 0 && <WelcomeStep clinicName={clinicName} setClinicName={setClinicName} onNext={nextStep} />}
                        {currentStep === 1 && <PracticeStep onNext={nextStep} onBack={prevStep} />}
                        {currentStep === 2 && <PatientStep onNext={nextStep} onBack={prevStep} />}
                        {currentStep === 3 && <NovaStep onNext={nextStep} onBack={prevStep} />}
                        {currentStep === 4 && <LaunchStep onBack={prevStep} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

function WelcomeStep({ clinicName, setClinicName, onNext }: any) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
                <Badge className="mx-auto bg-blue-600/20 text-blue-400 border-blue-500/30 mb-2">Phase 1: Foundation</Badge>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Welcome to the Future of Dentistry
                </CardTitle>
                <CardDescription className="text-slate-400 max-w-md mx-auto">
                    Orasync helps you reactivate patients, grow your reputation, and automate operations with artificial intelligence.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="aspect-video bg-slate-800/50 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center relative group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-300">Watch: Orasync in 60 Seconds</p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Practice Name</label>
                        <Input
                            placeholder="e.g. Bright Smile Family Dental"
                            className="bg-slate-950 border-slate-800 text-white focus:ring-blue-500/50"
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 text-lg shadow-lg shadow-blue-600/20 group"
                        onClick={onNext}
                        disabled={!clinicName}
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function PracticeStep({ onNext, onBack }: any) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Practice Configuration</CardTitle>
                <CardDescription>Connect your technical infrastructure for automated operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                <Calendar className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h4 className="font-semibold">Google Calendar</h4>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Sync booking availability and patient appointments automatically.</p>
                        <Button variant="outline" className="w-full border-slate-800 bg-transparent hover:bg-slate-800">
                            Connect Calendar
                        </Button>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                                <Clock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="font-semibold">Business Hours</h4>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Define when your clinic is open for AI-scheduled bookings.</p>
                        <Button variant="outline" className="w-full border-slate-800 bg-transparent hover:bg-slate-800">
                            Set Schedule
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        Core Settings
                    </h4>
                    <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Timezone</span>
                            <span className="text-white font-medium">America/New_York (Default)</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Booking Buffer</span>
                            <span className="text-white font-medium">15 Minutes</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={onBack}>Back</Button>
                    <Button className="flex-[2] bg-blue-600 hover:bg-blue-500" onClick={onNext}>Continue</Button>
                </div>
            </CardContent>
        </Card>
    )
}

function PatientStep({ onNext, onBack }: any) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Import Patient Data</CardTitle>
                <CardDescription>Upload your patient list to begin AI-powered reactivation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer bg-slate-950/20">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-bold mb-1">Drag and drop patient CSV</h4>
                    <p className="text-sm text-slate-500">Max file size: 50MB. Support: CSV, XLSX, JSON</p>
                    <Button variant="link" className="text-blue-400 mt-2">or browse files</Button>
                </div>

                <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Requirement Checklist</p>
                    <div className="grid grid-cols-2 gap-2">
                        {["Email Address", "Phone Number", "First Name", "Last Visit Date"].map((req) => (
                            <div key={req} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg p-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                {req}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={onBack}>Back</Button>
                    <Button className="flex-[2] bg-blue-600 hover:bg-blue-500" onClick={onNext}>Import & Analyze</Button>
                </div>
            </CardContent>
        </Card>
    )
}

function NovaStep({ onNext, onBack }: any) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl border-t-indigo-500/30">
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        Nova Insight Engine
                    </CardTitle>
                    <CardDescription>Analysis complete. Nova has found high-impact opportunities.</CardDescription>
                </div>
                <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/5 shrink-0">AI Active</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="relative z-10 flex gap-4">
                        <div className="shrink-0">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-lg">Top Recommendation</h4>
                                <p className="text-sm text-slate-300">Nova suggests launching a <span className="text-indigo-400 font-semibold underline decoration-indigo-500/30 underline-offset-4 cursor-pointer">"Reactivation Sprint"</span> targeting 450 patients who haven't visited in 12+ months.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Estimated Revenue</p>
                                    <p className="text-xl font-bold font-mono text-emerald-400">$12,450 - $18,900</p>
                                </div>
                                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Expected Bookings</p>
                                    <p className="text-xl font-bold font-mono text-blue-400">22 - 35 patients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Alternate Strategies</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-slate-700 group-hover:bg-blue-500 rounded-full transition-colors" />
                                <span className="text-sm">High-Value Recall (Insurance Expiration)</span>
                            </div>
                            <Badge variant="ghost" className="text-slate-500">Medium Impact</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-700 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-slate-700 group-hover:bg-blue-500 rounded-full transition-colors" />
                                <span className="text-sm">New Patient "Nurture" Sequence</span>
                            </div>
                            <Badge variant="ghost" className="text-slate-500">Long-term Growth</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={onBack}>Back</Button>
                    <Button className="flex-[2] bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20" onClick={onNext}>Accept & Pre-configure</Button>
                </div>
            </CardContent>
        </Card>
    )
}

function LaunchStep({ onBack }: any) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl border-t-emerald-500/30">
            <CardHeader className="text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <CardTitle className="text-3xl">Ready for Launch</CardTitle>
                <CardDescription>Everything is configured. Your practice is about to go live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">Summary of Configuration</p>
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Clinic Context</p>
                            <p className="text-sm font-medium">Bright Smile Family Dental</p>
                            <p className="text-[10px] text-slate-400">America/New_York (EST)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Patient Ledger</p>
                            <p className="text-sm font-medium">450 Patients imported</p>
                            <p className="text-[10px] text-emerald-500">Waitlist Ready</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Initial Campaign</p>
                            <p className="text-sm font-medium">Reactivation Sprint</p>
                            <p className="text-[10px] text-indigo-400">AI Optimized Drip</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Trial Credits</p>
                            <p className="text-sm font-medium">1,250 SMS/Email</p>
                            <p className="text-[10px] text-blue-400">Full Access Granted</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                        <Rocket className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-200">Legal Compliance</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">By clicking "Go to Dashboard", you confirm access to these records and agree to our HIPAA-compatible data processing terms.</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={onBack}>Review</Button>
                    <Button
                        className="flex-[2] bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 h-12 text-lg"
                        onClick={() => window.location.href = "/dashboard"}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
