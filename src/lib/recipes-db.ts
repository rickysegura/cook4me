import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Recipe } from './types';

export interface SavedRecipe extends Recipe {
  id?: string;
  userId: string;
  savedAt: Timestamp;
  isLoved?: boolean;
}

const RECIPES_COLLECTION = 'savedRecipes';

export const saveRecipe = async (userId: string, recipe: Recipe): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipe,
      userId,
      savedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

export const getSavedRecipes = async (userId: string): Promise<SavedRecipe[]> => {
  try {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SavedRecipe[];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RECIPES_COLLECTION, recipeId));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const isRecipeSaved = async (userId: string, recipeName: string): Promise<string | null> => {
  try {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('userId', '==', userId),
      where('name', '==', recipeName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    throw error;
  }
};

export const toggleRecipeLoved = async (recipeId: string, isLoved: boolean): Promise<void> => {
  try {
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
    await updateDoc(recipeRef, {
      isLoved,
    });
  } catch (error) {
    console.error('Error updating recipe loved status:', error);
    throw error;
  }
};

export const getRecipe = async (recipeId: string): Promise<SavedRecipe | null> => {
  try {
    const recipeDoc = await getDocs(
      query(collection(db, RECIPES_COLLECTION), where('__name__', '==', recipeId))
    );

    if (!recipeDoc.empty) {
      const data = recipeDoc.docs[0].data();
      return {
        id: recipeDoc.docs[0].id,
        ...data,
      } as SavedRecipe;
    }
    return null;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};