import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

export type MatchedCareer = { id: string; score: number; reason: string };

export type AssessmentResult = {
  type: string;
  careers: MatchedCareer[];
  answers?: Record<string, number>;
  completedAt: string;
};

export type SavedMeta = {
  note: string;           // user's personal note
  deadline: string;       // ISO date string for application deadline
  notifyMe: boolean;      // schedule a reminder for this item
};

// 6 progressive stages — drives home hero, journey steps, and next-action logic
export type JourneyStage =
  | 'onboarding'       // language not set
  | 'profile'          // language set, no quiz done
  | 'first_quiz'       // one quiz done, no saves
  | 'exploring'        // has saves, only one quiz done
  | 'both_quizzes'     // both career + job-fit done
  | 'ready';           // both quizzes + saves + province set

type UserState = {
  language: string;
  onboardingDone: boolean;
  grade: string;
  saved: string[];
  savedMeta: Record<string, SavedMeta>;  // keyed by saved item id
  consentGiven: boolean;
  province: string;
  fontScale: number;
  highContrast: boolean;
  pushToken: string | null;
  streakDays: number;
  lastOpenedAt: string;                  // ISO date — for streak calc
  assessmentResult: AssessmentResult | null;
  allResults: AssessmentResult[];
  _hydrated: boolean;

  setLanguage: (language: string) => void;
  completeOnboarding: () => void;
  setGrade: (grade: string) => void;
  toggleSaved: (id: string) => void;
  setSavedMeta: (id: string, meta: Partial<SavedMeta>) => void;
  setConsent: (v: boolean) => void;
  setProvince: (province: string) => void;
  setFontScale: (scale: number) => void;
  setHighContrast: (v: boolean) => void;
  setPushToken: (token: string | null) => void;
  recordOpen: () => void;                // call on app launch to update streak
  setAssessmentResult: (result: Omit<AssessmentResult, 'completedAt'>) => void;
  clearAll: () => void;
  setHydrated: () => void;
};

const defaults = {
  language: 'English',
  onboardingDone: false,
  grade: '',
  saved: [] as string[],
  savedMeta: {} as Record<string, SavedMeta>,
  consentGiven: false,
  province: '',
  fontScale: 1,
  highContrast: false,
  pushToken: null as string | null,
  streakDays: 0,
  lastOpenedAt: '',
  assessmentResult: null as AssessmentResult | null,
  allResults: [] as AssessmentResult[],
  _hydrated: false,
};

function getStorage() {
  if (Platform.OS === 'web') return createJSONStorage(() => localStorage);
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return createJSONStorage(() => AsyncStorage);
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...defaults,
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ onboardingDone: true }),
      setGrade: (grade) => set({ grade }),
      toggleSaved: (id) =>
        set((s) => {
          const isSaved = s.saved.includes(id);
          const savedMeta = { ...s.savedMeta };
          if (isSaved) delete savedMeta[id];
          return {
            saved: isSaved ? s.saved.filter((x) => x !== id) : [...s.saved, id],
            savedMeta,
          };
        }),
      setSavedMeta: (id, meta) =>
        set((s) => ({
          savedMeta: {
            ...s.savedMeta,
            [id]: { note: '', deadline: '', notifyMe: false, ...s.savedMeta[id], ...meta },
          },
        })),
      setConsent: (consentGiven) => set({ consentGiven }),
      setProvince: (province) => set({ province }),
      setFontScale: (fontScale) => set({ fontScale }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setPushToken: (pushToken) => set({ pushToken }),
      recordOpen: () =>
        set((s) => {
          const today = new Date().toDateString();
          const last  = s.lastOpenedAt ? new Date(s.lastOpenedAt).toDateString() : '';
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const streakDays =
            last === today      ? s.streakDays :          // same day, no change
            last === yesterday  ? s.streakDays + 1 :      // consecutive day
            1;                                            // streak broken
          return { streakDays, lastOpenedAt: new Date().toISOString() };
        }),
      setAssessmentResult: (result) =>
        set((s) => {
          const full: AssessmentResult = { ...result, completedAt: new Date().toISOString() };
          // Keep history, newest first, max 20 entries
          const allResults = [full, ...s.allResults.filter((r) => r.type !== result.type)].slice(0, 20);
          return { assessmentResult: full, allResults };
        }),
      clearAll: () => set({ ...defaults, _hydrated: true }),
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: 'khetha-user',
      storage: getStorage(),
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    }
  )
);

// ── Derived selectors ──────────────────────────────────────────────────────────

export function useJourneyStage(): JourneyStage {
  const { onboardingDone, allResults, saved, province } = useUserStore();
  if (!onboardingDone) return 'onboarding';
  const types = allResults.map((r) => r.type);
  const hasBoth = types.includes('career') && types.includes('job-fit');
  const hasAny = allResults.length > 0;
  const hasSaves = saved.length > 0;
  if (!hasAny) return 'profile';
  if (hasBoth && hasSaves && province) return 'ready';
  if (hasBoth) return 'both_quizzes';
  if (hasSaves) return 'exploring';
  return 'first_quiz';
}

// Get the latest result for a specific quiz type
export function useResultByType(type: string): AssessmentResult | null {
  const allResults = useUserStore((s) => s.allResults);
  return allResults.find((r) => r.type === type) ?? null;
}

// Completion percentage 0–100 for the journey progress ring
export function useJourneyProgress(): number {
  const { onboardingDone, allResults, saved, province, grade } = useUserStore();
  const types = allResults.map((r) => r.type);
  let score = 0;
  if (onboardingDone) score += 20;
  if (grade) score += 10;
  if (province) score += 10;
  if (types.includes('career')) score += 20;
  if (types.includes('job-fit')) score += 20;
  if (saved.length > 0) score += 10;
  if (saved.length >= 3) score += 10;
  return Math.min(score, 100);
}
