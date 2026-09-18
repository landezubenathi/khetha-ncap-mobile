import { Link, router } from 'expo-router';
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../src/theme';
import { useUserStore, useJourneyStage, useJourneyProgress, useResultByType } from '../../src/store/user';
import { useT } from '../../src/i18n';
import { CAREERS } from '../../src/data/seed';

const QUICK_ACTIONS = [
  { icon: 'compass-outline',    label: 'Career Quiz',  route: '/questionnaire/career',  bg: colors.blue,   glow: colors.blueGlow },
  { icon: 'fitness-outline',    label: 'Job Fit',      route: '/questionnaire/job-fit', bg: colors.teal,   glow: colors.tealGlow },
  { icon: 'book-outline',       label: 'Subjects',     route: '/subject-chooser',       bg: colors.purple, glow: colors.purpleGlow },
  { icon: 'map-outline',        label: 'My Journey',   route: '/(tabs)/journey',        bg: colors.orange, glow: 'rgba(224,92,42,0.25)' },
  { icon: 'sparkles-outline',   label: 'AI Advisor',   route: '/advisor',               bg: colors.navyMid,glow: 'rgba(17,34,64,0.4)' },
  { icon: 'chatbubble-ellipses-outline', label: 'Ask Khetha', route: '/chatbot', bg: colors.purple, glow: colors.purpleGlow },
] as const;

const HERO: Record<string, { label: string; title: string; cta: string; route: string }> = {
  onboarding:   { label: 'GETTING STARTED',  title: 'Choose your language to begin.',             cta: 'Start setup',    route: '/onboarding' },
  profile:      { label: 'NEXT STEP',         title: 'Set your grade & province to personalise.', cta: 'Set up profile', route: '/(tabs)/profile' },
  first_quiz:   { label: 'KEEP GOING',        title: 'Try Job Fit to complete your profile.',     cta: 'Start Job Fit',  route: '/questionnaire/job-fit' },
  exploring:    { label: 'KEEP GOING',        title: 'Complete Job Fit for a fuller picture.',    cta: 'Start Job Fit',  route: '/questionnaire/job-fit' },
  both_quizzes: { label: 'ALMOST THERE',      title: 'Set your province to find nearby providers.',cta: 'Update profile',route: '/(tabs)/profile' },
  ready:        { label: 'PROFILE COMPLETE',  title: 'Your career profile is ready!',             cta: 'Get advice',     route: '/contact' },
};

export default function Home() {
  const t = useT();
  const { language, saved, streakDays } = useUserStore();
  const stage = useJourneyStage();
  const progress = useJourneyProgress();
  const careerResult = useResultByType('career');
  const jobFitResult = useResultByType('job-fit');
  const hero = HERO[stage] ?? HERO['profile'];
  const topCareer = careerResult ? CAREERS.find((c) => c.id === careerResult.careers[0]?.id) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={{
          backgroundColor: colors.navy,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
          paddingBottom: spacing.xl + 20,
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
          overflow: 'hidden',
        }}>
          {/* Decorative glow orbs */}
          <View style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: colors.tealGlow }} />
          <View style={{ position: 'absolute', bottom: 0, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: colors.blueGlow }} />

          {/* Logos */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <Image source={require('../../assets/khetha_logo.png')} style={{ height: 44, width: 120 }} resizeMode="contain" />
            <View style={{
              backgroundColor: colors.white,
              borderRadius: radius.md,
              paddingHorizontal: 10,
              paddingVertical: 6,
              ...shadow.sm,
            }}>
              <Image source={require('../../assets/DHET-FC-logo.png')} style={{ height: 40, width: 90 }} resizeMode="contain" />
            </View>
          </View>

          {/* Label + Title */}
          <Text style={{ color: colors.yellowLight, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8 }}>
            {hero.label}
          </Text>
          <Text style={{ color: colors.white, fontSize: 28, fontWeight: '800', lineHeight: 36, marginBottom: spacing.md }}>
            {hero.title}
          </Text>

          {/* Progress bar */}
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: colors.mutedLight, fontSize: 12, fontWeight: '600' }}>Journey progress</Text>
              <Text style={{ color: colors.yellowLight, fontWeight: '800', fontSize: 12 }}>{progress}%</Text>
            </View>
            <View style={{ height: 5, backgroundColor: colors.glass, borderRadius: radius.full }}>
              <View style={{ height: 5, width: `${progress}%`, backgroundColor: colors.tealLight, borderRadius: radius.full, ...shadow.teal }} />
            </View>
          </View>

          {/* Badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md }}>
            <View style={{ backgroundColor: colors.glassMid, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.glassBorder }}>
              <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700' }}>🌍 {language}</Text>
            </View>
            {careerResult && (
              <View style={{ backgroundColor: colors.tealGlow, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.teal + '44' }}>
                <Text style={{ color: colors.tealLight, fontSize: 11, fontWeight: '700' }}>✓ Career quiz</Text>
              </View>
            )}
            {jobFitResult && (
              <View style={{ backgroundColor: colors.blueGlow, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.blue + '44' }}>
                <Text style={{ color: colors.blueMid, fontSize: 11, fontWeight: '700' }}>✓ Job Fit</Text>
              </View>
            )}
            {saved.length > 0 && (
              <View style={{ backgroundColor: colors.glassMid, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.glassBorder }}>
                <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700' }}>🔖 {saved.length} saved</Text>
              </View>
            )}
            {streakDays >= 2 && (
              <View style={{ backgroundColor: colors.yellowGlow, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.yellow + '55' }}>
                <Text style={{ color: colors.yellowLight, fontSize: 11, fontWeight: '700' }}>🔥 {streakDays}-day streak</Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <Pressable
            onPress={() => router.push(hero.route as any)}
            style={{ backgroundColor: colors.yellow, borderRadius: radius.md, paddingVertical: 15, paddingHorizontal: 26, alignSelf: 'flex-start', ...shadow.gold }}
            accessibilityRole="button"
          >
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>{hero.cta} →</Text>
          </Pressable>
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', marginBottom: spacing.sm }}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACTIONS.map((a) => (
              <Pressable
                key={a.route}
                onPress={() => router.push(a.route as any)}
                style={{
                  width: '30.5%',
                  backgroundColor: colors.bgCard,
                  borderRadius: radius.md,
                  padding: spacing.sm,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  ...shadow.sm,
                }}
                accessibilityRole="button"
                accessibilityLabel={a.label}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: radius.md,
                  backgroundColor: a.bg,
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 8,
                  shadowColor: a.bg, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
                }}>
                  <Ionicons name={a.icon as any} size={22} color={colors.white} />
                </View>
                <Text style={{ color: colors.navy, fontSize: 11, fontWeight: '800', textAlign: 'center', lineHeight: 15 }}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── AI ADVISOR BANNER ── */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Pressable
            onPress={() => router.push('/advisor' as any)}
            style={{
              backgroundColor: colors.navy,
              borderRadius: radius.lg,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              overflow: 'hidden',
              ...shadow.lg,
            }}
            accessibilityRole="button"
          >
            <View style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.tealGlow }} />
            <View style={{
              width: 54, height: 54, borderRadius: radius.md,
              backgroundColor: colors.teal,
              alignItems: 'center', justifyContent: 'center',
              ...shadow.teal,
            }}>
              <Ionicons name="sparkles" size={26} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>AI Career Advisor</Text>
                <View style={{ backgroundColor: colors.teal + 'CC', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>RESPONSIBLE AI</Text>
                </View>
              </View>
              <Text style={{ color: colors.mutedLight, fontSize: 13, lineHeight: 18 }}>
                Personalised career advice from your profile
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.yellow} />
          </Pressable>
        </View>

        {/* ── TOP CAREER MATCH ── */}
        {topCareer && (
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
            <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', marginBottom: spacing.sm }}>Your Top Match</Text>
            <Link href={`/career/${topCareer.id}`} asChild>
              <Pressable style={{
                backgroundColor: colors.bgCard,
                borderRadius: radius.lg,
                padding: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderWidth: 1,
                borderColor: colors.borderLight,
                ...shadow.md,
              }} accessibilityRole="button">
                <View style={{
                  width: 54, height: 54, borderRadius: radius.md,
                  backgroundColor: colors.teal,
                  alignItems: 'center', justifyContent: 'center',
                  ...shadow.teal,
                }}>
                  <Ionicons name="briefcase" size={24} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 3 }}>CAREER CHOICE RESULT</Text>
                  <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 17 }}>{topCareer.title}</Text>
                  <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '700', marginTop: 2 }}>{topCareer.salary_range}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.blue} />
              </Pressable>
            </Link>
          </View>
        )}

        {/* ── CHATBOT BANNER ── */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Pressable
            onPress={() => router.push('/chatbot' as any)}
            style={{
              backgroundColor: colors.purple,
              borderRadius: radius.lg,
              padding: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              overflow: 'hidden',
              ...shadow.md,
            }}
            accessibilityRole="button"
          >
            <View style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <View style={{
              width: 50, height: 50, borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 15 }}>Ask Khetha</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>FAQ chatbot — instant answers</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        {/* ── DIRECTORY SHORTCUT ── */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', marginBottom: spacing.sm }}>Explore</Text>
          <Link href="/(tabs)/explore" asChild>
            <Pressable style={{
              backgroundColor: colors.bgCard,
              borderRadius: radius.lg,
              padding: spacing.md,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.borderLight,
              ...shadow.sm,
            }} accessibilityRole="button">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{
                  width: 48, height: 48, borderRadius: radius.md,
                  backgroundColor: colors.blue,
                  alignItems: 'center', justifyContent: 'center',
                  ...shadow.blue,
                }}>
                  <Ionicons name="search" size={22} color={colors.white} />
                </View>
                <View>
                  <Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800' }}>Browse Directory</Text>
                  <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>Careers · Qualifications · Providers</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.blue} />
            </Pressable>
          </Link>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
