import { Link, router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { colors, spacing } from '../../src/theme';
import { useUserStore, useJourneyStage, useJourneyProgress, useResultByType } from '../../src/store/user';
import { useT } from '../../src/i18n';
import { CAREERS } from '../../src/data/seed';

const TOOLS = [
  { title: 'Subject Chooser', body: 'See which subjects unlock your dream career — or which careers your subjects open up.', href: '/subject-chooser', color: colors.teal },
  { title: 'Career Choice', body: 'Discover careers that match your interests across 6 clusters.', href: '/questionnaire/career', color: colors.blue },
  { title: 'Job Fit', body: 'Understand your work style across 8 dimensions.', href: '/questionnaire/job-fit', color: '#F4B740' },
];

// Hero content per journey stage
const HERO: Record<string, { label: string; title: string; cta: string; route: string }> = {
  onboarding:   { label: 'GETTING STARTED', title: 'Choose your language to begin your journey.', cta: 'Start setup →', route: '/onboarding' },
  profile:      { label: 'YOUR NEXT STEP', title: 'Tell us your grade and province to personalise your results.', cta: 'Set up profile →', route: '/(tabs)/profile' },
  first_quiz:   { label: 'KEEP GOING', title: 'You have done Career Choice. Now try Job Fit to complete your profile.', cta: 'Start Job Fit →', route: '/questionnaire/job-fit' },
  exploring:    { label: 'KEEP GOING', title: 'Complete Job Fit to get a fuller picture of which careers suit you.', cta: 'Start Job Fit →', route: '/questionnaire/job-fit' },
  both_quizzes: { label: 'ALMOST THERE', title: 'Both quizzes done. Set your province to find providers near you.', cta: 'Update profile →', route: '/(tabs)/profile' },
  ready:        { label: 'PROFILE COMPLETE', title: 'Your career profile is ready. Speak to an adviser to take the next step.', cta: 'Get advice →', route: '/contact' },
};

export default function Home() {
  const t = useT();
  const { language, saved, streakDays } = useUserStore();
  const stage = useJourneyStage();
  const progress = useJourneyProgress();
  const careerResult = useResultByType('career');
  const jobFitResult = useResultByType('job-fit');
  const hero = HERO[stage] ?? HERO['profile'];

  const topCareer = careerResult
    ? CAREERS.find((c) => c.id === careerResult.careers[0]?.id)
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}>

        {/* Header */}
        <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14 }}>{t('welcome')}</Text>
        <Text style={{ color: colors.navy, fontSize: 30, fontWeight: '800', marginTop: 4 }}>{t('build_future')}</Text>

        {/* Progress bar */}
        <View style={{ marginTop: 12, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>Journey progress</Text>
            <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 12 }}>{progress}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
            <View style={{ height: 6, width: `${progress}%`, backgroundColor: colors.teal, borderRadius: 3 }} />
          </View>
        </View>

        {/* Stage badges */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 20, gap: 8, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '700' }}>🌍 {language}</Text>
          </View>
          {careerResult && (
            <View style={{ backgroundColor: colors.blue + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: colors.blue, fontSize: 12, fontWeight: '700' }}>🎯 Career Choice ✓</Text>
            </View>
          )}
          {jobFitResult && (
            <View style={{ backgroundColor: '#F4B74033', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: '#92600A', fontSize: 12, fontWeight: '700' }}>🧩 Job Fit ✓</Text>
            </View>
          )}
          {saved.length > 0 && (
            <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '700' }}>🔖 {saved.length} saved</Text>
            </View>
          )}
          {streakDays >= 2 && (
            <View style={{ backgroundColor: '#F4B74033', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: '#92600A', fontSize: 12, fontWeight: '700' }}>🔥 {streakDays}-day streak</Text>
            </View>
          )}
        </View>

        {/* Stage-aware hero CTA */}
        <Pressable
          onPress={() => router.push(hero.route as any)}
          style={{ backgroundColor: colors.navy, borderRadius: 18, padding: spacing.lg, marginBottom: 20 }}
          accessibilityRole="button"
          accessibilityLabel={hero.cta}
        >
          <Text style={{ color: colors.yellow, fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>
            {hero.label}
          </Text>
          <Text style={{ color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 8, lineHeight: 28 }}>
            {hero.title}
          </Text>
          <View style={{ backgroundColor: colors.yellow, alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 16, minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>{hero.cta}</Text>
          </View>
        </Pressable>

        {/* Top career spotlight — shown once Career Choice is done */}
        {topCareer && (
          <Link href={`/career/${topCareer.id}`} asChild>
            <Pressable
              style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}
              accessibilityRole="button"
              accessibilityLabel={`Your top career match: ${topCareer.title}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>YOUR TOP CAREER MATCH</Text>
                <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginTop: 4 }}>{topCareer.title}</Text>
                <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '700', marginTop: 2 }}>{topCareer.salary_range}</Text>
              </View>
              <Text style={{ color: colors.blue, fontSize: 24 }}>›</Text>
            </Pressable>
          </Link>
        )}

        {/* Tools */}
        <Text style={{ color: colors.navy, fontSize: 20, fontWeight: '800', marginBottom: 14 }}>
          {t('explore_tools')}
        </Text>
        {TOOLS.map((c) => (
          <Link key={c.href} href={c.href as any} asChild>
            <Pressable
              style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: c.color }}
              accessibilityRole="button"
              accessibilityLabel={c.title}
            >
              <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800' }}>{c.title}</Text>
              <Text style={{ color: colors.muted, marginTop: 6, fontSize: 14 }}>{c.body}</Text>
            </Pressable>
          </Link>
        ))}

        {/* Explore shortcut */}
        <Link href="/(tabs)/explore" asChild>
          <Pressable
            style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Browse careers directory"
          >
            <View>
              <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800' }}>Browse Directory</Text>
              <Text style={{ color: colors.muted, marginTop: 4, fontSize: 14 }}>Careers · Qualifications · Providers</Text>
            </View>
            <Text style={{ color: colors.blue, fontSize: 22 }}>›</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
