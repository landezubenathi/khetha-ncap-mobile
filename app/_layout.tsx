import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';
import { supabase } from '../src/lib/supabase';
import { useUserStore } from '../src/store/user';
import { setupNotificationHandler, cancelJourneyReminder, registerForPushNotifications, scheduleQuizNudge, scheduleJourneyReminder, scheduleStreakLapse, scheduleApplicationSeasonAlert } from '../src/lib/notifications';
import { OfflineBanner } from '../src/lib/connectivity.tsx';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 2,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

export default function RootLayout() {
  const { consentGiven, recordOpen, setPushToken, allResults, saved, streakDays } = useUserStore();

  useEffect(() => {
    setupNotificationHandler();
    recordOpen();

    // Register for push + schedule smart notifications
    registerForPushNotifications().then((token) => {
      if (token) setPushToken(token);
    });

    const hasQuiz = allResults.length > 0;
    const hasSaves = saved.length > 0;

    if (!hasQuiz) scheduleQuizNudge();
    if (hasSaves) scheduleJourneyReminder();
    else cancelJourneyReminder();

    scheduleStreakLapse(streakDays);
    scheduleApplicationSeasonAlert();
  }, []);

  // Supabase auth state listener
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/auth');
      if (event === 'SIGNED_IN') router.replace(consentGiven ? '/(tabs)' : '/consent');
    });
    return () => subscription.unsubscribe();
  }, [consentGiven]);

  return (
    <QueryClientProvider client={client}>
      <StatusBar style="light" backgroundColor={colors.navy} />
      <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index"               options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"          options={{ headerShown: false }} />
        <Stack.Screen name="auth"                options={{ headerShown: false }} />
        <Stack.Screen name="consent"             options={{ headerShown: false }} />
        <Stack.Screen name="results"             options={{ title: 'Your matches' }} />
        <Stack.Screen name="contact"             options={{ title: 'Get Advice' }} />
        <Stack.Screen name="subject-chooser"      options={{ title: 'Subject Chooser' }} />
        <Stack.Screen name="questionnaire/[type]" options={{ title: 'Career quiz' }} />
        <Stack.Screen name="career/[id]"         options={{ title: 'Career details' }} />
        <Stack.Screen name="qualification/[id]"  options={{ title: 'Qualification' }} />
        <Stack.Screen name="provider/[id]"       options={{ title: 'Provider' }} />
        <Stack.Screen name="accessibility"        options={{ title: 'Accessibility' }} />
        <Stack.Screen name="chatbot"              options={{ headerShown: false }} />
        <Stack.Screen name="advisor"              options={{ headerShown: false }} />
      </Stack>
      </View>
    </QueryClientProvider>
  );
}
