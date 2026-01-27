import { NextRequest, NextResponse } from 'next/server'
import { saveEventRegistration } from '@/lib/google-sheets'
import { getUserProfile } from '@/lib/user-utils'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { eventId, eventName, userId, name, email, phone, college, department, year, studentId: rollNumber, whyJoin } = body

    // Validate required fields
    if (!eventId || !eventName || !name || !email || !phone || !college || !department || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email is already registered for this event
    const existingRegistrations = await adminDb
      .collection('registrations')
      .where('eventId', '==', eventId)
      .where('studentEmail', '==', email.toLowerCase())
      .get()
    
    if (!existingRegistrations.empty) {
      return NextResponse.json(
        { error: 'This email is already registered for this event' },
        { status: 400 }
      )
    }

    const registrationData = {
      eventId,
      eventName,
      studentName: name,
      studentEmail: email.toLowerCase(),
      studentId: userId || email.toLowerCase(), // Use userId if logged in, otherwise use email
      college: college,
      department: department,
      year: year,
      rollNumber: rollNumber || '',
      phone: phone,
      whyJoin: whyJoin || '',
      timestamp: new Date(),
      registeredViaAuth: !!userId,
    }

    // Save to Firestore
    await adminDb.collection('registrations').add({
      ...registrationData,
      createdAt: FieldValue.serverTimestamp(),
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
