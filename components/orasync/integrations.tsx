"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Clock, Plus, Trash2, TestTube, Copy, Eye, EyeOff, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Integration {
  id: string
  name: string
  status: "connected" | "disconnected" | "error"
  lastSync?: string
  lastActivity?: string
}

interface IntegrationCardProps {
  title: string
  description: string
  icon: React.ReactNode
  integration: Integration
  onConnect: () => void
  onTest: () => void
  onDisconnect: () => void
  children?: React.ReactNode
}

function IntegrationCard({
  title,
  description,
  icon,
  integration,
  onConnect,
  onTest,
  onDisconnect,
  children,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-primary mt-1">{icon}</div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge
            variant={integration.status === "connected" ? "default" : "secondary"}
            className={
              integration.status === "connected"
                ? "bg-green-500"
                : integration.status === "error"
                  ? "bg-red-500"
                  : "bg-gray-500"
            }
          >
            {integration.status === "connected" && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {integration.status === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
            {integration.status === "disconnected" && <Clock className="w-3 h-3 mr-1" />}
            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {integration.lastActivity && (
          <div className="text-sm text-muted-foreground">Last activity: {integration.lastActivity}</div>
        )}

        {children}

        <div className="flex gap-2 pt-4">
          {integration.status === "connected" ? (
            <>
              <Button size="sm" variant="outline" onClick={onTest}>
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button size="sm" variant="outline" onClick={onDisconnect} className="text-red-600 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onConnect}>
              <Plus className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CredentialInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  isSecret = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  isSecret?: boolean
}) {
  const [showSecret, setShowSecret] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type={isSecret && !showSecret ? "password" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        {isSecret && (
          <Button size="sm" variant="outline" onClick={() => setShowSecret(!showSecret)} className="px-3">
            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}

function CopyableEndpoint({ label, endpoint }: { label: string; endpoint: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(endpoint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-2 p-3 rounded-lg bg-muted">
      <div className="text-sm font-medium">{label}</div>
      <code className="text-xs break-all block mb-2">{endpoint}</code>
      <Button size="sm" variant="ghost" onClick={handleCopy} className="w-full">
        <Copy className="w-4 h-4 mr-2" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  )
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Record<string, Integration>>({
    googleAds: {
      id: "google-ads",
      name: "Google Ads",
      status: "disconnected",
      lastActivity: "Never",
    },
    facebookAds: {
      id: "facebook-ads",
      name: "Facebook Ads",
      status: "disconnected",
      lastActivity: "Never",
    },
    googleCalendar: {
      id: "google-calendar",
      name: "Google Calendar",
      status: "disconnected",
      lastActivity: "Never",
    },
    twilio: {
      id: "twilio",
      name: "Twilio/WhatsApp",
      status: "disconnected",
      lastActivity: "Never",
    },
    smtp: {
      id: "smtp",
      name: "SMTP Email",
      status: "disconnected",
      lastActivity: "Never",
    },
    stripe: {
      id: "stripe",
      name: "Stripe",
      status: "disconnected",
      lastActivity: "Never",
    },
    n8n: {
      id: "n8n",
      name: "n8n Workflow Engine",
      status: "disconnected",
      lastActivity: "Never",
    },
  })

  const [showOAuthDialog, setShowOAuthDialog] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("")
  const [n8nEnabled, setN8nEnabled] = useState(false)
  const [n8nWorkflows, setN8nWorkflows] = useState<Array<{ name: string; uploadDate: string; lastRun?: string }>>([])
  const [showN8nUpload, setShowN8nUpload] = useState(false)
  const [n8nJsonInput, setN8nJsonInput] = useState("")

  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({
    googleAds: { clientId: "", clientSecret: "" },
    facebookAds: { appId: "", appSecret: "" },
    googleCalendar: { clientId: "", clientSecret: "" },
    twilio: { accountSid: "", authToken: "", phoneNumber: "" },
    smtp: { host: "", port: "", username: "", password: "" },
    stripe: { apiKey: "", publishableKey: "" },
    n8n: { baseUrl: "", webhookToken: "" },
  })

  const handleConnect = (integrationId: string) => {
    setSelectedIntegration(integrationId)
    setShowOAuthDialog(true)
  }

  const handleOAuthConnect = () => {
    if (selectedIntegration) {
      setIntegrations((prev) => ({
        ...prev,
        [selectedIntegration]: {
          ...prev[selectedIntegration],
          status: "connected",
          lastActivity: new Date().toLocaleString(),
        },
      }))
    }
    setShowOAuthDialog(false)
  }

  const handleTest = (integrationId: string) => {
    alert(`Testing connection for ${integrations[integrationId]?.name}... Success!`)
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        status: "disconnected",
        lastActivity: "Never",
      },
    }))
  }

  const handleN8nUpload = () => {
    try {
      const workflow = JSON.parse(n8nJsonInput)
      setN8nWorkflows((prev) => [
        ...prev,
        {
          name: workflow.name || "Untitled Workflow",
          uploadDate: new Date().toLocaleString(),
        },
      ])
      setN8nJsonInput("")
      setShowN8nUpload(false)
      alert("Workflow uploaded successfully!")
    } catch (error) {
      alert("Invalid JSON format")
    }
  }

  const webhookToken = "whk_live_abc123def456ghi789jkl012mno345"
  const clinicId = "clinic-001"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground">Connect and manage third-party services</p>
      </div>

      <Tabs defaultValue="ads" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ads">Ads & Marketing</TabsTrigger>
          <TabsTrigger value="calendar">Calendar & Booking</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Ads & Marketing Tab */}
        <TabsContent value="ads" className="space-y-6">
          <IntegrationCard
            title="Google Ads"
            description="Connect your Google Ads account to import leads and track campaign performance"
            icon={<div className="w-6 h-6 bg-blue-500 rounded" />}
            integration={integrations.googleAds}
            onConnect={() => handleConnect("googleAds")}
            onTest={() => handleTest("googleAds")}
            onDisconnect={() => handleDisconnect("googleAds")}
          >
            {integrations.googleAds.status === "connected" && (
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Connected Email:</span>
                    <span className="font-medium">admin@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Sync:</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
            {integrations.googleAds.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="Client ID"
                  value={credentials.googleAds.clientId}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      googleAds: { ...prev.googleAds, clientId: value },
                    }))
                  }
                  placeholder="Your Google Client ID"
                />
                <CredentialInput
                  label="Client Secret"
                  value={credentials.googleAds.clientSecret}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      googleAds: { ...prev.googleAds, clientSecret: value },
                    }))
                  }
                  placeholder="Your Google Client Secret"
                  isSecret
                />
              </div>
            )}
          </IntegrationCard>

          <IntegrationCard
            title="Facebook / Meta Ads"
            description="Connect Meta Business Account to manage Facebook and Instagram ads"
            icon={<div className="w-6 h-6 bg-blue-600 rounded" />}
            integration={integrations.facebookAds}
            onConnect={() => handleConnect("facebookAds")}
            onTest={() => handleTest("facebookAds")}
            onDisconnect={() => handleDisconnect("facebookAds")}
          >
            {integrations.facebookAds.status === "connected" && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Business Account:</span>
                  <span className="font-medium">Smile Dental Care</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages Connected:</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            )}
            {integrations.facebookAds.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="App ID"
                  value={credentials.facebookAds.appId}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      facebookAds: { ...prev.facebookAds, appId: value },
                    }))
                  }
                  placeholder="Your Meta App ID"
                />
                <CredentialInput
                  label="App Secret"
                  value={credentials.facebookAds.appSecret}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      facebookAds: { ...prev.facebookAds, appSecret: value },
                    }))
                  }
                  placeholder="Your Meta App Secret"
                  isSecret
                />
              </div>
            )}
          </IntegrationCard>

          <IntegrationCard
            title="Stripe"
            description="Connect Stripe to process payments and manage subscriptions"
            icon={<div className="w-6 h-6 bg-purple-600 rounded" />}
            integration={integrations.stripe}
            onConnect={() => handleConnect("stripe")}
            onTest={() => handleTest("stripe")}
            onDisconnect={() => handleDisconnect("stripe")}
          >
            {integrations.stripe.status === "connected" && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Account Mode:</span>
                  <Badge variant="outline">Test Mode</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Account ID:</span>
                  <span className="font-medium">acct_1234567890</span>
                </div>
              </div>
            )}
            {integrations.stripe.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="API Key"
                  value={credentials.stripe.apiKey}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      stripe: { ...prev.stripe, apiKey: value },
                    }))
                  }
                  placeholder="sk_test_..."
                  isSecret
                />
                <CredentialInput
                  label="Publishable Key"
                  value={credentials.stripe.publishableKey}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      stripe: { ...prev.stripe, publishableKey: value },
                    }))
                  }
                  placeholder="pk_test_..."
                />
              </div>
            )}
          </IntegrationCard>
        </TabsContent>

        {/* Calendar & Booking Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <IntegrationCard
            title="Google Calendar"
            description="Sync your calendar and manage provider availability"
            icon={<div className="w-6 h-6 bg-red-500 rounded" />}
            integration={integrations.googleCalendar}
            onConnect={() => handleConnect("googleCalendar")}
            onTest={() => handleTest("googleCalendar")}
            onDisconnect={() => handleDisconnect("googleCalendar")}
          >
            {integrations.googleCalendar.status === "connected" && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Connected Calendars:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider Emails:</span>
                  <span className="font-medium">dr.james@practice.com</span>
                </div>
              </div>
            )}
            {integrations.googleCalendar.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="Client ID"
                  value={credentials.googleCalendar.clientId}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      googleCalendar: { ...prev.googleCalendar, clientId: value },
                    }))
                  }
                  placeholder="Your Google Client ID"
                />
                <CredentialInput
                  label="Client Secret"
                  value={credentials.googleCalendar.clientSecret}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      googleCalendar: { ...prev.googleCalendar, clientSecret: value },
                    }))
                  }
                  placeholder="Your Google Client Secret"
                  isSecret
                />
              </div>
            )}
          </IntegrationCard>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <IntegrationCard
            title="Twilio / WhatsApp"
            description="Send SMS and WhatsApp messages to patients"
            icon={<div className="w-6 h-6 bg-green-500 rounded" />}
            integration={integrations.twilio}
            onConnect={() => handleConnect("twilio")}
            onTest={() => handleTest("twilio")}
            onDisconnect={() => handleDisconnect("twilio")}
          >
            {integrations.twilio.status === "connected" && (
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Account SID:</span>
                    <span className="font-medium">AC1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Number:</span>
                    <span className="font-medium">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm">Sandbox Mode</span>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            )}
            {integrations.twilio.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="Account SID"
                  value={credentials.twilio.accountSid}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      twilio: { ...prev.twilio, accountSid: value },
                    }))
                  }
                  placeholder="Your Twilio Account SID"
                  isSecret
                />
                <CredentialInput
                  label="Auth Token"
                  value={credentials.twilio.authToken}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      twilio: { ...prev.twilio, authToken: value },
                    }))
                  }
                  placeholder="Your Twilio Auth Token"
                  isSecret
                />
                <CredentialInput
                  label="Phone Number"
                  value={credentials.twilio.phoneNumber}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      twilio: { ...prev.twilio, phoneNumber: value },
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}
          </IntegrationCard>

          <IntegrationCard
            title="SMTP Email"
            description="Configure email provider (Brevo, Sendinblue, Gmail)"
            icon={<div className="w-6 h-6 bg-orange-500 rounded" />}
            integration={integrations.smtp}
            onConnect={() => handleConnect("smtp")}
            onTest={() => handleTest("smtp")}
            onDisconnect={() => handleDisconnect("smtp")}
          >
            {integrations.smtp.status === "connected" && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">Brevo</span>
                </div>
                <div className="flex justify-between">
                  <span>From Email:</span>
                  <span className="font-medium">noreply@smiledental.com</span>
                </div>
              </div>
            )}
            {integrations.smtp.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="SMTP Host"
                  value={credentials.smtp.host}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      smtp: { ...prev.smtp, host: value },
                    }))
                  }
                  placeholder="smtp.brevo.com"
                />
                <CredentialInput
                  label="SMTP Port"
                  value={credentials.smtp.port}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      smtp: { ...prev.smtp, port: value },
                    }))
                  }
                  placeholder="587"
                />
                <CredentialInput
                  label="Username"
                  value={credentials.smtp.username}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      smtp: { ...prev.smtp, username: value },
                    }))
                  }
                  placeholder="your-email@example.com"
                />
                <CredentialInput
                  label="Password"
                  value={credentials.smtp.password}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      smtp: { ...prev.smtp, password: value },
                    }))
                  }
                  placeholder="Your SMTP password"
                  isSecret
                />
              </div>
            )}
          </IntegrationCard>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <IntegrationCard
            title="n8n Workflow Engine"
            description="Connect n8n for advanced workflow automation and integrations"
            icon={<div className="w-6 h-6 bg-yellow-500 rounded" />}
            integration={integrations.n8n}
            onConnect={() => handleConnect("n8n")}
            onTest={() => handleTest("n8n")}
            onDisconnect={() => handleDisconnect("n8n")}
          >
            {integrations.n8n.status === "connected" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook Base URL</label>
                  <Input
                    value={n8nWebhookUrl}
                    onChange={(e) => setN8nWebhookUrl(e.target.value)}
                    placeholder="https://n8n.example.com/webhook"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm">Enable n8n Orchestration</span>
                  <Switch checked={n8nEnabled} onCheckedChange={setN8nEnabled} />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowN8nUpload(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Workflow JSON
                </Button>
              </div>
            )}
            {integrations.n8n.status === "disconnected" && (
              <div className="space-y-3">
                <CredentialInput
                  label="n8n Base URL"
                  value={credentials.n8n.baseUrl}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      n8n: { ...prev.n8n, baseUrl: value },
                    }))
                  }
                  placeholder="https://n8n.example.com"
                />
                <CredentialInput
                  label="Webhook Token"
                  value={credentials.n8n.webhookToken}
                  onChange={(value) =>
                    setCredentials((prev) => ({
                      ...prev,
                      n8n: { ...prev.n8n, webhookToken: value },
                    }))
                  }
                  placeholder="Your n8n webhook token"
                  isSecret
                />
              </div>
            )}
          </IntegrationCard>

          {/* Webhooks & Workflows Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Webhooks & Workflows</CardTitle>
              <CardDescription>Ready-to-use webhook endpoints and imported workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="text-sm font-medium">Webhook Endpoints</div>
                <CopyableEndpoint label="Lead Upload" endpoint={`/webhook/lead-upload?token=${webhookToken}`} />
                <CopyableEndpoint
                  label="Campaign Trigger"
                  endpoint={`/webhook/campaign-trigger?token=${webhookToken}`}
                />
                <CopyableEndpoint label="Inbound Message" endpoint={`/webhook/inbound-message?token=${webhookToken}`} />
                <CopyableEndpoint label="Booking Confirm" endpoint={`/webhook/booking-confirm?token=${webhookToken}`} />
                <CopyableEndpoint label="Ad Lead" endpoint={`/webhook/ad-lead?token=${webhookToken}`} />
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <RotateIcon className="w-4 h-4 mr-2" />
                  Rotate Token
                </Button>
              </div>

              {/* Imported Workflows */}
              {n8nWorkflows.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="text-sm font-medium">Imported Workflows</div>
                  {n8nWorkflows.map((workflow, index) => (
                    <div key={index} className="p-3 rounded-lg border space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{workflow.name}</div>
                          <div className="text-xs text-muted-foreground">Uploaded: {workflow.uploadDate}</div>
                          {workflow.lastRun && (
                            <div className="text-xs text-muted-foreground">Last run: {workflow.lastRun}</div>
                          )}
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <TestTube className="w-4 h-4 mr-2" />
                          Run Test
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-medium">Enable System Automation</div>
                  <div className="text-xs text-muted-foreground">Turn off for manual mode or demo purposes</div>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* OAuth Dialog */}
      <Dialog open={showOAuthDialog} onOpenChange={setShowOAuthDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Connect {selectedIntegration ? integrations[selectedIntegration]?.name : "Integration"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You will be redirected to authorize this integration. This is a demo - in production, this would redirect
              to the OAuth provider.
            </p>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium">Demo Authorization Flow</p>
              <p className="text-xs text-muted-foreground mt-2">
                Simulating OAuth redirect to {selectedIntegration}...
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOAuthConnect}>Authorize & Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* n8n Workflow Upload Dialog */}
      <Dialog open={showN8nUpload} onOpenChange={setShowN8nUpload}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import n8n Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Paste your n8n workflow JSON below</p>
            <Textarea
              value={n8nJsonInput}
              onChange={(e) => setN8nJsonInput(e.target.value)}
              placeholder='{"name": "My Workflow", ...}'
              className="min-h-[300px] font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowN8nUpload(false)}>
              Cancel
            </Button>
            <Button onClick={handleN8nUpload}>Upload Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RotateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}
