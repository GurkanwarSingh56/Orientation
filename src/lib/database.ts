/**
 * Firebase Realtime Database Helper Functions
 * CRUD operations for Firebase Realtime Database
 */

import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  limitToFirst,
  limitToLast,
  startAt,
  endAt,
  equalTo,
  DataSnapshot,
  DatabaseReference,
  Unsubscribe,
} from 'firebase/database'
import { database } from './firebase'

/**
 * Write data to a specific path
 */
export async function writeData(path: string, data: any): Promise<void> {
  try {
    const dbRef = ref(database, path)
    await set(dbRef, data)
  } catch (error) {
    console.error('Error writing data:', error)
    throw error
  }
}

/**
 * Read data from a specific path (one-time read)
 */
export async function readData(path: string): Promise<any> {
  try {
    const dbRef = ref(database, path)
    const snapshot = await get(dbRef)
    
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error('Error reading data:', error)
    throw error
  }
}

/**
 * Update specific fields at a path
 */
export async function updateData(
  path: string,
  updates: Record<string, any>
): Promise<void> {
  try {
    const dbRef = ref(database, path)
    await update(dbRef, updates)
  } catch (error) {
    console.error('Error updating data:', error)
    throw error
  }
}

/**
 * Delete data at a specific path
 */
export async function deleteData(path: string): Promise<void> {
  try {
    const dbRef = ref(database, path)
    await remove(dbRef)
  } catch (error) {
    console.error('Error deleting data:', error)
    throw error
  }
}

/**
 * Push new data to a list (generates unique key)
 */
export async function pushData(path: string, data: any): Promise<string> {
  try {
    const dbRef = ref(database, path)
    const newRef = push(dbRef)
    await set(newRef, data)
    return newRef.key!
  } catch (error) {
    console.error('Error pushing data:', error)
    throw error
  }
}

/**
 * Listen for real-time updates at a path
 * Returns an unsubscribe function
 */
export function subscribeToData(
  path: string,
  callback: (data: any) => void
): Unsubscribe {
  const dbRef = ref(database, path)
  
  const unsubscribe = onValue(
    dbRef,
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null
      callback(data)
    },
    (error) => {
      console.error('Error subscribing to data:', error)
    }
  )

  return unsubscribe
}

/**
 * Unsubscribe from real-time updates
 */
export function unsubscribeFromData(dbRef: DatabaseReference): void {
  off(dbRef)
}

/**
 * Query data with filters
 * Example: queryData('users', { orderBy: 'age', limitTo: 10 })
 */
export async function queryData(
  path: string,
  options: {
    orderBy?: 'child' | 'key' | 'value'
    orderByChild?: string
    limitToFirst?: number
    limitToLast?: number
    startAt?: any
    endAt?: any
    equalTo?: any
  } = {}
): Promise<any> {
  try {
    const dbRef = ref(database, path)
    let dbQuery = query(dbRef)

    // Apply ordering
    if (options.orderBy === 'child' && options.orderByChild) {
      dbQuery = query(dbRef, orderByChild(options.orderByChild))
    } else if (options.orderBy === 'key') {
      dbQuery = query(dbRef, orderByKey())
    } else if (options.orderBy === 'value') {
      dbQuery = query(dbRef, orderByValue())
    }

    // Apply filters
    if (options.limitToFirst) {
      dbQuery = query(dbQuery, limitToFirst(options.limitToFirst))
    }
    if (options.limitToLast) {
      dbQuery = query(dbQuery, limitToLast(options.limitToLast))
    }
    if (options.startAt !== undefined) {
      dbQuery = query(dbQuery, startAt(options.startAt))
    }
    if (options.endAt !== undefined) {
      dbQuery = query(dbQuery, endAt(options.endAt))
    }
    if (options.equalTo !== undefined) {
      dbQuery = query(dbQuery, equalTo(options.equalTo))
    }

    const snapshot = await get(dbQuery)
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error('Error querying data:', error)
    throw error
  }
}

/**
 * Transaction - for atomic operations
 * Note: Use Firebase Transaction API for complex atomic operations
 */
export async function incrementCounter(
  path: string,
  incrementBy: number = 1
): Promise<void> {
  try {
    const currentValue = await readData(path)
    const newValue = (currentValue || 0) + incrementBy
    await writeData(path, newValue)
  } catch (error) {
    console.error('Error incrementing counter:', error)
    throw error
  }
}

/**
 * Get database reference for advanced operations
 */
export function getDatabaseRef(path: string): DatabaseReference {
  return ref(database, path)
}

// Export useful database utilities
export {
  ref,
  onValue,
  off,
  query,
  orderByChild,
  orderByKey,
  orderByValue,
  limitToFirst,
  limitToLast,
  startAt,
  endAt,
  equalTo,
}
