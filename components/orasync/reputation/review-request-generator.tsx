"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Send, Smartphone, Mail, CheckCircle2 } from "lucide-react"

export function ReviewRequestGenerator() {
    const [patient, setPatient] = useState({ name: "", contact: "" })
    const [channel, setChannel] = useState<"sms" | "email">("sms")
    const [sent, setSent] = useState(false)

    const handleSend = () => {
        // API call mock
        setTimeout(() => setSent(true), 1000)
    }

    if (sent) {
        return (
            <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-800">Request Sent!</h3>
                        <p className="text-sm text-green-700">
                            {patient.name} will receive a {channel.toUpperCase()} shortly.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => { setSent(false); setPatient({ name: "", contact: "" }) }} className="bg-white">
                        Send Another
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Get More Reviews</CardTitle>
                <CardDescription>Send a smart review request to a recent patient.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input
                        placeholder="e.g. John Smith"
                        value={patient.name}
                        onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Contact ({channel === "sms" ? "Phone" : "Email"})</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder={channel === "sms" ? "+1 (555) 000-0000" : "john@example.com"}
                            value={patient.contact}
                            onChange={(e) => setPatient({ ...patient, contact: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        variant={channel === "sms" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setChannel("sms")}
                    >
                        <Smartphone className="mr-2 h-4 w-4" /> SMS
                    </Button>
                    <Button
                        variant={channel === "email" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setChannel("email")}
                    >
                        <Mail className="mr-2 h-4 w-4" /> Email
                    </Button>
                </div>

                <Button className="w-full" onClick={handleSend} disabled={!patient.name || !patient.contact}>
                    <Send className="mr-2 h-4 w-4" /> Send Request
                </Button>
            </CardContent>
        </Card>
    )
}
