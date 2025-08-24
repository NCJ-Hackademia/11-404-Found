"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Leaf,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "VERIFIED LISTINGS",
      description: "AI-POWERED VERIFICATION ENSURES AUTHENTIC, HIGH-QUALITY PRE-OWNED GOODS",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "CARBON FOOTPRINT TRACKING",
      description: "SEE YOUR ENVIRONMENTAL IMPACT WITH EVERY PURCHASE AND SALE",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "SMART PRICING",
      description: "AI-DRIVEN PRICE SUGGESTIONS BASED ON CONDITION AND MARKET DATA",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "SECURE ESCROW",
      description: "PROTECTED PAYMENTS WITH MONEY-BACK GUARANTEE FOR PEACE OF MIND",
    },
  ]

  const revenueModel = [
    {
      title: "TRANSACTION FEES",
      description: "3% COMMISSION ON SUCCESSFUL SALES",
      amount: "₹30 ON ₹1000 SALE",
    },
    {
      title: "PREMIUM LISTINGS",
      description: "FEATURED PLACEMENT FOR FASTER SALES",
      amount: "₹99/MONTH",
    },
    {
      title: "VERIFICATION SERVICES",
      description: "PROFESSIONAL ITEM AUTHENTICATION",
      amount: "₹199/ITEM",
    },
  ]

  const testimonials = [
    {
      name: "PRIYA SHARMA",
      role: "ECO-CONSCIOUS BUYER",
      content:
        "TRUSTLIST HELPED ME FURNISH MY ENTIRE APARTMENT SUSTAINABLY. SAVED ₹50,000 AND REDUCED MY CARBON FOOTPRINT!",
      rating: 5,
    },
    {
      name: "RAJESH KUMAR",
      role: "FREQUENT SELLER",
      content: "SOLD MY OLD ELECTRONICS QUICKLY AND SAFELY. THE AI PRICING SUGGESTIONS WERE SPOT ON!",
      rating: 5,
    },
    {
      name: "ANITA PATEL",
      role: "SUSTAINABILITY ADVOCATE",
      content: "FINALLY, A PLATFORM THAT MAKES CIRCULAR LIVING EASY AND TRUSTWORTHY. LOVE THE CARBON TRACKING!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-green-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
          </motion.div>
          <div className="flex gap-4">
            <Link href="/auth">
              <Button variant="outline" className="font-bold bg-transparent">
                LOGIN
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 font-bold">SIGN UP</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-black"
          >
            TRUSTLIST — A SUSTAINABLE MARKETPLACE FOR PRE-OWNED GOODS,{" "}
            <span className="text-green-800">REDUCING CARBON FOOTPRINTS</span> BY ENCOURAGING SMART REUSE AND CIRCULAR
            LIVING.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 font-semibold"
          >
            BUY SMART. SELL SMART. EVERY REUSE REDUCES WASTE AND HELPS OUR PLANET.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/marketplace">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg group"
              >
                START BUYING
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold px-8 py-4 text-lg group bg-transparent"
              >
                START SELLING
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            KEY FEATURES
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-green-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-green-600 mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            REVENUE MODEL
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {revenueModel.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-4 mx-auto" />
                    <h3 className="text-lg font-bold mb-3 text-gray-800">{model.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                    <div className="text-2xl font-bold text-green-600">{model.amount}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            TESTIMONIALS
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-bold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                <svg
                  className="w-8 h-8 text-green-400 animate-spin"
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
              </div>
              <p className="text-gray-400 text-sm">
                BUILDING A SUSTAINABLE FUTURE THROUGH SMART REUSE AND CIRCULAR LIVING.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">COMPANY</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    CAREERS
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    PRESS
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    BLOG
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    HELP CENTER
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    SAFETY
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    TERMS
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    PRIVACY
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">CONNECT</h3>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 NEXZEN TECHNOLOGIES. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}
