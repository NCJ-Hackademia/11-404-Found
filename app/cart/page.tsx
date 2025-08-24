"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, ArrowLeft, Plus, Minus, Trash2, IndianRupee, Shield, Leaf, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"
import { cartService } from "@/lib/cart"

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setCartItems(cartService.getCart())
    setIsLoading(false)

    // Listen for cart changes
    const unsubscribe = cartService.onCartChange((cart) => {
      setCartItems(cart)
    })

    return unsubscribe
  }, [router])

  const updateQuantity = (productId: number, quantity: number) => {
    cartService.updateQuantity(productId, quantity)
  }

  const removeItem = (productId: number) => {
    cartService.removeFromCart(productId)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const getTotalCarbonSaved = () => {
    return cartItems.reduce((total, item) => total + item.carbonSaved * item.quantity, 0)
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const handleEscrowCheckout = () => {
    router.push("/checkout?escrow=true")
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
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
            <Link href="/buy">
              <Button variant="ghost" className="font-bold">
                CONTINUE SHOPPING
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/buy" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            CONTINUE SHOPPING
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SHOPPING CART</h1>
          <p className="text-gray-600">REVIEW YOUR ITEMS BEFORE CHECKOUT</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">YOUR CART IS EMPTY</h2>
            <p className="text-gray-500 mb-6">ADD SOME VERIFIED PRODUCTS TO GET STARTED</p>
            <Link href="/buy">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">START SHOPPING</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">CART ITEMS ({getCartCount()})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-100 text-green-800">{item.condition}</Badge>
                          <span className="text-sm text-gray-500">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">{item.price.toLocaleString("en-IN")}</span>
                          <span className="text-sm text-gray-500">per item</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Environmental Impact */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-green-800">ENVIRONMENTAL IMPACT</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {getTotalCarbonSaved().toFixed(1)} KG
                      </div>
                      <p className="text-sm text-green-700">CO₂ SAVED FROM ATMOSPHERE</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold">ORDER SUMMARY</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">SUBTOTAL ({getCartCount()} ITEMS):</span>
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold">{getCartTotal().toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">PLATFORM FEE (3%):</span>
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold">{(getCartTotal() * 0.03).toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">DELIVERY:</span>
                        <span className="font-bold text-green-600">FREE</span>
                      </div>

                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">TOTAL:</span>
                          <div className="flex items-center">
                            <IndianRupee className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-green-600 text-xl">
                              {(getCartTotal() + getCartTotal() * 0.03).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold text-lg py-6"
                      >
                        PROCEED TO CHECKOUT
                      </Button>

                      <Button
                        onClick={handleEscrowCheckout}
                        variant="outline"
                        className="w-full font-bold bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100 py-6"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        CHECKOUT WITH ESCROW PROTECTION
                      </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>ALL ITEMS VERIFIED</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span>SECURE PAYMENT PROCESSING</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-500" />
                        <span>CARBON FOOTPRINT TRACKING</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Escrow Info */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-800 text-sm">ESCROW PROTECTION</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Your payment is held securely until you confirm delivery. Get full refund if item doesn't match
                      description.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
