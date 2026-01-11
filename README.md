# cook4me.

![Screenshot](/screenshot.png)

An intelligent AI-powered recipe generator that creates personalized recipes tailored to your preferences, dietary needs, and taste profile. Built with Next.js 15, Claude Sonnet 4, and Firebase.

## Features

### AI-Powered Recipe Generation
- **Claude Sonnet 4 Integration**: Leverages Anthropic's latest AI model for high-quality, creative recipe generation
- **Detailed Recipes**: Complete with ingredients, step-by-step instructions, cooking times, and helpful tips
- **Always Includes Nutrition**: Every recipe comes with accurate calorie and macronutrient information

### Smart Personalization
- **Taste Profile Learning**: Automatically analyzes your saved and loved recipes to understand your preferences
- **Intelligent Recommendations**: Future recipes incorporate your favorite cuisines, ingredients, and cooking styles
- **Weighted Favorites**: Loved recipes have more influence on personalization than just saved ones

### Macro & Nutrition Tracking
- **Daily Macro Targets**: Set optional goals for calories, protein, carbs, and fats per serving
- **Accurate Calculations**: AI generates recipes that closely match your nutritional targets
- **Visual Nutrition Display**: Clear breakdown of macros for each recipe

### User Authentication & Profiles
- **Multiple Auth Methods**: Sign up with email/password or Google account
- **User Profiles**: Customizable usernames and profile pictures
- **Secure Storage**: Firebase Authentication with protected routes

### Recipe Management
- **Save Recipes**: Bookmark recipes for quick access later
- **Love System**: Mark your absolute favorites to improve personalization
- **Recipe Collection**: View all your saved recipes in one place
- **Easy Deletion**: Remove recipes you no longer want

### Customization Options
- **Cuisine Types**: Italian, Mexican, Chinese, Japanese, Indian, Thai, French, Mediterranean, and more
- **Dietary Restrictions**: Vegetarian, Vegan, Gluten-free, Dairy-free, Nut-free, etc.
- **Skill Levels**: Beginner, Intermediate, Advanced
- **Cooking Time**: Set maximum time limits (15-120+ minutes)
- **Servings**: Adjust for 1-10+ people
- **Meal Types**: Breakfast, Lunch, Dinner, Snack, Dessert

### Responsive Design
- **Mobile-Friendly**: Optimized navigation and layout for all screen sizes
- **Icon-Based Mobile Nav**: Clean, efficient interface on small screens
- **Fast Performance**: Built with Next.js 15 and Turbopack

### Progressive Web App (PWA)
- **Installable**: Add cook4me to your home screen on any device
- **Offline Support**: Service workers cache assets for offline functionality
- **App-Like Experience**: Runs in standalone mode without browser chrome
- **Fast Loading**: Optimized caching strategies for instant load times
- **App Shortcuts**: Quick access to Generate Recipe and Saved Recipes from your home screen
- **Cross-Platform**: Works on iOS, Android, and desktop devices

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **PWA**: @ducanh2912/next-pwa (Service workers & offline support)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rickysegura/cook4me.git
cd cook4me
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── generate-recipe/  # Recipe generation API endpoint
│   ├── login/                # Authentication pages
│   ├── signup/
│   ├── saved-recipes/        # User's recipe collection
│   ├── settings/             # User profile settings
│   └── page.tsx              # Main recipe generator
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── recipe-form.tsx       # Recipe preferences form
│   └── recipe-display.tsx    # Recipe output display
├── contexts/
│   └── AuthContext.tsx       # Global auth state
├── hooks/
│   └── useAuth.ts            # Auth hook
└── lib/
    ├── firebase.ts           # Firebase initialization
    ├── firebase-auth.ts      # Auth functions
    ├── firebase-firestore.ts # Generic Firestore operations
    ├── firebase-storage.ts   # Storage operations
    ├── recipes-db.ts         # Recipe-specific operations
    ├── users-db.ts           # User profile operations
    ├── taste-profile.ts      # Taste profile analysis
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Utility functions
```

## How It Works

### Recipe Generation Flow

1. **User Input**: Fill out preferences (cuisine, dietary needs, skill level, etc.)
2. **Taste Analysis**: System analyzes your saved/loved recipes (if logged in)
3. **AI Generation**: Claude Sonnet 4 creates a personalized recipe
4. **Display**: Recipe shown with full details and nutrition info
5. **Save/Love**: Optionally save and mark as favorite for future personalization

### Taste Profile System

The taste profile automatically learns from your interactions:

- **Cuisines**: Identifies patterns in recipe names and descriptions
- **Ingredients**: Tracks your most-used ingredients
- **Difficulty**: Understands your preferred complexity level
- **Timing**: Calculates average cooking time preferences
- **Nutrition**: Averages macro targets from saved recipes
- **Dietary Patterns**: Detects common restrictions (vegetarian, gluten-free, etc.)

Loved recipes are weighted higher in the analysis, making your favorites more influential in future recommendations.

## Firebase Setup

### Firestore Collections

- `users`: User profiles with usernames and profile pictures
- `savedRecipes`: User's saved recipes with love status

### Storage Structure

- `profile-pictures/{userId}/`: User profile images

### Security Rules

Ensure proper Firestore security rules are configured:
- Users can only read/write their own data
- Authentication required for all operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Claude AI](https://www.anthropic.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend by [Firebase](https://firebase.google.com/)
