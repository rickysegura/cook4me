'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedRecipes, deleteRecipe, SavedRecipe } from '@/lib/recipes-db';
import { getUserProfile } from '@/lib/users-db';
import { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecipeDisplay } from '@/components/recipe-display';
import { UserNav } from '@/components/user-nav';
import { Loader2, Bookmark, Trash2, ArrowLeft } from 'lucide-react';

export default function SavedRecipesPage() {
  const { user, loading: authLoading, signOut: authSignOut } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  useEffect(() => {
    const loadRecipes = async () => {
      if (user) {
        try {
          const savedRecipes = await getSavedRecipes(user.uid);
          setRecipes(savedRecipes);
        } catch (error) {
          console.error('Error loading recipes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadRecipes();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    setDeletingId(recipeId);
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter(r => r.id !== recipeId));
      if (selectedRecipe?.id === recipeId) {
        setSelectedRecipe(null);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewRecipe = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (selectedRecipe) {
    return (
      <main className="min-h-screen sm:py-8 pt-8">
        <div className="container mx-auto max-w-6xl">
          <UserNav user={user} userProfile={userProfile} onSignOut={handleSignOut} />

          <div className="px-4 sm:px-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Saved Recipes
            </Button>
            <RecipeDisplay
              recipe={selectedRecipe}
              onGenerateAnother={handleBack}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen sm:py-8 pt-8">
      <div className="container mx-auto max-w-6xl">
        <UserNav user={user} userProfile={userProfile} onSignOut={handleSignOut} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8 mx-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Saved Recipes</h1>
            </div>
            <p className="text-muted-foreground">
              Your collection of favorite recipes
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="cursor-pointer"
          >
            Generate New Recipe
          </Button>
        </div>

        {/* Recipes Grid */}
        <div className="mx-4">
          {recipes.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Bookmark className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-semibold mb-2">No saved recipes yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Start generating recipes and save your favorites to see them here
                  </p>
                  <Button onClick={() => router.push('/')} className="cursor-pointer">
                    Generate Your First Recipe
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{recipe.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1 font-medium">{recipe.totalTime} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Servings:</span>
                        <span className="ml-1 font-medium">{recipe.servings}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Difficulty:</span>
                        <span className="ml-1 font-medium">{recipe.difficulty}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Saved:</span>
                        <span className="ml-1 font-medium">
                          {recipe.savedAt?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewRecipe(recipe)}
                        className="flex-1 cursor-pointer"
                        size="sm"
                      >
                        View Recipe
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(recipe.id!)}
                        disabled={deletingId === recipe.id}
                        className="cursor-pointer"
                      >
                        {deletingId === recipe.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}