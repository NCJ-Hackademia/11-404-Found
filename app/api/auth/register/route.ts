// Next.js API Route for registration with Firebase
import { type NextRequest, NextResponse } from "next/server"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { firestoreService } from "@/lib/firestore"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { email, password, name, phone, location } = userData

    if (!email || !password || !name) {
      return NextResponse.json({ 
        success: false, 
        error: "Email, password, and name are required" 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: "Please enter a valid email address" 
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: "Password must be at least 6 characters long" 
      }, { status: 400 })
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user

    // Create user profile in Firestore with complete user data structure
    const userProfile = {
      id: firebaseUser.uid,
      name: name,
      email: email,
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${name}&background=059669&color=fff&size=100`,
      verified: firebaseUser.emailVerified,
      governmentIdVerified: false,
      phone: phone || null,
      address: location || null,
      joinedDate: new Date().toISOString(),
      totalSales: 0,
      totalPurchases: 0,
      rating: 5.0,
      carbonSaved: 0,
      provider: "email",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await firestoreService.createUser(firebaseUser.uid, userProfile)

    // Get Firebase ID token
    const token = await firebaseUser.getIdToken()

    return NextResponse.json({
      success: true,
      token,
      user: userProfile,
      message: "Registration successful",
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({ 
        success: false, 
        error: "This email is already registered. Please login instead." 
      }, { status: 409 })
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json({ 
        success: false, 
        error: "Password is too weak. Please choose a stronger password." 
      }, { status: 400 })
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email address format." 
      }, { status: 400 })
    }
    
    if (error.code === 'auth/operation-not-allowed') {
      return NextResponse.json({ 
        success: false, 
        error: "Email/password authentication is not enabled. Please contact support." 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Registration failed. Please try again later." 
    }, { status: 500 })
  }
}
