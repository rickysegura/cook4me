'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RecipePreferences } from '@/lib/types';

interface RecipeFormProps {
  onSubmit: (preferences: RecipePreferences) => void;
  isLoading: boolean;
}

export function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [cuisineType, setCuisineType] = useState('Italian');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [maxCookingTime, setMaxCookingTime] = useState([45]);
  const [servings, setServings] = useState(4);
  const [mealType, setMealType] = useState('Dinner');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("None");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preferences: RecipePreferences = {
      cuisineType,
      dietaryRestrictions,
      skillLevel,
      maxCookingTime: maxCookingTime[0],
      servings,
      mealType,
      additionalInstructions,
    };

    onSubmit(preferences);
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Recipe Preferences</CardTitle>
        <CardDescription>
          Tell us what you&apos;re in the mood for, and we&apos;ll generate a custom recipe just for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cuisine Type */}
          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine Type</Label>
            <Select value={cuisineType} onValueChange={setCuisineType}>
              <SelectTrigger id="cuisine">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger id="meal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Brunch">Brunch</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Appetizer">Appetizer</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'].map(
                (restriction) => (
                  <Button
                    key={restriction}
                    type="button"
                    variant={dietaryRestrictions.includes(restriction) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDietaryRestriction(restriction)}
                  >
                    {restriction}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Skill Level */}
          <div className="space-y-2">
            <Label htmlFor="skill">Skill Level</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger id="skill">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Cooking Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Maximum Cooking Time: {maxCookingTime[0]} minutes</Label>
            <Slider
              id="time"
              min={15}
              max={180}
              step={15}
              value={maxCookingTime}
              onValueChange={setMaxCookingTime}
              className="w-full"
            />
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings">Number of Servings</Label>
            <Input
              id="servings"
              type="number"
              min={1}
              max={12}
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <Label htmlFor="additionalInstructions">Additional Instructions</Label>
            <Input
              id="additionalInstructions"
              type="text"
              value={additionalInstructions}
              onClick={e => e.currentTarget.value === "None" ? setAdditionalInstructions("") : setAdditionalInstructions(e.currentTarget.value)}
              onChange={e => setAdditionalInstructions(e.currentTarget.value)}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Generating Recipe...' : 'Generate Recipe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
