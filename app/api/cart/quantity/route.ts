// Next.js API Route for cart quantity operations
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/firebase"
import { firestoreService } from "@/lib/firestore"

export async function PUT(request: NextRequest) {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ success: false, error: "Cart item ID and quantity are required" }, { status: 400 })
    }

    // Update cart item quantity in Firestore
    await firestoreService.updateCartItemQuantity(cartItemId, quantity)

    return NextResponse.json({
      success: true,
      message: "Cart item quantity updated",
    })
  } catch (error) {
    console.error("Cart quantity API error:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart item quantity" }, { status: 500 })
  }
}
