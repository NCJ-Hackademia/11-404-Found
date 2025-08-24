// Next.js API Route for cart operations
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { firestoreService } from "@/lib/firestore"

export async function GET(request: NextRequest) {
  try {
    // Get user from Firebase Auth
    const currentUser = auth.currentUser
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get cart items from Firestore
    const cartItems = await firestoreService.getCartItems(currentUser.uid)

    return NextResponse.json({
      success: true,
      data: cartItems,
      total: cartItems.length,
    })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { productId, quantity = 1, price } = await request.json()

    if (!productId || !price) {
      return NextResponse.json({ success: false, error: "Product ID and price are required" }, { status: 400 })
    }

    // Add item to cart in Firestore
    await firestoreService.addToCart(currentUser.uid, productId, quantity, price)

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ success: false, error: "Failed to add item to cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Remove item from cart in Firestore
    await firestoreService.removeFromCart(currentUser.uid, productId)

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    })
  } catch (error) {
    console.error("Cart API error:", error)
    return NextResponse.json({ success: false, error: "Failed to remove item from cart" }, { status: 500 })
  }
}
