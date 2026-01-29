/**
 * Google Sheets Integration
 * For saving event registrations to Google Sheets
 */

import { google } from 'googleapis'

// Initialize Google Sheets API
function getGoogleSheetsClient() {
  try {
    // Check if credentials are available
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
    const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY

    if (!clientEmail || !privateKeyRaw) {
      throw new Error('Google Sheets credentials not configured')
    }

    // Handle private key formatting - support both formats
    let privateKey = privateKeyRaw
    
    // If the key doesn't start with "-----BEGIN", it might be base64 encoded
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      try {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf8')
      } catch (e) {
        // If base64 decode fails, try standard replacement
        privateKey = privateKey.replace(/\\n/g, '\n')
      }
    } else {
      // Standard newline replacement for escaped keys
      privateKey = privateKey.replace(/\\n/g, '\n')
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return google.sheets({ version: 'v4', auth })
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error)
    throw error
  }
}

/**
 * Append data to Google Sheet
 */
export async function appendToSheet(
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  try {
    const sheets = getGoogleSheetsClient()

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error appending to sheet:', error)
    throw error
  }
}

/**
 * Save event registration to Google Sheets
 */
export async function saveEventRegistration(data: {
  eventId: string
  eventName: string
  studentName: string
  studentEmail: string
  studentId: string
  college?: string
  department: string
  year: number
  phone?: string
  rollNumber?: string
  timestamp: Date
}) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    if (!spreadsheetId) {
      console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not configured, skipping Google Sheets save')
      return { success: false, skipped: true }
    }

    // Check if credentials are available
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      console.warn('Google Sheets credentials not configured, skipping save')
      return { success: false, skipped: true }
    }

    // Format data for sheet
    const row = [
      new Date(data.timestamp).toLocaleString(),
      data.eventId,
      data.eventName,
      data.studentName,
      data.studentEmail,
      data.studentId,
      data.college || 'N/A',
      data.department,
      data.year.toString(),
      data.rollNumber || 'N/A',
      data.phone || 'N/A',
    ]

    // Append to sheet (Sheet1 by default)
    await appendToSheet(spreadsheetId, 'Sheet1!A:K', [row])

    return { success: true }
  } catch (error) {
    console.error('Error saving event registration to Google Sheets:', error)
    // Re-throw to let the caller decide how to handle
    throw error
  }
}

/**
 * Get all registrations from sheet (optional - for admin view)
 */
export async function getRegistrations(spreadsheetId: string, range: string = 'Sheet1!A2:I') {
  try {
    const sheets = getGoogleSheetsClient()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })

    return response.data.values || []
  } catch (error) {
    console.error('Error getting registrations:', error)
    throw error
  }
}

/**
 * Initialize sheet with headers (run once)
 */
export async function initializeSheet(spreadsheetId: string) {
  try {
    const headers = [
      'Timestamp',
      'Event ID',
      'Event Name',
      'Student Name',
      'Email',
      'Student ID',
      'Department',
      'Year',
      'Phone',
    ]

    await appendToSheet(spreadsheetId, 'Sheet1!A1:I1', [headers])

    return { success: true }
  } catch (error) {
    console.error('Error initializing sheet:', error)
    throw error
  }
}
