'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/lib/types';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe;
  onGenerateAnother: () => void;
}

export function RecipeDisplay({ recipe, onGenerateAnother }: RecipeDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Recipe Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{recipe.name}</CardTitle>
          <CardDescription className="text-base mt-2">
            {recipe.description}
          </CardDescription>
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
    </div>
  );
}
