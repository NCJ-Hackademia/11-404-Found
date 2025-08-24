// Firestore service for database operations
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  addDoc,
  serverTimestamp 
} from "firebase/firestore"
import app from "./firebase"

// Initialize Firestore
export const db = getFirestore(app)

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  CARTS: "carts",
  ORDERS: "orders",
  ESCROW_TRANSACTIONS: "escrow_transactions"
} as const

// User interface
export interface FirestoreUser {
  id: string
  name: string
  email: string
  avatar: string
  verified: boolean
  governmentIdVerified: boolean
  phone: string | null
  address: string | null
  bio?: string
  joinedDate: string
  totalSales: number
  totalPurchases: number
  rating: number
  carbonSaved: number
  provider: string
  governmentIdVerification?: {
    status: string
    idType: string
    submittedAt: string
  }
  createdAt: any
  updatedAt: any
}

// Product interface
export interface FirestoreProduct {
  id: string
  title: string
  price: number
  original_price: number
  image: string
  location: string
  seller_name: string
  seller_id: string
  rating: number
  condition: string
  category: string
  carbon_saved: number
  verified: boolean
  featured: boolean
  stock: number
  description?: string
  tags?: string[]
  createdAt: any
  updatedAt: any
}

// Cart item interface
export interface FirestoreCartItem {
  id: string
  product_id: string
  user_id: string
  quantity: number
  price: number
  addedAt: string
  product?: FirestoreProduct
}

// Firestore service class
class FirestoreService {
  // User operations
  async getUser(userId: string): Promise<FirestoreUser | null> {
    try {
      const userDoc = doc(db, COLLECTIONS.USERS, userId)
      console.log("Fetching user document:", userId) // Log fetching user document
      const userSnapshot = await getDoc(userDoc)
      console.log("User document snapshot:", userSnapshot) // Log user document snapshot
      console.log("User snapshot exists:", userSnapshot.exists()) // Log if user snapshot exists
      
      if (userSnapshot.exists()) {
        return { id: userSnapshot.id, ...userSnapshot.data() } as FirestoreUser
      }
      return null
    } catch (error: any) {
      console.error("Error getting user:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Returning null for user.")
        return null
      }
      throw error
    }
  }

  async createUser(userId: string, userData: Partial<FirestoreUser>): Promise<void> {
    try {
      const userDoc = doc(db, COLLECTIONS.USERS, userId)
      await setDoc(userDoc, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    } catch (error: any) {
      console.error("Error creating user:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot create user.")
        return
      }
      throw error
    }
  }

  async updateUser(userId: string, updates: Partial<FirestoreUser>): Promise<void> {
    try {
      const userDoc = doc(db, COLLECTIONS.USERS, userId)
      await updateDoc(userDoc, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error: any) {
      console.error("Error updating user:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot update user.")
        return
      }
      throw error
    }
  }

  // Product operations
  async getProducts(filters?: {
    category?: string
    location?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    limit?: number
    excludeUserId?: string
  }): Promise<FirestoreProduct[]> {
    try {
      let productsQuery = query(collection(db, COLLECTIONS.PRODUCTS))
      
      if (filters?.category && filters.category !== "all") {
        productsQuery = query(productsQuery, where("category", "==", filters.category.toLowerCase()))
      }
      
      if (filters?.location && filters.location !== "all") {
        productsQuery = query(productsQuery, where("location", "==", filters.location.toLowerCase()))
      }
      
      if (filters?.minPrice) {
        productsQuery = query(productsQuery, where("price", ">=", filters.minPrice))
      }
      
      if (filters?.maxPrice) {
        productsQuery = query(productsQuery, where("price", "<=", filters.maxPrice))
      }
      
      if (filters?.limit) {
        productsQuery = query(productsQuery, limit(filters.limit))
      }
      
      // Exclude products from specific user if provided
      if (filters?.excludeUserId) {
        productsQuery = query(productsQuery, where("seller_id", "!=", filters.excludeUserId))
      }
      
      productsQuery = query(productsQuery, orderBy("createdAt", "desc"))
      
      const productsSnapshot = await getDocs(productsQuery)
      const products: FirestoreProduct[] = []
      
      productsSnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as FirestoreProduct)
      })
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        return products.filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.seller_name.toLowerCase().includes(searchLower)
        )
      }
      
      return products
    } catch (error: any) {
      console.error("Error getting products:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Returning empty products array.")
        return []
      }
      throw error
    }
  }

  async getProduct(productId: string): Promise<FirestoreProduct | null> {
    try {
      const productDoc = doc(db, COLLECTIONS.PRODUCTS, productId)
      const productSnapshot = await getDoc(productDoc)
      
      if (productSnapshot.exists()) {
        return { id: productSnapshot.id, ...productSnapshot.data() } as FirestoreProduct
      }
      return null
    } catch (error: any) {
      console.error("Error getting product:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Returning null for product.")
        return null
      }
      throw error
    }
  }

  async getUserProducts(userId: string): Promise<FirestoreProduct[]> {
    try {
      const productsQuery = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where("seller_id", "==", userId),
        orderBy("createdAt", "desc")
      )
      
      const productsSnapshot = await getDocs(productsQuery)
      const products: FirestoreProduct[] = []
      
      productsSnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as FirestoreProduct)
      })
      
      return products
    } catch (error: any) {
      console.error("Error getting user products:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Returning empty user products array.")
        return []
      }
      throw error
    }
  }

  async createProduct(productData: Omit<FirestoreProduct, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const productsCollection = collection(db, COLLECTIONS.PRODUCTS)
      const docRef = await addDoc(productsCollection, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error: any) {
      console.error("Error creating product:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot create product.")
        return ""
      }
      throw error
    }
  }

  // Cart operations
  async getCartItems(userId: string): Promise<FirestoreCartItem[]> {
    try {
      const cartQuery = query(
        collection(db, COLLECTIONS.CARTS),
        where("user_id", "==", userId)
      )
      
      const cartSnapshot = await getDocs(cartQuery)
      const cartItems: FirestoreCartItem[] = []
      
      cartSnapshot.forEach((doc) => {
        cartItems.push({ id: doc.id, ...doc.data() } as FirestoreCartItem)
      })
      
      return cartItems
    } catch (error: any) {
      console.error("Error getting cart items:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Returning empty cart items array.")
        return []
      }
      throw error
    }
  }

  async addToCart(userId: string, productId: string, quantity: number, price: number): Promise<void> {
    try {
      const existingItems = await this.getCartItems(userId)
      const existingItem = existingItems.find(item => item.product_id === productId)
      
      if (existingItem) {
        const cartItemDoc = doc(db, COLLECTIONS.CARTS, existingItem.id)
        await updateDoc(cartItemDoc, {
          quantity: existingItem.quantity + quantity,
          updatedAt: serverTimestamp()
        })
      } else {
        const cartCollection = collection(db, COLLECTIONS.CARTS)
        await addDoc(cartCollection, {
          user_id: userId,
          product_id: productId,
          quantity,
          price,
          addedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot add to cart.")
        return
      }
      throw error
    }
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<void> {
    try {
      const cartItemDoc = doc(db, COLLECTIONS.CARTS, cartItemId)
      
      if (quantity <= 0) {
        await deleteDoc(cartItemDoc)
      } else {
        await updateDoc(cartItemDoc, {
          quantity,
          updatedAt: serverTimestamp()
        })
      }
    } catch (error: any) {
      console.error("Error updating cart item:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot update cart item quantity.")
        return
      }
      throw error
    }
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    try {
      const cartQuery = query(
        collection(db, COLLECTIONS.CARTS),
        where("user_id", "==", userId),
        where("product_id", "==", productId)
      )
      
      const cartSnapshot = await getDocs(cartQuery)
      
      if (!cartSnapshot.empty) {
        const cartItemDoc = doc(db, COLLECTIONS.CARTS, cartSnapshot.docs[0].id)
        await deleteDoc(cartItemDoc)
      }
    } catch (error: any) {
      console.error("Error removing from cart:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot remove from cart.")
        return
      }
      throw error
    }
  }

  async clearUserCart(userId: string): Promise<void> {
    try {
      const cartItems = await this.getCartItems(userId)
      const deletePromises = cartItems.map(item => 
        deleteDoc(doc(db, COLLECTIONS.CARTS, item.id))
      )
      await Promise.all(deletePromises)
    } catch (error: any) {
      console.error("Error clearing cart:", error)
      if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
        console.warn("Firestore not enabled. Cannot clear cart.")
        return
      }
      throw error
    }
  }
}

export const firestoreService = new FirestoreService()
