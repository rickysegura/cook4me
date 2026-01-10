import { getSavedRecipes } from './recipes-db';
import { TasteProfile, MacroTargets } from './types';

/**
 * Analyzes user's saved and loved recipes to build a taste profile
 */
export const analyzeTasteProfile = async (userId: string): Promise<TasteProfile | null> => {
  try {
    const savedRecipes = await getSavedRecipes(userId);

    if (savedRecipes.length === 0) {
      return null;
    }

    // Separate loved recipes for weighted analysis
    const lovedRecipes = savedRecipes.filter(recipe => recipe.isLoved);
    const recipesToAnalyze = lovedRecipes.length > 0 ? lovedRecipes : savedRecipes;

    // Analyze cuisines (from recipe names and descriptions)
    const cuisineMap = new Map<string, number>();
    recipesToAnalyze.forEach(recipe => {
      // Extract cuisine hints from recipe name and description
      const text = `${recipe.name} ${recipe.description}`.toLowerCase();
      const cuisines = [
        'italian', 'mexican', 'chinese', 'japanese', 'indian',
        'thai', 'french', 'mediterranean', 'american', 'korean', 'middle eastern'
      ];

      cuisines.forEach(cuisine => {
        if (text.includes(cuisine)) {
          cuisineMap.set(cuisine, (cuisineMap.get(cuisine) || 0) + 1);
        }
      });
    });

    const favoriteCuisines = Array.from(cuisineMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cuisine]) => cuisine.charAt(0).toUpperCase() + cuisine.slice(1));

    // Analyze difficulty preferences
    const difficultyMap = new Map<string, number>();
    recipesToAnalyze.forEach(recipe => {
      const difficulty = recipe.difficulty.toLowerCase();
      difficultyMap.set(difficulty, (difficultyMap.get(difficulty) || 0) + 1);
    });

    const preferredDifficulty = Array.from(difficultyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([diff]) => diff.charAt(0).toUpperCase() + diff.slice(1));

    // Calculate average cooking time
    const totalTime = recipesToAnalyze.reduce((sum, recipe) => sum + recipe.totalTime, 0);
    const averageCookingTime = Math.round(totalTime / recipesToAnalyze.length);

    // Analyze favorite ingredients (top ingredients from loved recipes)
    const ingredientMap = new Map<string, number>();
    recipesToAnalyze.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const item = ingredient.item.toLowerCase();
        // Extract main ingredient (remove adjectives and quantities)
        const mainIngredient = item
          .replace(/\b(fresh|dried|chopped|minced|sliced|diced|ground|whole|raw|cooked)\b/g, '')
          .trim()
          .split(' ')
          .slice(-2) // Take last 2 words as main ingredient
          .join(' ');

        if (mainIngredient.length > 2) {
          ingredientMap.set(mainIngredient, (ingredientMap.get(mainIngredient) || 0) + 1);
        }
      });
    });

    const favoriteIngredients = Array.from(ingredientMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ingredient]) => ingredient);

    // Analyze dietary restrictions (from recipe patterns)
    const commonDietaryRestrictions: string[] = [];
    const restrictions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'keto'];

    restrictions.forEach(restriction => {
      const matchCount = recipesToAnalyze.filter(recipe => {
        const text = `${recipe.name} ${recipe.description}`.toLowerCase();
        return text.includes(restriction.replace('-', ' '));
      }).length;

      if (matchCount / recipesToAnalyze.length > 0.3) {
        commonDietaryRestrictions.push(
          restriction.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('-')
        );
      }
    });

    // Analyze macro preferences (if nutrition data available)
    let macroPreferences: MacroTargets | undefined;
    const recipesWithNutrition = recipesToAnalyze.filter(recipe => recipe.nutrition);

    if (recipesWithNutrition.length > 0) {
      const totalCalories = recipesWithNutrition.reduce((sum, r) => sum + (r.nutrition?.calories || 0), 0);
      const totalProtein = recipesWithNutrition.reduce((sum, r) => sum + (r.nutrition?.protein || 0), 0);
      const totalCarbs = recipesWithNutrition.reduce((sum, r) => sum + (r.nutrition?.carbs || 0), 0);
      const totalFats = recipesWithNutrition.reduce((sum, r) => sum + (r.nutrition?.fats || 0), 0);

      macroPreferences = {
        calories: Math.round(totalCalories / recipesWithNutrition.length),
        protein: Math.round(totalProtein / recipesWithNutrition.length),
        carbs: Math.round(totalCarbs / recipesWithNutrition.length),
        fats: Math.round(totalFats / recipesWithNutrition.length),
      };
    }

    return {
      favoriteCuisines,
      commonDietaryRestrictions,
      preferredDifficulty,
      averageCookingTime,
      favoriteIngredients,
      macroPreferences,
    };
  } catch (error) {
    console.error('Error analyzing taste profile:', error);
    return null;
  }
};

/**
 * Formats taste profile for inclusion in recipe generation prompt
 */
export const formatTasteProfileForPrompt = (profile: TasteProfile): string => {
  const parts = [];

  if (profile.favoriteCuisines.length > 0) {
    parts.push(`Favorite cuisines: ${profile.favoriteCuisines.join(', ')}`);
  }

  if (profile.commonDietaryRestrictions.length > 0) {
    parts.push(`Common dietary preferences: ${profile.commonDietaryRestrictions.join(', ')}`);
  }

  if (profile.preferredDifficulty.length > 0) {
    parts.push(`Preferred difficulty levels: ${profile.preferredDifficulty.join(', ')}`);
  }

  parts.push(`Average preferred cooking time: ${profile.averageCookingTime} minutes`);

  if (profile.favoriteIngredients.length > 0) {
    parts.push(`Favorite ingredients: ${profile.favoriteIngredients.slice(0, 5).join(', ')}`);
  }

  if (profile.macroPreferences) {
    parts.push(
      `Typical macro preferences: ${profile.macroPreferences.calories} cal, ` +
      `${profile.macroPreferences.protein}g protein, ` +
      `${profile.macroPreferences.carbs}g carbs, ` +
      `${profile.macroPreferences.fats}g fats`
    );
  }

  return parts.join('\n');
};