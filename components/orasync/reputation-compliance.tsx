"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Shield,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  FileText,
  Eye,
  Calendar,
} from "lucide-react"

const recentReviews = [
  {
    platform: "Google",
    author: "Sarah M.",
    rating: 5,
    text: "Excellent service and very professional staff. Dr. Smith explained everything clearly and made me feel comfortable throughout the procedure.",
    date: "2 days ago",
    responded: true,
  },
  {
    platform: "Yelp",
    author: "Mike R.",
    rating: 4,
    text: "Great dental office with modern equipment. Only minor complaint is the wait time, but the quality of care makes up for it.",
    date: "5 days ago",
    responded: false,
  },
  {
    platform: "Facebook",
    author: "Emily C.",
    rating: 5,
    text: "I've been coming here for years and they never disappoint. Highly recommend for anyone looking for quality dental care.",
    date: "1 week ago",
    responded: true,
  },
]

const complianceItems = [
  {
    category: "HIPAA",
    item: "Staff Training Completion",
    status: "compliant",
    dueDate: "Annual - Next due: Jan 2025",
    progress: 100,
  },
  {
    category: "HIPAA",
    item: "Risk Assessment",
    status: "compliant",
    dueDate: "Annual - Next due: Mar 2025",
    progress: 100,
  },
  {
    category: "OSHA",
    item: "Bloodborne Pathogen Training",
    status: "due-soon",
    dueDate: "Due: Nov 15, 2024",
    progress: 75,
  },
  {
    category: "State Board",
    item: "License Renewal",
    status: "compliant",
    dueDate: "Next renewal: Jun 2025",
    progress: 100,
  },
  {
    category: "DEA",
    item: "Controlled Substance Registration",
    status: "action-required",
    dueDate: "Overdue: Oct 1, 2024",
    progress: 0,
  },
]

const auditLog = [
  {
    action: "Patient record accessed",
    user: "Dr. Smith",
    timestamp: "2024-10-15 14:30:22",
    details: "Viewed patient #1234 treatment history",
  },
  {
    action: "HIPAA form updated",
    user: "Admin",
    timestamp: "2024-10-15 09:15:10",
    details: "Updated privacy notice template",
  },
  {
    action: "Staff training completed",
    user: "Sarah Johnson, RDH",
    timestamp: "2024-10-14 16:45:33",
    details: "Completed HIPAA refresher course",
  },
]

export function ReputationCompliance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reputation & Compliance</h1>
          <p className="text-muted-foreground">Manage reviews, maintain compliance, and protect your practice</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8 this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">Within 24 hours</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center text-xs text-yellow-600">
              <AlertTriangle className="h-3 w-3 mr-1" />2 items need attention
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Review Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
          <TabsTrigger value="hipaa">HIPAA & Security</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Review Summary</CardTitle>
                <CardDescription>Rating distribution across platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>5 Stars</span>
                    <span>89 reviews</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>4 Stars</span>
                    <span>28 reviews</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>3 Stars</span>
                    <span>7 reviews</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>2 Stars</span>
                    <span>2 reviews</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>1 Star</span>
                    <span>1 review</span>
                  </div>
                  <Progress value={1} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Reviews by platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Google My Business</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">4.9 (78 reviews)</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Yelp</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">4.6 (32 reviews)</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Facebook</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">4.8 (17 reviews)</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Average</span>
                    <span className="text-lg font-bold text-primary">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest patient feedback requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{review.platform}</Badge>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">by {review.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.responded ? (
                          <Badge variant="secondary">Responded</Badge>
                        ) : (
                          <Badge variant="destructive">Needs Response</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{review.text}</p>
                    {!review.responded && (
                      <div className="flex gap-2">
                        <Button size="sm">Respond</Button>
                        <Button size="sm" variant="outline">
                          Template Response
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>Track regulatory requirements and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.status === "compliant"
                            ? "bg-green-500"
                            : item.status === "due-soon"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="font-medium">{item.item}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress value={item.progress} className="h-2" />
                      </div>
                      <Badge
                        variant={
                          item.status === "compliant"
                            ? "secondary"
                            : item.status === "due-soon"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {item.status === "compliant"
                          ? "Compliant"
                          : item.status === "due-soon"
                            ? "Due Soon"
                            : "Action Required"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Important dates to remember</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="font-medium">OSHA Training</p>
                      <p className="text-sm text-muted-foreground">Bloodborne Pathogen</p>
                    </div>
                  </div>
                  <Badge variant="default">Nov 15</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium">DEA Registration</p>
                      <p className="text-sm text-muted-foreground">Controlled Substances</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">HIPAA Training</p>
                      <p className="text-sm text-muted-foreground">Annual Refresher</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Jan 2025</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
                <CardDescription>Overall regulatory compliance status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">92%</div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>HIPAA Compliance</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>OSHA Standards</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>State Regulations</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hipaa" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>HIPAA Security</CardTitle>
                <CardDescription>Privacy and security measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Encryption</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Access Controls</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary">Configured</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit Logging</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Backup & Recovery</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Badge variant="secondary">Daily</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Staff Training</span>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <Badge variant="default">Due Soon</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Security vulnerabilities and risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Low Risk</div>
                  <p className="text-sm text-muted-foreground">Last assessment: Sep 2024</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Physical Safeguards</span>
                    <Badge variant="secondary">Compliant</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Administrative Safeguards</span>
                    <Badge variant="secondary">Compliant</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Technical Safeguards</span>
                    <Badge variant="default">Minor Issues</Badge>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  Run New Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Notices & Forms</CardTitle>
              <CardDescription>Manage HIPAA documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Notice of Privacy Practices</p>
                      <p className="text-sm text-muted-foreground">Last updated: Jan 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Authorization Forms</p>
                      <p className="text-sm text-muted-foreground">Treatment & payment consent</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Business Associate Agreements</p>
                      <p className="text-sm text-muted-foreground">Third-party vendor contracts</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Audit Log</CardTitle>
              <CardDescription>Track all system access and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map((log, index) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {log.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline">Load More Entries</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Statistics</CardTitle>
                <CardDescription>User activity summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Logins Today</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patient Records Accessed</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Login Attempts</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Exports</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>Recent security events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 border rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">System backup completed</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Multiple failed logins detected</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Security patch applied</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
