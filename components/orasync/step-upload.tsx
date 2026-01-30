"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Users } from "lucide-react"
import type { Lead } from "./types"

interface StepUploadProps {
  onNext: (leads: Lead[]) => void
  initialLeads: Lead[]
}

export function StepUpload({ onNext, initialLeads }: StepUploadProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate file processing
      const mockLeads: Lead[] = [
        { id: "1", firstName: "John", email: "john@example.com", phone: "555-0101", status: "valid" },
        { id: "2", firstName: "Jane", email: "jane@example.com", phone: "555-0102", status: "valid" },
      ]
      setLeads(mockLeads)
    }
  }

  const handleSubmit = () => {
    if (leads.length > 0) {
      onNext(leads)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Your Leads</h2>
        <p className="text-muted-foreground">Upload a CSV file with your patient leads</p>
      </div>

      <Card 
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </span>
            </Button>
          </Label>
        </div>
      </Card>

      {leads.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Leads Found</h3>
          </div>
          <p className="text-2xl font-bold text-primary">{leads.length} leads ready</p>
          <p className="text-sm text-muted-foreground">All leads are valid and ready to process</p>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={leads.length === 0}>
          Continue to Template
        </Button>
      </div>
    </div>
  )
}