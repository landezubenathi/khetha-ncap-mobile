import { Link, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import { colors, spacing } from '../../src/theme';
import { useUserStore, useJourneyStage, useJourneyProgress, useResultByType } from '../../src/store/user';
import { CAREERS, QUALIFICATIONS, PROVIDERS } from '../../src/data/seed';
import { QUIZ_META, CAREER_QUESTIONS, JOB_FIT_QUESTIONS, SECTION_SUMMARIES } from '../../src/data/questionnaire';

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

// ── Progress ring (pure SVG-free implementation using View arcs) ──────────────
function ProgressRing({ pct }: { pct: number }) {
  const size = 80;
  const filled = Math.round(pct);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: colors.border }} />
      {/* Filled arc — approximated with a coloured overlay using rotation */}
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: colors.teal, borderRightColor: pct >= 25 ? colors.teal : 'transparent', borderBottomColor: pct >= 50 ? colors.teal : 'transparent', borderLeftColor: pct >= 75 ? colors.teal : 'transparent', transform: [{ rotate: '-90deg' }] }} />
      <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18 }}>{filled}%</Text>
    </View>
  );
}

// ── Top section from answers ──────────────────────────────────────────────────
function topSectionFromAnswers(type: string, answers: Record<string, number>): string | null {
  const questions = type === 'career' ? CAREER_QUESTIONS : type === 'job-fit' ? JOB_FIT_QUESTIONS : [];
  if (!questions.length) return null;
  const sectionTotals: Record<string, number> = {};
  for (const q of questions) {
    if (q.key in answers) sectionTotals[q.section] = (sectionTotals[q.section] ?? 0) + answers[q.key];
  }
  const top = Object.entries(sectionTotals).sort((a, b) => b[1] - a[1])[0];
  return top?.[0] ?? null;
}

// ── Stage config — what to show and what to do next ──────────────────────────
const STAGE_NEXT: Record<string, { title: string; body: string; cta: string; route: string; color: string }> = {
  onboarding:   { title: 'Set your language', body: 'Choose your preferred language to personalise your experience.', cta: 'Go to onboarding', route: '/onboarding', color: colors.teal },
  profile:      { title: 'Tell us about yourself', body: 'Set your grade and province so we can show you the most relevant options.', cta: 'Update profile', route: '/(tabs)/profile', color: colors.blue },
  first_quiz:   { title: 'Take your second quiz', body: 'You have done Career Choice. Now try Job Fit to understand your work style.', cta: 'Start Job Fit →', route: '/questionnaire/job-fit', color: '#F4B740' },
  exploring:    { title: 'Complete Job Fit', body: 'Combining both quizzes gives you a much fuller picture of which careers suit you.', cta: 'Start Job Fit →', route: '/questionnaire/job-fit', color: '#F4B740' },
  both_quizzes: { title: 'Set your province', body: 'Tell us where you are so we can show providers near you.', cta: 'Update profile', route: '/(tabs)/profile', color: colors.teal },
  ready:        { title: 'Contact an adviser', body: 'You have a strong profile. A Khetha adviser can help you take the next step.', cta: 'Get advice →', route: '/contact', color: colors.navy },
};

// ── Quiz result mini-card ─────────────────────────────────────────────────────
function QuizCard({ type }: { type: 'career' | 'job-fit' }) {
  const result = useResultByType(type);
  const meta = QUIZ_META[type];
  const accentColor = meta?.color ?? colors.blue;

  if (!result) {
    return (
      <Pressable
        onPress={() => router.push(`/questionnaire/${type}` as any)}
        style={{ flex: 1, backgroundColor: colors.white, borderRadius: 14, padding: spacing.sm, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', minHeight: 110 }}
        accessibilityRole="button"
        accessibilityLabel={`Start ${meta?.title}`}
      >
        <Text style={{ fontSize: 24, marginBottom: 6 }}>{meta?.icon}</Text>
        <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 13, textAlign: 'center' }}>{meta?.title}</Text>
        <Text style={{ color: accentColor, fontSize: 12, marginTop: 4, fontWeight: '700' }}>Start →</Text>
      </Pressable>
    );
  }

  const topCareer = CAREERS.find((c) => c.id === result.careers[0]?.id);
  const topSection = result.answers ? topSectionFromAnswers(type, result.answers) : null;
  const date = new Date(result.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

  return (
    <Link href="/results" asChild>
      <Pressable
        style={{ flex: 1, backgroundColor: accentColor + '12', borderRadius: 14, padding: spacing.sm, borderLeftWidth: 3, borderLeftColor: accentColor, minHeight: 110 }}
        accessibilityRole="button"
        accessibilityLabel={`View ${meta?.title} results`}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 20 }}>{meta?.icon}</Text>
          <Text style={{ color: colors.muted, fontSize: 11 }}>{date}</Text>
        </View>
        <Text style={{ color: accentColor, fontWeight: '800', fontSize: 12 }}>{meta?.title?.toUpperCase()}</Text>
        {topCareer && (
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 13, marginTop: 4 }} numberOfLines={2}>
            {topCareer.title}
          </Text>
        )}
        {topSection && (
          <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3 }} numberOfLines={1}>
            Top: {topSection}
          </Text>
        )}
        <Text style={{ color: accentColor, fontSize: 12, fontWeight: '700', marginTop: 6 }}>View results →</Text>
      </Pressable>
    </Link>
  );
}

// ── Journey step row ──────────────────────────────────────────────────────────
function JourneyStep({ num, label, sublabel, done, active, route }: {
  num: number; label: string; sublabel: string; done: boolean; active: boolean; route: string;
}) {
  return (
    <Pressable
      onPress={() => !done && router.push(route as any)}
      style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}
      accessibilityRole={done ? 'text' : 'button'}
      accessibilityLabel={`${label}: ${sublabel}`}
    >
      {/* Step indicator + connector */}
      <View style={{ alignItems: 'center', marginRight: 14 }}>
        <View style={{
          width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
          backgroundColor: done ? colors.teal : active ? colors.navy : colors.white,
          borderWidth: done || active ? 0 : 2, borderColor: colors.border,
        }}>
          <Text style={{ color: done || active ? colors.white : colors.muted, fontWeight: '800', fontSize: done ? 16 : 14 }}>
            {done ? '✓' : num}
          </Text>
        </View>
        <View style={{ width: 2, height: 20, backgroundColor: done ? colors.teal + '44' : colors.border, marginTop: 4 }} />
      </View>
      {/* Content */}
      <View style={{ flex: 1, paddingTop: 4 }}>
        <Text style={{ color: done ? colors.muted : colors.navy, fontWeight: '800', fontSize: 15, textDecorationLine: done ? 'line-through' : 'none' }}>
          {label}
        </Text>
        <Text style={{ color: active ? colors.blue : colors.muted, fontSize: 13, marginTop: 3, lineHeight: 18 }}>
          {sublabel}
        </Text>
      </View>
      {!done && active && <Text style={{ color: colors.blue, fontSize: 20, marginTop: 6 }}>›</Text>}
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Journey() {
  const { onboardingDone, saved, province, grade, allResults } = useUserStore();
  const stage = useJourneyStage();
  const progress = useJourneyProgress();
  const next = STAGE_NEXT[stage];

  const types = allResults.map((r) => r.type);
  const hasCareer = types.includes('career');
  const hasJobFit = types.includes('job-fit');
  const hasSaves = saved.length > 0;

  const savedCareers = CAREERS.filter((c) => saved.includes(c.id));
  const savedQuals = QUALIFICATIONS.filter((q) => saved.includes(q.id));
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));

  // Build dynamic steps based on actual state
  const steps = [
    {
      label: 'Set up your profile',
      sublabel: grade && province ? `${grade} · ${province}` : 'Add your grade and province',
      done: !!(grade && province),
      active: stage === 'profile',
      route: '/(tabs)/profile',
    },
    {
      label: 'Career Choice quiz',
      sublabel: hasCareer ? `Top match: ${CAREERS.find((c) => c.id === allResults.find((r) => r.type === 'career')?.careers[0]?.id)?.title ?? '—'}` : 'Discover careers that match your interests',
      done: hasCareer,
      active: !hasCareer,
      route: '/questionnaire/career',
    },
    {
      label: 'Job Fit quiz',
      sublabel: hasJobFit ? `Completed · ${new Date(allResults.find((r) => r.type === 'job-fit')!.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}` : 'Understand your work style',
      done: hasJobFit,
      active: hasCareer && !hasJobFit,
      route: '/questionnaire/job-fit',
    },
    {
      label: 'Save careers & qualifications',
      sublabel: hasSaves ? `${saved.length} item${saved.length !== 1 ? 's' : ''} saved` : 'Bookmark options you want to explore',
      done: hasSaves,
      active: (hasCareer || hasJobFit) && !hasSaves,
      route: '/(tabs)/explore',
    },
    {
      label: 'Check your subjects',
      sublabel: 'See which subjects you need for your top careers',
      done: false,
      active: hasSaves,
      route: '/subject-chooser',
    },
    {
      label: 'Contact an adviser',
      sublabel: 'Speak to a Khetha career practitioner',
      done: false,
      active: stage === 'ready',
      route: '/contact',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 56 }}>

        {/* Header + progress ring */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.navy }}>My Journey</Text>
            <Text style={{ color: colors.muted, marginTop: 4, fontSize: 14, lineHeight: 20 }}>
              {stage === 'ready'
                ? 'Your profile is complete. Time to take action.'
                : 'Complete each step to build your career profile.'}
            </Text>
          </View>
          <ProgressRing pct={progress} />
        </View>

        {/* ── NEXT ACTION BANNER ── */}
        <Pressable
          onPress={() => router.push(next.route as any)}
          style={{ backgroundColor: next.color, borderRadius: 16, padding: spacing.md, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}
          accessibilityRole="button"
          accessibilityLabel={next.cta}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.white + 'BB', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 }}>NEXT STEP</Text>
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 17, lineHeight: 24 }}>{next.title}</Text>
            <Text style={{ color: colors.white + 'CC', fontSize: 13, marginTop: 4, lineHeight: 18 }}>{next.body}</Text>
          </View>
          <View style={{ backgroundColor: colors.white + '22', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }}>
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 13 }}>{next.cta}</Text>
          </View>
        </Pressable>

        {/* ── QUIZ RESULTS SIDE BY SIDE ── */}
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Your assessments</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <QuizCard type="career" />
          <QuizCard type="job-fit" />
        </View>

        {/* ── PROFILE SUMMARY ── */}
        {(grade || province || saved.length > 0) && (
          <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 24 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Your profile</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {grade && (
                <View style={{ backgroundColor: colors.blue + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 13 }}>🎓 {grade}</Text>
                </View>
              )}
              {province && (
                <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 13 }}>📍 {province}</Text>
                </View>
              )}
              {savedCareers.length > 0 && (
                <View style={{ backgroundColor: '#7B61FF18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: '#7B61FF', fontWeight: '700', fontSize: 13 }}>💼 {savedCareers.length} career{savedCareers.length !== 1 ? 's' : ''}</Text>
                </View>
              )}
              {savedQuals.length > 0 && (
                <View style={{ backgroundColor: colors.yellow + '33', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: '#92600A', fontWeight: '700', fontSize: 13 }}>📚 {savedQuals.length} qual{savedQuals.length !== 1 ? 's' : ''}</Text>
                </View>
              )}
              {savedProviders.length > 0 && (
                <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 13 }}>🏫 {savedProviders.length} provider{savedProviders.length !== 1 ? 's' : ''}</Text>
                </View>
              )}
            </View>

            {/* Top saved career spotlight */}
            {savedCareers.length > 0 && (
              <Link href={`/career/${savedCareers[0].id}`} asChild>
                <Pressable
                  style={{ backgroundColor: (FIELD_COLORS[savedCareers[0].field] ?? colors.muted) + '12', borderRadius: 12, padding: spacing.sm, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${savedCareers[0].title}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>TOP SAVED CAREER</Text>
                    <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginTop: 2 }}>{savedCareers[0].title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{savedCareers[0].salary_range}</Text>
                  </View>
                  <Text style={{ color: colors.blue, fontSize: 20 }}>›</Text>
                </Pressable>
              </Link>
            )}
          </View>
        )}

        {/* ── JOURNEY STEPS ── */}
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 16 }}>Your steps</Text>
        {steps.map((s, i) => (
          <JourneyStep
            key={s.label}
            num={i + 1}
            label={s.label}
            sublabel={s.sublabel}
            done={s.done}
            active={s.active}
            route={s.route}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
