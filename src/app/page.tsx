'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { RecipeForm } from '@/components/recipe-form';
import { RecipeDisplay } from '@/components/recipe-display';
import { Recipe, RecipePreferences, UserProfile } from '@/lib/types';
import { Loader2, Sparkles, Clock, Heart, TrendingUp, Shield, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/lib/users-db';
import { PublicNav } from '@/components/public-nav';
import { UserNav } from '@/components/user-nav';

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
      // Analyze taste profile if user is logged in
      let tasteProfile = null;
      if (user) {
        const { analyzeTasteProfile } = await import('@/lib/taste-profile');
        tasteProfile = await analyzeTasteProfile(user.uid);
      }

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...preferences,
          ...(tasteProfile && { tasteProfile }),
        }),
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

  // Landing page for signed-out users
  if (!user) {
    return (
      <main className="min-h-screen">
        <PublicNav />

        {/* Hero Section */}
        <section className="container mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Recipe Generation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Your Personal Chef,{' '}
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Generate personalized recipes tailored to your taste, dietary needs, and skill level in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="cursor-pointer text-lg px-8" onClick={() => router.push('/signup')}>
                Start Cooking Free
              </Button>
              <Button size="lg" variant="outline" className="cursor-pointer text-lg px-8" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">No credit card required</p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto max-w-6xl px-4 py-20 border-t">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Cook Smarter</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make meal planning effortless and enjoyable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                Advanced AI creates unique recipes based on your preferences, dietary restrictions, and cooking skills.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Personalized to Your Taste</h3>
              <p className="text-muted-foreground">
                Our taste profiling system learns what you love and suggests recipes you&apos;ll enjoy.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Macro Tracking</h3>
              <p className="text-muted-foreground">
                Set daily macro targets and get recipes that align with your nutritional goals automatically.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Time-Conscious</h3>
              <p className="text-muted-foreground">
                Set your maximum cooking time and get recipes that fit perfectly into your busy schedule.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Save Your Favorites</h3>
              <p className="text-muted-foreground">
                Build your personal recipe collection and access your favorite meals anytime, anywhere.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Dietary Restrictions</h3>
              <p className="text-muted-foreground">
                Support for vegetarian, vegan, gluten-free, keto, and many more dietary preferences.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto max-w-6xl px-4 py-20 border-t">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From preferences to plate in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Set Your Preferences</h3>
              <p className="text-muted-foreground">
                Choose your cuisine, dietary needs, skill level, cooking time, and macro targets.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Generates Recipe</h3>
              <p className="text-muted-foreground">
                Our AI creates a unique recipe tailored specifically to your requirements.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Cook & Enjoy</h3>
              <p className="text-muted-foreground">
                Follow the step-by-step instructions and enjoy your personalized meal.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-6xl px-4 py-20 border-t">
          <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-primary/5 border-2 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Cooking?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of home cooks discovering new recipes every day.
            </p>
            <Button size="lg" className="cursor-pointer text-lg px-8" onClick={() => router.push('/signup')}>
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>
    );
  }

  // Recipe generator for signed-in users
  return (
    <main className="min-h-screen sm:py-8 pt-8">
      <div className="container mx-auto max-w-6xl">
        <UserNav user={user} userProfile={userProfile} onSignOut={handleSignOut} />

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
