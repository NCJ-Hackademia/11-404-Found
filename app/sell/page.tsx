"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  IndianRupee,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  TrendingUp,
  X,
  AlertTriangle,
  Shield,
  Zap,
  Camera,
  Scan,
  Clock,
  UserCheck,
  ThumbsUp,
  ThumbsDown,
  Info,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { firestoreService } from "@/lib/firestore"

interface AIHealthCheck {
  overallScore: number
  checks: {
    imageQuality: { score: number; status: "excellent" | "good" | "poor"; message: string }
    productCondition: { score: number; status: "excellent" | "good" | "poor"; message: string }
    priceAccuracy: { score: number; status: "excellent" | "good" | "poor"; message: string }
    descriptionQuality: { score: number; status: "excellent" | "good" | "poor"; message: string }
    authenticity: { score: number; status: "excellent" | "good" | "poor"; message: string }
  }
  recommendations: string[]
  flagged: boolean
  requiresManualReview: boolean
}

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [aiHealthCheck, setAiHealthCheck] = useState<AIHealthCheck | null>(null)
  const [manualReviewStatus, setManualReviewStatus] = useState<"pending" | "approved" | "rejected" | null>(null)

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setAuthLoading(false)

    // Listen for auth changes
    const unsubscribeAuth = authService.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
      }
    })

    return () => {
      unsubscribeAuth()
    }
  }, [router])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    originalPrice: "",
  })

  const [aiSuggestions] = useState({
    priceRange: { min: 75000, max: 90000 },
    suggestedTitle: "IPHONE 14 PRO MAX - EXCELLENT CONDITION",
    qualityScore: 92,
    marketDemand: "HIGH",
  })

  const categories = [
    "ELECTRONICS",
    "FURNITURE",
    "APPLIANCES",
    "FASHION",
    "BOOKS",
    "SPORTS",
    "AUTOMOTIVE",
    "HOME & GARDEN",
  ]

  const conditions = ["LIKE NEW", "EXCELLENT", "GOOD", "FAIR"]

  const locations = ["MUMBAI", "DELHI", "BANGALORE", "PUNE", "CHENNAI", "HYDERABAD", "KOLKATA", "AHMEDABAD"]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const runAIHealthCheck = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const price = Number(formData.price)
    const isHighValue = price > 10000

    // Mock AI analysis results
    const mockHealthCheck: AIHealthCheck = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      checks: {
        imageQuality: {
          score: uploadedImages.length >= 3 ? 95 : 75,
          status: uploadedImages.length >= 3 ? "excellent" : "good",
          message:
            uploadedImages.length >= 3
              ? "High-quality images with good lighting and multiple angles"
              : "Good image quality, consider adding more angles",
        },
        productCondition: {
          score: formData.condition === "LIKE NEW" ? 95 : formData.condition === "EXCELLENT" ? 85 : 75,
          status: formData.condition === "LIKE NEW" ? "excellent" : "good",
          message: `Product condition matches ${formData.condition} category standards`,
        },
        priceAccuracy: {
          score: price >= aiSuggestions.priceRange.min && price <= aiSuggestions.priceRange.max ? 90 : 70,
          status: price >= aiSuggestions.priceRange.min && price <= aiSuggestions.priceRange.max ? "excellent" : "good",
          message:
            price >= aiSuggestions.priceRange.min && price <= aiSuggestions.priceRange.max
              ? "Price is within market range"
              : "Price may be outside typical market range",
        },
        descriptionQuality: {
          score: formData.description.length > 100 ? 90 : 70,
          status: formData.description.length > 100 ? "excellent" : "good",
          message:
            formData.description.length > 100
              ? "Detailed description with sufficient information"
              : "Consider adding more product details",
        },
        authenticity: {
          score: Math.random() > 0.1 ? 95 : 60, // 90% chance of good authenticity
          status: Math.random() > 0.1 ? "excellent" : "poor",
          message:
            Math.random() > 0.1
              ? "Product appears authentic based on images and description"
              : "Some authenticity concerns detected - manual review required",
        },
      },
      recommendations: [],
      flagged: false,
      requiresManualReview: isHighValue,
    }

    // Generate recommendations
    if (mockHealthCheck.checks.imageQuality.score < 85) {
      mockHealthCheck.recommendations.push("Add more high-quality images from different angles")
    }
    if (mockHealthCheck.checks.descriptionQuality.score < 85) {
      mockHealthCheck.recommendations.push("Provide more detailed product description")
    }
    if (mockHealthCheck.checks.priceAccuracy.score < 85) {
      mockHealthCheck.recommendations.push("Consider adjusting price to market standards")
    }
    if (mockHealthCheck.checks.authenticity.score < 80) {
      mockHealthCheck.flagged = true
      mockHealthCheck.recommendations.push("Provide proof of purchase or authenticity certificate")
    }

    setAiHealthCheck(mockHealthCheck)
    setIsAnalyzing(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const price = Number(formData.price)
      const isHighValue = price > 10000

      // Create product data for Firestore
      const productData = {
        title: formData.title,
        price: price,
        original_price: formData.originalPrice ? Number(formData.originalPrice) : 0, // Default to 0 if not provided
        image: uploadedImages.length > 0 ? uploadedImages[0] : "/placeholder.svg",
        location: formData.location.toUpperCase(),
        seller_name: user?.name || "Unknown Seller",
        seller_id: user?.id || "",
        rating: 5.0, // Default rating
        condition: formData.condition.toUpperCase(),
        category: formData.category.toUpperCase(),
        carbon_saved: Math.floor(price * 0.1), // Calculate carbon saved (10% of price)
        verified: !isHighValue, // Auto-verify low value items
        featured: false,
        stock: 1,
        description: formData.description,
        tags: [formData.category.toLowerCase(), formData.condition.toLowerCase()]
      }

      // Get user token for authentication
      let token = null
      if (authService.getToken) {
        token = await authService.getToken()
      } else if (typeof window !== 'undefined') {
        token = localStorage.getItem('trustlist_token')
      }

      // Save product via API with token
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create product")
      }

      console.log("Product created with ID:", result.productId)

      if (isHighValue && !aiHealthCheck?.flagged) {
        // High value items go to manual review
        setManualReviewStatus("pending")

        // Simulate manual review process (faster for demo)
        setTimeout(() => {
          const approved = Math.random() > 0.2 // 80% approval rate
          setManualReviewStatus(approved ? "approved" : "rejected")

          if (approved) {
            setTimeout(() => {
              setIsSubmitting(false)
              router.push("/dashboard")
            }, 2000)
          } else {
            setIsSubmitting(false)
          }
        }, 4000)
      } else if (aiHealthCheck?.flagged) {
        // Flagged items require additional review
        setManualReviewStatus("rejected")
        setIsSubmitting(false)
      } else {
        // Low value items with good AI score go live immediately
        setTimeout(() => {
          setIsSubmitting(false)
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to create product:", error)
      setIsSubmitting(false)
      // Show error message to user
      alert("Failed to create listing. Please try again.")
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
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
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
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
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SELL YOUR ITEM</h1>
          <p className="text-gray-600">TURN YOUR PRE-OWNED GOODS INTO CASH WHILE HELPING THE PLANET</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 3 && <div className={`w-20 h-1 mx-2 ${currentStep > step ? "bg-green-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl">BASIC INFORMATION</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="font-bold">
                      ITEM TITLE *
                    </Label>
                    <Input
                      id="title"
                      placeholder="E.G., IPHONE 14 PRO MAX - EXCELLENT CONDITION"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-2"
                    />
                    {aiSuggestions.suggestedTitle && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600 font-bold">AI SUGGESTION:</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">{aiSuggestions.suggestedTitle}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() => setFormData({ ...formData, title: aiSuggestions.suggestedTitle })}
                        >
                          USE SUGGESTION
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="font-bold">
                        CATEGORY *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="SELECT CATEGORY" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition" className="font-bold">
                        CONDITION *
                      </Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => setFormData({ ...formData, condition: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="SELECT CONDITION" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition.toLowerCase()}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-bold">
                      DESCRIPTION *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="DESCRIBE YOUR ITEM IN DETAIL. MENTION ANY DEFECTS, INCLUDED ACCESSORIES, ETC."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="font-bold">
                      LOCATION *
                    </Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="SELECT YOUR CITY" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase()}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                      NEXT: PRICING
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold text-xl">PRICING & AI INSIGHTS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Price Suggestions */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-green-700">AI PRICE ANALYSIS</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{aiSuggestions.priceRange.min.toLocaleString("en-IN")} - ₹
                          {aiSuggestions.priceRange.max.toLocaleString("en-IN")}
                        </div>
                        <p className="text-sm text-gray-600">SUGGESTED PRICE RANGE</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{aiSuggestions.qualityScore}%</div>
                        <p className="text-sm text-gray-600">QUALITY SCORE</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-orange-100 text-orange-800 text-lg px-3 py-1">
                          {aiSuggestions.marketDemand} DEMAND
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">MARKET DEMAND</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice" className="font-bold">
                        ORIGINAL PURCHASE PRICE
                      </Label>
                      <div className="relative mt-2">
                        <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="originalPrice"
                          type="number"
                          placeholder="ORIGINAL PRICE"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="price" className="font-bold">
                        SELLING PRICE *
                      </Label>
                      <div className="relative mt-2">
                        <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="YOUR SELLING PRICE"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* High Value Item Notice */}
                  {Number(formData.price) > 10000 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-blue-700">HIGH VALUE ITEM DETECTED</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Items above ₹10,000 require manual verification by our team to ensure marketplace fairness and
                        buyer protection.
                      </p>
                    </div>
                  )}

                  {formData.price && formData.originalPrice && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-700">PRICING INSIGHTS</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">DEPRECIATION:</span>
                          <span className="font-bold ml-2">
                            {Math.round(
                              ((Number(formData.originalPrice) - Number(formData.price)) /
                                Number(formData.originalPrice)) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">BUYER SAVES:</span>
                          <span className="font-bold ml-2 text-green-600">
                            ₹{(Number(formData.originalPrice) - Number(formData.price)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="font-bold bg-transparent">
                      BACK
                    </Button>
                    <Button onClick={nextStep} className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                      NEXT: PHOTOS & REVIEW
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Photos, AI Health Check & Submit */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="space-y-6">
                {/* Photo Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      PRODUCT PHOTOS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-bold">PHOTOS (UP TO 5) *</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-bold">CLICK TO UPLOAD PHOTOS</p>
                          <p className="text-sm text-gray-500 mt-2">DRAG & DROP OR CLICK TO SELECT FILES</p>
                        </label>
                      </div>

                      {/* Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-5 gap-4 mt-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AI Health Check Button */}
                    {uploadedImages.length > 0 && !aiHealthCheck && (
                      <div className="text-center">
                        <Button
                          onClick={runAIHealthCheck}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 font-bold"
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              ANALYZING PRODUCT...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4 mr-2" />
                              RUN AI HEALTH CHECK
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Health Check Results */}
                {aiHealthCheck && (
                  <Card
                    className={`${aiHealthCheck.flagged ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                  >
                    <CardHeader>
                      <CardTitle className="font-bold text-xl flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                        AI PRODUCT HEALTH CHECK
                        <Badge
                          className={`ml-2 ${getScoreBadge(aiHealthCheck.overallScore >= 85 ? "excellent" : aiHealthCheck.overallScore >= 70 ? "good" : "poor")}`}
                        >
                          SCORE: {aiHealthCheck.overallScore}/100
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Overall Score */}
                      <div className="text-center mb-6">
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(aiHealthCheck.overallScore)}`}>
                          {aiHealthCheck.overallScore}/100
                        </div>
                        <Progress value={aiHealthCheck.overallScore} className="w-full max-w-md mx-auto" />
                        <p className="text-sm text-gray-600 mt-2">
                          {aiHealthCheck.overallScore >= 85
                            ? "EXCELLENT LISTING QUALITY"
                            : aiHealthCheck.overallScore >= 70
                              ? "GOOD LISTING QUALITY"
                              : "NEEDS IMPROVEMENT"}
                        </p>
                      </div>

                      {/* Detailed Checks */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(aiHealthCheck.checks).map(([key, check]) => (
                          <div key={key} className="p-3 bg-white rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-sm">{key.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
                              <Badge className={getScoreBadge(check.status)}>{check.score}/100</Badge>
                            </div>
                            <p className="text-xs text-gray-600">{check.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      {aiHealthCheck.recommendations.length > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-yellow-600" />
                            <span className="font-bold text-yellow-800">RECOMMENDATIONS</span>
                          </div>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {aiHealthCheck.recommendations.map((rec, index) => (
                              <li key={index}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Flagged Warning */}
                      {aiHealthCheck.flagged && (
                        <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="font-bold text-red-800">LISTING FLAGGED</span>
                          </div>
                          <p className="text-sm text-red-700">
                            This listing has been flagged for potential issues. Please address the recommendations above
                            before resubmitting.
                          </p>
                        </div>
                      )}

                      {/* Manual Review Notice */}
                      {aiHealthCheck.requiresManualReview && !aiHealthCheck.flagged && (
                        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-blue-800">MANUAL REVIEW REQUIRED</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            High-value items (₹{Number(formData.price).toLocaleString("en-IN")}) require manual
                            verification by our team to ensure marketplace fairness.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Manual Review Status */}
                {manualReviewStatus && (
                  <Card
                    className={`${
                      manualReviewStatus === "approved"
                        ? "border-green-200 bg-green-50"
                        : manualReviewStatus === "rejected"
                          ? "border-red-200 bg-red-50"
                          : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      {manualReviewStatus === "pending" && (
                        <>
                          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4 animate-pulse" />
                          <h3 className="text-xl font-bold text-yellow-800 mb-2">MANUAL REVIEW IN PROGRESS</h3>
                          <p className="text-yellow-700 mb-4">
                            Our verification team is reviewing your high-value listing. This usually takes 2-5 minutes.
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </>
                      )}

                      {manualReviewStatus === "approved" && (
                        <>
                          <ThumbsUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-green-800 mb-2">LISTING APPROVED!</h3>
                          <p className="text-green-700 mb-4">
                            Your listing has been verified and approved by our team. It will go live shortly.
                          </p>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            VERIFIED BY TRUSTLIST
                          </Badge>
                        </>
                      )}

                      {manualReviewStatus === "rejected" && (
                        <>
                          <ThumbsDown className="w-12 h-12 text-red-600 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-red-800 mb-2">LISTING REJECTED</h3>
                          <p className="text-red-700 mb-4">
                            Your listing doesn't meet our quality standards. Please address the issues and try again.
                          </p>
                          <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                            <p className="font-bold mb-1">REASONS FOR REJECTION:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Price appears significantly below market value</li>
                              <li>Product authenticity concerns</li>
                              <li>Insufficient product documentation</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Listing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-xl">LISTING SUMMARY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">TITLE:</span>
                          <span className="font-bold">{formData.title || "NOT SET"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CATEGORY:</span>
                          <span className="font-bold">{formData.category?.toUpperCase() || "NOT SET"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CONDITION:</span>
                          <span className="font-bold">{formData.condition?.toUpperCase() || "NOT SET"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PRICE:</span>
                          <span className="font-bold text-green-600">
                            ₹{formData.price ? Number(formData.price).toLocaleString("en-IN") : "NOT SET"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">LOCATION:</span>
                          <span className="font-bold">{formData.location?.toUpperCase() || "NOT SET"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PHOTOS:</span>
                          <span className="font-bold">{uploadedImages.length} UPLOADED</span>
                        </div>
                        {aiHealthCheck && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">AI HEALTH SCORE:</span>
                            <span className={`font-bold ${getScoreColor(aiHealthCheck.overallScore)}`}>
                              {aiHealthCheck.overallScore}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={prevStep} className="font-bold bg-transparent">
                        BACK
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-600 to-blue-600 font-bold"
                        disabled={
                          isSubmitting || !aiHealthCheck || aiHealthCheck.flagged || manualReviewStatus === "rejected"
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {manualReviewStatus === "pending" ? "REVIEWING..." : "SUBMITTING..."}
                          </>
                        ) : (
                          "SUBMIT LISTING"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
