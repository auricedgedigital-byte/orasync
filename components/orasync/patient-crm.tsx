"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, Plus, Mail, Phone, Calendar, TrendingUp, Heart, Edit2, Trash2 } from "@/components/icons"
import { PatientForm, type PatientFormData } from "./patient-form"
import { PatientDetail } from "./patient-detail"
import MetricCard from "@/components/kokonutui/metric-card"

interface Patient extends PatientFormData {
  id: string
  lastVisit?: string
  status: "active" | "inactive" | "vip"
}

export default function PatientCRM() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "vip">("all")
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, City, State",
      dateOfBirth: "1980-05-15",
      insurance: "Delta Dental",
      status: "vip",
      notes: "Regular patient, excellent compliance",
      lastVisit: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, City, State",
      dateOfBirth: "1985-08-22",
      insurance: "Cigna",
      status: "active",
      notes: "New patient, referred by John Smith",
      lastVisit: "2024-01-10",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "(555) 345-6789",
      address: "789 Pine Rd, City, State",
      dateOfBirth: "1990-03-10",
      insurance: "Aetna",
      status: "active",
      notes: "Needs crown replacement",
      lastVisit: "2023-12-20",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 456-7890",
      address: "321 Elm St, City, State",
      dateOfBirth: "1988-11-05",
      insurance: "United Healthcare",
      status: "inactive",
      notes: "Hasn't visited in 6 months",
      lastVisit: "2023-07-15",
    },
  ])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    const matchesFilter = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setFormOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormOpen(true)
  }

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id))
  }

  const handleFormSubmit = (formData: PatientFormData) => {
    if (selectedPatient) {
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? { ...p, ...formData } : p)))
    } else {
      const newPatient: Patient = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
        lastVisit: new Date().toISOString().split("T")[0],
      }
      setPatients([...patients, newPatient])
    }
  }

  const activeCount = patients.filter((p) => p.status === "active").length
  const vipCount = patients.filter((p) => p.status === "vip").length
  const inactiveCount = patients.filter((p) => p.status === "inactive").length

  const totalPatientsDetails = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold">{inactiveCount}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">All Patients</h4>
        {patients.map((patient) => (
          <div key={patient.id} className="p-3 rounded-lg border text-sm">
            <div className="font-medium">{patient.name}</div>
            <div className="text-muted-foreground">{patient.email}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const vipPatientsDetails = (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">Premium Members</p>
        <p className="text-2xl font-bold">{vipCount}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">VIP Patients</h4>
        {patients
          .filter((p) => p.status === "vip")
          .map((patient) => (
            <div key={patient.id} className="p-3 rounded-lg border text-sm">
              <div className="font-medium">{patient.name}</div>
              <div className="text-muted-foreground">{patient.email}</div>
              <div className="text-xs text-muted-foreground mt-1">Last visit: {patient.lastVisit}</div>
            </div>
          ))}
      </div>
    </div>
  )

  const inactivePatientsDetails = (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">Need Follow-up</p>
        <p className="text-2xl font-bold">{inactiveCount}</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">Inactive Patients</h4>
        {patients
          .filter((p) => p.status === "inactive")
          .map((patient) => (
            <div key={patient.id} className="p-3 rounded-lg border text-sm">
              <div className="font-medium">{patient.name}</div>
              <div className="text-muted-foreground">{patient.email}</div>
              <div className="text-xs text-muted-foreground mt-1">Last visit: {patient.lastVisit}</div>
            </div>
          ))}
      </div>
    </div>
  )

  const growthDetails = (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">Growth This Month</p>
        <p className="text-2xl font-bold">+12%</p>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold">New Patients Added</h4>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">Sarah Johnson</div>
          <div className="text-muted-foreground">Added Oct 10</div>
        </div>
        <div className="p-3 rounded-lg border text-sm">
          <div className="font-medium">Mike Chen</div>
          <div className="text-muted-foreground">Added Oct 5</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient CRM</h1>
          <p className="text-muted-foreground">Manage and track patient information</p>
        </div>
        <Button size="sm" onClick={handleAddPatient}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Patients"
          value={patients.length}
          subtitle={`${activeCount} active`}
          icon={Users}
          detailsContent={totalPatientsDetails}
          onClick={() => setFilterStatus("all")}
        />

        <MetricCard
          title="VIP Patients"
          value={vipCount}
          subtitle="Premium members"
          icon={Heart}
          detailsContent={vipPatientsDetails}
          onClick={() => setFilterStatus("vip")}
        />

        <MetricCard
          title="Inactive"
          value={inactiveCount}
          subtitle="Need follow-up"
          icon={Calendar}
          detailsContent={inactivePatientsDetails}
          onClick={() => setFilterStatus("inactive")}
        />

        <MetricCard
          title="Growth"
          value="+12%"
          subtitle="This month"
          icon={TrendingUp}
          detailsContent={growthDetails}
          onClick={() => setFilterStatus("active")}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Patient List</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(v) => setFilterStatus(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({patients.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="vip">VIP ({vipCount})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filterStatus} className="space-y-4 mt-4">
              {filteredPatients.length > 0 ? (
                <div className="space-y-3">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={patient.status === "vip" ? "default" : "secondary"}>{patient.status}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => handleEditPatient(patient)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeletePatient(patient.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No patients found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PatientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedPatient || undefined}
        isEditing={!!selectedPatient}
      />

      {selectedPatient && (
        <PatientDetail
          open={!!selectedPatient}
          onOpenChange={(open) => !open && setSelectedPatient(null)}
          patient={selectedPatient}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
        />
      )}
    </div>
  )
}
