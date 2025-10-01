"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  FileText,
  UserCheck,
  Clock,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Building,
  Stethoscope,
} from "lucide-react"

export default function PracticeOperations() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Practice Operations</h1>
          <p className="text-muted-foreground">Manage appointments, patients, and treatment plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Building className="w-4 h-4 mr-2" />
            Multi-Location
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patient CRM</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
          <TabsTrigger value="forms">Digital Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 pending confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">85% capacity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    time: "9:00 AM",
                    patient: "Sarah Johnson",
                    treatment: "Routine Cleaning",
                    duration: "60 min",
                    status: "confirmed",
                    doctor: "Dr. Smith",
                  },
                  {
                    time: "10:30 AM",
                    patient: "Mike Chen",
                    treatment: "Root Canal Treatment",
                    duration: "90 min",
                    status: "in-progress",
                    doctor: "Dr. Smith",
                  },
                  {
                    time: "12:30 PM",
                    patient: "Emma Davis",
                    treatment: "Teeth Whitening",
                    duration: "45 min",
                    status: "confirmed",
                    doctor: "Dr. Johnson",
                  },
                  {
                    time: "2:00 PM",
                    patient: "John Wilson",
                    treatment: "Crown Placement",
                    duration: "75 min",
                    status: "pending",
                    doctor: "Dr. Smith",
                  },
                ].map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-muted-foreground min-w-[80px]">{appointment.time}</div>
                      <div className="flex-1">
                        <div className="font-medium">{appointment.patient}</div>
                        <div className="text-sm text-muted-foreground">{appointment.treatment}</div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.duration} • {appointment.doctor}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "default"
                            : appointment.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Find Available Slots
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Manage Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,923</div>
                <p className="text-xs text-muted-foreground">Visited in last 12 months</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Visits</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Need follow-up</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input placeholder="Search patients..." className="max-w-sm" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Sarah Johnson",
                    email: "sarah.j@email.com",
                    phone: "(555) 123-4567",
                    lastVisit: "2024-01-15",
                    nextAppointment: "2024-02-15",
                    status: "active",
                  },
                  {
                    name: "Mike Chen",
                    email: "mike.chen@email.com",
                    phone: "(555) 234-5678",
                    lastVisit: "2024-01-20",
                    nextAppointment: "2024-02-20",
                    status: "treatment",
                  },
                  {
                    name: "Emma Davis",
                    email: "emma.davis@email.com",
                    phone: "(555) 345-6789",
                    lastVisit: "2023-11-10",
                    nextAppointment: null,
                    status: "overdue",
                  },
                ].map((patient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedPatient(patient.name)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          patient.status === "active"
                            ? "default"
                            : patient.status === "treatment"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {patient.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last: {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPatient ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Patient ID: #12345</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Contact</label>
                        <div className="text-sm text-muted-foreground">
                          <div>sarah.j@email.com</div>
                          <div>(555) 123-4567</div>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <div className="text-sm text-muted-foreground">123 Main St, City, ST 12345</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Insurance</label>
                        <div className="text-sm text-muted-foreground">Delta Dental - Active</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Visit</label>
                        <div className="text-sm text-muted-foreground">January 15, 2024</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Appointment
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Records
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a patient to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Awaiting patient</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,200</div>
                <p className="text-xs text-muted-foreground">Active plans</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  patient: "Sarah Johnson",
                  treatment: "Comprehensive Orthodontic Treatment",
                  phases: 3,
                  currentPhase: 1,
                  totalCost: "$4,500",
                  status: "active",
                  startDate: "2024-01-15",
                },
                {
                  patient: "Mike Chen",
                  treatment: "Full Mouth Reconstruction",
                  phases: 4,
                  currentPhase: 2,
                  totalCost: "$12,000",
                  status: "active",
                  startDate: "2023-12-01",
                },
                {
                  patient: "Emma Davis",
                  treatment: "Implant and Crown Placement",
                  phases: 2,
                  currentPhase: 0,
                  totalCost: "$3,200",
                  status: "pending",
                  startDate: "2024-02-01",
                },
              ].map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {plan.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{plan.patient}</div>
                      <div className="text-sm text-muted-foreground">{plan.treatment}</div>
                      <div className="text-xs text-muted-foreground">
                        Phase {plan.currentPhase} of {plan.phases} • Started {plan.startDate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{plan.totalCost}</div>
                    <Badge variant={plan.status === "active" ? "default" : "outline"}>{plan.status}</Badge>
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forms Completed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Awaiting completion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Digital Signatures</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Average completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "New Patient Intake Form", completions: 45, avgTime: "8 min" },
                  { name: "Medical History Update", completions: 23, avgTime: "5 min" },
                  { name: "Consent for Treatment", completions: 67, avgTime: "3 min" },
                  { name: "Insurance Information", completions: 34, avgTime: "4 min" },
                  { name: "Post-Treatment Feedback", completions: 89, avgTime: "2 min" },
                ].map((form, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium text-sm">{form.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {form.completions} completions • Avg: {form.avgTime}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    patient: "Sarah Johnson",
                    form: "New Patient Intake",
                    status: "completed",
                    time: "2 hours ago",
                  },
                  {
                    patient: "Mike Chen",
                    form: "Consent for Treatment",
                    status: "completed",
                    time: "4 hours ago",
                  },
                  {
                    patient: "Emma Davis",
                    form: "Medical History Update",
                    status: "pending",
                    time: "1 day ago",
                  },
                  {
                    patient: "John Wilson",
                    form: "Insurance Information",
                    status: "completed",
                    time: "2 days ago",
                  },
                ].map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {submission.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{submission.patient}</div>
                        <div className="text-xs text-muted-foreground">{submission.form}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={submission.status === "completed" ? "default" : "outline"}>
                        {submission.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{submission.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
