"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, Users, Calendar, DollarSign, Download, Filter, Award, AlertTriangle } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, appointments: 320, newPatients: 45 },
  { month: "Feb", revenue: 52000, appointments: 380, newPatients: 62 },
  { month: "Mar", revenue: 48000, appointments: 340, newPatients: 38 },
  { month: "Apr", revenue: 61000, appointments: 420, newPatients: 71 },
  { month: "May", revenue: 58000, appointments: 390, newPatients: 55 },
  { month: "Jun", revenue: 67000, appointments: 450, newPatients: 83 },
]

const treatmentData = [
  { name: "Cleanings", value: 35, revenue: 28000 },
  { name: "Fillings", value: 25, revenue: 22000 },
  { name: "Crowns", value: 15, revenue: 18000 },
  { name: "Root Canals", value: 10, revenue: 12000 },
  { name: "Extractions", value: 8, revenue: 6000 },
  { name: "Other", value: 7, revenue: 4000 },
]

const patientSatisfactionData = [
  { month: "Jan", satisfaction: 4.2, reviews: 28 },
  { month: "Feb", satisfaction: 4.5, reviews: 35 },
  { month: "Mar", satisfaction: 4.3, reviews: 22 },
  { month: "Apr", satisfaction: 4.7, reviews: 41 },
  { month: "May", satisfaction: 4.6, reviews: 38 },
  { month: "Jun", satisfaction: 4.8, reviews: 45 },
]

const COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#5AC8FA"]

export function AnalyticsReporting() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">Comprehensive practice insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$67,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +7.7% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +50.9% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +4.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="patient">Patient Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and appointment volume</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#007AFF" fill="#007AFF" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Treatment Distribution</CardTitle>
                <CardDescription>Most common procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={treatmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {treatmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Practice Efficiency</CardTitle>
                <CardDescription>Key operational metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Chair Utilization</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>On-Time Performance</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Treatment Acceptance</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Retention</CardTitle>
                <CardDescription>Loyalty and return rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">94%</div>
                  <p className="text-sm text-muted-foreground">Overall Retention Rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>6-Month Recall</span>
                    <Badge variant="secondary">89%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Visits</span>
                    <Badge variant="secondary">76%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Referral Rate</span>
                    <Badge variant="secondary">23%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Clinical and service quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Patient Satisfaction</span>
                    <span>4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Complication Rate</span>
                    <span>2.1%</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Recall Compliance</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Treatment</CardTitle>
                <CardDescription>Top revenue-generating procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={treatmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#007AFF" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Current month performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gross Revenue</span>
                  <span className="text-lg font-bold">$67,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Insurance Collections</span>
                  <span className="text-lg font-bold">$42,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Patient Payments</span>
                  <span className="text-lg font-bold">$25,000</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium">Net Collections</span>
                  <span className="text-lg font-bold text-primary">$63,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Collection Rate</span>
                  <Badge variant="secondary">94.8%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Outstanding Claims</CardTitle>
              <CardDescription>Insurance claims requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="font-medium">Delta Dental - Claim #12345</p>
                      <p className="text-sm text-muted-foreground">Pending for 45 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,250</p>
                    <Badge variant="outline">Follow Up</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium">Aetna - Claim #12346</p>
                      <p className="text-sm text-muted-foreground">Denied - needs resubmission</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$890</p>
                    <Badge variant="destructive">Action Required</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
                <CardDescription>Scheduling patterns and efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="appointments" stroke="#007AFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Productivity</CardTitle>
                <CardDescription>Team performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dr. Smith - Procedures/Day</span>
                    <span>12.5</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dr. Johnson - Procedures/Day</span>
                    <span>10.8</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hygienist Team - Cleanings/Day</span>
                    <span>18.2</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Optimization</CardTitle>
              <CardDescription>Appointment booking and utilization insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">87%</div>
                  <p className="text-sm text-muted-foreground">Chair Utilization</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.2%</div>
                  <p className="text-sm text-muted-foreground">No-Show Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15 min</div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction Trend</CardTitle>
                <CardDescription>Monthly satisfaction scores and review volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#007AFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age and insurance distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ages 18-35</span>
                    <span>28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ages 36-55</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ages 56+</span>
                    <span>30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Feedback</CardTitle>
              <CardDescription>Recent reviews and feedback summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 text-yellow-400 fill-current">
                          ★
                        </div>
                      ))}
                    </div>
                  </div>
                  <Badge variant="secondary">45 reviews this month</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">
                      "Excellent service and very professional staff. Dr. Smith explained everything clearly."
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">- Sarah M. (5 stars)</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">"Clean facility and minimal wait time. Highly recommend for dental care."</p>
                    <p className="text-xs text-muted-foreground mt-1">- Mike R. (5 stars)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
