"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Share2,
  MapPin,
  IndianRupee,
  Star,
  Shield,
  Truck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Leaf,
  Award,
  Clock,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const product = {
    id: 1,
    title: "IPHONE 14 PRO MAX - MINT CONDITION",
    price: 85000,
    originalPrice: 129900,
    images: [
      "/IPHONE.jpeg",
      "/IPHONE.jpeg",
      "/IPHONE.jpeg",
      "/IPHONE.jpeg",
    ],
    video: "/placeholder.mp4",
    location: "MUMBAI, MAHARASHTRA",
    seller: {
      name: "PRIYA SHARMA",
      rating: 4.8,
      totalSales: 47,
      joinedDate: "2022-03-15",
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    rating: 4.8,
    condition: "EXCELLENT",
    category: "ELECTRONICS",
    carbonSaved: 15.2,
    verified: true,
    featured: true,
    views: 1247,
    description:
      "PRISTINE IPHONE 14 PRO MAX IN DEEP PURPLE. BARELY USED FOR 6 MONTHS. COMES WITH ORIGINAL BOX, CHARGER, AND UNUSED EARPODS. NO SCRATCHES OR DENTS. BATTERY HEALTH AT 98%. PERFECT FOR SOMEONE LOOKING FOR A PREMIUM DEVICE AT A GREAT PRICE.",
    specifications: {
      STORAGE: "256GB",
      COLOR: "DEEP PURPLE",
      CONDITION: "MINT",
      "BATTERY HEALTH": "98%",
      WARRANTY: "6 MONTHS REMAINING",
      ACCESSORIES: "BOX, CHARGER, EARPODS",
    },
    priceHistory: [
      { date: "2024-01-01", price: 90000 },
      { date: "2024-01-15", price: 87000 },
      { date: "2024-01-25", price: 85000 },
    ],
    similarItems: [
      {
        id: 2,
        title: "IPHONE 14 PRO - GOLD",
        price: 75000,
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 3,
        title: "IPHONE 13 PRO MAX - BLUE",
        price: 65000,
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 4,
        title: "SAMSUNG GALAXY S23 ULTRA",
        price: 80000,
        image: "/placeholder.svg?height=150&width=150",
      },
    ],
    ownershipHistory: [
      {
        owner: "ORIGINAL PURCHASE",
        date: "2023-09-15",
        receipt: "/placeholder.pdf",
      },
      {
        owner: "PRIYA SHARMA",
        date: "2023-09-20",
        receipt: "/placeholder.pdf",
      },
    ],
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

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

  const handleContactSeller = () => {
    // Navigate to chat page with product and seller info
    router.push(`/chat?productId=${product.id}&sellerId=${product.seller.name}`)
  }

  const handleBuyWithEscrow = () => {
    // Navigate to payment page with product info
    router.push(`/payment?productId=${product.id}`)
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
            <Link href="/dashboard">
              <Button variant="ghost" className="font-bold">
                DASHBOARD
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-green-600 hover:text-green-700">
            HOME
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/marketplace" className="text-green-600 hover:text-green-700">
            MARKETPLACE
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{product.category}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Video Play Button */}
                {currentImageIndex === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-4 right-4 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    PLAY VIDEO
                  </Button>
                )}
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-green-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && <Badge className="bg-orange-500 text-white">FEATURED</Badge>}
                {product.verified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    VERIFIED
                  </Badge>
                )}
                <Badge className={getConditionColor(product.condition)}>{product.condition}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">{product.price.toLocaleString("en-IN")}</span>
                </div>
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <Badge className="bg-red-100 text-red-800">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {product.views} VIEWS
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  LISTED 3 DAYS AGO
                </div>
              </div>

              <div className="flex items-center gap-1 mb-6">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-bold">SAVES {product.carbonSaved}KG CO₂ FROM ATMOSPHERE</span>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.seller.avatar || "/placeholder.svg"}
                      alt={product.seller.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{product.seller.name}</h3>
                        {product.seller.verified && <Award className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{product.seller.rating}</span>
                        <span>• {product.seller.totalSales} SALES</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    VIEW PROFILE
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleContactSeller}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold text-lg py-6"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                CONTACT SELLER
              </Button>

              <Button
                onClick={handleBuyWithEscrow}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg py-6"
              >
                <Shield className="w-5 h-5 mr-2" />
                BUY WITH ESCROW
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="font-bold bg-transparent">
                  <Heart className="w-4 h-4 mr-2" />
                  SAVE
                </Button>
                <Button variant="outline" className="font-bold bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  SHARE
                </Button>
              </div>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span>SECURE PAYMENT</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>SAFE DELIVERY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description" className="font-bold">
              DESCRIPTION
            </TabsTrigger>
            <TabsTrigger value="specifications" className="font-bold">
              SPECIFICATIONS
            </TabsTrigger>
            <TabsTrigger value="ownership" className="font-bold">
              OWNERSHIP
            </TabsTrigger>
            <TabsTrigger value="similar" className="font-bold">
              SIMILAR ITEMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">PRODUCT DESCRIPTION</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">SPECIFICATIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-bold text-gray-600">{key}:</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ownership">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">OWNERSHIP HISTORY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.ownershipHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-bold">{record.owner}</h4>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        VIEW RECEIPT
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="similar">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">SIMILAR ITEMS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {product.similarItems.map((item) => (
                    <Link key={item.id} href={`/product/${item.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-bold text-sm mb-2">{item.title}</h4>
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-green-600">{item.price.toLocaleString("en-IN")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
