// lib/types.ts

export interface MacroTargets {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface TasteProfile {
  favoriteCuisines: string[];
  commonDietaryRestrictions: string[];
  preferredDifficulty: string[];
  averageCookingTime: number;
  favoriteIngredients: string[];
  macroPreferences?: MacroTargets;
}

export interface RecipePreferences {
  cuisineType: string;
  dietaryRestrictions: string[];
  skillLevel: string;
  maxCookingTime: number;
  servings: number;
  mealType: string;
  additionalInstructions: string;
  macroTargets?: MacroTargets;
  tasteProfile?: TasteProfile;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
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
  nutrition?: NutritionInfo;
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