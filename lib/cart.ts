

// Shopping cart service with escrow functionality and Firestore integration
import { authService } from "./auth"
import { firestoreService } from "./firestore"

class CartService {
  private cart: any[] = []
  private listeners: Function[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadCartFromStorage()
      this.syncCartWithFirestore()
    }
  }

  private async syncCartWithFirestore() {
    const user = authService.getCurrentUser()
    if (user) {
      try {
        const firestoreCartItems = await firestoreService.getCartItems(user.id)
        
        // Merge Firestore cart with local cart
        const mergedCart = [...this.cart]
        
        firestoreCartItems.forEach(firestoreItem => {
          const existingItemIndex = mergedCart.findIndex(item => item.id === firestoreItem.product_id)
          
          if (existingItemIndex !== -1) {
            // Update quantity from Firestore (server is source of truth)
            mergedCart[existingItemIndex].quantity = firestoreItem.quantity
          } else {
            // Add Firestore item to local cart
            mergedCart.push({
              id: firestoreItem.product_id,
              quantity: firestoreItem.quantity,
              price: firestoreItem.price,
              addedAt: firestoreItem.addedAt
            })
          }
        })
        
        this.cart = mergedCart
        this.saveCartToStorage()
        this.notifyListeners()
      } catch (error) {
        console.error("Error syncing cart with Firestore:", error)
      }
    }
  }

  private loadCartFromStorage() {
    const cartData = localStorage.getItem("trustlist_cart")
    if (cartData) {
      this.cart = JSON.parse(cartData)
      this.notifyListeners()
    }
  }

  private saveCartToStorage() {
    localStorage.setItem("trustlist_cart", JSON.stringify(this.cart))
    this.notifyListeners()
  }

  async addToCart(product: any, quantity = 1) {
    const existingItem = this.cart.find((item) => item.id === product.id)
    const user = authService.getCurrentUser()

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.cart.push({
        ...product,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    this.saveCartToStorage()
    
    // Sync with Firestore if user is authenticated
    if (user) {
      try {
        await firestoreService.addToCart(user.id, product.id, quantity, product.price)
      } catch (error) {
        console.error("Error adding to Firestore cart:", error)
      }
    }
    
    return { success: true, message: "Item added to cart" }
  }

  async removeFromCart(productId: number) {
    const user = authService.getCurrentUser()
    this.cart = this.cart.filter((item) => item.id !== productId)
    this.saveCartToStorage()
    
    // Sync with Firestore if user is authenticated
    if (user) {
      try {
        await firestoreService.removeFromCart(user.id, productId.toString())
      } catch (error) {
        console.error("Error removing from Firestore cart:", error)
      }
    }
    
    return { success: true, message: "Item removed from cart" }
  }

  async updateQuantity(productId: number, quantity: number) {
    const user = authService.getCurrentUser()
    const item = this.cart.find((item) => item.id === productId)
    
    if (item) {
      if (quantity <= 0) {
        return await this.removeFromCart(productId)
      }
      item.quantity = quantity
      this.saveCartToStorage()
      
      // Sync with Firestore if user is authenticated
      if (user) {
        try {
          // Find the cart item ID first
          const cartItems = await firestoreService.getCartItems(user.id)
          const cartItem = cartItems.find(item => item.product_id === productId.toString())
          
          if (cartItem) {
            await firestoreService.updateCartItemQuantity(cartItem.id, quantity)
          }
        } catch (error) {
          console.error("Error updating quantity in Firestore:", error)
        }
      }
    }
    return { success: true, message: "Quantity updated" }
  }

  getCart() {
    return this.cart
  }

  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0)
  }

  async clearCart() {
    const user = authService.getCurrentUser()
    this.cart = []
    this.saveCartToStorage()
    
    // Sync with Firestore if user is authenticated
    if (user) {
      try {
        await firestoreService.clearUserCart(user.id)
      } catch (error) {
        console.error("Error clearing Firestore cart:", error)
      }
    }
  }

  onCartChange(callback: Function) {
    this.listeners.push(callback)
    // Call immediately with current state
    callback(this.cart)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.cart))
  }

  // Escrow functionality
  async initiateEscrowPurchase(items: any[], buyerInfo: any) {
    try {
      // Simulate escrow initiation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const escrowTransaction = {
        id: `escrow_${Date.now()}`,
        items,
        buyer: buyerInfo,
        totalAmount: this.getCartTotal(),
        status: "escrow_pending",
        createdAt: new Date().toISOString(),
        escrowReleaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        protectionPeriod: "7 days",
      }

      // Clear cart after successful escrow initiation
      await this.clearCart()

      return {
        success: true,
        transaction: escrowTransaction,
        message: "Escrow transaction initiated successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to initiate escrow transaction",
      }
    }
  }
}

export const cartService = new CartService()
