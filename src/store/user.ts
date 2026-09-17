import { create } from 'zustand';

type UserState = { language: string; onboardingDone: boolean; saved: string[]; setLanguage: (language: string) => void; completeOnboarding: () => void; toggleSaved: (id: string) => void };
export const useUserStore = create<UserState>((set) => ({
  language: 'English', onboardingDone: false, saved: [],
  setLanguage: (language) => set({ language }),
  completeOnboarding: () => set({ onboardingDone: true }),
  toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] }))
}));
