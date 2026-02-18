"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import Papa from "papaparse"

interface ImportResult {
    total: number
    added: number
    skipped: number
    errors: Array<{ row: number; message: string }>
}

export function LeadImport() {
    const { user } = useUser()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<any[]>([])
    const [uploading, setUploading] = useState(false)
    const [result, setResult] = useState<ImportResult | null>(null)
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile.name.endsWith('.csv')) {
            alert('Please upload a CSV file')
            return
        }

        setFile(selectedFile)
        setResult(null)

        // Parse CSV for preview
        Papa.parse(selectedFile, {
            header: true,
            preview: 5,
            complete: (results) => {
                setPreview(results.data)
            },
            error: (error) => {
                console.error('CSV parse error:', error)
                alert('Failed to parse CSV file')
            }
        })
    }

    const handleUpload = async () => {
        if (!file || !user?.id) return

        setUploading(true)
        try {
            // Parse full CSV
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    // Send to API
                    const res = await fetch(`/api/v1/clinics/${user.id}/leads/upload`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            leads: results.data
                        })
                    })

                    if (res.ok) {
                        const data = await res.json()
                        setResult(data)
                        setFile(null)
                        setPreview([])
                    } else {
                        const error = await res.json()
                        alert(`Upload failed: ${error.error}`)
                    }
                },
                error: (error) => {
                    console.error('CSV parse error:', error)
                    alert('Failed to parse CSV file')
                }
            })
        } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const downloadTemplate = () => {
        const template = `first_name,last_name,email,phone,date_of_birth,address
John,Doe,john.doe@example.com,+1234567890,1980-01-15,"123 Main St, City, State"
Jane,Smith,jane.smith@example.com,+19876543210,1985-05-20,"456 Oak Ave, City, State"
`
        const blob = new Blob([template], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'orasync_leads_template.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            {/* Template Download */}
            <Card className="glass-card p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm mb-1">Need a template?</h3>
                        <p className="text-xs text-muted-foreground">
                            Download our CSV template with the correct column format
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                    </Button>
                </div>
            </Card>

            {/* Upload Area */}
            <Card
                className={cn(
                    "glass-card p-10 border-2 border-dashed transition-all duration-200",
                    dragActive ? "border-primary bg-primary/5" : "border-border/50",
                    file && "border-green-500/50 bg-green-500/5"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    title="Upload Patient CSV"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            handleFileSelect(e.target.files[0])
                        }
                    }}
                />

                <div className="text-center">
                    {file ? (
                        <>
                            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                            <h3 className="font-bold text-lg mb-2">{file.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {(file.size / 1024).toFixed(2)} KB • {preview.length} rows previewed
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFile(null)
                                        setPreview([])
                                        setResult(null)
                                    }}
                                >
                                    Remove
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload & Import
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="font-bold text-lg mb-2">Drop your CSV file here</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                or click to browse
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Select CSV File
                            </Button>
                        </>
                    )}
                </div>
            </Card>

            {/* Preview */}
            {preview.length > 0 && (
                <Card className="glass-card p-5">
                    <h3 className="font-bold text-sm mb-4">Preview (first 5 rows)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border/50">
                                    {Object.keys(preview[0]).map((header, i) => (
                                        <th key={i} className="text-left p-2 font-bold text-muted-foreground">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((row, i) => (
                                    <tr key={i} className="border-b border-border/30">
                                        {Object.values(row).map((value: any, j) => (
                                            <td key={j} className="p-2 text-foreground">
                                                {value || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Import Result */}
            {result && (
                <Card className="glass-card p-5 border-green-500/50">
                    <div className="flex items-start gap-3 mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">Import Complete!</h3>
                            <p className="text-sm text-muted-foreground">
                                Your leads have been processed
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 rounded-lg bg-muted/20">
                            <p className="text-2xl font-black text-foreground">{result.total}</p>
                            <p className="text-xs text-muted-foreground">Total Rows</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10">
                            <p className="text-2xl font-black text-green-500">{result.added}</p>
                            <p className="text-xs text-muted-foreground">Added</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                            <p className="text-2xl font-black text-yellow-500">{result.skipped}</p>
                            <p className="text-xs text-muted-foreground">Skipped</p>
                        </div>
                    </div>

                    {result.errors.length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-bold mb-2">{result.errors.length} errors found:</p>
                                <ul className="text-xs space-y-1">
                                    {result.errors.slice(0, 5).map((error, i) => (
                                        <li key={i}>Row {error.row}: {error.message}</li>
                                    ))}
                                    {result.errors.length > 5 && (
                                        <li className="text-muted-foreground">
                                            ...and {result.errors.length - 5} more
                                        </li>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </Card>
            )}
        </div>
    )
}
