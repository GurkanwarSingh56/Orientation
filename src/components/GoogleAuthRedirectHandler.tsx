'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getGoogleRedirectResult } from '@/lib/firebase-auth'
import { getUserProfile } from '@/lib/user-utils'

/**
 * Component to handle Google Auth redirect results
 * Should be placed in auth layout to process redirects
 */
export default function GoogleAuthRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult()
        
        if (result) {
          // User successfully signed in via redirect
          const user = result.user
          
          // Check if user profile exists in Firestore
          const existingProfile = await getUserProfile(user.uid)
          
          if (!existingProfile) {
            // New user - redirect to complete profile
            console.log('New Google user, redirecting to complete profile')
            router.push('/complete-profile')
          } else if (!existingProfile.department || !existingProfile.year) {
            // Existing user but missing info - redirect to complete profile
            console.log('User missing profile info, redirecting to complete profile')
            router.push('/complete-profile')
          } else {
            // Profile complete - redirect to dashboard
            router.push('/dashboard')
          }
        }
      } catch (error: any) {
        console.error('Error handling redirect result:', error)
        // Error will be displayed on the auth page
      }
    }

    handleRedirectResult()
  }, [router])

  return null // This component doesn't render anything
}
