import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { colors, spacing } from '../../src/theme';
import ProgressBar from '../../src/components/ProgressBar';
import { useUserStore } from '../../src/store/user';
import { matchCareers } from '../../src/lib/match';
import { supabase } from '../../src/lib/supabase';
import {
  CAREER_QUESTIONS, JOB_FIT_QUESTIONS, QUIZ_META,
  SCALE_LABELS, type Question,
} from '../../src/data/questionnaire';

const BANKS: Record<string, Question[]> = {
  career:    CAREER_QUESTIONS,
  'job-fit': JOB_FIT_QUESTIONS,
};

export default function Questionnaire() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const quizType = type && BANKS[type] ? type : 'career';
  const questions = BANKS[quizType];
  const meta = QUIZ_META[quizType];

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { setAssessmentResult, consentGiven } = useUserStore();

  const accentColor = meta?.color ?? colors.blue;
  const current = questions[step];
  const labels = SCALE_LABELS[current?.scale ?? 'agreement'];

  // Show section header when section changes
  const prevSection = step > 0 ? questions[step - 1].section : null;
  const showSectionHeader = started && !submitting && current?.section !== prevSection;

  async function handleAnswer(value: number) {
    setSelected(value);
    const updated = { ...answers, [current.key]: value };
    setAnswers(updated);

    await new Promise((r) => setTimeout(r, 200));
    setSelected(null);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // Last question — run matching
    setSubmitting(true);
    const result = await matchCareers(quizType, updated);
    setAssessmentResult({ type: quizType, careers: result.careers, answers: updated });

    if (supabase && consentGiven) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: assessment } = await supabase
          .from('assessments')
          .insert({ user_id: user.id, type: quizType, result })
          .select('id')
          .single();
        if (assessment) {
          await supabase.from('assessment_answers').insert(
            Object.entries(updated).map(([question_key, answer]) => ({
              assessment_id: assessment.id, question_key, answer,
            }))
          );
        }
      }
    }

    setSubmitting(false);
    router.replace('/results');
  }

  // ── INTRO SCREEN ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Stack.Screen options={{ title: meta?.title ?? 'Quiz' }} />
        <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

          {/* Icon + title */}
          <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 28 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: accentColor + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 36 }}>{meta?.icon}</Text>
            </View>
            <Text style={{ color: colors.navy, fontSize: 28, fontWeight: '800', textAlign: 'center', lineHeight: 36 }}>
              {meta?.title}
            </Text>
            <Text style={{ color: accentColor, fontWeight: '700', fontSize: 14, marginTop: 6 }}>
              {meta?.subtitle}
            </Text>
          </View>

          {/* Description */}
          <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 16 }}>
            <Text style={{ color: colors.ink, fontSize: 15, lineHeight: 24 }}>
              {meta?.description}
            </Text>
          </View>

          {/* Quick facts */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            <View style={{ flex: 1, backgroundColor: accentColor + '12', borderRadius: 12, padding: spacing.sm, alignItems: 'center' }}>
              <Text style={{ color: accentColor, fontWeight: '800', fontSize: 18 }}>{questions.length}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Questions</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: accentColor + '12', borderRadius: 12, padding: spacing.sm, alignItems: 'center' }}>
              <Text style={{ color: accentColor, fontWeight: '800', fontSize: 15 }}>{meta?.duration}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Duration</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: accentColor + '12', borderRadius: 12, padding: spacing.sm, alignItems: 'center' }}>
              <Text style={{ color: accentColor, fontWeight: '800', fontSize: 18 }}>{meta?.sections.length}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Sections</Text>
            </View>
          </View>

          {/* Sections list */}
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginBottom: 10 }}>
            What we will cover:
          </Text>
          {meta?.sections.map((s, i) => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: accentColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.white, fontSize: 11, fontWeight: '800' }}>{i + 1}</Text>
              </View>
              <Text style={{ color: colors.ink, fontSize: 14, fontWeight: '600' }}>{s}</Text>
            </View>
          ))}

          {/* Tip */}
          <View style={{ backgroundColor: colors.yellow + '22', borderRadius: 12, padding: spacing.sm, marginTop: 20, marginBottom: 24, flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 16 }}>💡</Text>
            <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 20, flex: 1 }}>
              Answer honestly — there are no right or wrong answers. Your results are most useful when they reflect how you actually feel, not how you think you should feel.
            </Text>
          </View>

          <Pressable
            onPress={() => setStarted(true)}
            style={{ backgroundColor: accentColor, borderRadius: 14, padding: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Start questionnaire"
          >
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 17 }}>
              Start questionnaire →
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={{ padding: 16, alignItems: 'center', marginTop: 8 }}
            accessibilityRole="button"
          >
            <Text style={{ color: colors.muted, fontSize: 14 }}>← Go back</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── SUBMITTING STATE ──────────────────────────────────────────────────────
  if (submitting) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ title: meta?.title ?? 'Quiz' }} />
        <Text style={{ fontSize: 48, marginBottom: 24 }}>{meta?.icon}</Text>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginTop: 20 }}>
          Analysing your answers…
        </Text>
        <Text style={{ color: colors.muted, fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
          We are matching your profile to careers that suit you.
        </Text>
      </SafeAreaView>
    );
  }

  // ── QUESTION SCREEN ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: meta?.title ?? 'Quiz' }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        {/* Progress */}
        <View style={{ marginBottom: spacing.md }}>
          <ProgressBar current={step} total={questions.length} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              Question {step + 1} of {questions.length}
            </Text>
            <Text style={{ color: accentColor, fontSize: 13, fontWeight: '700' }}>
              {Math.round(((step) / questions.length) * 100)}% done
            </Text>
          </View>
        </View>

        {/* Section header — shown when section changes */}
        {showSectionHeader && (
          <View style={{ backgroundColor: accentColor + '12', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accentColor }} />
            <Text style={{ color: accentColor, fontWeight: '800', fontSize: 13 }}>
              {current.section}
            </Text>
          </View>
        )}

        {/* Question text */}
        <Text style={{ color: colors.navy, fontSize: 22, fontWeight: '800', lineHeight: 32, marginBottom: 10 }}>
          {current.text}
        </Text>

        {/* Hint */}
        {current.hint && (
          <Text style={{ color: colors.muted, fontSize: 13, marginBottom: spacing.lg, lineHeight: 20 }}>
            {current.hint}
          </Text>
        )}

        {/* Answer options */}
        {labels.map((label, i) => {
          const isSelected = selected === i;
          const isPast = answers[current.key] === i && selected === null;
          return (
            <Pressable
              key={label}
              onPress={() => handleAnswer(i)}
              style={{
                backgroundColor: isSelected ? accentColor : isPast ? accentColor + '12' : colors.white,
                borderWidth: 1.5,
                borderColor: isSelected ? accentColor : isPast ? accentColor : colors.border,
                borderRadius: 14,
                padding: spacing.md,
                marginBottom: 10,
                minHeight: 60,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              {/* Scale indicator dot */}
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                borderWidth: 2,
                borderColor: isSelected ? colors.white : isPast ? accentColor : colors.border,
                backgroundColor: isSelected ? colors.white + '33' : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{
                  color: isSelected ? colors.white : isPast ? accentColor : colors.muted,
                  fontWeight: '800', fontSize: 13,
                }}>
                  {i + 1}
                </Text>
              </View>
              <Text style={{
                color: isSelected ? colors.white : colors.ink,
                fontWeight: '700', fontSize: 15, flex: 1,
              }}>
                {label}
              </Text>
              {/* Strength indicator bar */}
              <View style={{ width: 4 + i * 6, height: 20, borderRadius: 4, backgroundColor: isSelected ? colors.white + '66' : accentColor + '33' }} />
            </Pressable>
          );
        })}

        {/* Back nudge for first question */}
        {step === 0 && (
          <Pressable
            onPress={() => setStarted(false)}
            style={{ padding: 14, alignItems: 'center', marginTop: 4 }}
            accessibilityRole="button"
          >
            <Text style={{ color: colors.muted, fontSize: 13 }}>← Back to intro</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
