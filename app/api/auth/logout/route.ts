// Next.js API Route for logout with Firebase
import { type NextRequest, NextResponse } from "next/server"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    // Sign out from Firebase Auth
    await signOut(auth)
    
    return NextResponse.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 })
  }
}
