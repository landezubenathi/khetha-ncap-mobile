import { Stack, router } from 'expo-router';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { colors, spacing } from '../src/theme';
import { useT } from '../src/i18n';
import { useUserStore } from '../src/store/user';
import { supabase } from '../src/lib/supabase';
import { registerForPushNotifications } from '../src/lib/notifications';

const POINTS = [
  { icon: '🔒', text: 'Your quiz answers are stored privately and used only to personalise your career suggestions.' },
  { icon: '🚫', text: 'Your data is never sold or shared with third parties.' },
  { icon: '🗑️', text: 'You can withdraw consent and delete your data at any time from your Profile.' },
];

export default function Consent() {
  const t = useT();
  const setConsent = useUserStore((s) => s.setConsent);
  const [loading, setLoading] = useState(false);

  async function agree() {
    setLoading(true);

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Register push token and store on profile
        const pushToken = await registerForPushNotifications();
        await supabase.from('profiles').upsert({
          id: user.id,
          consent_at: new Date().toISOString(),
          ...(pushToken ? { push_token: pushToken } : {}),
        });
      }
    } else {
      // Guest — still try to register for local notifications
      await registerForPushNotifications();
    }

    setConsent(true);
    setLoading(false);
    router.replace('/(tabs)');
  }

  async function decline() {
    if (supabase) await supabase.auth.signOut();
    router.replace('/auth');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, justifyContent: 'center', flexGrow: 1 }}>
        <Text style={{ color: colors.yellow, fontSize: 18, fontWeight: '800', letterSpacing: 2 }}>KHETHA NCAP</Text>
        <Text style={{ color: colors.white, fontSize: 28, fontWeight: '800', marginTop: 16, lineHeight: 36 }}>
          Your privacy matters
        </Text>
        <Text style={{ color: '#D9E2EC', fontSize: 15, marginTop: 12, lineHeight: 24 }}>
          {t('consent_body')}
        </Text>

        <View style={{ marginTop: 32, gap: 20 }}>
          {POINTS.map((p) => (
            <View key={p.icon} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
              <Text style={{ fontSize: 22 }}>{p.icon}</Text>
              <Text style={{ color: '#D9E2EC', fontSize: 14, lineHeight: 22, flex: 1 }}>{p.text}</Text>
            </View>
          ))}
        </View>

        <Text style={{ color: '#829AB1', fontSize: 12, marginTop: 28, lineHeight: 18 }}>
          By continuing you agree to the DHET Khetha privacy policy. This app is built on the National Career Advice Portal (ncap.careerhelp.org.za).
        </Text>

        <Pressable
          onPress={agree}
          disabled={loading}
          style={{ backgroundColor: colors.yellow, borderRadius: 14, marginTop: 36, minHeight: 56, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('consent_agree')}
        >
          {loading
            ? <ActivityIndicator color={colors.navy} />
            : <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>{t('consent_agree')}</Text>
          }
        </Pressable>

        <Pressable
          onPress={decline}
          style={{ marginTop: 16, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="No thanks, sign out"
        >
          <Text style={{ color: '#829AB1', fontSize: 14 }}>No thanks — sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
