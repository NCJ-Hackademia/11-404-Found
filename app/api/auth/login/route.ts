// Next.js API Route for authentication with Firebase
import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { firestoreService } from "@/lib/firestore"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
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

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    
    // Get user data from Firestore
    const user = await firestoreService.getUser(firebaseUser.uid)
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "User account not found. Please contact support." 
      }, { status: 404 })
    }

    // Get Firebase ID token
    const token = await firebaseUser.getIdToken()

    return NextResponse.json({
      success: true,
      token,
      user,
      message: "Login successful",
    })
  } catch (error: any) {
    console.error("Login error:", error)
    
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ 
        success: false, 
        error: "No account found with this email. Please sign up first." 
      }, { status: 401 })
    }
    
    if (error.code === 'auth/wrong-password') {
      return NextResponse.json({ 
        success: false, 
        error: "Incorrect password. Please try again." 
      }, { status: 401 })
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email address format." 
      }, { status: 400 })
    }
    
    if (error.code === 'auth/too-many-requests') {
      return NextResponse.json({ 
        success: false, 
        error: "Too many failed attempts. Please try again later." 
      }, { status: 429 })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: "Login failed. Please try again later." 
    }, { status: 500 })
  }
}
