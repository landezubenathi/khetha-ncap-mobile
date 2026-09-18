import { Link, router } from 'expo-router';
import { SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../src/theme';
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
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: 'rgba(255,255,255,0.15)' }} />
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: colors.tealLight, borderRightColor: pct >= 25 ? colors.tealLight : 'transparent', borderBottomColor: pct >= 50 ? colors.tealLight : 'transparent', borderLeftColor: pct >= 75 ? colors.tealLight : 'transparent', transform: [{ rotate: '-90deg' }] }} />
      <Text style={{ color: colors.white, fontWeight: '800', fontSize: 18 }}>{filled}%</Text>
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
      <View style={{ alignItems: 'center', marginRight: 14 }}>
        <View style={{
          width: 36, height: 36, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center',
          backgroundColor: done ? colors.teal : active ? colors.blue : colors.bgCard,
          borderWidth: done || active ? 0 : 1.5, borderColor: colors.border,
          ...(done ? shadow.teal : active ? shadow.blue : shadow.xs),
        }}>
          {done
            ? <Ionicons name="checkmark" size={18} color={colors.white} />
            : <Text style={{ color: active ? colors.white : colors.muted, fontWeight: '800', fontSize: 13 }}>{num}</Text>}
        </View>
        <View style={{ width: 2, height: 20, backgroundColor: done ? colors.teal + '55' : colors.border, marginTop: 4 }} />
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
      {!done && active && <Ionicons name="chevron-forward" size={18} color={colors.blue} style={{ marginTop: 6 }} />}
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

  // ── Empty state for brand new users ──────────────────────────────────────────
  const isBlankSlate = !grade && !province && allResults.length === 0 && saved.length === 0;
  if (isBlankSlate) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ backgroundColor: colors.navy, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: colors.tealGlow }} />
          <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800' }}>My Journey</Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>Build your career profile step by step</Text>
        </View>
        <View style={{ flex: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.teal + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="map-outline" size={40} color={colors.teal} />
          </View>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 24, textAlign: 'center', lineHeight: 32 }}>Your journey starts here</Text>
          <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22, paddingHorizontal: 16 }}>Complete a few quick steps to build your personalised career profile. It takes less than 10 minutes.</Text>
          <View style={{ width: '100%', marginTop: 28, gap: 10 }}>
            {[
              { icon: 'person-outline', label: 'Set your grade & province', route: '/(tabs)/profile', color: colors.blue, glow: colors.blueGlow },
              { icon: 'compass-outline', label: 'Take the Career Choice quiz', route: '/questionnaire/career', color: colors.teal, glow: colors.tealGlow },
              { icon: 'puzzle-outline', label: 'Take the Job Fit quiz', route: '/questionnaire/job-fit', color: colors.purple, glow: colors.purpleGlow },
            ].map(({ icon, label, route, color, glow }) => (
              <Pressable key={label} onPress={() => router.push(route as any)}
                style={{ backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.borderLight, ...shadow.sm }}
                accessibilityRole="button" accessibilityLabel={label}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: color, alignItems: 'center', justifyContent: 'center', shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 }}>
                  <Ionicons name={icon as any} size={20} color={colors.white} />
                </View>
                <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 15, flex: 1 }}>{label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile' as any)}
            style={{ backgroundColor: colors.navy, borderRadius: radius.md, paddingVertical: 16, paddingHorizontal: 32, marginTop: 28, minHeight: 52, justifyContent: 'center', ...shadow.lg }}
            accessibilityRole="button">
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Get started →</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Dark header */}
        <View style={{ backgroundColor: colors.navy, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, marginBottom: spacing.lg, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: colors.tealGlow }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800' }}>My Journey</Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 }}>
                {stage === 'ready' ? 'Profile complete — time to act.' : 'Complete each step to build your profile.'}
              </Text>
            </View>
            <ProgressRing pct={progress} />
          </View>
          <Pressable onPress={() => router.push(next.route as any)}
            style={{ backgroundColor: colors.glassMid, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.glassBorder }}
            accessibilityRole="button" accessibilityLabel={next.cta}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.yellowLight, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 }}>NEXT STEP</Text>
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>{next.title}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 3 }}>{next.body}</Text>
            </View>
            <View style={{ backgroundColor: colors.yellow, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 12 }}>{next.cta}</Text>
            </View>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.md }}>
        {/* Quiz results */}
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Your assessments</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <QuizCard type="career" />
          <QuizCard type="job-fit" />
        </View>

        {/* ── PROFILE SUMMARY ── */}
        {(grade || province || saved.length > 0) && (
          <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.md, marginBottom: 24, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
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
                <Pressable style={{ backgroundColor: (FIELD_COLORS[savedCareers[0].field] ?? colors.muted) + '12', borderRadius: radius.md, padding: spacing.sm, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                  accessibilityRole="button" accessibilityLabel={`View ${savedCareers[0].title}`}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '700' }}>TOP SAVED CAREER</Text>
                    <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginTop: 2 }}>{savedCareers[0].title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{savedCareers[0].salary_range}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.blue} />
                </Pressable>
              </Link>
            )}
          </View>
        )}

        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 16 }}>Your steps</Text>
        {steps.map((s, i) => (
          <JourneyStep key={s.label} num={i + 1} label={s.label} sublabel={s.sublabel} done={s.done} active={s.active} route={s.route} />
        ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
