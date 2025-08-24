"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Shield, CreditCard, Smartphone, Building, IndianRupee, CheckCircle, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/auth"
import { cartService } from "@/lib/cart"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEscrow = searchParams.get("escrow") === "true"

  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, completed
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  })

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    const items = cartService.getCart()

    if (items.length === 0) {
      router.push("/buy")
      return
    }

    setCartItems(items)

    // Pre-fill shipping info if available
    setShippingInfo({
      fullName: currentUser.name || "",
      address: currentUser.address || "",
      city: "",
      pincode: "",
      phone: currentUser.phone || "",
    })
  }, [router])

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalCarbonSaved = () => {
    return cartItems.reduce((total, item) => total + item.carbonSaved * item.quantity, 0)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      if (isEscrow) {
        // Process escrow payment
        const result = await cartService.initiateEscrowPurchase(cartItems, {
          ...shippingInfo,
          paymentMethod,
          user,
        })

        if (result.success) {
          setPaymentStatus("completed")
          setTimeout(() => {
            router.push("/dashboard?tab=orders")
          }, 3000)
        } else {
          throw new Error(result.error)
        }
      } else {
        // Regular payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Clear cart and redirect
        cartService.clearCart()
        setPaymentStatus("completed")

        setTimeout(() => {
          router.push("/dashboard?tab=orders")
        }, 2000)
      }
    } catch (error) {
      setPaymentStatus("pending")
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
        <nav className="bg-white/90 backdrop-blur-md border-b border-green-100">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            >
              TRUSTLIST
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEscrow ? "ESCROW PAYMENT SUCCESSFUL!" : "PAYMENT SUCCESSFUL!"}
                </h1>
                <p className="text-gray-600 mb-6">
                  {isEscrow
                    ? "YOUR PAYMENT IS HELD SECURELY IN ESCROW UNTIL DELIVERY CONFIRMATION"
                    : "YOUR ORDER HAS BEEN PLACED AND IS BEING PROCESSED"}
                </p>

                {/* Environmental Impact */}
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-800">ENVIRONMENTAL IMPACT</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {getTotalCarbonSaved().toFixed(1)} KG CO₂ SAVED
                  </div>
                  <p className="text-sm text-green-700">Thank you for choosing sustainable shopping!</p>
                </div>

                {/* Order Summary */}
                <div className="border rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-bold mb-3">ORDER SUMMARY</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 mb-2">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">QTY: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>TOTAL:</span>
                      <span>₹{(getCartTotal() + getCartTotal() * 0.03).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {isEscrow && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-800">ESCROW PROTECTION ACTIVE</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your payment is held securely. Funds will be released to sellers only after you confirm delivery.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Link href="/dashboard?tab=orders">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold">
                      VIEW ORDER DETAILS
                    </Button>
                  </Link>
                  <Link href="/buy">
                    <Button variant="outline" className="w-full font-bold bg-transparent">
                      CONTINUE SHOPPING
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO CART
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isEscrow ? "SECURE ESCROW CHECKOUT" : "SECURE CHECKOUT"}
          </h1>
          <p className="text-gray-600">
            {isEscrow
              ? "COMPLETE YOUR PURCHASE WITH ESCROW PROTECTION"
              : "COMPLETE YOUR PURCHASE SAFELY WITH TRUSTLIST"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escrow Protection Notice */}
            {isEscrow && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-blue-800">ESCROW PROTECTION ACTIVE</h3>
                      <p className="text-sm text-blue-700">
                        Your payment is held securely until you confirm delivery. Full refund if items don't match
                        description.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">SHIPPING INFORMATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="font-bold">
                      FULL NAME
                    </Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-bold">
                      PHONE NUMBER
                    </Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="font-bold">
                    ADDRESS
                  </Label>
                  <Textarea
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="font-bold">
                      CITY
                    </Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="font-bold">
                      PINCODE
                    </Label>
                    <Input
                      id="pincode"
                      value={shippingInfo.pincode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">PAYMENT METHOD</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="card" className="font-bold">
                      CREDIT/DEBIT CARD
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="upi" className="font-bold">
                      UPI PAYMENT
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Building className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="netbanking" className="font-bold">
                      NET BANKING
                    </Label>
                  </div>
                </RadioGroup>

                {/* Payment Details Form would go here based on selected method */}
                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="font-bold">
                        CARD NUMBER
                      </Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="font-bold">
                          EXPIRY DATE
                        </Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="font-bold">
                          CVV
                        </Label>
                        <Input id="cvv" placeholder="123" className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="font-bold">
                        CARDHOLDER NAME
                      </Label>
                      <Input id="cardName" placeholder="NAME ON CARD" className="mt-2" />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="mt-6">
                    <Label htmlFor="upiId" className="font-bold">
                      UPI ID
                    </Label>
                    <Input id="upiId" placeholder="yourname@paytm" className="mt-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-bold">ORDER SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">QTY: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">SUBTOTAL:</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-bold">{getCartTotal().toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">PLATFORM FEE:</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-bold">{(getCartTotal() * 0.03).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {isEscrow && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ESCROW FEE:</span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">DELIVERY:</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">TOTAL:</span>
                    <div className="flex items-center">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-600 text-lg">
                        {(getCartTotal() + getCartTotal() * 0.03).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <h4 className="font-bold text-green-800">ENVIRONMENTAL IMPACT</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{getTotalCarbonSaved().toFixed(1)} KG</div>
                    <p className="text-sm text-green-700">CO₂ SAVED FROM ATMOSPHERE</p>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold text-lg py-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isEscrow ? "PROCESSING ESCROW..." : "PROCESSING PAYMENT..."}
                    </div>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      {isEscrow ? "PAY WITH ESCROW" : "PAY SECURELY"}
                    </>
                  )}
                </Button>

                {/* Trust Indicators */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>🔒 256-BIT SSL ENCRYPTION</p>
                  <p>🛡️ {isEscrow ? "ESCROW PROTECTION" : "MONEY-BACK GUARANTEE"}</p>
                  <p>📱 INSTANT PAYMENT CONFIRMATION</p>
                  {isEscrow && <p>⏰ 7-DAY ESCROW PROTECTION PERIOD</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
