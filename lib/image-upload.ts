// Image upload service for Firebase Storage
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  StorageReference 
} from "firebase/storage"
import { storage } from "./firebase"

interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

class ImageUploadServiceClass {
  /**
   * Upload a profile image to Firebase Storage
   * @param userId The user ID to associate with the image
   * @param file The image file to upload
   * @param oldImageUrl Optional URL of the old image to delete
   * @returns Upload result with success status and image URL
   */
  async updateProfileImage(userId: string, file: File, oldImageUrl?: string): Promise<UploadResult> {
    try {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'File must be an image' }
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: 'Image size must be less than 5MB' }
      }

      // Delete old image if provided
      if (oldImageUrl) {
        await this.deleteImageByUrl(oldImageUrl)
      }

      // Create storage reference
      const storageRef = ref(storage, `profile-images/${userId}/${Date.now()}-${file.name}`)
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return { success: true, url: downloadURL }
    } catch (error: any) {
      console.error('Profile image upload error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to upload profile image' 
      }
    }
  }

  /**
   * Delete an image from Firebase Storage by URL
   * @param imageUrl The URL of the image to delete
   */
  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const url = new URL(imageUrl)
      const path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0] || '')
      
      if (path) {
        const imageRef = ref(storage, path)
        await deleteObject(imageRef)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      // Don't throw error for deletion failures as they're not critical
    }
  }

  /**
   * Upload a government ID document
   * @param userId The user ID
   * @param file The document file
   * @param documentType Type of document (front/back)
   * @returns Upload result with success status and document URL
   */
  async uploadGovernmentId(userId: string, file: File, documentType: string): Promise<UploadResult> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'File must be JPEG, PNG, or PDF' }
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit for documents
        return { success: false, error: 'File size must be less than 10MB' }
      }

      // Create storage reference
      const storageRef = ref(storage, `government-ids/${userId}/${documentType}-${Date.now()}-${file.name}`)
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return { success: true, url: downloadURL }
    } catch (error: any) {
      console.error('Government ID upload error:', error)
      return { 
        success: false, 
        error: error.message || 'Failed to upload government ID' 
      }
    }
  }
}

export const ImageUploadService = new ImageUploadServiceClass()
