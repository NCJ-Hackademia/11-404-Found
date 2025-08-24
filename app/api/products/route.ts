import { type NextRequest, NextResponse } from "next/server"
import { firestoreService } from "@/lib/firestore"
import { authService } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.id : null; // Get current user ID
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const limit = searchParams.get("limit")

    // Get products from Firestore with filters, excluding current user's listings
    const products = await firestoreService.getProducts({
      category: category || undefined,
      location: location || undefined,
      search: search || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      excludeUserId: userId || undefined // Exclude current user's listings
    })

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length,
    })
  } catch (error) {
    console.error("Products API error:", error)
    // Return empty array instead of error to prevent 500
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
    })
  }
}
