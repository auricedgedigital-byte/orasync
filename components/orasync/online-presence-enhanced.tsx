"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Copy, Zap, MessageSquare, TrendingUp } from "lucide-react"

export function OnlinePresenceEnhanced() {
  const [domain, setDomain] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [chatbotEnabled, setChatbotEnabled] = useState(false)
  const [showChatbotScript, setShowChatbotScript] = useState(false)
  const [showSEOAudit, setShowSEOAudit] = useState(false)
  const [seoResults, setSeoResults] = useState<string[] | null>(null)
  const [isApplyingSEO, setIsApplyingSEO] = useState(false)

  const metaTag = `<meta name="orasync-verification" content="orasync_verify_${Date.now()}" />`

  const chatbotScript = `
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://chat.orasync.com/embed.js';
    script.async = true;
    script.onload = function() {
      window.OrasyncChatbot.init({
        clinicId: 'clinic-001',
        position: 'bottom-right',
        theme: 'light'
      });
    };
    document.head.appendChild(script);
  })();
</script>
  `

  const handleVerifyDomain = () => {
    if (domain) {
      setIsVerified(true)
      setShowVerification(false)
    }
  }

  const handleRunSEOAudit = async () => {
    setShowSEOAudit(true)
    setSeoResults([
      "Add meta descriptions to all pages",
      "Optimize heading hierarchy (H1, H2, H3)",
      "Improve page load speed (currently 3.2s)",
      "Add schema markup for local business",
      "Optimize images for mobile",
      "Add internal linking strategy",
    ])
  }

  const handleApplySEOFixes = async () => {
    setIsApplyingSEO(true)
    try {
      const clinicId = "clinic-001"
      const response = await fetch(`/api/v1/clinics/${clinicId}/seo-apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        alert("SEO fixes applied successfully!")
      } else {
        alert("Failed to apply SEO fixes")
      }
    } catch (error) {
      console.error("[v0] SEO apply error:", error)
      alert("Error applying SEO fixes")
    } finally {
      setIsApplyingSEO(false)
    }
  }

  const handleInstallChatbot = async () => {
    try {
      const clinicId = "clinic-001"
      const response = await fetch(`/api/v1/clinics/${clinicId}/chatbot-install`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setChatbotEnabled(true)
        alert("Chatbot installed successfully!")
      } else {
        alert("Failed to install chatbot")
      }
    } catch (error) {
      console.error("[v0] Chatbot install error:", error)
      alert("Error installing chatbot")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Online Presence</h1>
        <p className="text-muted-foreground">Manage your website, chatbot, and SEO</p>
      </div>

      <Tabs defaultValue="website" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Website Tab */}
        <TabsContent value="website" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Verification</CardTitle>
              <CardDescription>Connect your practice website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isVerified ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Domain</label>
                    <Input placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
                  </div>
                  <Button onClick={() => setShowVerification(true)}>Verify Domain</Button>

                  <Dialog open={showVerification} onOpenChange={setShowVerification}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Verify Your Domain</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Add this meta tag to the &lt;head&gt; section of your website:
                        </p>
                        <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">{metaTag}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(metaTag)
                            alert("Copied to clipboard!")
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Meta Tag
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Once added, click verify below. This may take a few minutes to propagate.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowVerification(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleVerifyDomain}>Verify Now</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-medium text-green-900">Domain Verified</p>
                  </div>
                  <p className="text-sm text-green-800">{domain} is now connected to Orasync</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Templates</CardTitle>
              <CardDescription>Choose a template or customize your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Modern Clinic", "Professional Dental", "Wellness Center", "Custom"].map((template) => (
                <div key={template} className="p-3 rounded-lg border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{template}</p>
                    <p className="text-xs text-muted-foreground">Fully customizable template</p>
                  </div>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    {template === "Custom" ? "Upload" : "Use"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chatbot Tab */}
        <TabsContent value="chatbot" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>Automated patient support 24/7</CardDescription>
              </div>
              <Switch checked={chatbotEnabled} onCheckedChange={setChatbotEnabled} />
            </CardHeader>
            <CardContent className="space-y-4">
              {!chatbotEnabled ? (
                <>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-900 mb-3">
                      Enable the AI chatbot to automatically respond to patient inquiries and handle booking requests.
                    </p>
                    <Button onClick={handleInstallChatbot} className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Install Chatbot
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-green-900">Chatbot Active</p>
                    </div>
                    <p className="text-sm text-green-800">Your chatbot is live and responding to patients</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Embed Code</label>
                    <div className="p-3 rounded-lg bg-muted font-mono text-xs overflow-x-auto">{chatbotScript}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(chatbotScript)
                        alert("Embed code copied!")
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Chatbot Settings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="text-sm">Enable booking requests</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="text-sm">Enable appointment reminders</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="text-sm">Enable insurance inquiries</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization</CardTitle>
              <CardDescription>Improve your search engine visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRunSEOAudit} className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Run SEO Audit
              </Button>

              {seoResults && (
                <>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-sm font-medium text-amber-900 mb-3">Audit Results</p>
                    <ul className="space-y-2">
                      {seoResults.map((result, idx) => (
                        <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <p className="font-medium text-blue-900">Apply SEO Fixes</p>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                      Automatically apply recommended SEO improvements (uses 1 SEO credit)
                    </p>
                    <Button onClick={handleApplySEOFixes} disabled={isApplyingSEO} className="w-full">
                      {isApplyingSEO ? "Applying..." : "Apply Fixes"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
