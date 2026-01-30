"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Plus, Edit2, Trash2, AlertCircle } from "@/components/icons"
import { AppointmentForm, type AppointmentFormData } from "./appointment-form"
import MetricCard from "@/components/kokonutui/metric-card"

interface Appointment extends AppointmentFormData {
  id: string
}

export default function Appointments() {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patient: "John Smith",
      time: "9:00 AM",
      type: "Cleaning",
      status: "confirmed",
      phone: "(555) 123-4567",
      date: new Date().toISOString().split("T")[0],
      provider: "Dr. Sarah Mitchell",
      notes: "Regular cleaning and checkup",
    },
    {
      id: "2",
      patient: "Sarah Johnson",
      time: "10:30 AM",
      type: "Root Canal",
      status: "confirmed",
      phone: "(555) 234-5678",
      date: new Date().toISOString().split("T")[0],
      provider: "Dr. James Wilson",
      notes: "Follow-up root canal treatment",
    },
    {
      id: "3",
      patient: "Mike Chen",
      time: "2:00 PM",
      type: "Consultation",
      status: "pending",
      phone: "(555) 345-6789",
      date: new Date().toISOString().split("T")[0],
      provider: "Dr. Sarah Mitchell",
      notes: "Initial consultation for whitening",
    },
    {
      id: "4",
      patient: "Emma Davis",
      time: "3:30 PM",
      type: "Filling",
      status: "confirmed",
      phone: "(555) 456-7890",
      date: new Date().toISOString().split("T")[0],
      provider: "Hygienist Lisa Brown",
      notes: "Cavity filling - tooth #14",
    },
  ])

  const handleNewAppointment = () => {
    setEditingId(null)
    setFormOpen(true)
  }

  const handleEditAppointment = (id: string) => {
    setEditingId(id)
    setFormOpen(true)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
  }

  const handleFormSubmit = (formData: AppointmentFormData) => {
    if (editingId) {
      setAppointments(appointments.map((apt) => (apt.id === editingId ? { ...apt, ...formData } : apt)))
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
      }
      setAppointments([...appointments, newAppointment])
    }
  }

  const todayDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "confirmed").length}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "pending").length}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Today's Appointments</h4>
        {appointments.map((apt, i) => (
          <div key={i} className="p-3 rounded-lg border text-sm">
            <div className="font-medium">
              {apt.time} - {apt.patient}
            </div>
            <div className="text-muted-foreground">{apt.type}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const noShowsDetails = (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">This Month</p>
        <p className="text-2xl font-bold">2</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">No-Show Records</h4>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">John Doe - Oct 10</div>
          <div className="text-muted-foreground">Cleaning appointment</div>
        </div>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">Jane Smith - Oct 15</div>
          <div className="text-muted-foreground">Root canal follow-up</div>
        </div>
      </div>
    </div>
  )

  const cancellationsDetails = (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">This Month</p>
        <p className="text-2xl font-bold">3</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Cancelled Appointments</h4>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">Robert Johnson - Oct 12</div>
          <div className="text-muted-foreground">Patient requested reschedule</div>
        </div>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">Lisa Anderson - Oct 14</div>
          <div className="text-muted-foreground">Emergency cancellation</div>
        </div>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">David Martinez - Oct 18</div>
          <div className="text-muted-foreground">Rescheduled to next week</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Button size="sm" onClick={handleNewAppointment}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Appointments"
          value={appointments.length}
          subtitle={`${appointments.filter((a) => a.status === "pending").length} pending confirmations`}
          icon={Calendar}
          detailsContent={todayDetails}
          onClick={() => setActiveTab("list")}
        />

        <MetricCard
          title="This Week"
          value={appointments.length * 8}
          subtitle="Estimated"
          icon={Calendar}
          detailsContent={todayDetails}
          onClick={() => setActiveTab("schedule")}
        />

        <MetricCard
          title="No-Shows"
          value="2"
          subtitle="This month"
          icon={AlertCircle}
          detailsContent={noShowsDetails}
          onClick={() => setActiveTab("list")}
        />

        <MetricCard
          title="Cancellations"
          value="3"
          subtitle="This month"
          icon={AlertCircle}
          detailsContent={cancellationsDetails}
          onClick={() => setActiveTab("list")}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground border rounded-lg">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Interactive calendar view would be displayed here</p>
                  <p className="text-sm">Drag and drop appointments to reschedule</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{appointment.patient}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {appointment.time} • {appointment.type}
                        </div>
                        {appointment.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{appointment.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditAppointment(appointment.id)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAppointment(appointment.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No appointments scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Dr. Sarah Mitchell", "Dr. James Wilson", "Hygienist Lisa Brown"].map((provider) => (
                  <div key={provider} className="border rounded-lg p-4">
                    <div className="font-medium mb-3">{provider}</div>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const hasAppointment = appointments.some(
                          (apt) => apt.provider === provider && apt.time === `${9 + i}:00 AM`,
                        )
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded text-xs text-center cursor-pointer transition-colors ${
                              hasAppointment
                                ? "bg-primary text-primary-foreground font-medium"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                          >
                            {9 + i}:00
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AppointmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingId ? appointments.find((apt) => apt.id === editingId) : undefined}
        isEditing={!!editingId}
      />
    </div>
  )
}
