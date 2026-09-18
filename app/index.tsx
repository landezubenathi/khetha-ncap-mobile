import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUserStore } from '../src/store/user';
import { colors } from '../src/theme';

export default function Index() {
  const { onboardingDone, consentGiven, _hydrated } = useUserStore();

  // Wait for AsyncStorage / localStorage rehydration before redirecting.
  // Without this the store reads defaults and sends the user to /onboarding every time.
  if (!_hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.yellow} size="large" />
      </View>
    );
  }

  if (!onboardingDone) return <Redirect href="/onboarding" />;
  if (!consentGiven) return <Redirect href="/auth" />;
  return <Redirect href="/(tabs)" />;
}
