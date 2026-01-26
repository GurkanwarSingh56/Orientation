import { NextRequest, NextResponse } from 'next/server'
import { saveEventRegistration } from '@/lib/google-sheets'
import { getUserProfile } from '@/lib/user-utils'
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, eventName, userId, phone } = body

    // Validate required fields
    if (!eventId || !eventName || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user profile from Firestore
    const userProfile = await getUserProfile(userId)
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user is already registered for this event
    const existingRegistrationQuery = query(
      collection(db, 'registrations'),
      where('eventId', '==', eventId),
      where('studentId', '==', userId)
    )
    const existingRegistrations = await getDocs(existingRegistrationQuery)
    
    if (!existingRegistrations.empty) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      )
    }

    const registrationData = {
      eventId,
      eventName,
      studentName: userProfile.displayName,
      studentEmail: userProfile.email,
      studentId: userProfile.uid,
      department: userProfile.department || 'N/A',
      year: userProfile.year || 0,
      phone: phone || userProfile.phone || '',
      timestamp: new Date(),
    }

    // Save to Firestore
    await addDoc(collection(db, 'registrations'), {
      ...registrationData,
      createdAt: serverTimestamp(),
    })

    // Save to Google Sheets (if configured)
    try {
      await saveEventRegistration(registrationData)
    } catch (sheetsError) {
      console.warn('Google Sheets save failed (continuing):', sheetsError)
      // Don't fail the request if Google Sheets fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
    })
  } catch (error: any) {
    console.error('Error processing registration:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
