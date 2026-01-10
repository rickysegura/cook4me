'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import { RecipeForm } from '@/components/recipe-form';
import { RecipeDisplay } from '@/components/recipe-display';
import { Recipe, RecipePreferences, UserProfile } from '@/lib/types';
import { Loader2, LogOut, User, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/lib/users-db';

export default function Home() {
  const { user, signOut: authSignOut } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  const handleSignOut = async () => {
    try {
      await authSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleGenerateRecipe = async (preferences: RecipePreferences) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    setRecipe(null);
  };

  return (
    <main className="min-h-screen sm:py-8 pt-8">
      <div className="container mx-auto max-w-6xl">
        {/* Navigation */}
        <div className="flex justify-end mb-8 mx-4">
          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/settings')}>
                  {userProfile?.profilePictureUrl ? (
                    <Image
                      src={userProfile.profilePictureUrl}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {userProfile?.username || user.displayName || user.email}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => router.push('/saved-recipes')}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved Recipes
                </Button>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex md:hidden items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer p-2"
                  onClick={() => router.push('/settings')}
                  aria-label="Profile"
                >
                  {userProfile?.profilePictureUrl ? (
                    <Image
                      src={userProfile.profilePictureUrl}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer p-2"
                  onClick={() => router.push('/saved-recipes')}
                  aria-label="Saved Recipes"
                >
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer p-2"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => router.push('/login')}>
                Sign in
              </Button>
              <Button size="sm" className="cursor-pointer" onClick={() => router.push('/signup')}>
                Sign up
              </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center max-w-6xl sm:mb-8">
          <Image
            src="/logo.png"
            alt="Munch logo"
            width={120}
            height={120}
            className="mx-auto mb-6 rounded-2xl"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            cook4me.
          </h1>
          <p className="text-xl text-muted-foreground">
            Get personalized recipes tailored to your preferences
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">
              Generating your perfect meal...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive text-center">{error}</p>
          </div>
        )}

        {/* Form or Recipe Display */}
        {!isLoading && (
          <>
            {recipe ? (
              <div className="p-8 sm:p-0">
                <RecipeDisplay recipe={recipe} onGenerateAnother={handleGenerateAnother} />
              </div>
            ) : (
              <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
