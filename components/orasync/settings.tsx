"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Lock, Users, CreditCard, LogOut, Zap } from "@/components/icons"
import { EditProfileDialog, ChangePasswordDialog, TeamMemberDialog, PaymentMethodDialog } from "./settings-dialogs"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function Settings() {
  const router = useRouter()
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [teamMemberOpen, setTeamMemberOpen] = useState(false)
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    ipWhitelist: false,
    sessionTimeout: 30,
    encryptionEnabled: true,
    auditLogging: true,
  })

  const [phiSettings, setPhiSettings] = useState({
    phiEncryption: true,
    dataMinimization: true,
    accessLogging: true,
    retentionPolicy: "7years",
    anonymization: true,
  })

  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "Dr. Sarah Mitchell", email: "sarah@practice.com", role: "Dentist" },
    { id: "2", name: "Lisa Brown", email: "lisa@practice.com", role: "Hygienist" },
  ])

  const handleLogout = () => {
    router.push("/")
  }

  const handleCopyWebhookSecret = () => {
    navigator.clipboard.writeText("whk_live_abc123def456ghi789jkl012mno345")
    alert("Webhook secret copied to clipboard")
  }

  const baaChecklist = [
    { item: "Business Associate Agreement Signed", status: true, date: "2024-01-15" },
    { item: "Data Processing Agreement in Place", status: true, date: "2024-01-15" },
    { item: "Encryption Standards Implemented", status: true, date: "2024-01-10" },
    { item: "Access Controls Configured", status: true, date: "2024-01-08" },
    { item: "Audit Logging Enabled", status: true, date: "2024-01-05" },
    { item: "Breach Notification Plan", status: true, date: "2023-12-20" },
    { item: "Staff Training Completed", status: true, date: "2024-01-12" },
    { item: "Annual Security Assessment", status: false, date: null },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-medium">Dr. James Wilson</div>
                  <div className="text-sm text-muted-foreground">james@practice.com</div>
                </div>
                <Button size="sm" onClick={() => setEditProfileOpen(true)}>
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Phone:</span>
                  <span className="text-sm font-medium">(555) 123-4567</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Practice:</span>
                  <span className="text-sm font-medium">Smile Dental Care</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">License #:</span>
                  <span className="text-sm font-medium">DDS-12345</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-medium">Professional Plan</div>
                  <div className="text-sm text-muted-foreground">$99/month</div>
                </div>
                <Badge>Active</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Billing Date:</span>
                  <span className="text-sm font-medium">February 15, 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Payment Method:</span>
                  <span className="text-sm font-medium">Visa ending in 4242</span>
                </div>
              </div>

              <Button size="sm" onClick={() => setPaymentMethodOpen(true)}>
                Update Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="sm" onClick={() => setChangePasswordOpen(true)}>
                Change Password
              </Button>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm">Login Alerts</span>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm">IP Whitelist</span>
                  <Switch
                    checked={securitySettings.ipWhitelist}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelist: checked })}
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm">Encryption Enabled</span>
                  <Switch
                    checked={securitySettings.encryptionEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, encryptionEnabled: checked })
                    }
                  />
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm">Audit Logging</span>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">{securitySettings.sessionTimeout} minutes</div>
                </div>
                <select className="text-sm border rounded px-2 py-1">
                  <option>15 minutes</option>
                  <option selected>30 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-medium">Current Session</div>
                  <div className="text-xs text-muted-foreground">Chrome on macOS</div>
                </div>
                <Badge>Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                PHI & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm">PHI Encryption</span>
                <Switch
                  checked={phiSettings.phiEncryption}
                  onCheckedChange={(checked) => setPhiSettings({ ...phiSettings, phiEncryption: checked })}
                />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm">Data Minimization</span>
                <Switch
                  checked={phiSettings.dataMinimization}
                  onCheckedChange={(checked) => setPhiSettings({ ...phiSettings, dataMinimization: checked })}
                />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm">Access Logging</span>
                <Switch
                  checked={phiSettings.accessLogging}
                  onCheckedChange={(checked) => setPhiSettings({ ...phiSettings, accessLogging: checked })}
                />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm">Patient Data Anonymization</span>
                <Switch
                  checked={phiSettings.anonymization}
                  onCheckedChange={(checked) => setPhiSettings({ ...phiSettings, anonymization: checked })}
                />
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <div>
                  <span className="text-sm">Data Retention Policy</span>
                  <div className="text-xs text-muted-foreground">Keep records for 7 years</div>
                </div>
                <Badge variant="secondary">7 Years</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                BAA Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {baaChecklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  {item.status ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.item}</div>
                    {item.date && <div className="text-xs text-muted-foreground">Completed: {item.date}</div>}
                  </div>
                  <Badge variant={item.status ? "default" : "secondary"}>{item.status ? "✓" : "Pending"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">Email Notifications</span>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">SMS Notifications</span>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">Appointment Reminders</span>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">Marketing Emails</span>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <Button size="sm" onClick={() => setTeamMemberOpen(true)}>
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                    <Badge variant="outline" className="mt-1">
                      {member.role}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Connected Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Connect your accounts to enable integrations with external services.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Google Ads</div>
                      <div className="text-xs text-muted-foreground">Lead import and campaign tracking</div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Facebook Ads</div>
                      <div className="text-xs text-muted-foreground">Ad account management</div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Stripe</div>
                      <div className="text-xs text-muted-foreground">Payment processing</div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">Twilio</div>
                      <div className="text-xs text-muted-foreground">SMS and WhatsApp messaging</div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">SMTP Email</div>
                      <div className="text-xs text-muted-foreground">Email delivery service</div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <TeamMemberDialog open={teamMemberOpen} onOpenChange={setTeamMemberOpen} />
      <PaymentMethodDialog open={paymentMethodOpen} onOpenChange={setPaymentMethodOpen} />
    </div>
  )
}
