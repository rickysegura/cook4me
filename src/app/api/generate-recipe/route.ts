import { NextRequest, NextResponse } from 'next/server';
import { RecipePreferences, Recipe } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const preferences: RecipePreferences = await request.json();

    // Construct the prompt for Claude
    const prompt = `Generate a complete recipe based on these preferences: 
    Cuisine Type: ${preferences.cuisineType}
    Dietary Restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
    Skill Level: ${preferences.skillLevel}
    Maximum Cooking Time: ${preferences.maxCookingTime} minutes
    Servings: ${preferences.servings}
    Meal Type: ${preferences.mealType}
    Additional Instructions: ${preferences.additionalInstructions}

    Please create an original, detailed recipe that matches ALL of these criteria. 

    IMPORTANT: You must respond with ONLY a valid JSON object in this exact format. Do not include any text, explanations, or markdown formatting outside the JSON structure:

    {
      "name": "Recipe Name",
      "description": "Brief description of the dish (2-3 sentences)",
      "prepTime": number (in minutes),
      "cookTime": number (in minutes),
      "totalTime": number (in minutes),
      "servings": number,
      "difficulty": "Easy" | "Medium" | "Hard",
      "ingredients": [
        {
          "item": "ingredient name",
          "amount": "quantity and unit",
          "notes": "optional preparation notes"
        }
      ],
      "instructions": [
        "Step 1 description",
        "Step 2 description"
      ],
      "tips": [
        "Optional cooking tip 1",
        "Optional cooking tip 2"
      ]
    }

    DO NOT include markdown code blocks or any text outside the JSON object. Your entire response must be valid JSON only.`;

    // Call the Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate recipe' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const recipeText = data.content[0].text;

    // Parse the JSON response
    let recipe: Recipe;
    try {
      // Clean up the response in case there's any markdown formatting
      const cleanedText = recipeText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      recipe = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse recipe JSON:', parseError);
      console.error('Raw response:', recipeText);
      return NextResponse.json(
        { error: 'Failed to parse recipe data' },
        { status: 500 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
