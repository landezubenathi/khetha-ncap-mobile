import { Alert, SafeAreaView, ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow, fs } from '../../src/theme';
import { useUserStore, useJourneyProgress } from '../../src/store/user';
import { useT, LANGUAGE_LIST } from '../../src/i18n';
import { supabase } from '../../src/lib/supabase';
import { QUIZ_META } from '../../src/data/questionnaire';

const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Limpopo', 'Eastern Cape', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape'];
const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Post-matric', 'Adult learner'];

type SavedField = 'grade' | 'province' | 'language' | null;

export default function Profile() {
  const t = useT();
  const { language, setLanguage, province, setProvince, grade, setGrade, fontScale, consentGiven, allResults, clearAll } = useUserStore();
  const progress = useJourneyProgress();
  const [confirmedField, setConfirmedField] = useState<SavedField>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flash(field: SavedField) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfirmedField(field);
    timerRef.current = setTimeout(() => setConfirmedField(null), 2000);
  }

  function handleSetGrade(g: string) { setGrade(g); flash('grade'); }
  function handleSetProvince(p: string) { setProvince(p); flash('province'); }
  function handleSetLanguage(l: string) { setLanguage(l); flash('language'); }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    clearAll();
    router.replace('/onboarding');
  }

  function confirmReset() {
    Alert.alert(
      'Start Over?',
      'This will clear all your quiz results, saved items and profile settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, start over',
          style: 'destructive',
          onPress: () => { clearAll(); router.replace('/onboarding'); },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Dark header */}
        <View style={{ backgroundColor: colors.navy, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, marginBottom: spacing.md, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: colors.purpleGlow }} />
        <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800' }}>Profile</Text>
        <Text style={{ color: colors.mutedLight, fontSize: 13, marginTop: 2, marginBottom: spacing.md }}>Your preferences, progress and privacy.</Text>

        {/* Journey progress */}
        <View style={{ backgroundColor: colors.glassMid, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.glassBorder }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: fs(14, fontScale) }}>Journey progress</Text>
            <Text style={{ color: colors.yellowLight, fontWeight: '800', fontSize: fs(14, fontScale) }}>{progress}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }}>
            <View style={{ height: 6, width: `${progress}%`, backgroundColor: colors.tealLight, borderRadius: radius.full }} />
          </View>
          <Pressable onPress={() => router.push('/(tabs)/journey' as any)} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }} accessibilityRole="button">
            <Text style={{ color: colors.yellowLight, fontSize: 13, fontWeight: '700' }}>View full journey</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.yellowLight} />
          </Pressable>
        </View>
      </View>

        {/* Incomplete profile banner */}
        {(!grade || !province) && (
          <View style={{ backgroundColor: colors.yellow + '18', borderRadius: radius.md, padding: spacing.sm, marginHorizontal: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderLeftWidth: 4, borderLeftColor: colors.yellow }}>
            <Ionicons name="warning-outline" size={18} color={colors.yellow} style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(13, fontScale) }}>Profile incomplete</Text>
              <Text style={{ color: colors.ink, fontSize: fs(12, fontScale), marginTop: 2, lineHeight: 18 }}>
                {!grade && !province ? 'Set your grade and province to get personalised results.' : !grade ? 'Select your grade to personalise your career matches.' : 'Select your province to find providers near you.'}
              </Text>
            </View>
          </View>
        )}

        {/* Grade */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>Your grade / level</Text>
            {confirmedField === 'grade'
              ? <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '800' }}>✓ Saved</Text>
              : !grade
              ? <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Required</Text>
              : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {GRADES.map((g) => (
              <Pressable
                key={g}
                onPress={() => handleSetGrade(g)}
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
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>{t('language_prompt')}</Text>
            {confirmedField === 'language' && <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '800' }}>✓ Saved</Text>}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {LANGUAGE_LIST.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => handleSetLanguage(lang)}
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
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>Your province</Text>
            {confirmedField === 'province'
              ? <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '800' }}>✓ Saved</Text>
              : !province
              ? <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Required</Text>
              : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {PROVINCES.map((p) => (
              <Pressable
                key={p}
                onPress={() => handleSetProvince(p)}
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

        {allResults.length > 0 && (
          <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Assessment history</Text>
            {allResults.map((r) => {
              const meta = QUIZ_META[r.type];
              const date = new Date(r.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
              const topCareer = r.careers[0];
              return (
                <Pressable key={r.type + r.completedAt} onPress={() => router.push('/results')}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  accessibilityRole="button" accessibilityLabel={`View ${meta?.title} results`}>
                  <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: (meta?.color ?? colors.blue) + '18', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="stats-chart-outline" size={20} color={meta?.color ?? colors.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 14 }}>{meta?.title ?? r.type}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{date}{topCareer ? ` · Top: ${topCareer.id.replace(/-/g, ' ')}` : ''}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.blue} />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Accessibility shortcut */}
        <Pressable onPress={() => router.push('/accessibility' as any)}
          style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}
          accessibilityRole="button" accessibilityLabel={t('accessibility')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.blue + '18', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="accessibility-outline" size={20} color={colors.blue} />
            </View>
            <View>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>{t('accessibility')}</Text>
              <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginTop: 2 }}>Text size · High contrast · Offline info</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.blue} />
        </Pressable>

        {/* Privacy */}
        <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginHorizontal: spacing.md, marginBottom: 14, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>Privacy &amp; consent</Text>
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 13, lineHeight: 20 }}>
            {consentGiven ? '✓ You have given consent for your data to be stored securely.' : 'You are using guest mode. Data is stored on this device only.'}
          </Text>
        </View>

        <Pressable onPress={() => router.push('/contact' as any)}
          style={{ backgroundColor: colors.teal, borderRadius: radius.md, padding: 16, alignItems: 'center', marginHorizontal: spacing.md, marginBottom: 12, minHeight: 56, justifyContent: 'center', ...shadow.teal }}
          accessibilityRole="button" accessibilityLabel={t('contact_adviser')}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>{t('contact_adviser')}</Text>
        </Pressable>

        <Pressable onPress={() => Linking.openURL('tel:0869990123')}
          style={{ backgroundColor: colors.bgCard, borderRadius: radius.md, padding: 16, alignItems: 'center', marginHorizontal: spacing.md, marginBottom: 12, borderWidth: 1, borderColor: colors.border, minHeight: 56, justifyContent: 'center', flexDirection: 'row', gap: 8, ...shadow.sm }}
          accessibilityRole="button" accessibilityLabel="Call Khetha on 086 999 0123">
          <Ionicons name="call-outline" size={18} color={colors.navy} />
          <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 15 }}>Khetha: 086 999 0123</Text>
        </Pressable>

        <Pressable onPress={confirmReset}
          style={{ backgroundColor: colors.yellow + '18', borderWidth: 1.5, borderColor: colors.yellow, borderRadius: radius.md, padding: 16, alignItems: 'center', marginHorizontal: spacing.md, marginTop: 8, minHeight: 56, justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          accessibilityRole="button" accessibilityLabel="Start over from scratch">
          <Ionicons name="refresh-outline" size={18} color={colors.navy} />
          <View>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>Start Over</Text>
            <Text style={{ color: colors.muted, fontSize: 11 }}>Clears all results, saves and settings</Text>
          </View>
        </Pressable>

        <Pressable onPress={signOut}
          style={{ borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.md, padding: 16, alignItems: 'center', marginHorizontal: spacing.md, marginTop: 10, minHeight: 56, justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          accessibilityRole="button" accessibilityLabel={t('sign_out')}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15 }}>{t('sign_out')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
