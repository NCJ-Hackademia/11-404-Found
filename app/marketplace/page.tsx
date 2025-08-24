"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, Heart, MapPin, IndianRupee, Star, ArrowLeft, Grid3X3, List, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { apiService } from "@/lib/api"
import { realtimeService } from "@/lib/realtime"
import { authService } from "@/lib/auth"

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
}

export default function Marketplace() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 5000000]) // Increased max to 50 lakh
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [authLoading, setAuthLoading] = useState(true)

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

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setAuthLoading(false)
    
    // Load products on mount and when filters change
    loadProducts()

    // Listen for real-time updates
    realtimeService.on("new_listing", handleNewListing)
    realtimeService.on("listing_updated", handleListingUpdated)

    // Listen for auth changes
    const unsubscribeAuth = authService.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
      }
    })

    return () => {
      realtimeService.off("new_listing", handleNewListing)
      realtimeService.off("listing_updated", handleListingUpdated)
      unsubscribeAuth()
    }
  }, [router, selectedCategory, selectedLocation, searchQuery])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const filters = {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        location: selectedLocation !== "all" ? selectedLocation : undefined,
        search: searchQuery || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      }

      console.log("Loading products with filters:", filters)
      const response = await apiService.getProducts(filters)
      console.log("API response:", response)

      // Handle both direct data and nested data structure
      const productsData = response.data || response || []

      // Transform API response to match our Product interface
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        title: product.title || product.name,
        price: product.price,
        originalPrice: product.original_price || product.originalPrice || product.price * 1.5,
        image:
          product.image ||
          product.images?.[0] ||
          `/placeholder.svg?height=400&width=400&text=${product.category || "Item"}`,
        location: product.location || "MUMBAI",
        seller: product.seller_name || product.seller || "VERIFIED SELLER",
        rating: product.rating || 4.5 + Math.random() * 0.5,
        condition: product.condition || "EXCELLENT",
        category: product.category || "ELECTRONICS",
        carbonSaved: product.carbon_saved || product.carbonSaved || 10 + Math.random() * 30,
        verified: product.verified !== false,
        featured: product.featured || false,
      }))

      console.log("Transformed products:", transformedProducts)
      setProducts(transformedProducts)
    } catch (error) {
      console.error("Failed to load products:", error)
      // Set empty array on error to show "no products" message
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewListing = (newProduct: any) => {
    const transformedProduct: Product = {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      originalPrice: newProduct.original_price || newProduct.price * 1.5,
      image: newProduct.image || "/IPHONE.jpeg",
      location: newProduct.location || "MUMBAI",
      seller: newProduct.seller || "NEW SELLER",
      rating: 4.5,
      condition: newProduct.condition || "EXCELLENT",
      category: newProduct.category || "ELECTRONICS",
      carbonSaved: newProduct.carbon_saved || 15,
      verified: true,
      featured: false,
    }

    setProducts((prev) => [transformedProduct, ...prev])
  }

  const handleListingUpdated = (updatedProduct: any) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product)),
    )
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
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase())

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

  if (authLoading) {
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
            <Link href="/sell">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">SELL ITEM</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO HOME
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">MARKETPLACE</h1>
            <p className="text-gray-600">DISCOVER AMAZING PRE-OWNED ITEMS</p>
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
                  <p className="text-xs text-gray-500 mt-1">Search by title, category, or seller</p>
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
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000000}
                    step={10000}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹0</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setPriceRange([0, 5000000])
                    loadProducts()
                  }}
                >
                  CLEAR FILTERS
                </Button>

                <Button
                  className="w-full mt-2 bg-gradient-to-r from-green-600 to-blue-600 font-bold"
                  onClick={loadProducts}
                >
                  APPLY FILTERS
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                SHOWING {filteredProducts.length} OF {products.length} PRODUCTS
              </p>
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
                    <Link href={`/product/${product.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              width={viewMode === "grid" ? 300 : 200}
                              height={viewMode === "grid" ? 200 : 150}
                              className={`w-full object-cover rounded-t-lg ${viewMode === "grid" ? "h-48" : "h-32"}`}
                            />
                            {product.featured && (
                              <Badge className="absolute top-2 left-2 bg-orange-500 text-white">FEATURED</Badge>
                            )}
                            {product.verified && (
                              <Badge className="absolute top-2 right-2 bg-green-500 text-white">VERIFIED</Badge>
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

                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={getConditionColor(product.condition)}>{product.condition}</Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {product.location}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-bold">{product.rating.toFixed(1)}</span>
                                <span className="text-gray-500">• {product.seller}</span>
                              </div>
                              <div className="text-green-600 font-bold">-{product.carbonSaved.toFixed(1)}KG CO₂</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">NO PRODUCTS FOUND MATCHING YOUR FILTERS</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or price range</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLocation("all")
                    setPriceRange([0, 5000000])
                    loadProducts()
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
