'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Recipe } from '@/lib/types';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck, Flame, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveRecipe, deleteRecipe, isRecipeSaved, toggleRecipeLoved, getRecipe } from '@/lib/recipes-db';

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnother: () => void;
}

export function RecipeDisplay({ recipe, onGenerateAnother }: RecipeDisplayProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isTogglingLove, setIsTogglingLove] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (user && recipe.name) {
        const recipeId = await isRecipeSaved(user.uid, recipe.name);
        if (recipeId) {
          setIsSaved(true);
          setSavedRecipeId(recipeId);

          // Check if it's loved
          const savedRecipe = await getRecipe(recipeId);
          if (savedRecipe?.isLoved) {
            setIsLoved(true);
          }
        } else {
          setIsSaved(false);
          setSavedRecipeId(null);
          setIsLoved(false);
        }
      }
    };

    checkIfSaved();
  }, [user, recipe.name]);

  const handleBookmark = async () => {
    if (!user) {
      setShowSignUpModal(true);
      return;
    }

    setIsSaving(true);

    try {
      if (isSaved && savedRecipeId) {
        await deleteRecipe(savedRecipeId);
        setIsSaved(false);
        setSavedRecipeId(null);
      } else {
        const recipeId = await saveRecipe(user.uid, recipe);
        setIsSaved(true);
        setSavedRecipeId(recipeId);
      }
    } catch (error) {
      console.error('Error bookmarking recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLove = async () => {
    if (!user) {
      setShowSignUpModal(true);
      return;
    }

    if (!savedRecipeId) {
      alert('Please save the recipe first before marking it as loved.');
      return;
    }

    setIsTogglingLove(true);
    try {
      const newLovedState = !isLoved;
      await toggleRecipeLoved(savedRecipeId, newLovedState);
      setIsLoved(newLovedState);
    } catch (error) {
      console.error('Error toggling loved status:', error);
      alert('Failed to update loved status. Please try again.');
    } finally {
      setIsTogglingLove(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Recipe Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl">{recipe.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {recipe.description}
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {isSaved && (
                <Button
                  variant={isLoved ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleToggleLove}
                  disabled={isTogglingLove}
                  className="cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isLoved ? 'fill-current' : ''}`}
                  />
                  {isLoved ? 'Loved' : 'Love'}
                </Button>
              )}
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                onClick={handleBookmark}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prep Time</p>
                <p className="font-medium">{recipe.prepTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cook Time</p>
                <p className="font-medium">{recipe.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Servings</p>
                <p className="font-medium">{recipe.servings}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Difficulty</p>
                <p className="font-medium">{recipe.difficulty}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Information */}
      {recipe.nutrition && (
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
            <CardDescription>Per serving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Flame className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-2xl font-bold">{recipe.nutrition.calories}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{recipe.nutrition.protein}g</p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{recipe.nutrition.carbs}g</p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{recipe.nutrition.fats}g</p>
                <p className="text-sm text-muted-foreground">Fats</p>
              </div>
              {recipe.nutrition.fiber && (
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold">{recipe.nutrition.fiber}g</p>
                  <p className="text-sm text-muted-foreground">Fiber</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <div>
                  <span className="font-medium">{ingredient.amount}</span> {ingredient.item}
                  {ingredient.notes && (
                    <span className="text-sm text-muted-foreground ml-1">({ingredient.notes})</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <p className="pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tips & Tricks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">💡</span>
                  <p>{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Generate Another Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={onGenerateAnother} size="lg" className="cursor-pointer">
          Generate Another Recipe
        </Button>
      </div>

      {/* Sign Up Modal */}
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Favorite Recipes</DialogTitle>
            <DialogDescription>
              Create an account to save and access your favorite recipes anytime, anywhere.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Bookmark Recipes</h4>
                <p className="text-sm text-muted-foreground">
                  Save your favorite recipes for quick access
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Personalized Collection</h4>
                <p className="text-sm text-muted-foreground">
                  Build your own recipe library
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Access Anywhere</h4>
                <p className="text-sm text-muted-foreground">
                  View your recipes on any device
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSignUpModal(false);
                router.push('/login');
              }}
              className="cursor-pointer w-full sm:w-auto"
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setShowSignUpModal(false);
                router.push('/signup');
              }}
              className="cursor-pointer w-full sm:w-auto"
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
