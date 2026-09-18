import { Stack, router } from 'expo-router';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { colors, spacing, fs, MIN_TOUCH } from '../src/theme';
import { useT } from '../src/i18n';
import { useUserStore } from '../src/store/user';
import { supabase } from '../src/lib/supabase';
import { registerForPushNotifications } from '../src/lib/notifications';
import { logConsent, syncProfile } from '../src/lib/api';

// Increment this when consent wording changes — forces re-consent
const CONSENT_VERSION = 1;

type ConsentType = 'data_storage' | 'push_notifications' | 'analytics';

const CONSENT_ITEMS: Array<{
  key: ConsentType;
  icon: string;
  title: string;
  body: string;
  required: boolean;
}> = [
  {
    key: 'data_storage',
    icon: '🔒',
    title: 'Save my career profile',
    body: 'Store your quiz answers, saved items and journey progress so you can pick up where you left off on any device.',
    required: true,
  },
  {
    key: 'push_notifications',
    icon: '🔔',
    title: 'Career reminders & deadline alerts',
    body: 'Send push notifications for application deadlines, upcoming events and journey nudges. You can turn these off at any time.',
    required: false,
  },
  {
    key: 'analytics',
    icon: '📊',
    title: 'Anonymous usage analytics',
    body: 'Share anonymous, aggregated usage data to help DHET improve the Khetha platform. No personal data is included.',
    required: false,
  },
];

export default function Consent() {
  const t = useT();
  const { setConsent, fontScale, clearAll } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // All items start checked; required items cannot be unchecked
  const [checked, setChecked] = useState<Record<ConsentType, boolean>>({
    data_storage: true,
    push_notifications: true,
    analytics: false,
  });

  function toggle(key: ConsentType) {
    const item = CONSENT_ITEMS.find((i) => i.key === key);
    if (item?.required) return; // required — cannot uncheck
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  }

  async function agree() {
    setLoading(true);

    let pushToken: string | null = null;
    if (checked.push_notifications) {
      pushToken = await registerForPushNotifications();
    }

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Sync profile with consent version
        await syncProfile({
          id: user.id,
          language: '',
          province: '',
          grade: '',
          consent_version: CONSENT_VERSION,
          push_token: pushToken,
        });

        // Append-only consent audit log
        await logConsent({
          user_id: user.id,
          version: CONSENT_VERSION,
          data_storage: checked.data_storage,
          push_notifications: checked.push_notifications,
          analytics: checked.analytics,
          action: 'granted',
        });
      }
    }

    setConsent(true);
    setLoading(false);
    router.replace('/(tabs)');
  }

  async function withdraw() {
    setWithdrawing(true);

    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Log withdrawal before deleting
        await logConsent({
          user_id: user.id,
          version: CONSENT_VERSION,
          data_storage: false,
          push_notifications: false,
          analytics: false,
          action: 'withdrawn',
        });

        // Delete all user data (RLS ensures only own rows)
        await Promise.all([
          supabase.from('assessments').delete().eq('user_id', user.id),
          supabase.from('assessment_answers').delete().eq('user_id', user.id),
          supabase.from('saved_items').delete().eq('user_id', user.id),
          supabase.from('profiles').delete().eq('id', user.id),
        ]);

        await supabase.auth.signOut();
      }
    }

    clearAll();
    setWithdrawing(false);
    router.replace('/auth');
  }

  if (showWithdraw) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={{ padding: spacing.xl, flexGrow: 1, justifyContent: 'center' }}>
          <Text style={{ color: colors.yellow, fontSize: fs(18, fontScale), fontWeight: '800', letterSpacing: 2 }}>KHETHA NCAP</Text>
          <Text style={{ color: colors.white, fontSize: fs(26, fontScale), fontWeight: '800', marginTop: 16, lineHeight: fs(26, fontScale) * 1.3 }}>
            Withdraw consent
          </Text>
          <Text style={{ color: '#D9E2EC', fontSize: fs(14, fontScale), marginTop: 12, lineHeight: fs(14, fontScale) * 1.7 }}>
            This will permanently delete all your saved data from Khetha — quiz results, saved careers, notes and your profile. This cannot be undone.
          </Text>

          <View style={{ backgroundColor: colors.danger + '22', borderRadius: 14, padding: spacing.md, marginTop: 24 }}>
            <Text style={{ color: colors.danger, fontWeight: '800', fontSize: fs(14, fontScale), marginBottom: 8 }}>
              ⚠️ What will be deleted:
            </Text>
            {['Quiz results and answers', 'Saved careers, qualifications and providers', 'Personal notes and deadlines', 'Your profile (grade, province, language)'].map((item) => (
              <Text key={item} style={{ color: '#D9E2EC', fontSize: fs(13, fontScale), marginBottom: 4 }}>• {item}</Text>
            ))}
          </View>

          <Pressable
            onPress={withdraw}
            disabled={withdrawing}
            style={{ backgroundColor: colors.danger, borderRadius: 14, marginTop: 32, minHeight: MIN_TOUCH + 12, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Confirm withdrawal and delete all data"
          >
            {withdrawing
              ? <ActivityIndicator color={colors.white} />
              : <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(15, fontScale) }}>Delete all my data</Text>
            }
          </Pressable>

          <Pressable
            onPress={() => setShowWithdraw(false)}
            style={{ marginTop: 16, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
          >
            <Text style={{ color: '#829AB1', fontSize: fs(14, fontScale) }}>← Cancel</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, flexGrow: 1 }}>
        <Text style={{ color: colors.yellow, fontSize: fs(18, fontScale), fontWeight: '800', letterSpacing: 2 }}>KHETHA NCAP</Text>
        <Text style={{ color: colors.white, fontSize: fs(28, fontScale), fontWeight: '800', marginTop: 16, lineHeight: fs(28, fontScale) * 1.25 }}>
          Your privacy matters
        </Text>
        <Text style={{ color: '#D9E2EC', fontSize: fs(14, fontScale), marginTop: 10, lineHeight: fs(14, fontScale) * 1.7 }}>
          {t('consent_body')}
        </Text>

        {/* Granular consent toggles */}
        <View style={{ marginTop: 28, gap: 12 }}>
          {CONSENT_ITEMS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => toggle(item.key)}
              style={{
                backgroundColor: '#1E3A5F',
                borderRadius: 14,
                padding: spacing.md,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 14,
                borderWidth: 1.5,
                borderColor: checked[item.key] ? colors.teal : '#2D5A8E',
              }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: checked[item.key] }}
              accessibilityLabel={item.title}
            >
              {/* Checkbox */}
              <View style={{
                width: 24, height: 24, borderRadius: 6, marginTop: 2,
                backgroundColor: checked[item.key] ? colors.teal : 'transparent',
                borderWidth: 2, borderColor: checked[item.key] ? colors.teal : '#829AB1',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {checked[item.key] && <Text style={{ color: colors.white, fontSize: 14, fontWeight: '800' }}>✓</Text>}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(14, fontScale), flex: 1 }}>{item.title}</Text>
                  {item.required && (
                    <View style={{ backgroundColor: colors.teal + '33', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ color: colors.teal, fontSize: 10, fontWeight: '700' }}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: '#829AB1', fontSize: fs(12, fontScale), lineHeight: fs(12, fontScale) * 1.6 }}>{item.body}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Legal footer */}
        <Text style={{ color: '#627D98', fontSize: fs(11, fontScale), marginTop: 20, lineHeight: fs(11, fontScale) * 1.7 }}>
          By continuing you agree to the DHET Khetha privacy policy (v{CONSENT_VERSION}). Built on the National Career Advice Portal. You can withdraw consent at any time from your Profile.
        </Text>

        {/* Agree CTA */}
        <Pressable
          onPress={agree}
          disabled={loading}
          style={{
            backgroundColor: colors.yellow, borderRadius: 14, marginTop: 28,
            minHeight: MIN_TOUCH + 12, alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          accessibilityRole="button"
          accessibilityLabel={t('consent_agree')}
        >
          {loading
            ? <ActivityIndicator color={colors.navy} />
            : <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>{t('consent_agree')}</Text>
          }
        </Pressable>

        {/* Decline */}
        <Pressable
          onPress={async () => { if (supabase) await supabase.auth.signOut(); router.replace('/auth'); }}
          style={{ marginTop: 14, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="No thanks, sign out"
        >
          <Text style={{ color: '#829AB1', fontSize: fs(14, fontScale) }}>No thanks — sign out</Text>
        </Pressable>

        {/* Withdraw existing consent */}
        <Pressable
          onPress={() => setShowWithdraw(true)}
          style={{ marginTop: 8, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Withdraw consent and delete my data"
        >
          <Text style={{ color: colors.danger + 'AA', fontSize: fs(12, fontScale) }}>Withdraw consent & delete my data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
