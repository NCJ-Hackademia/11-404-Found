import { type NextRequest, NextResponse } from "next/server"
import { firestoreService } from "@/lib/firestore"
import { adminApp, getAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided" },
        { status: 401 }
      )
    }

    // Verify token with Firebase Admin
    let decodedToken
    try {
      decodedToken = await getAuth(adminApp).verifyIdToken(token)
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 401 }
      )
    }

    // Parse request body
    const productData = await request.json()

    // Add seller information to product data
    const productWithSeller = {
      ...productData,
      seller_id: decodedToken.uid,
      seller_name: decodedToken.name || "Unknown Seller",
      verified: productData.price <= 10000, // Auto-verify low value items
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Create product in Firestore
    const productId = await firestoreService.createProduct(productWithSeller)

    return NextResponse.json({
      success: true,
      productId,
      message: "Product created successfully"
    })

  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    )
  }
}
