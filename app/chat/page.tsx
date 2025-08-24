"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  MapPin,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  IndianRupee,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/auth"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "system" | "warning"
  blocked?: boolean
}

interface ChatUser {
  id: string
  name: string
  avatar: string
  location: string
  distance: number
  verified: boolean
  rating: number
  totalSales: number
  responseTime: string
  lastSeen: string
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatUser, setChatUser] = useState<ChatUser | null>(null)
  const [product, setProduct] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const productId = searchParams.get("productId")
  const sellerId = searchParams.get("sellerId")

  // Mock distance calculation (in real app, this would use geolocation)
  const calculateDistance = (userLocation: string, sellerLocation: string) => {
    // Mock distances for demo
    const distances: { [key: string]: number } = {
      "MUMBAI-MUMBAI": 5,
      "MUMBAI-DELHI": 1400,
      "MUMBAI-BANGALORE": 980,
      "MUMBAI-PUNE": 150,
      "DELHI-MUMBAI": 1400,
      "DELHI-DELHI": 8,
      "BANGALORE-MUMBAI": 980,
      "PUNE-MUMBAI": 150,
    }

    const key = `${userLocation}-${sellerLocation}`
    return distances[key] || Math.floor(Math.random() * 2000) + 50
  }

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)

    // Mock product and seller data
    const mockProduct = {
      id: productId,
      title: "IPHONE 14 PRO MAX - MINT CONDITION",
      price: 85000,
      image: "/placeholder.svg?height=100&width=100&text=📱",
      location: "MUMBAI",
    }

    const mockChatUser: ChatUser = {
      id: "seller-1",
      name: sellerId || "PRIYA SHARMA",
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
      location: "MUMBAI",
      distance: calculateDistance(currentUser.location || "PUNE", "MUMBAI"),
      verified: true,
      rating: 4.8,
      totalSales: 47,
      responseTime: "< 1 hour",
      lastSeen: "2 min ago",
    }

    setProduct(mockProduct)
    setChatUser(mockChatUser)

    // Initialize chat with system messages
    const initialMessages: Message[] = [
      {
        id: "system-1",
        senderId: "system",
        senderName: "TrustList",
        content: `You are now chatting about "${mockProduct.title}". Distance between you and seller: ${mockChatUser.distance}km`,
        timestamp: new Date(Date.now() - 300000),
        type: "system",
      },
    ]

    // Add location-based restrictions
    if (mockChatUser.distance > 40) {
      initialMessages.push({
        id: "system-2",
        senderId: "system",
        senderName: "TrustList",
        content:
          "⚠️ SAFETY NOTICE: You are more than 40km away from this seller. For your safety, sharing contact details or arranging meetups is restricted. All transactions must go through TrustList's secure escrow system.",
        timestamp: new Date(Date.now() - 290000),
        type: "warning",
      })
    } else {
      initialMessages.push({
        id: "system-2",
        senderId: "system",
        senderName: "TrustList",
        content:
          "✅ You are within 40km of this seller. You may discuss contact details and meetups, but all payments must still go through TrustList's secure system.",
        timestamp: new Date(Date.now() - 290000),
        type: "system",
      })
    }

    // Add some mock conversation
    initialMessages.push(
      {
        id: "msg-1",
        senderId: "seller-1",
        senderName: mockChatUser.name,
        content:
          "Hi! Thanks for your interest in the iPhone. It's in excellent condition and comes with all original accessories.",
        timestamp: new Date(Date.now() - 120000),
        type: "text",
      },
      {
        id: "msg-2",
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: "Hello! The phone looks great. Can you tell me more about the battery health?",
        timestamp: new Date(Date.now() - 60000),
        type: "text",
      },
      {
        id: "msg-3",
        senderId: "seller-1",
        senderName: mockChatUser.name,
        content: "The battery health is at 98%. I've barely used it for 6 months. Would you like to see more photos?",
        timestamp: new Date(Date.now() - 30000),
        type: "text",
      },
    )

    setMessages(initialMessages)
  }, [router, productId, sellerId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const detectRestrictedContent = (message: string): boolean => {
    const restrictedPatterns = [
      /\b\d{10}\b/, // Phone numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone patterns
      /whatsapp|telegram|instagram|facebook/i,
      /meet\s+me|let's\s+meet|coffee\s+shop|my\s+place/i,
      /address|location|where\s+do\s+you\s+live/i,
      /cash\s+payment|direct\s+payment|outside\s+trustlist/i,
    ]

    return restrictedPatterns.some((pattern) => pattern.test(message))
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !chatUser) return

    const isRestricted = chatUser.distance > 40 && detectRestrictedContent(newMessage)

    if (isRestricted) {
      // Block the message and show warning
      const blockedMessage: Message = {
        id: `blocked-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        content: newMessage,
        timestamp: new Date(),
        type: "text",
        blocked: true,
      }

      const warningMessage: Message = {
        id: `warning-${Date.now()}`,
        senderId: "system",
        senderName: "TrustList",
        content:
          "🚫 MESSAGE BLOCKED: Your message appears to contain contact information or meetup requests. This is not allowed when you're more than 40km from the seller. Please use TrustList's secure escrow system for all transactions.",
        timestamp: new Date(),
        type: "warning",
      }

      setMessages((prev) => [...prev, blockedMessage, warningMessage])
    } else {
      // Send normal message
      const message: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        content: newMessage,
        timestamp: new Date(),
        type: "text",
      }

      setMessages((prev) => [...prev, message])

      // Simulate seller typing and response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const response: Message = {
          id: `response-${Date.now()}`,
          senderId: chatUser.id,
          senderName: chatUser.name,
          content: "Thanks for your message! I'll get back to you shortly.",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, response])
      }, 2000)
    }

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageStyle = (message: Message) => {
    if (message.type === "system") return "bg-blue-50 border-blue-200 text-blue-800"
    if (message.type === "warning") return "bg-red-50 border-red-200 text-red-800"
    if (message.blocked) return "bg-red-100 border-red-300 text-red-700 opacity-50"
    return message.senderId === user?.id ? "bg-green-100 ml-auto" : "bg-gray-100"
  }

  const isContactAllowed = chatUser && chatUser.distance <= 40

  if (!user || !chatUser || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">CHAT WITH SELLER</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{chatUser.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{chatUser.name}</h3>
                        {chatUser.verified && <Shield className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{chatUser.location}</span>
                        <span>•</span>
                        <span className={chatUser.distance <= 40 ? "text-green-600" : "text-red-600"}>
                          {chatUser.distance}km away
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isContactAllowed}
                      className={!isContactAllowed ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isContactAllowed}
                      className={!isContactAllowed ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] ${message.senderId === user.id ? "ml-auto" : ""}`}
                  >
                    {message.type === "system" || message.type === "warning" ? (
                      <div className={`p-3 rounded-lg border text-sm text-center ${getMessageStyle(message)}`}>
                        {message.content}
                      </div>
                    ) : (
                      <div className={`p-3 rounded-lg ${getMessageStyle(message)}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold">{message.senderName}</span>
                          {message.blocked && <span className="text-xs text-red-500">BLOCKED</span>}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{chatUser.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      isContactAllowed
                        ? "Type your message..."
                        : "Type your message (contact details restricted due to distance)..."
                    }
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {!isContactAllowed && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Contact details and meetup requests are restricted due to distance (40km+ rule)
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">PRODUCT DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{product.title}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      <IndianRupee className="w-3 h-3 text-green-600" />
                      <span className="font-bold text-green-600 text-sm">{product.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {product.location}
                    </div>
                  </div>
                </div>
                <Link href={`/product/${product.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                    VIEW PRODUCT
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">SELLER INFORMATION</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{chatUser.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{chatUser.name}</h4>
                      {chatUser.verified && <Shield className="w-3 h-3 text-green-600" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{chatUser.rating}</span>
                      <span>• {chatUser.totalSales} sales</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{chatUser.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className={`font-medium ${chatUser.distance <= 40 ? "text-green-600" : "text-red-600"}`}>
                      {chatUser.distance}km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time:</span>
                    <span className="font-medium">{chatUser.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last seen:</span>
                    <span className="font-medium">{chatUser.lastSeen}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  VIEW PROFILE
                </Button>
              </CardContent>
            </Card>

            {/* Safety Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  SAFETY GUIDELINES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className={`flex items-start gap-2 ${isContactAllowed ? "text-green-700" : "text-red-700"}`}>
                  {isContactAllowed ? (
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{isContactAllowed ? "Contact Allowed" : "Contact Restricted"}</p>
                    <p className="text-xs text-gray-600">
                      {isContactAllowed
                        ? "You may exchange contact details and arrange meetups"
                        : "Contact sharing restricted due to 40km+ distance"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-blue-700">
                  <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium">Secure Payments Only</p>
                    <p className="text-xs text-gray-600">All payments must go through TrustList's escrow system</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-700">
                  <Clock className="w-4 h-4 mt-0.5 text-gray-600" />
                  <div>
                    <p className="font-medium">Report Issues</p>
                    <p className="text-xs text-gray-600">Contact support if you encounter any problems</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">QUICK ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/payment?productId=${product.id}`}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
                    <Shield className="w-4 h-4 mr-2" />
                    BUY WITH ESCROW
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-transparent">
                  REPORT USER
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  BLOCK USER
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
