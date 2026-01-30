"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Clock, DollarSign, FileText, Plus, Search } from "lucide-react"

export function BillingClaims() {
  const [activeTab, setActiveTab] = useState("invoices")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)

  // Mock data for invoices
  const invoices = [
    { id: "INV-001", patient: "John Smith", amount: 450, date: "2024-01-15", status: "paid", dueDate: "2024-01-20" },
    {
      id: "INV-002",
      patient: "Sarah Johnson",
      amount: 320,
      date: "2024-01-14",
      status: "pending",
      dueDate: "2024-01-21",
    },
    { id: "INV-003", patient: "Mike Davis", amount: 580, date: "2024-01-13", status: "overdue", dueDate: "2024-01-10" },
    { id: "INV-004", patient: "Emily Brown", amount: 275, date: "2024-01-12", status: "paid", dueDate: "2024-01-19" },
  ]

  // Mock data for memberships
  const memberships = [
    {
      id: "MEM-001",
      patient: "John Smith",
      plan: "Premium",
      amount: 99,
      frequency: "monthly",
      status: "active",
      nextBilling: "2024-02-15",
    },
    {
      id: "MEM-002",
      patient: "Sarah Johnson",
      plan: "Standard",
      amount: 49,
      frequency: "monthly",
      status: "active",
      nextBilling: "2024-02-10",
    },
    {
      id: "MEM-003",
      patient: "Mike Davis",
      plan: "Premium",
      amount: 99,
      frequency: "monthly",
      status: "cancelled",
      nextBilling: null,
    },
  ]

  // Mock data for claims
  const claims = [
    {
      id: "CLM-001",
      patient: "John Smith",
      insurance: "Blue Cross",
      amount: 450,
      status: "submitted",
      submittedDate: "2024-01-10",
      expectedPayout: 360,
    },
    {
      id: "CLM-002",
      patient: "Sarah Johnson",
      insurance: "Aetna",
      amount: 320,
      status: "approved",
      submittedDate: "2024-01-08",
      expectedPayout: 256,
    },
    {
      id: "CLM-003",
      patient: "Mike Davis",
      insurance: "United",
      amount: 580,
      status: "denied",
      submittedDate: "2024-01-05",
      expectedPayout: 0,
    },
    {
      id: "CLM-004",
      patient: "Emily Brown",
      insurance: "Cigna",
      amount: 275,
      status: "paid",
      submittedDate: "2024-01-01",
      expectedPayout: 220,
    },
  ]

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
      case "submitted":
        return <Clock className="w-4 h-4" />
      case "overdue":
      case "denied":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$1,230</div>
            <p className="text-xs text-gray-500 mt-1">3 overdue invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">$2,376/month recurring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Claims Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$1,850</div>
            <p className="text-xs text-gray-500 mt-1">2 claims submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>Create a new invoice for a patient</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Patient</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="sarah">Sarah Johnson</SelectItem>
                        <SelectItem value="mike">Mike Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Invoice description" />
                  </div>
                  <Button className="w-full">Create Invoice</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">{invoice.patient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount}</p>
                        <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                      </div>
                      <Badge className={`gap-1 ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Memberships Tab */}
        <TabsContent value="memberships" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Recurring Memberships</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Membership
            </Button>
          </div>

          <div className="space-y-2">
            {memberships.map((membership) => (
              <Card key={membership.id} className="hover:bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{membership.patient}</p>
                        <p className="text-sm text-gray-500">
                          {membership.plan} Plan - ${membership.amount}/{membership.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Next Billing</p>
                        <p className="text-xs text-gray-500">{membership.nextBilling || "N/A"}</p>
                      </div>
                      <Badge className={getStatusColor(membership.status)}>
                        {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Insurance Claims</h3>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Submit Claim
            </Button>
          </div>

          <div className="space-y-2">
            {claims.map((claim) => (
              <Card key={claim.id} className="hover:bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{claim.patient}</p>
                        <p className="text-sm text-gray-500">
                          {claim.insurance} - Submitted {claim.submittedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">${claim.amount}</p>
                        <p className="text-xs text-gray-500">Expected: ${claim.expectedPayout}</p>
                      </div>
                      <Badge className={`gap-1 ${getStatusColor(claim.status)}`}>
                        {getStatusIcon(claim.status)}
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
