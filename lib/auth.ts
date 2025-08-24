import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth"
import { auth, googleProvider } from "./firebase"
import { ImageUploadService } from "./image-upload"
import { firestoreService, FirestoreUser } from "./firestore"

interface User extends FirestoreUser {}

class AuthService {
  private user: User | null = null
  private listeners: Function[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.initAuthStateListener()
      this.loadUserFromStorage()
    }
  }

  private initAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid) // Log authenticated user
        const existingUser = await firestoreService.getUser(user.uid)
        console.log("Fetching existing user from Firestore...") // Log fetching user
        console.log("Existing User:", existingUser) // Log existing user from Firestore
        if (!existingUser) {
          const userData = this.formatUserData(user)
          await firestoreService.createUser(user.uid, userData)
          this.user = userData
        } else {
          this.user = existingUser
        }
        
        // Store user data in localStorage for persistence
        localStorage.setItem("trustlist_user", JSON.stringify(this.user))
        const token = await user.getIdToken()
        localStorage.setItem("trustlist_token", token)
      } else {
        this.user = null
        // Clear storage when user signs out
        localStorage.removeItem("trustlist_user")
        localStorage.removeItem("trustlist_token")
      }
      
      this.notifyListeners()
    })
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem("trustlist_user")
    const token = localStorage.getItem("trustlist_token")

    if (userData && token) {
      this.user = JSON.parse(userData)
      this.notifyListeners()
    }
  }

  private formatUserData(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0]?.toUpperCase() || "USER",
      email: firebaseUser.email || "",
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || firebaseUser.email}&background=059669&color=fff&size=100`,
      verified: firebaseUser.emailVerified,
      governmentIdVerified: false,
      phone: firebaseUser.phoneNumber || null,
      address: null,
      joinedDate: new Date().toISOString(),
      totalSales: 0,
      totalPurchases: 0,
      rating: 5.0,
      carbonSaved: 0,
      provider: firebaseUser.providerData[0]?.providerId || "unknown",
      createdAt: new Date(),
      updatedAt: new Date()
    } as User
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        // Store token and user data
        localStorage.setItem("trustlist_token", result.token)
        localStorage.setItem("trustlist_user", JSON.stringify(result.user))
        
        // Update current user state
        this.user = result.user
        this.notifyListeners()
        
        return { 
          success: true, 
          user: result.user,
          token: result.token
        }
      } else {
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error: any) {
      console.error("Email login error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  async registerWithEmail(userData: any) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (result.success) {
        // Store token and user data
        localStorage.setItem("trustlist_token", result.token)
        localStorage.setItem("trustlist_user", JSON.stringify(result.user))
        
        // Update current user state
        this.user = result.user
        this.notifyListeners()
        
        return { 
          success: true, 
          user: result.user,
          token: result.token
        }
      } else {
        return { success: false, error: result.error || "Registration failed" }
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, error: "Network error. Please try again." }
    }
  }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // User is automatically stored via auth state listener
      return { 
        success: true, 
        user: this.formatUserData(user),
        token: await user.getIdToken()
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      
      let errorMessage = "Google authentication failed"
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Google sign-in was cancelled"
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site."
      }
      
      return { success: false, error: errorMessage }
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(auth)
      this.user = null
      localStorage.removeItem("trustlist_user")
      localStorage.removeItem("trustlist_token")
      this.notifyListeners()
      return { success: true }
    } catch (error) {
      console.error("Sign out error:", error)
      return { success: false, error: "Sign out failed" }
    }
  }

  getCurrentUser() {
    return this.user
  }

  isAuthenticated() {
    return !!this.user
  }

  async getToken() {
    if (this.user && auth.currentUser) {
      return await auth.currentUser.getIdToken()
    }
    return localStorage.getItem("trustlist_token") || null
  }

  onAuthStateChanged(callback: Function) {
    this.listeners.push(callback)
    // Call immediately with current state
    callback(this.user)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.user))
  }

  async updateProfile(profileData: any) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "No authenticated user" }
      }

      // Update Firebase profile if name changed
      if (profileData.name && profileData.name !== this.user?.name) {
        await updateProfile(currentUser, {
          displayName: profileData.name
        })
      }

      // Update local user data and Firestore
      if (this.user) {
        const updatedUser = {
          ...this.user,
          name: profileData.name || this.user.name,
          phone: profileData.phone || this.user.phone,
          address: profileData.address || this.user.address,
          bio: profileData.bio || this.user.bio,
          updatedAt: new Date()
        }
        
        this.user = updatedUser
        
        // Update user in Firestore
        await firestoreService.updateUser(currentUser.uid, {
          name: updatedUser.name,
          phone: updatedUser.phone,
          address: updatedUser.address,
          bio: updatedUser.bio,
          updatedAt: updatedUser.updatedAt
        })
        
        // Store updated user data
        localStorage.setItem("trustlist_user", JSON.stringify(this.user))
        this.notifyListeners()
      }

      return { success: true, user: this.user }
    } catch (error: any) {
      console.error("Profile update error:", error)
      return { success: false, error: error.message || "Failed to update profile" }
    }
  }

  async updateProfileImage(file: File) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "No authenticated user" }
      }

      // Upload image to Firebase Storage
      const uploadResult = await ImageUploadService.updateProfileImage(
        currentUser.uid,
        file,
        this.user?.avatar
      )

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error }
      }

      // Update Firebase profile with new photo URL
      await updateProfile(currentUser, {
        photoURL: uploadResult.url
      })

      // Update local user data and Firestore
      if (this.user) {
        const updatedUser = {
          ...this.user,
          avatar: uploadResult.url!,
          updatedAt: new Date()
        }
        
        this.user = updatedUser
        
        // Update user in Firestore
        await firestoreService.updateUser(currentUser.uid, {
          avatar: updatedUser.avatar,
          updatedAt: updatedUser.updatedAt
        })
        
        // Store updated user data
        localStorage.setItem("trustlist_user", JSON.stringify(this.user))
        this.notifyListeners()
      }

      return { success: true, user: this.user }
    } catch (error: any) {
      console.error("Profile image update error:", error)
      return { success: false, error: error.message || "Failed to update profile image" }
    }
  }

  async uploadGovernmentId(idType: string, frontImage: File, backImage?: File) {
    // For ID verification, we'll keep the mock implementation
    // This would typically upload to a different storage path and update verification status
    return { 
      success: true, 
      user: { 
        ...this.user, 
        governmentIdVerified: true,
        governmentIdVerification: {
          status: "verified",
          idType,
          submittedAt: new Date().toISOString()
        }
      } 
    } as { success: boolean; user: User; error?: string }
  }
}

export const authService = new AuthService()
