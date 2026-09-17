# Khetha NCAP Mobile

A React Native / Expo prototype for the DHET Khetha NCAP challenge.

## Run locally

```bash
npm install
cp .env.example .env
# add Supabase URL and anon key
npx expo start
```

Run `supabase/schema.sql` in the Supabase SQL Editor. The UI works with local demo data before Supabase is configured.

## Demo flow

Onboarding → Home → Career quiz → Career match → Save → Journey/Profile.

## Product principles

- Mobile-first NCAP information architecture
- Low-bandwidth-friendly screens and local state
- Accessible type sizes, contrast and touch targets
- Consent-aware profile and assessment storage
- Extensible directories for careers, qualifications and providers

## Next implementation steps

1. Add Supabase auth screens and session guard.
2. Replace demo result with weighted recommendation queries.
3. Add AsyncStorage persistence and an offline queue.
4. Add translations with a language dictionary.
5. Integrate push notifications and provider geolocation.
