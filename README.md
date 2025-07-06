# VibePage - Domain Registration & VibePage Studio

A modern domain registration platform with an integrated VibePage studio, powered by AI translations.

## Features

- **Domain Search & Registration**: Find and register domains with real-time availability checking
- **VibePage Studio**: Create stunning social media pages with drag-and-drop builder
- **Multi-language Support**: English, French, and Malagasy with AI-powered translations
- **User Authentication**: Secure sign-up and sign-in with Supabase
- **Shopping Cart**: Add domains to cart with currency conversion
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Supabase Auth
- **Translations**: Lingo.dev with AI-powered translations
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Configure Supabase**:
   - Create a Supabase project
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`

4. **Configure Lingo.dev**:
   - Sign up at [lingo.dev](https://lingo.dev)
   - Add your `LINGO_API_KEY` to `.env`
   - Or use alternative AI providers (Groq, OpenAI) by setting `GROQ_API_KEY` or `OPENAI_API_KEY`

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Lingo.dev Integration

This project uses Lingo.dev for AI-powered translations supporting:

- **English** (default)
- **French** (Français)
- **Malagasy** (Malagasy)

### Translation Workflow

1. **Automatic Extraction**: Lingo.dev scans your code for `t()` function calls
2. **AI Translation**: Generates translations using AI with context-aware prompts
3. **Hot Reload**: Translations update in real-time during development
4. **Build Optimization**: Creates optimized translation bundles for production

### Adding New Translations

Simply use the `t()` function in your components:

```tsx
import { t } from 'lingo.dev/react';

function MyComponent() {
  return <h1>{t('welcome.title')}</h1>;
}
```

Lingo.dev will automatically:
- Extract the translation key
- Generate translations for all configured locales
- Update the translation files

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── card-studio/    # VibePage Studio components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # Base UI components
├── context/            # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── locales/            # Translation files (auto-generated)
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
