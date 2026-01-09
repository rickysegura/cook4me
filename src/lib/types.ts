// lib/types.ts

export interface RecipePreferences {
  cuisineType: string;
  dietaryRestrictions: string[];
  skillLevel: string;
  maxCookingTime: number;
  servings: number;
  mealType: string;
  additionalInstructions: string;
}

export interface Recipe {
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[];
  tips?: string[];
}

export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  username: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}