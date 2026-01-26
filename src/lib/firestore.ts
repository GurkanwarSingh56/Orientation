/**
 * Firestore Helper Functions
 * CRUD operations for Firestore database
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Get a single document by ID
 */
export async function getDocument(
  collectionName: string,
  docId: string
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting document:', error)
    throw error
  }
}

/**
 * Get all documents from a collection
 */
export async function getDocuments(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<DocumentData[]> {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error getting documents:', error)
    throw error
  }
}

/**
 * Add a new document with auto-generated ID
 */
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding document:', error)
    throw error
  }
}

/**
 * Set a document with specific ID (creates or overwrites)
 */
export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  merge: boolean = false
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
        ...(merge ? {} : { createdAt: serverTimestamp() }),
      },
      { merge }
    )
  } catch (error) {
    console.error('Error setting document:', error)
    throw error
  }
}

/**
 * Update an existing document
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

/**
 * Query documents with conditions
 * Example: queryDocuments('events', [where('status', '==', 'upcoming'), orderBy('date'), limit(10)])
 */
export async function queryDocuments(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<DocumentData[]> {
  return getDocuments(collectionName, constraints)
}

/**
 * Export useful Firestore utilities
 */
export { where, orderBy, limit, Timestamp, serverTimestamp }
