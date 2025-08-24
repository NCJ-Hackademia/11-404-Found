interface Product {
  id: number
  title: string
  price: number
  original_price?: number
  originalPrice?: number
  image?: string
  images?: string[]
  location: string
  seller_name?: string
  seller?: string
  rating: number
  condition: string
  category: string
  carbon_saved?: number
  carbonSaved?: number
  verified: boolean
  featured?: boolean
}

interface ProductFilters {
  category?: string
  location?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}

class ApiService {
  private baseUrl = "/api"

  async getProducts(filters: ProductFilters = {}) {
    try {
      const params = new URLSearchParams()

      if (filters.category) params.append("category", filters.category)
      if (filters.location) params.append("location", filters.location)
      if (filters.search) params.append("search", filters.search)
      if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())

      const url = `${this.baseUrl}/products?${params.toString()}`
      console.log("Fetching products from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      return data
    } catch (error) {
      console.error("Failed to fetch products:", error)
      // Return fallback mock data
      return {
        success: true,
        data: this.getMockProducts(),
        total: 8,
      }
    }
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        title: "IPHONE 14 PRO MAX - MINT CONDITION",
        price: 85000,
        original_price: 129900,
        image: "/placeholder.svg?height=400&width=400&text=📱iPhone",
        location: "MUMBAI",
        seller_name: "PRIYA SHARMA",
        rating: 4.8,
        condition: "EXCELLENT",
        category: "ELECTRONICS",
        carbon_saved: 15.2,
        verified: true,
        featured: true,
      },
      {
        id: 2,
        title: "HERMAN MILLER AERON CHAIR",
        price: 45000,
        original_price: 89000,
        image: "/placeholder.svg?height=400&width=400&text=🪑Chair",
        location: "BANGALORE",
        seller_name: "RAJESH KUMAR",
        rating: 4.9,
        condition: "LIKE NEW",
        category: "FURNITURE",
        carbon_saved: 25.8,
        verified: true,
        featured: false,
      },
      {
        id: 3,
        title: 'MACBOOK PRO 16" M2 MAX',
        price: 180000,
        original_price: 249900,
        image: "/placeholder.svg?height=400&width=400&text=💻MacBook",
        location: "DELHI",
        seller_name: "ANITA PATEL",
        rating: 4.7,
        condition: "EXCELLENT",
        category: "ELECTRONICS",
        carbon_saved: 35.4,
        verified: true,
        featured: true,
      },
      {
        id: 4,
        title: "SONY WH-1000XM4 HEADPHONES",
        price: 15000,
        original_price: 29990,
        image: "/placeholder.svg?height=400&width=400&text=🎧Headphones",
        location: "PUNE",
        seller_name: "AMIT SINGH",
        rating: 4.6,
        condition: "GOOD",
        category: "ELECTRONICS",
        carbon_saved: 8.5,
        verified: true,
        featured: false,
      },
      {
        id: 5,
        title: "IKEA DINING TABLE SET",
        price: 12000,
        original_price: 25000,
        image: "/placeholder.svg?height=400&width=400&text=🍽️Table",
        location: "CHENNAI",
        seller_name: "MEERA REDDY",
        rating: 4.4,
        condition: "GOOD",
        category: "FURNITURE",
        carbon_saved: 18.3,
        verified: true,
        featured: false,
      },
      {
        id: 6,
        title: "CANON EOS R5 CAMERA",
        price: 220000,
        original_price: 349900,
        image: "/placeholder.svg?height=400&width=400&text=📷Camera",
        location: "HYDERABAD",
        seller_name: "VIKRAM SHAH",
        rating: 4.9,
        condition: "LIKE NEW",
        category: "ELECTRONICS",
        carbon_saved: 42.1,
        verified: true,
        featured: true,
      },
      {
        id: 7,
        title: "TESLA MODEL 3 PERFORMANCE - 2022",
        price: 4500000,
        original_price: 6000000,
        image: "/placeholder.svg?height=400&width=400&text=🚗Tesla",
        location: "MUMBAI",
        seller_name: "ROHIT AGARWAL",
        rating: 4.9,
        condition: "EXCELLENT",
        category: "AUTOMOTIVE",
        carbon_saved: 2500.0,
        verified: true,
        featured: true,
      },
      {
        id: 8,
        title: "ROLEX SUBMARINER WATCH - AUTHENTIC",
        price: 850000,
        original_price: 1200000,
        image: "/placeholder.svg?height=400&width=400&text=⌚Rolex",
        location: "DELHI",
        seller_name: "KAVYA MEHTA",
        rating: 5.0,
        condition: "LIKE NEW",
        category: "FASHION",
        carbon_saved: 45.2,
        verified: true,
        featured: true,
      },
    ]
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async register(userData: { name: string; email: string; password: string }) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }
}

export const apiService = new ApiService()
