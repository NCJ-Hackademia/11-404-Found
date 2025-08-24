"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  ShoppingCart,
  MessageCircle,
  TrendingUp,
  Leaf,
  IndianRupee,
  Eye,
  Edit,
  Trash2,
  LogOut,
  User,
  Shield,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { firestoreService } from "@/lib/firestore"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [myListings, setMyListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authService.getCurrentUser()
    console.log("Current User:", currentUser) // Log current user
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)

    // Load user's listings
    const loadUserListings = async () => {
      try {
        setIsLoading(true)
        const listings = await firestoreService.getUserProducts(currentUser.id)
        console.log("User listings loaded:", listings)
        setMyListings(listings)
      } catch (error) {
        console.error("Failed to load user listings:", error)
        setMyListings([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUserListings()

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
        // Reload listings when user changes
        firestoreService.getUserProducts(user.id).then(setMyListings).catch(console.error)
      }
    })

    return unsubscribe
  }, [router])

  const handleSignOut = () => {
    authService.signOut()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "SOLD":
        return "bg-blue-100 text-blue-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "IN TRANSIT":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            <svg className="w-8 h-8 text-green-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            TRUSTLIST
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/marketplace">
              <Button variant="ghost" className="font-bold">
                MARKETPLACE
              </Button>
            </Link>
            <Link href="/sell">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                <Plus className="w-4 h-4 mr-2" />
                SELL ITEM
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Image
                src={user.avatar || "/placeholder.svg?height=32&width=32&text=USER"}
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-700">{user.name}</span>
                {user.governmentIdVerified && <Shield className="w-4 h-4 text-green-600" />}
              </div>
              <div className="flex gap-1">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            WELCOME BACK, {user.name}!{user.governmentIdVerified && <span className="text-green-600"> ✓</span>}
          </h1>
          <p className="text-gray-600">HERE'S WHAT'S HAPPENING WITH YOUR ACCOUNT</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-green-600">CARBON SAVED</p>
                    <p className="text-2xl font-bold text-green-700">{user.carbonSaved.toFixed(1)} KG</p>
                  </div>
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-600">TOTAL SALES</p>
                    <p className="text-2xl font-bold text-blue-700">{user.totalSales}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
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
                    <p className="text-sm font-bold text-purple-600">PURCHASES</p>
                    <p className="text-2xl font-bold text-purple-700">{user.totalPurchases}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-purple-600" />
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
                    <p className="text-sm font-bold text-orange-600">ACTIVE CHATS</p>
                    <p className="text-2xl font-bold text-orange-700">0</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Verification Status */}
        {!user.governmentIdVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-blue-800">GET VERIFIED</h3>
                      <p className="text-blue-700 text-sm">
                        Verify your government ID to build trust and unlock premium features
                      </p>
                    </div>
                  </div>
                  <Link href="/profile?tab=verification">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">VERIFY NOW</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings" className="font-bold">
              MY LISTINGS
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-bold">
              ORDERS
            </TabsTrigger>
            <TabsTrigger value="chats" className="font-bold">
              CHATS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-bold">MY LISTINGS</CardTitle>
                  <Link href="/sell">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                      <Plus className="w-4 h-4 mr-2" />
                      ADD NEW LISTING
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                    <p className="text-gray-600">Loading your listings...</p>
                  </div>
                ) : myListings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 font-bold mb-2">NO LISTINGS YET</p>
                    <p className="text-gray-400 text-sm mb-4">Start selling by creating your first listing</p>
                    <Link href="/sell">
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                        CREATE FIRST LISTING
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={listing.image || "/placeholder.svg"}
                            alt={listing.title}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-gray-800">{listing.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-600">{listing.price.toLocaleString("en-IN")}</span>
                              <Badge className={getStatusColor(listing.status || "ACTIVE")}>
                                {listing.status || "ACTIVE"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="uppercase">{listing.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">RECENT ORDERS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders</p>
                  <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">RECENT CHATS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent chats</p>
                  <p className="text-sm text-gray-400 mt-2">Your conversations will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
