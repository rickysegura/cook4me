'use client';

import { useState } from 'react';
import { RecipeForm } from '@/components/recipe-form';
import { RecipeDisplay } from '@/components/recipe-display';
import { Recipe, RecipePreferences } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Recipe Generator
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
              Generating your perfect recipe...
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
              <RecipeDisplay recipe={recipe} onGenerateAnother={handleGenerateAnother} />
            ) : (
              <RecipeForm onSubmit={handleGenerateRecipe} isLoading={isLoading} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
