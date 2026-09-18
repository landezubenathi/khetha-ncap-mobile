import { SafeAreaView, ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, fs } from '../../src/theme';
import { useUserStore, useJourneyProgress } from '../../src/store/user';
import { useT, LANGUAGE_LIST } from '../../src/i18n';
import { supabase } from '../../src/lib/supabase';
import { QUIZ_META } from '../../src/data/questionnaire';

const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Limpopo', 'Eastern Cape', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'];
const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Post-matric', 'Adult learner'];

export default function Profile() {
  const t = useT();
  const { language, setLanguage, province, setProvince, grade, setGrade, fontScale, consentGiven, allResults, clearAll } = useUserStore();
  const progress = useJourneyProgress();

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    clearAll();
    router.replace('/onboarding');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>
        <Text style={{ fontSize: fs(28, fontScale), fontWeight: '800', color: colors.navy }}>Profile</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20, fontSize: fs(14, fontScale) }}>
          Your preferences, progress and privacy.
        </Text>

        {/* Journey progress bar */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>Journey progress</Text>
            <Text style={{ color: colors.teal, fontWeight: '800', fontSize: fs(15, fontScale) }}>{progress}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
            <View style={{ height: 8, width: `${progress}%`, backgroundColor: colors.teal, borderRadius: 4 }} />
          </View>
          <Pressable onPress={() => router.push('/(tabs)/journey' as any)} style={{ marginTop: 10 }} accessibilityRole="button">
            <Text style={{ color: colors.blue, fontSize: 13, fontWeight: '700' }}>View full journey →</Text>
          </Pressable>
        </View>

        {/* Grade */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 12 }}>Your grade / level</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {GRADES.map((g) => (
              <Pressable
                key={g}
                onPress={() => setGrade(g)}
                style={{
                  borderWidth: 1.5,
                  borderColor: grade === g ? colors.blue : colors.border,
                  borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                  backgroundColor: grade === g ? colors.blue + '18' : colors.bg,
                  minHeight: 40, justifyContent: 'center',
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: grade === g }}
              >
                <Text style={{ color: grade === g ? colors.blue : colors.muted, fontWeight: '700', fontSize: 13 }}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 12 }}>{t('language_prompt')}</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {LANGUAGE_LIST.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={{
                  borderWidth: 2,
                  borderColor: language === lang ? colors.blue : colors.border,
                  borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
                  backgroundColor: language === lang ? colors.blue + '18' : colors.bg,
                  minHeight: 40, justifyContent: 'center',
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: language === lang }}
              >
                <Text style={{ color: language === lang ? colors.blue : colors.ink, fontWeight: '700', fontSize: fs(13, fontScale) }}>{lang}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Province */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Your province</Text>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {PROVINCES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setProvince(p)}
                style={{
                  borderWidth: 1.5,
                  borderColor: province === p ? colors.teal : colors.border,
                  borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
                  backgroundColor: province === p ? colors.teal + '18' : colors.bg,
                  minHeight: 36, justifyContent: 'center',
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: province === p }}
              >
                <Text style={{ color: province === p ? colors.teal : colors.muted, fontWeight: '600', fontSize: 12 }}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quiz history */}
        {allResults.length > 0 && (
          <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Assessment history</Text>
            {allResults.map((r) => {
              const meta = QUIZ_META[r.type];
              const date = new Date(r.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
              const topCareer = r.careers[0];
              return (
                <Pressable
                  key={r.type + r.completedAt}
                  onPress={() => router.push('/results')}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${meta?.title} results`}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: (meta?.color ?? colors.blue) + '18', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20 }}>{meta?.icon ?? '🎯'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 14 }}>{meta?.title ?? r.type}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                      {date}{topCareer ? ` · Top: ${topCareer.id.replace(/-/g, ' ')}` : ''}
                    </Text>
                  </View>
                  <Text style={{ color: colors.blue, fontSize: 18 }}>›</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Accessibility shortcut */}
        <Pressable
          onPress={() => router.push('/accessibility' as any)}
          style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility')}
        >
          <View>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>♿ {t('accessibility')}</Text>
            <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginTop: 3 }}>Text size · High contrast · Offline info</Text>
          </View>
          <Text style={{ color: colors.blue, fontSize: 20 }}>›</Text>
        </Pressable>

        {/* Privacy */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>Privacy & consent</Text>
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 13, lineHeight: 20 }}>
            {consentGiven
              ? '✓ You have given consent for your data to be stored securely.'
              : 'You are using guest mode. Data is stored on this device only.'}
          </Text>
        </View>

        {/* Contact adviser */}
        <Pressable
          onPress={() => router.push('/contact' as any)}
          style={{ backgroundColor: colors.teal, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('contact_adviser')}
        >
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>{t('contact_adviser')}</Text>
        </Pressable>

        {/* Khetha hotline */}
        <Pressable
          onPress={() => Linking.openURL('tel:0869990123')}
          style={{ backgroundColor: colors.white, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: colors.border, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Call Khetha on 086 999 0123"
        >
          <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 15 }}>📞 Khetha: 086 999 0123</Text>
        </Pressable>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          style={{ borderWidth: 1.5, borderColor: colors.danger, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('sign_out')}
        >
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>{t('sign_out')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
