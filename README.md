# Khetha NCAP Mobile

Khetha NCAP Mobile is a mobile-first career guidance prototype built with React Native and Expo for the DHET Khetha NCAP experience. It helps learners explore careers, compare subjects, complete guided assessments, and discover relevant qualifications and providers in South Africa.

## Overview

The app is designed around a learner journey:

- Start with onboarding and preference setup
- Choose a language and text size
- Answer career and job-fit questionnaires
- Review recommended career matches
- Explore subjects, qualifications, and institutions
- Save favourites and track progress through the journey

## Included features

- Onboarding flow with language selection and accessibility settings
- Home dashboard with progress tracking and top career match
- Career choice questionnaire and job-fit assessment
- Subject chooser for mapping subjects to career pathways
- Career detail pages with skills, subjects, salary range, and outlook
- Qualification and provider directory views
- Saved items and profile/journey tracking
- Offline-friendly local data with optional Supabase integration
- Accessibility-focused design with larger touch targets and text scaling

## Tech stack

- React Native + Expo
- Expo Router for navigation
- Zustand for local app state
- AsyncStorage for persistence
- Supabase client for optional backend integration
- TypeScript

## App flow

Typical user journey in the current version:

1. Onboarding
2. Consent and profile setup
3. Home dashboard
4. Career choice and job-fit quiz
5. Career matching and recommendations
6. Explore careers, qualifications, and provider information
7. Save interest and continue through journey/profile screens

## Local setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your Supabase values in the `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Start the app:

```bash
npx expo start
```

Optional platform commands:

```bash
npm run android
npm run ios
npm run web
```

## Supabase setup

If you want to use the Supabase-backed version of the app, run the SQL schema in the Supabase SQL editor:

```bash
supabase/schema.sql
```

The app also works with its bundled demo data before a remote Supabase configuration is connected.

## Project structure

```text
app/                # Expo Router screens and routes
src/
  components/       # Reusable UI components
  data/             # Demo career, qualification, and provider data
  i18n.ts           # Localisation strings
  lib/              # Supabase and helper logic
  store/            # Zustand state management
  theme.ts          # Shared styling and design tokens
supabase/
  schema.sql        # Database schema for Supabase integration
```

## Key screens

- Landing and onboarding
- Home dashboard
- Subject chooser
- Career questionnaire
- Job-fit questionnaire
- Career profile pages
- Qualification detail pages
- Provider detail pages
- Saved items and contact/adviser screens

## Notes

This project is a prototype and intentionally prioritises mobile-first exploration, low-bandwidth access, and accessibility for learners navigating post-school career decisions in South Africa.
