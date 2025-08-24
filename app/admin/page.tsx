"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  IndianRupee,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [pendingListings] = useState([
    {
      id: 1,
      title: 'MACBOOK PRO 16" M2 MAX',
      seller: "AMIT SHARMA",
      price: 180000,
      image: "/placeholder.svg?height=80&width=80",
      submittedAt: "2024-01-25 10:30 AM",
      category: "ELECTRONICS",
      aiScore: 95,
      flagged: false,
    },
    {
      id: 2,
      title: "HERMAN MILLER CHAIR",
      seller: "PRIYA PATEL",
      price: 45000,
      image: "/placeholder.svg?height=80&width=80",
      submittedAt: "2024-01-25 11:15 AM",
      category: "FURNITURE",
      aiScore: 88,
      flagged: false,
    },
    {
      id: 3,
      title: "CHEAP IPHONE COPY",
      seller: "SUSPICIOUS USER",
      price: 5000,
      image: "/placeholder.svg?height=80&width=80",
      submittedAt: "2024-01-25 12:00 PM",
      category: "ELECTRONICS",
      aiScore: 25,
      flagged: true,
    },
  ])

  const [stats] = useState({
    totalListings: 1247,
    pendingReview: 23,
    approvedToday: 45,
    rejectedToday: 8,
    totalUsers: 5632,
    activeUsers: 892,
    totalRevenue: 2847500,
    monthlyGrowth: 23.5,
  })

  const handleApprove = (id: number) => {
    console.log("Approved listing:", id)
  }

  const handleReject = (id: number) => {
    console.log("Rejected listing:", id)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            TRUSTLIST ADMIN
          </Link>

          <div className="flex items-center gap-4">
            <Badge className="bg-red-100 text-red-800">{stats.pendingReview} PENDING</Badge>
            <Link href="/dashboard">
              <Button variant="ghost" className="font-bold">
                DASHBOARD
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ADMIN PANEL</h1>
          <p className="text-gray-600">MANAGE LISTINGS, USERS, AND PLATFORM OPERATIONS</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-600">TOTAL LISTINGS</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalListings.toLocaleString()}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-green-600">ACTIVE USERS</p>
                    <p className="text-2xl font-bold text-green-700">{stats.activeUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-purple-600">MONTHLY REVENUE</p>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-purple-700" />
                      <p className="text-2xl font-bold text-purple-700">{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-orange-600">PENDING REVIEW</p>
                    <p className="text-2xl font-bold text-orange-700">{stats.pendingReview}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings" className="font-bold">
              PENDING LISTINGS
            </TabsTrigger>
            <TabsTrigger value="users" className="font-bold">
              USER MANAGEMENT
            </TabsTrigger>
            <TabsTrigger value="reports" className="font-bold">
              REPORTS
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-bold">
              ANALYTICS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-bold">PENDING LISTINGS REVIEW</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="SEARCH LISTINGS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      FILTER
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border rounded-lg ${listing.flagged ? "border-red-200 bg-red-50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={listing.image || "/placeholder.svg"}
                            alt={listing.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800">{listing.title}</h3>
                              {listing.flagged && (
                                <Badge className="bg-red-100 text-red-800">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  FLAGGED
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-600">{listing.price.toLocaleString("en-IN")}</span>
                              <Badge className={getScoreBadge(listing.aiScore)}>AI SCORE: {listing.aiScore}%</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>SELLER: {listing.seller}</span>
                              <span>CATEGORY: {listing.category}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {listing.submittedAt}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            REVIEW
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(listing.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            APPROVE
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-200 bg-transparent"
                            onClick={() => handleReject(listing.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            REJECT
                          </Button>
                        </div>
                      </div>

                      {listing.flagged && (
                        <div className="mt-3 p-3 bg-red-100 rounded-lg">
                          <h4 className="font-bold text-red-800 mb-1">AI FLAGGED ISSUES:</h4>
                          <ul className="text-sm text-red-700 list-disc list-inside">
                            <li>SUSPICIOUS PRICING (TOO LOW FOR CATEGORY)</li>
                            <li>POOR IMAGE QUALITY DETECTED</li>
                            <li>SELLER ACCOUNT RECENTLY CREATED</li>
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">USER MANAGEMENT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">USER MANAGEMENT PANEL</p>
                  <p className="text-gray-400">MANAGE USER ACCOUNTS, VERIFICATIONS, AND RESTRICTIONS</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">REPORTS & DISPUTES</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">REPORTS MANAGEMENT</p>
                  <p className="text-gray-400">HANDLE USER REPORTS, DISPUTES, AND POLICY VIOLATIONS</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">PLATFORM ANALYTICS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">ANALYTICS DASHBOARD</p>
                  <p className="text-gray-400">VIEW DETAILED PLATFORM METRICS AND INSIGHTS</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
