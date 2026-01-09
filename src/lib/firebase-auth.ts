import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, userProfileExists } from './users-db';

export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName && user) {
      await updateProfile(user, { displayName });
    }

    // Create user profile document in Firestore
    await createUserProfile({
      userId: user.uid,
      email: user.email || email,
      username: displayName || email.split('@')[0],
      profilePictureUrl: user.photoURL || '',
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create one (for new Google users)
    const profileExists = await userProfileExists(user.uid);
    if (!profileExists) {
      await createUserProfile({
        userId: user.uid,
        email: user.email || '',
        username: user.displayName || user.email?.split('@')[0] || 'User',
        profilePictureUrl: user.photoURL || '',
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};