"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  Filter,
  Heart,
  MapPin,
  IndianRupee,
  Star,
  ArrowLeft,
  Grid3X3,
  List,
  Loader2,
  ShoppingCart,
  Shield,
  Bot,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { cartService } from "@/lib/cart"

interface Product {
  id: number
  title: string
  price: number
  originalPrice: number
  image: string
  location: string
  seller: string
  rating: number
  condition: string
  category: string
  carbonSaved: number
  verified: boolean
  featured: boolean
  views: number
  aiVerified: boolean
  humanVerified: boolean
  verificationScore: number
  trustScore: number
  sellerRating: number
  totalSales: number
  responseTime: string
  lastActive: string
}

export default function BuyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [cartCount, setCartCount] = useState(0)

  const categories = [
    { value: "all", label: "ALL CATEGORIES" },
    { value: "electronics", label: "ELECTRONICS" },
    { value: "furniture", label: "FURNITURE" },
    { value: "appliances", label: "APPLIANCES" },
    { value: "fashion", label: "FASHION" },
    { value: "books", label: "BOOKS" },
    { value: "sports", label: "SPORTS" },
    { value: "automotive", label: "AUTOMOTIVE" },
  ]

  const locations = [
    { value: "all", label: "ALL LOCATIONS" },
    { value: "mumbai", label: "MUMBAI" },
    { value: "delhi", label: "DELHI" },
    { value: "bangalore", label: "BANGALORE" },
    { value: "pune", label: "PUNE" },
    { value: "chennai", label: "CHENNAI" },
    { value: "hyderabad", label: "HYDERABAD" },
  ]

  // Mock products with verification details for investor demo
  const mockProducts: Product[] = [
    {
      id: 1,
      title: "IPHONE 14 PRO MAX - MINT CONDITION",
      price: 85000,
      originalPrice: 129900,
      image: "/placeholder.svg?height=400&width=400&text=📱iPhone",
      location: "MUMBAI",
      seller: "PRIYA SHARMA",
      rating: 4.8,
      condition: "EXCELLENT",
      category: "ELECTRONICS",
      carbonSaved: 15.2,
      verified: true,
      featured: true,
      views: 1247,
      aiVerified: true,
      humanVerified: true,
      verificationScore: 95,
      trustScore: 98,
      sellerRating: 4.9,
      totalSales: 47,
      responseTime: "< 1 hour",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      title: "HERMAN MILLER AERON CHAIR",
      price: 45000,
      originalPrice: 89000,
      image: "/placeholder.svg?height=400&width=400&text=🪑Chair",
      location: "BANGALORE",
      seller: "RAJESH KUMAR",
      rating: 4.9,
      condition: "LIKE NEW",
      category: "FURNITURE",
      carbonSaved: 25.8,
      verified: true,
      featured: false,
      views: 892,
      aiVerified: true,
      humanVerified: false,
      verificationScore: 88,
      trustScore: 92,
      sellerRating: 4.7,
      totalSales: 23,
      responseTime: "< 2 hours",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      title: 'MACBOOK PRO 16" M2 MAX',
      price: 180000,
      originalPrice: 249900,
      image: "/placeholder.svg?height=400&width=400&text=💻MacBook",
      location: "DELHI",
      seller: "ANITA PATEL",
      rating: 4.7,
      condition: "EXCELLENT",
      category: "ELECTRONICS",
      carbonSaved: 35.4,
      verified: true,
      featured: true,
      views: 2156,
      aiVerified: true,
      humanVerified: true,
      verificationScore: 96,
      trustScore: 97,
      sellerRating: 4.8,
      totalSales: 31,
      responseTime: "< 30 min",
      lastActive: "30 min ago",
    },
    {
      id: 4,
      title: "SONY WH-1000XM4 HEADPHONES",
      price: 15000,
      originalPrice: 29990,
      image: "/placeholder.svg?height=400&width=400&text=🎧Headphones",
      location: "PUNE",
      seller: "AMIT SINGH",
      rating: 4.6,
      condition: "GOOD",
      category: "ELECTRONICS",
      carbonSaved: 8.5,
      verified: true,
      featured: false,
      views: 543,
      aiVerified: true,
      humanVerified: false,
      verificationScore: 82,
      trustScore: 85,
      sellerRating: 4.5,
      totalSales: 15,
      responseTime: "< 3 hours",
      lastActive: "4 hours ago",
    },
    {
      id: 5,
      title: "IKEA DINING TABLE SET",
      price: 12000,
      originalPrice: 25000,
      image: "/placeholder.svg?height=400&width=400&text=🍽️Table",
      location: "CHENNAI",
      seller: "MEERA REDDY",
      rating: 4.4,
      condition: "GOOD",
      category: "FURNITURE",
      carbonSaved: 18.3,
      verified: true,
      featured: false,
      views: 321,
      aiVerified: false,
      humanVerified: true,
      verificationScore: 78,
      trustScore: 81,
      sellerRating: 4.3,
      totalSales: 8,
      responseTime: "< 4 hours",
      lastActive: "6 hours ago",
    },
    {
      id: 6,
      title: "CANON EOS R5 CAMERA",
      price: 220000,
      originalPrice: 349900,
      image: "/placeholder.svg?height=400&width=400&text=📷Camera",
      location: "HYDERABAD",
      seller: "VIKRAM SHAH",
      rating: 4.9,
      condition: "LIKE NEW",
      category: "ELECTRONICS",
      carbonSaved: 42.1,
      verified: true,
      featured: true,
      views: 1876,
      aiVerified: true,
      humanVerified: true,
      verificationScore: 94,
      trustScore: 96,
      sellerRating: 4.9,
      totalSales: 19,
      responseTime: "< 1 hour",
      lastActive: "1 hour ago",
    },
    // NEW INVESTOR DEMO ITEMS WITH FULL VERIFICATION DATA
    {
      id: 7,
      title: "TESLA MODEL 3 PERFORMANCE - 2022",
      price: 4500000,
      originalPrice: 6000000,
      image: "/placeholder.svg?height=400&width=400&text=🚗Tesla",
      location: "MUMBAI",
      seller: "ROHIT AGARWAL",
      rating: 4.9,
      condition: "EXCELLENT",
      category: "AUTOMOTIVE",
      carbonSaved: 2500.0,
      verified: true,
      featured: true,
      views: 3421,
      aiVerified: true,
      humanVerified: true,
      verificationScore: 98,
      trustScore: 99,
      sellerRating: 4.9,
      totalSales: 3,
      responseTime: "< 15 min",
      lastActive: "15 min ago",
    },
    {
      id: 8,
      title: "ROLEX SUBMARINER - AUTHENTIC",
      price: 850000,
      originalPrice: 1200000,
      image: "/placeholder.svg?height=400&width=400&text=⌚Rolex",
      location: "DELHI",
      seller: "KAVYA MEHTA",
      rating: 5.0,
      condition: "LIKE NEW",
      category: "FASHION",
      carbonSaved: 45.2,
      verified: true,
      featured: true,
      views: 2847,
      aiVerified: true,
      humanVerified: true,
      verificationScore: 99,
      trustScore: 100,
      sellerRating: 5.0,
      totalSales: 12,
      responseTime: "< 10 min",
      lastActive: "5 min ago",
    },
  ]

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    loadProducts()

    // Listen for cart changes
    const unsubscribeCart = cartService.onCartChange((cart) => {
      setCartCount(cartService.getCartCount())
    })

    // Listen for auth changes
    const unsubscribeAuth = authService.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
      }
    })

    return () => {
      unsubscribeCart()
      unsubscribeAuth()
    }
  }, [router])

  const loadProducts = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setProducts(mockProducts)
    setIsLoading(false)
  }

  const handleAddToCart = (product: Product) => {
    const result = cartService.addToCart(product)
    if (result.success) {
      // Show success feedback (you could add a toast here)
      console.log("Added to cart:", product.title)
    }
  }

  const handleBuyNow = (product: Product) => {
    // Add to cart and redirect to checkout
    cartService.addToCart(product)
    router.push("/checkout")
  }

  const handleEscrowPurchase = (product: Product) => {
    // Add to cart and redirect to escrow checkout
    cartService.addToCart(product)
    router.push("/checkout?escrow=true")
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory
    const matchesLocation = selectedLocation === "all" || product.location.toLowerCase() === selectedLocation
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "EXCELLENT":
        return "bg-green-100 text-green-800"
      case "LIKE NEW":
        return "bg-blue-100 text-blue-800"
      case "GOOD":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600"
    if (score >= 85) return "text-blue-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Checking authentication...</p>
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
            <Link href="/dashboard">
              <Button variant="ghost" className="font-bold">
                DASHBOARD
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="relative font-bold bg-transparent">
                <ShoppingCart className="w-4 h-4 mr-2" />
                CART
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </Badge>
                )}
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
              <span className="font-bold text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO DASHBOARD
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">BUY VERIFIED PRODUCTS</h1>
            <p className="text-gray-600">DISCOVER AUTHENTICATED PRE-OWNED ITEMS WITH ESCROW PROTECTION</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  FILTERS
                </h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">SEARCH</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="SEARCH PRODUCTS..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">CATEGORY</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">LOCATION</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">
                    PRICE RANGE: ₹{priceRange[0].toLocaleString("en-IN")} - ₹{priceRange[1].toLocaleString("en-IN")}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={200000} step={1000} className="mt-2" />
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setPriceRange([0, 200000])
                  }}
                >
                  CLEAR FILTERS
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">SHOWING {filteredProducts.length} VERIFIED PRODUCTS</p>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">LOADING...</span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="bg-gray-200 h-48 rounded-t-lg" />
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded" />
                        <div className="bg-gray-200 h-4 rounded w-2/3" />
                        <div className="bg-gray-200 h-4 rounded w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow group">
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            width={viewMode === "grid" ? 300 : 200}
                            height={viewMode === "grid" ? 200 : 150}
                            className={`w-full object-cover rounded-t-lg ${viewMode === "grid" ? "h-48" : "h-32"}`}
                          />

                          {/* Verification Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.aiVerified && (
                              <Badge className="bg-purple-500 text-white text-xs">
                                <Bot className="w-3 h-3 mr-1" />
                                AI VERIFIED
                              </Badge>
                            )}
                            {product.humanVerified && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                <UserCheck className="w-3 h-3 mr-1" />
                                HUMAN VERIFIED
                              </Badge>
                            )}
                          </div>

                          {product.featured && (
                            <Badge className="absolute top-2 right-2 bg-orange-500 text-white">FEATURED</Badge>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFavorite(product.id)
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 ${favorites.has(product.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                            {product.title}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-green-600 text-lg">
                                {product.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Trust Score */}
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className={`font-bold text-sm ${getTrustScoreColor(product.trustScore)}`}>
                              TRUST SCORE: {product.trustScore}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getConditionColor(product.condition)}>{product.condition}</Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {product.location}
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="flex items-center justify-between text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-bold">{product.sellerRating.toFixed(1)}</span>
                              <span className="text-gray-500">• {product.seller}</span>
                            </div>
                            <div className="text-green-600 font-bold">-{product.carbonSaved.toFixed(1)}KG CO₂</div>
                          </div>

                          {/* Seller Stats */}
                          <div className="text-xs text-gray-500 mb-4">
                            <div className="flex justify-between">
                              <span>{product.totalSales} SALES</span>
                              <span>RESPONDS IN {product.responseTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>ACTIVE {product.lastActive}</span>
                              <span>{product.views} VIEWS</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                className="font-bold bg-transparent"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                ADD TO CART
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleBuyNow(product)}
                                className="bg-gradient-to-r from-green-600 to-blue-600 font-bold"
                              >
                                BUY NOW
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEscrowPurchase(product)}
                              className="w-full font-bold bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              BUY WITH ESCROW PROTECTION
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">NO PRODUCTS FOUND MATCHING YOUR FILTERS</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setPriceRange([0, 200000])
                  }}
                >
                  CLEAR FILTERS
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
