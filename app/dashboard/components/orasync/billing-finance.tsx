"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Eye,
  Plus,
  Filter,
  Building,
} from "lucide-react"

export default function BillingFinance() {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Finance</h1>
          <p className="text-muted-foreground">Manage payments, invoices, and insurance claims</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,250</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">23 unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Pending</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,750</div>
            <p className="text-xs text-muted-foreground">15 claims processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">$78K of $100K target</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments Today</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,250</div>
                <p className="text-xs text-muted-foreground">18 transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credit Card</span>
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cash</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Check</span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  patient: "Sarah Johnson",
                  amount: "$450.00",
                  method: "Credit Card",
                  status: "completed",
                  time: "2 hours ago",
                  treatment: "Routine Cleaning",
                },
                {
                  patient: "Mike Chen",
                  amount: "$1,200.00",
                  method: "Insurance + Card",
                  status: "completed",
                  time: "4 hours ago",
                  treatment: "Root Canal",
                },
                {
                  patient: "Emma Davis",
                  amount: "$750.00",
                  method: "Payment Plan",
                  status: "pending",
                  time: "1 day ago",
                  treatment: "Teeth Whitening",
                },
                {
                  patient: "John Wilson",
                  amount: "$320.00",
                  method: "Cash",
                  status: "completed",
                  time: "2 days ago",
                  treatment: "Consultation",
                },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {payment.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{payment.patient}</div>
                      <div className="text-sm text-muted-foreground">{payment.treatment}</div>
                      <div className="text-xs text-muted-foreground">{payment.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{payment.amount}</div>
                    <div className="text-sm text-muted-foreground">{payment.method}</div>
                    <Badge variant={payment.status === "completed" ? "default" : "outline"}>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input placeholder="Search invoices..." className="max-w-sm" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">133</div>
                <p className="text-xs text-muted-foreground">85% payment rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Requires follow-up</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Draft</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11</div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  id: "INV-001",
                  patient: "Sarah Johnson",
                  amount: "$450.00",
                  status: "paid",
                  dueDate: "2024-01-15",
                  treatment: "Routine Cleaning",
                },
                {
                  id: "INV-002",
                  patient: "Mike Chen",
                  amount: "$1,200.00",
                  status: "pending",
                  dueDate: "2024-01-20",
                  treatment: "Root Canal Treatment",
                },
                {
                  id: "INV-003",
                  patient: "Emma Davis",
                  amount: "$750.00",
                  status: "overdue",
                  dueDate: "2024-01-10",
                  treatment: "Teeth Whitening",
                },
                {
                  id: "INV-004",
                  patient: "John Wilson",
                  amount: "$2,400.00",
                  status: "draft",
                  dueDate: "2024-01-25",
                  treatment: "Crown Placement",
                },
              ].map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedInvoice(invoice.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.patient}</div>
                      <div className="text-xs text-muted-foreground">{invoice.treatment}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{invoice.amount}</div>
                    <div className="text-sm text-muted-foreground">Due: {invoice.dueDate}</div>
                    <Badge
                      variant={
                        invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "outline"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">84% approval rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Under review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Requires resubmission</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  claimId: "CLM-001",
                  patient: "Sarah Johnson",
                  insurance: "Delta Dental",
                  amount: "$450.00",
                  status: "approved",
                  submittedDate: "2024-01-10",
                  treatment: "Routine Cleaning",
                },
                {
                  claimId: "CLM-002",
                  patient: "Mike Chen",
                  insurance: "Aetna",
                  amount: "$1,200.00",
                  status: "pending",
                  submittedDate: "2024-01-15",
                  treatment: "Root Canal",
                },
                {
                  claimId: "CLM-003",
                  patient: "Emma Davis",
                  insurance: "Cigna",
                  amount: "$750.00",
                  status: "rejected",
                  submittedDate: "2024-01-08",
                  treatment: "Cosmetic Whitening",
                },
              ].map((claim, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{claim.claimId}</div>
                      <div className="text-sm text-muted-foreground">{claim.patient}</div>
                      <div className="text-xs text-muted-foreground">
                        {claim.insurance} • {claim.treatment}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{claim.amount}</div>
                    <div className="text-sm text-muted-foreground">Submitted: {claim.submittedDate}</div>
                    <Badge
                      variant={
                        claim.status === "approved"
                          ? "default"
                          : claim.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,670</div>
                <p className="text-xs text-muted-foreground">Recurring revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.1%</div>
                <p className="text-xs text-muted-foreground">Monthly churn</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Requires retry</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Basic Plan", price: "$29/month", members: 45, benefits: "2 cleanings, 10% discount" },
                  { name: "Family Plan", price: "$79/month", members: 32, benefits: "4 cleanings, 15% discount" },
                  { name: "Premium Plan", price: "$49/month", members: 12, benefits: "3 cleanings, whitening" },
                ].map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.benefits}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.members} members</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Membership Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { patient: "Sarah Johnson", action: "Renewed", plan: "Family Plan", date: "2 hours ago" },
                  { patient: "Mike Chen", action: "Upgraded", plan: "Premium Plan", date: "1 day ago" },
                  { patient: "Emma Davis", action: "Joined", plan: "Basic Plan", date: "2 days ago" },
                  { patient: "John Wilson", action: "Cancelled", plan: "Basic Plan", date: "3 days ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {activity.patient
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{activity.patient}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.action} {activity.plan}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.date}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$78,450</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">Above industry average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$425</div>
                <p className="text-xs text-muted-foreground">Per patient visit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Insurance Mix</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground">Insurance vs private pay</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mb-4" />
                  <div className="text-center">
                    <p>Revenue chart would be displayed here</p>
                    <p className="text-sm">Showing monthly trends and projections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Daily Production Report", description: "Today's revenue breakdown" },
                  { name: "Outstanding Balances", description: "Unpaid invoices and aging" },
                  { name: "Insurance Analysis", description: "Claims performance by carrier" },
                  { name: "Payment Method Report", description: "Transaction types and fees" },
                  { name: "Membership Revenue", description: "Recurring revenue analysis" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-muted-foreground">{report.description}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
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
