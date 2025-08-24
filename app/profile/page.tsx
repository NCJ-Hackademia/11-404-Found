"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Upload,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Camera,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })

  const [idVerification, setIdVerification] = useState({
    idType: "",
    frontImage: null as File | null,
    backImage: null as File | null,
  })

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setEditForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      bio: currentUser.bio || "",
    })

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user: any) => {
      if (!user) {
        router.push("/auth")
      } else {
        setUser(user)
      }
    })

    return unsubscribe
  }, [router])

  const handleSignOut = () => {
    authService.signOut()
    router.push("/")
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await authService.updateProfile(editForm)

      if (result.success) {
        setSuccess("Profile updated successfully!")
        setIsEditing(false)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleIdVerification = async () => {
    if (!idVerification.idType || !idVerification.frontImage) {
      setError("Please select ID type and upload front image")
      return
    }

    setIsVerifying(true)
    setError("")
    setSuccess("")

    try {
      const result = await authService.uploadGovernmentId(
        idVerification.idType,
        idVerification.frontImage,
        idVerification.backImage || undefined,
      )

      if (result.success) {
        if (result.user?.governmentIdVerified) {
          setSuccess("🎉 ID Verified instantly! You now have the verified badge.")
        } else {
          setSuccess("ID submitted for verification. You'll be notified within 24-48 hours.")
        }
        setIdVerification({ idType: "", frontImage: null, backImage: null })
      } else {
        setError(result.error || "ID verification failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleFileUpload = (type: "front" | "back", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIdVerification((prev) => ({
        ...prev,
        [type === "front" ? "frontImage" : "backImage"]: file,
      }))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading profile...</p>
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
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="font-bold bg-transparent text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              SIGN OUT
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MY PROFILE</h1>
          <p className="text-gray-600">MANAGE YOUR ACCOUNT AND VERIFICATION STATUS</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Image
                    src={user.avatar || "/placeholder.svg?height=100&width=100&text=USER"}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="rounded-full mx-auto"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <div className="flex justify-center gap-2 mb-4">
                  {user.verified && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      EMAIL VERIFIED
                    </Badge>
                  )}
                  {user.governmentIdVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      ID VERIFIED
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">MEMBER SINCE:</span>
                    <span className="font-bold">{new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TOTAL SALES:</span>
                    <span className="font-bold">{user.totalSales}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RATING:</span>
                    <span className="font-bold">{user.rating.toFixed(1)} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CARBON SAVED:</span>
                    <span className="font-bold text-green-600">{user.carbonSaved.toFixed(1)} KG</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="font-bold">
                  PROFILE INFO
                </TabsTrigger>
                <TabsTrigger value="verification" className="font-bold">
                  VERIFICATION
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-bold">PERSONAL INFORMATION</CardTitle>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          EDIT
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            SAVE
                          </Button>
                          <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                            <X className="w-4 h-4 mr-2" />
                            CANCEL
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="font-bold">
                        FULL NAME
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-bold">
                        EMAIL ADDRESS
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-bold">
                        PHONE NUMBER
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="font-bold">
                        ADDRESS
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="address"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-bold">
                        BIO
                      </Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell others about yourself..."
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        disabled={!isEditing}
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold">GOVERNMENT ID VERIFICATION</CardTitle>
                    <p className="text-gray-600 text-sm">Get verified to build trust with buyers and sellers</p>
                  </CardHeader>
                  <CardContent>
                    {user.governmentIdVerified ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-800 mb-2">ID VERIFIED!</h3>
                        <p className="text-green-700">Your government ID has been successfully verified.</p>
                        <Badge className="bg-green-100 text-green-800 mt-4">
                          <Shield className="w-4 h-4 mr-2" />
                          TRUSTED SELLER
                        </Badge>
                      </div>
                    ) : user.governmentIdVerification?.status === "pending" ? (
                      <div className="text-center py-8">
                        <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-yellow-800 mb-2">VERIFICATION PENDING</h3>
                        <p className="text-yellow-700 mb-4">
                          Your ID is being reviewed. This usually takes 24-48 hours.
                        </p>
                        <div className="text-sm text-gray-600">
                          <p>Submitted: {new Date(user.governmentIdVerification.submittedAt).toLocaleDateString()}</p>
                          <p>ID Type: {user.governmentIdVerification.idType.toUpperCase()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-blue-800">Why verify your ID?</h4>
                              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                                <li>• Build trust with other users</li>
                                <li>• Get priority in search results</li>
                                <li>• Access to premium features</li>
                                <li>• Higher transaction limits</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="font-bold">ID TYPE</Label>
                          <Select
                            value={idVerification.idType}
                            onValueChange={(value) => setIdVerification({ ...idVerification, idType: value })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="SELECT ID TYPE" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aadhaar">AADHAAR CARD</SelectItem>
                              <SelectItem value="pan">PAN CARD</SelectItem>
                              <SelectItem value="passport">PASSPORT</SelectItem>
                              <SelectItem value="driving_license">DRIVING LICENSE</SelectItem>
                              <SelectItem value="voter_id">VOTER ID</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="font-bold">FRONT SIDE OF ID</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload("front", e)}
                              className="hidden"
                              id="front-upload"
                            />
                            <label htmlFor="front-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">
                                {idVerification.frontImage
                                  ? idVerification.frontImage.name
                                  : "CLICK TO UPLOAD FRONT SIDE"}
                              </p>
                            </label>
                          </div>
                        </div>

                        <div>
                          <Label className="font-bold">BACK SIDE OF ID (OPTIONAL)</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload("back", e)}
                              className="hidden"
                              id="back-upload"
                            />
                            <label htmlFor="back-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">
                                {idVerification.backImage ? idVerification.backImage.name : "CLICK TO UPLOAD BACK SIDE"}
                              </p>
                            </label>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                              <p className="font-bold">Important:</p>
                              <ul className="mt-1 space-y-1">
                                <li>• Ensure images are clear and readable</li>
                                <li>• All corners of the ID should be visible</li>
                                <li>• No glare or shadows on the document</li>
                                <li>• File size should be less than 5MB</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleIdVerification}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 font-bold"
                          disabled={isVerifying || !idVerification.idType || !idVerification.frontImage}
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              VERIFYING...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              SUBMIT FOR VERIFICATION
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
