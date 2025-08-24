"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  Clock,
  Truck,
  Star,
  Award,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/auth"

interface PaymentMethod {
  id: string
  type: "card" | "upi" | "netbanking"
  name: string
  icon: React.ReactNode
  description: string
}

interface OrderStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "completed"
  estimatedTime: string
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [escrowTermsAccepted, setEscrowTermsAccepted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderSteps, setOrderSteps] = useState<OrderStep[]>([])

  const productId = searchParams.get("productId")
  const isEscrow = searchParams.get("escrow") === "true"

  const product = {
    id: productId,
    title: "IPHONE 14 PRO MAX - MINT CONDITION",
    price: 85000,
    originalPrice: 129900,
    image: "/placeholder.svg?height=200&width=200&text=📱",
    seller: {
      name: "PRIYA SHARMA",
      rating: 4.8,
      totalSales: 47,
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
    },
    location: "MUMBAI",
    condition: "EXCELLENT",
    carbonSaved: 15.2,
  }

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "upi",
      type: "upi",
      name: "UPI Payment",
      icon: <Smartphone className="w-5 h-5" />,
      description: "PhonePe, GPay, Paytm",
    },
    {
      id: "netbanking",
      type: "netbanking",
      name: "Net Banking",
      icon: <Building2 className="w-5 h-5" />,
      description: "All major banks",
    },
  ]

  const escrowFee = Math.round(product.price * 0.02) // 2% escrow fee
  const platformFee = Math.round(product.price * 0.01) // 1% platform fee
  const totalAmount = product.price + escrowFee + platformFee

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)

    // Initialize order steps
    const steps: OrderStep[] = [
      {
        id: "payment",
        title: "Payment Processing",
        description: "Secure payment through TrustList escrow",
        status: "pending",
        estimatedTime: "2-3 minutes",
      },
      {
        id: "verification",
        title: "Order Verification",
        description: "Seller confirms order and prepares item",
        status: "pending",
        estimatedTime: "1-2 hours",
      },
      {
        id: "inspection",
        title: "Inspection Period",
        description: "7-day inspection period after delivery",
        status: "pending",
        estimatedTime: "7 days",
      },
      {
        id: "completion",
        title: "Payment Release",
        description: "Funds released to seller after approval",
        status: "pending",
        estimatedTime: "Instant",
      },
    ]

    setOrderSteps(steps)
  }, [router])

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !termsAccepted || (isEscrow && !escrowTermsAccepted)) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update order steps
    const updatedSteps = orderSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? "completed" : index === 1 ? "active" : "pending",
    }))

    setOrderSteps(updatedSteps)
    setOrderPlaced(true)
    setIsProcessing(false)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "active":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-green-100">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            >
              <svg
                className="w-8 h-8 text-green-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              TRUSTLIST
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ORDER PLACED SUCCESSFULLY!</h1>
            <p className="text-gray-600">Your order has been placed and is now in escrow protection</p>
          </motion.div>

          {/* Order Tracking */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                ORDER TRACKING
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${step.status === "completed" ? "text-green-600" : step.status === "active" ? "text-blue-600" : "text-gray-600"}`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                      <p className="text-xs text-gray-500">Estimated: {step.estimatedTime}</p>
                    </div>
                    {step.status === "active" && <Badge className="bg-blue-100 text-blue-800">IN PROGRESS</Badge>}
                    {step.status === "completed" && <Badge className="bg-green-100 text-green-800">COMPLETED</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ORDER SUMMARY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{product.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600 text-lg">{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Protected by TrustList Escrow</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Item Price:</span>
                  <span>₹{product.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Fee (2%):</span>
                  <span>₹{escrowFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (1%):</span>
                  <span>₹{platformFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Paid:</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-8">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                GO TO DASHBOARD
              </Button>
            </Link>
            <Link href="/buy" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600">CONTINUE SHOPPING</Button>
            </Link>
          </div>
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{isEscrow ? "SECURE ESCROW PAYMENT" : "PAYMENT"}</h1>
            <p className="text-gray-600">Complete your purchase with TrustList's secure payment system</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escrow Protection Notice */}
            {isEscrow && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-green-800 mb-2">ESCROW PROTECTION ACTIVE</h3>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Your payment is held securely until you confirm receipt</li>
                        <li>• 7-day inspection period to verify item condition</li>
                        <li>• Full refund if item doesn't match description</li>
                        <li>• Dispute resolution support included</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  PAYMENT METHOD
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    {paymentMethods.map((method) => (
                      <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                        {method.icon}
                        <span className="hidden sm:inline">{method.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">CARD NUMBER</label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">CARDHOLDER NAME</label>
                        <Input placeholder="JOHN DOE" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">EXPIRY DATE</label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">CVV</label>
                        <Input placeholder="123" type="password" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="upi" className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">UPI ID</label>
                      <Input placeholder="yourname@paytm" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Or scan QR code with your UPI app:</p>
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mt-2 flex items-center justify-center">
                        <span className="text-gray-500">QR CODE</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="netbanking" className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">SELECT BANK</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">STATE BANK OF INDIA</SelectItem>
                          <SelectItem value="hdfc">HDFC BANK</SelectItem>
                          <SelectItem value="icici">ICICI BANK</SelectItem>
                          <SelectItem value="axis">AXIS BANK</SelectItem>
                          <SelectItem value="kotak">KOTAK MAHINDRA BANK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>TERMS & CONDITIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to TrustList's{" "}
                    <Link href="/terms" className="text-green-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-green-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {isEscrow && (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="escrow-terms"
                      checked={escrowTermsAccepted}
                      onCheckedChange={(checked) => setEscrowTermsAccepted(checked as boolean)}
                    />
                    <label htmlFor="escrow-terms" className="text-sm">
                      I understand and agree to the{" "}
                      <Link href="/escrow-terms" className="text-green-600 hover:underline">
                        Escrow Service Terms
                      </Link>
                      , including the 7-day inspection period and dispute resolution process
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>ORDER SUMMARY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{product.title}</h3>
                    <Badge className="bg-green-100 text-green-800 mb-2">{product.condition}</Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Saves {product.carbonSaved}kg CO₂</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Item Price:</span>
                    <span>₹{product.price.toLocaleString("en-IN")}</span>
                  </div>
                  {isEscrow && (
                    <>
                      <div className="flex justify-between">
                        <span>Escrow Fee (2%):</span>
                        <span>₹{escrowFee.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (1%):</span>
                        <span>₹{platformFee.toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{(isEscrow ? totalAmount : product.price).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>SELLER INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={product.seller.avatar || "/placeholder.svg"}
                    alt={product.seller.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{product.seller.name}</h4>
                      {product.seller.verified && <Award className="w-3 h-3 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{product.seller.rating}</span>
                      <span>• {product.seller.totalSales} sales</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Located in {product.location}</p>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  SECURITY FEATURES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PCI DSS Compliant</span>
                </div>
                {isEscrow && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Escrow Protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>7-Day Inspection Period</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>24/7 Support</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || !termsAccepted || (isEscrow && !escrowTermsAccepted) || isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold py-6 text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  PROCESSING...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  PAY ₹{(isEscrow ? totalAmount : product.price).toLocaleString("en-IN")}
                </div>
              )}
            </Button>

            {(!selectedPaymentMethod || !termsAccepted || (isEscrow && !escrowTermsAccepted)) && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Please complete all required fields</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
