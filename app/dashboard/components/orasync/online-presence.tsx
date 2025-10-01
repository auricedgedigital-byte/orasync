"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Globe,
  Search,
  Share2,
  Eye,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Edit,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react"

const seoMetrics = [
  { keyword: "dentist near me", position: 3, searches: 2400, difficulty: "Medium" },
  { keyword: "dental cleaning", position: 7, searches: 1800, difficulty: "Low" },
  { keyword: "teeth whitening", position: 12, searches: 3200, difficulty: "High" },
  { keyword: "emergency dentist", position: 5, searches: 1600, difficulty: "Medium" },
]

const socialMetrics = [
  { platform: "Facebook", followers: 1250, engagement: "4.2%", posts: 12 },
  { platform: "Instagram", followers: 890, engagement: "6.8%", posts: 18 },
  { platform: "Google My Business", reviews: 127, rating: 4.8, views: 3400 },
]

const leadSources = [
  { source: "Website Contact Form", leads: 23, conversion: "12%" },
  { source: "Online Booking", leads: 45, conversion: "28%" },
  { source: "Google My Business", leads: 18, conversion: "15%" },
  { source: "Social Media", leads: 12, conversion: "8%" },
]

export function OnlinePresence() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Online Presence</h1>
          <p className="text-muted-foreground">Manage your digital presence and lead capture</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Website
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Search Ranking</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#3</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Avg. position improved
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex items-center text-xs text-muted-foreground">127 total reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +24% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="website" className="space-y-4">
        <TabsList>
          <TabsTrigger value="website">Website Builder</TabsTrigger>
          <TabsTrigger value="seo">SEO & Local Search</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="leads">Lead Capture</TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Website Preview</CardTitle>
                <CardDescription>Your current website appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">Bright Smile Dental</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Book Now
                        </Button>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-xl font-bold mb-2">Your Perfect Smile Awaits</h2>
                        <p className="text-sm text-muted-foreground">
                          Professional dental care in a comfortable environment
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">General Dentistry</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">Cosmetic Dentistry</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">Emergency Care</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="secondary">Live</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </Button>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Settings</CardTitle>
                <CardDescription>Update your website information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Name</label>
                  <Input defaultValue="Bright Smile Dental" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input defaultValue="123 Main St, Anytown, ST 12345" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hours</label>
                  <Textarea defaultValue="Mon-Fri: 8AM-6PM&#10;Sat: 9AM-3PM&#10;Sun: Closed" rows={3} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Online Booking</label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Website Performance</CardTitle>
              <CardDescription>Analytics and optimization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">95</div>
                  <p className="text-sm text-muted-foreground">Page Speed Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.3s</div>
                  <p className="text-sm text-muted-foreground">Load Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <p className="text-sm text-muted-foreground">Mobile Friendly</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <p className="text-sm text-muted-foreground">SEO Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Keyword Rankings</CardTitle>
                <CardDescription>Your search engine positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoMetrics.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{keyword.keyword}</p>
                        <p className="text-sm text-muted-foreground">{keyword.searches} monthly searches</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">#{keyword.position}</div>
                        <Badge
                          variant={
                            keyword.difficulty === "Low"
                              ? "secondary"
                              : keyword.difficulty === "Medium"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {keyword.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local SEO</CardTitle>
                <CardDescription>Google My Business optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completeness</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Review Response Rate</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Photo Engagement</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Views</span>
                    <span className="text-lg font-bold">3,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Direction Requests</span>
                    <span className="text-lg font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Phone Calls</span>
                    <span className="text-lg font-bold">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SEO Recommendations</CardTitle>
              <CardDescription>Improve your search rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Add more patient testimonials</p>
                    <p className="text-sm text-muted-foreground">Fresh reviews improve local search rankings</p>
                  </div>
                  <Badge variant="destructive">High Priority</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Optimize service pages</p>
                    <p className="text-sm text-muted-foreground">Add more content about specific treatments</p>
                  </div>
                  <Badge variant="secondary">Medium Priority</Badge>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Update business hours</p>
                    <p className="text-sm text-muted-foreground">Ensure consistency across all platforms</p>
                  </div>
                  <Badge variant="outline">Low Priority</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {socialMetrics.map((platform, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    {platform.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {platform.followers && (
                    <div className="flex justify-between">
                      <span className="text-sm">Followers</span>
                      <span className="font-medium">{platform.followers.toLocaleString()}</span>
                    </div>
                  )}
                  {platform.engagement && (
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement</span>
                      <span className="font-medium">{platform.engagement}</span>
                    </div>
                  )}
                  {platform.posts && (
                    <div className="flex justify-between">
                      <span className="text-sm">Posts This Month</span>
                      <span className="font-medium">{platform.posts}</span>
                    </div>
                  )}
                  {platform.reviews && (
                    <div className="flex justify-between">
                      <span className="text-sm">Reviews</span>
                      <span className="font-medium">{platform.reviews}</span>
                    </div>
                  )}
                  {platform.rating && (
                    <div className="flex justify-between">
                      <span className="text-sm">Rating</span>
                      <span className="font-medium">{platform.rating}/5</span>
                    </div>
                  )}
                  {platform.views && (
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Views</span>
                      <span className="font-medium">{platform.views.toLocaleString()}</span>
                    </div>
                  )}
                  <Button size="sm" className="w-full">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
              <CardDescription>Scheduled and suggested posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">National Dental Hygiene Month</p>
                      <p className="text-sm text-muted-foreground">Scheduled for Oct 1, 2024</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Patient Testimonial Feature</p>
                      <p className="text-sm text-muted-foreground">Suggested for this week</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Teeth Whitening Tips</p>
                      <p className="text-sm text-muted-foreground">Educational content idea</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Where your leads are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leadSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{source.source}</p>
                        <p className="text-sm text-muted-foreground">Conversion: {source.conversion}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{source.leads}</div>
                        <p className="text-sm text-muted-foreground">leads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Forms</CardTitle>
                <CardDescription>Manage your lead capture forms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">General Contact Form</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Appointment Request</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Emergency Contact</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Insurance Verification</span>
                    <Switch />
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Form Performance</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Form Views</span>
                      <span>1,247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Submissions</span>
                      <span>98</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span>7.9%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest inquiries and contact requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Appointment request - Cleaning</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">New</Badge>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mike Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Emergency consultation request</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Contacted</Badge>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Emily Chen</p>
                      <p className="text-sm text-muted-foreground">Insurance verification inquiry</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Scheduled</Badge>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
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
