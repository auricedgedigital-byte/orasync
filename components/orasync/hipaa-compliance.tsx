"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, CheckCircle, AlertCircle, Lock, FileText, Eye, Download } from "lucide-react"

export default function HIPAACompliance() {
  const handleDownloadReport = () => {
    alert("Downloading HIPAA compliance report...")
  }

  const handleViewAuditLog = () => {
    alert("Viewing audit log details...")
  }

  const handleViewPolicy = () => {
    alert("Opening policy document...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">HIPAA Compliance</h1>
          <p className="text-muted-foreground">Ensure your practice meets all regulatory requirements</p>
        </div>
        <Button size="sm" onClick={handleDownloadReport}>
          <Download className="w-4 h-4 mr-2" />
          Compliance Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Excellent standing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Days ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Critical issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Breaches</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Reported</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Requirements Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { requirement: "Administrative Safeguards", status: "compliant" },
                { requirement: "Physical Safeguards", status: "compliant" },
                { requirement: "Technical Safeguards", status: "compliant" },
                { requirement: "Organizational Requirements", status: "compliant" },
                { requirement: "Breach Notification", status: "compliant" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="text-sm font-medium">{item.requirement}</div>
                  <Badge variant={item.status === "compliant" ? "default" : "secondary"}>
                    {item.status === "compliant" ? "✓ Compliant" : "⚠ Review"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: "Data Access", user: "Dr. Smith", date: "Today", time: "2:30 PM" },
                { action: "Patient Record Modified", user: "Admin", date: "Today", time: "1:15 PM" },
                { action: "System Backup", user: "System", date: "Yesterday", time: "11:00 PM" },
                { action: "Security Update", user: "Admin", date: "2 days ago", time: "3:00 PM" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{log.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.user} • {log.date} at {log.time}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleViewAuditLog}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { policy: "Privacy Policy", updated: "3 months ago", status: "current" },
                { policy: "Security Policy", updated: "2 months ago", status: "current" },
                { policy: "Breach Response Plan", updated: "1 month ago", status: "current" },
                { policy: "Data Retention Policy", updated: "6 months ago", status: "review" },
              ].map((policy, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">{policy.policy}</div>
                    <div className="text-xs text-muted-foreground">Updated {policy.updated}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={policy.status === "current" ? "default" : "secondary"}>
                      {policy.status === "current" ? "Current" : "Review"}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={handleViewPolicy}>
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
