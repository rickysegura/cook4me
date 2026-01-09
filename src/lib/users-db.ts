import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from './types';

const USERS_COLLECTION = 'users';

export interface CreateUserData {
  userId: string;
  email: string;
  username: string;
  profilePictureUrl?: string;
}

/**
 * Creates a new user document in Firestore
 */
export const createUserProfile = async (userData: CreateUserData): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.userId);
    const now = Timestamp.now();

    await setDoc(userRef, {
      userId: userData.userId,
      email: userData.email,
      username: userData.username,
      profilePictureUrl: userData.profilePictureUrl || '',
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Gets a user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        userId: data.userId,
        email: data.email,
        username: data.username,
        profilePictureUrl: data.profilePictureUrl,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Checks if a user profile exists in Firestore
 */
export const userProfileExists = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error checking user profile existence:', error);
    throw error;
  }
};