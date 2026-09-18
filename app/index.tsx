import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '../src/store/user';
import { useSession } from '../src/lib/session';
import { colors } from '../src/theme';

export default function Index() {
  const { onboardingDone, consentGiven, _hydrated } = useUserStore();
  const { authState } = useSession();

  // Wait for store rehydration AND session check before redirecting
  if (!_hydrated || authState === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.yellow} size="large" />
      </View>
    );
  }

  if (!onboardingDone) return <Redirect href="/onboarding" />;
  if (authState === 'unauthenticated') return <Redirect href="/auth" />;
  if (!consentGiven) return <Redirect href="/consent" />;
  return <Redirect href="/(tabs)" />;
}
