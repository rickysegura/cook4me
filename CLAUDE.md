# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

cook4me is an AI-powered recipe generator built with Next.js 15 that creates personalized recipes based on user preferences. The application uses Claude Sonnet 4 (via Anthropic API) to generate recipes and Firebase for authentication and data storage.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production bundle with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom components
- **UI Components**: Radix UI primitives (dialog, select, slider, label)
- **Authentication**: Firebase Auth (email/password and Google)
- **Database**: Firestore
- **Storage**: Firebase Storage
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── api/
│   │   └── generate-recipe/  # API route for Claude recipe generation
│   ├── login/                # Authentication pages
│   ├── signup/
│   ├── saved-recipes/        # User's saved recipes page
│   └── page.tsx              # Main recipe generator page
├── components/
│   ├── ui/                   # Reusable Radix UI components
│   ├── ProtectedRoute.tsx    # Auth guard component
│   ├── recipe-form.tsx       # Recipe preferences form
│   └── recipe-display.tsx    # Recipe output display with save functionality
├── contexts/
│   └── AuthContext.tsx       # Global auth state with Firebase onAuthStateChanged
├── hooks/
│   └── useAuth.ts            # Auth hook
└── lib/
    ├── firebase.ts           # Firebase initialization (client-side only)
    ├── firebase-auth.ts      # Auth functions (signUp, signIn, signOut, Google)
    ├── firebase-firestore.ts # Generic Firestore CRUD operations
    ├── firebase-storage.ts   # Storage operations
    ├── recipes-db.ts         # Recipe-specific Firestore operations
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Utility functions (cn for className merging)
```

### Key Architectural Patterns

**Firebase Initialization**: Firebase is initialized only on the client-side (checking `typeof window !== 'undefined'`) in `src/lib/firebase.ts` to avoid SSR issues.

**Authentication Flow**:
- `AuthContext` wraps the entire application in `layout.tsx`
- Uses Firebase `onAuthStateChanged` listener to track auth state globally
- `ProtectedRoute` component redirects unauthenticated users to `/login`
- Auth functions abstracted in `firebase-auth.ts` for reusability

**Recipe Generation Flow**:
1. User fills out `RecipeForm` with preferences (cuisine, dietary restrictions, skill level, etc.)
2. Form submits to `/api/generate-recipe` route handler
3. API route constructs prompt and calls Anthropic API with `claude-sonnet-4-20250514`
4. Claude returns JSON-formatted recipe matching the `Recipe` interface
5. Recipe displayed in `RecipeDisplay` component with save functionality
6. Authenticated users can save recipes to Firestore via `recipes-db.ts`

**Saved Recipes**:
- Stored in Firestore collection `savedRecipes` with userId field
- Each recipe includes timestamp (`savedAt`) and full recipe data
- `isRecipeSaved` function checks for duplicates by recipe name
- Users can view and delete saved recipes on `/saved-recipes` page

**Data Layer**:
- `firebase-firestore.ts`: Generic CRUD operations with automatic timestamps
- `recipes-db.ts`: Recipe-specific operations (saveRecipe, getSavedRecipes, deleteRecipe, isRecipeSaved)
- All Firestore operations handle the `savedRecipes` collection

**Type Safety**:
- `RecipePreferences`: User input for recipe generation
- `Recipe`: AI-generated recipe structure with ingredients, instructions, times
- `SavedRecipe`: Extends Recipe with userId and savedAt timestamp
- Path aliases configured: `@/*` maps to `./src/*`

## Environment Variables

Required in `.env.local`:

```bash
# Anthropic API
ANTHROPIC_API_KEY=                          # API key for Claude Sonnet 4 (from console.anthropic.com)

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=               # Firebase project API key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=           # Firebase Auth domain (project-id.firebaseapp.com)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=            # Firebase project ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=        # Firebase Storage bucket URL
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=   # Firebase Cloud Messaging sender ID
NEXT_PUBLIC_FIREBASE_APP_ID=                # Firebase application ID
```

**Note**: All Firebase variables are prefixed with `NEXT_PUBLIC_` because they're used in client-side code. These values are safe to expose as Firebase security is handled through Firestore rules and Auth configuration.

## Important Implementation Details

- **Turbopack**: Development and build use `--turbopack` flag for faster compilation
- **Client-Side Only**: Firebase modules must be used in 'use client' components only
- **API Route Location**: Recipe generation happens server-side in `app/api/generate-recipe/route.ts`
- **Claude Response Format**: The API route includes cleanup logic to strip markdown code blocks from Claude's response before parsing JSON
- **Authentication State**: Managed globally through AuthContext, accessible via `useAuth()` hook
- **Firestore Structure**: Single collection `savedRecipes` with userId-based queries for multi-user support
