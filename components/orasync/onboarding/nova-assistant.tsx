"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, X, ChevronRight, CheckCircle, Calendar, Users, Megaphone } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: any
    actionLabel: string
    path: string
}

const steps: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to Orasync",
        description: "I'm Nova, your AI practice assistant. Let's get your practice set up for success.",
        icon: Zap,
        actionLabel: "Let's Go",
        path: ""
    },
    {
        id: "connect",
        title: "Connect Your Calendar",
        description: "Sync your practice management software to enable real-time scheduling and AI optimization.",
        icon: Calendar,
        actionLabel: "Connect Now",
        path: "/settings"
    },
    {
        id: "patients",
        title: "Import Patients",
        description: "Upload your patient list to start the reactivation engine. We'll identify who needs to come back.",
        icon: Users,
        actionLabel: "Go to Patients",
        path: "/patient-crm"
    },
    {
        id: "campaign",
        title: "Launch First Campaign",
        description: "Let's fill your schedule. I've prepared a 'Hygiene Reactivation' campaign for you.",
        icon: Megaphone,
        actionLabel: "View Campaigns",
        path: "/patient-engagement"
    }
]

export function NovaAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<string[]>([])
    const [minimized, setMinimized] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if onboarding is already completed
        const completed = localStorage.getItem("orasync_onboarding_completed")
        if (!completed) {
            // Small delay to show after initial load
            const timer = setTimeout(() => setIsOpen(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        const currentStep = steps[currentStepIndex]

        if (currentStep.path) {
            router.push(currentStep.path)
        }

        if (currentStepIndex < steps.length - 1) {
            setCompletedSteps([...completedSteps, currentStep.id])
            setCurrentStepIndex(currentStepIndex + 1)
        } else {
            handleComplete()
        }
    }

    const handleComplete = () => {
        setCompletedSteps([...completedSteps, steps[currentStepIndex].id])
        setIsOpen(false)
        localStorage.setItem("orasync_onboarding_completed", "true")
    }

    const handleDismiss = () => {
        setIsOpen(false)
        // Maybe set a "dismissed" state instead of completed
    }

    const handleMinimize = () => {
        setMinimized(!minimized)
    }

    if (!isOpen) return null

    const currentStep = steps[currentStepIndex]
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    return (
        <AnimatePresence>
            {minimized ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Button
                        className="rounded-full w-12 h-12 bg-primary shadow-lg shadow-primary/25 p-0"
                        onClick={() => setMinimized(false)}
                    >
                        <Zap className="w-6 h-6 text-primary-foreground" />
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
                >
                    <Card className="border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden bg-background/95 backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                            <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }} />
                        </div>

                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-primary rounded-lg">
                                        <Zap className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold">Nova Assistant</CardTitle>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Onboarding</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleMinimize}>
                                        <span className="sr-only">Minimize</span>
                                        <div className="w-2.5 h-0.5 bg-muted-foreground rounded-full" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleDismiss}>
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 pb-2">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                    <currentStep.icon className="w-8 h-8 text-primary" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg">{currentStep.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {currentStep.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 pb-6 flex justify-between gap-3">
                            <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs text-muted-foreground">
                                Skip Setup
                            </Button>
                            <Button onClick={handleNext} className="gap-2 shadow-lg shadow-primary/20">
                                {currentStep.actionLabel}
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
