import { useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Link, router, Stack } from 'expo-router';
import { colors, spacing } from '../src/theme';
import { useUserStore } from '../src/store/user';
import { useT } from '../src/i18n';
import { CAREERS } from '../src/data/seed';
import { scheduleJourneyReminder, cancelJourneyReminder } from '../src/lib/notifications';
import { CAREER_QUESTIONS, JOB_FIT_QUESTIONS, QUIZ_META, SECTION_SUMMARIES } from '../src/data/questionnaire';

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

function scorePill(score: number) {
  if (score >= 70) return { label: 'Strong match', bg: colors.teal + '22', text: colors.teal };
  if (score >= 40) return { label: 'Good match',   bg: colors.blue + '18', text: colors.blue };
  return                  { label: 'Possible fit',  bg: colors.yellow + '33', text: '#92600A' };
}

// Compute per-section average score (0–3) from raw answers
function sectionScores(questions: typeof CAREER_QUESTIONS, answers: Record<string, number>) {
  const sections: Record<string, number[]> = {};
  for (const q of questions) {
    if (!(q.section in sections)) sections[q.section] = [];
    if (q.key in answers) sections[q.section].push(answers[q.key]);
  }
  return Object.entries(sections).map(([section, vals]) => ({
    section,
    avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0,
  }));
}

function sectionSummary(section: string, avg: number): string {
  const map = SECTION_SUMMARIES[section];
  if (!map) return '';
  if (avg >= 2.5) return map[3] ?? map[2] ?? '';
  if (avg >= 1.5) return map[2] ?? '';
  return map[0] ?? '';
}

function SectionBar({ section, avg, color }: { section: string; avg: number; color: string }) {
  const pct = Math.round((avg / 3) * 100);
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 13 }}>{section}</Text>
        <Text style={{ color: color, fontWeight: '800', fontSize: 13 }}>{pct}%</Text>
      </View>
      <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 4 }}>
        <View style={{ height: 8, width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
        {sectionSummary(section, avg)}
      </Text>
    </View>
  );
}

export default function Results() {
  const t = useT();
  const { assessmentResult, toggleSaved, saved } = useUserStore();

  useEffect(() => { scheduleJourneyReminder(); }, []);

  if (!assessmentResult) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ title: 'Your results' }} />
        <Text style={{ fontSize: 40, marginBottom: 16 }}>🎯</Text>
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 20, marginBottom: 8 }}>No results yet</Text>
        <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 }}>
          Complete a questionnaire to see your personalised career matches.
        </Text>
        <Pressable
          onPress={() => router.replace('/questionnaire/career')}
          style={{ backgroundColor: colors.navy, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 }}
          accessibilityRole="button"
        >
          <Text style={{ color: colors.white, fontWeight: '700' }}>Start Career Choice →</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { type, careers: matched, answers } = assessmentResult as any;
  const meta = QUIZ_META[type];
  const accentColor = meta?.color ?? colors.blue;

  const enriched = matched
    .map((m: any) => ({ ...m, career: CAREERS.find((c) => c.id === m.id) }))
    .filter((m: any) => !!m.career);

  // Section profile — only when we have answers stored
  const questions = type === 'career' ? CAREER_QUESTIONS : type === 'job-fit' ? JOB_FIT_QUESTIONS : [];
  const sections = answers && questions.length ? sectionScores(questions, answers) : [];

  // Top section (highest avg) for headline
  const topSection = sections.length ? [...sections].sort((a, b) => b.avg - a.avg)[0] : null;

  function saveAll() {
    enriched.forEach((m: any) => { if (!saved.includes(m.id)) toggleSaved(m.id); });
    cancelJourneyReminder();
    router.replace('/(tabs)/journey');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: 'Your results' }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 56 }}>

        {/* Header */}
        <View style={{ backgroundColor: accentColor + '12', borderRadius: 16, padding: spacing.md, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 28 }}>{meta?.icon ?? '🎯'}</Text>
            <View>
              <Text style={{ color: accentColor, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }}>
                {meta?.title?.toUpperCase() ?? type.toUpperCase()}
              </Text>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 20, lineHeight: 26 }}>
                Your results
              </Text>
            </View>
          </View>
          {topSection && (
            <Text style={{ color: colors.ink, fontSize: 14, lineHeight: 22 }}>
              Your strongest area is <Text style={{ fontWeight: '800', color: accentColor }}>{topSection.section}</Text> — see your full profile below.
            </Text>
          )}
        </View>

        {/* ── SECTION PROFILE ── */}
        {sections.length > 0 && (
          <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 20 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 16 }}>
              {type === 'career' ? 'Your interest profile' : 'Your work-style profile'}
            </Text>
            {sections.map(({ section, avg }) => (
              <SectionBar key={section} section={section} avg={avg} color={accentColor} />
            ))}
          </View>
        )}

        {/* ── CAREER MATCHES ── */}
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginBottom: 12 }}>
          {t('top_matches')}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 16, lineHeight: 20 }}>
          Based on your answers — tap any career to explore qualifications and providers.
        </Text>

        {enriched.map((m: any, idx: number) => {
          const pill = scorePill(m.score);
          const isSaved = saved.includes(m.id);
          const fieldColor = FIELD_COLORS[m.career.field] ?? colors.muted;
          return (
            <Link key={m.id} href={`/career/${m.id}`} asChild>
              <Pressable
                style={{
                  backgroundColor: colors.white, borderRadius: 16,
                  padding: spacing.md, marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: idx === 0 ? accentColor : colors.border,
                }}
                accessibilityRole="button"
                accessibilityLabel={`${m.career.title}, ${pill.label}`}
              >
                {/* Rank + title + pill */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: idx === 0 ? accentColor : colors.border, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: idx === 0 ? colors.white : colors.muted, fontWeight: '800', fontSize: 13 }}>{idx + 1}</Text>
                    </View>
                    <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', flex: 1 }}>
                      {m.career.title}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: pill.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 }}>
                    <Text style={{ color: pill.text, fontSize: 11, fontWeight: '700' }}>{pill.label}</Text>
                  </View>
                </View>

                {/* Reason */}
                <Text style={{ color: colors.muted, marginTop: 8, fontSize: 13, lineHeight: 20 }}>
                  {m.reason}
                </Text>

                {/* Score bar */}
                <View style={{ marginTop: 10, marginBottom: 4 }}>
                  <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
                    <View style={{ height: 4, width: `${m.score}%`, backgroundColor: accentColor + 'AA', borderRadius: 2 }} />
                  </View>
                </View>

                {/* Footer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <View style={{ backgroundColor: fieldColor + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                    <Text style={{ color: fieldColor, fontSize: 11, fontWeight: '700' }}>{m.career.field}</Text>
                  </View>
                  <Text style={{ color: isSaved ? colors.teal : colors.blue, fontSize: 13, fontWeight: '700' }}>
                    {isSaved ? 'Saved ✓' : 'Explore →'}
                  </Text>
                </View>
              </Pressable>
            </Link>
          );
        })}

        {/* ── CROSS-QUIZ NUDGE ── */}
        {type === 'career' && (
          <Pressable
            onPress={() => router.push('/questionnaire/job-fit')}
            style={{ backgroundColor: '#F4B74018', borderRadius: 14, padding: spacing.md, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Also take the Job Fit questionnaire"
          >
            <Text style={{ fontSize: 28 }}>🧩</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>Also try: Job Fit</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                Understand your work style to refine these matches further.
              </Text>
            </View>
            <Text style={{ color: '#F4B740', fontWeight: '800', fontSize: 18 }}>›</Text>
          </Pressable>
        )}

        {type === 'job-fit' && (
          <Pressable
            onPress={() => router.push('/questionnaire/career')}
            style={{ backgroundColor: colors.blue + '12', borderRadius: 14, padding: spacing.md, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Also take the Career Choice questionnaire"
          >
            <Text style={{ fontSize: 28 }}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>Also try: Career Choice</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                Explore your interest clusters to get a fuller picture.
              </Text>
            </View>
            <Text style={{ color: colors.blue, fontWeight: '800', fontSize: 18 }}>›</Text>
          </Pressable>
        )}

        {/* ── CTAs ── */}
        <Pressable
          onPress={saveAll}
          style={{ backgroundColor: colors.navy, borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 4, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('save_all')}
        >
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>{t('save_all')}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace(`/questionnaire/${type}`)}
          style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 10, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={t('retake')}
        >
          <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 15 }}>{t('retake')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
