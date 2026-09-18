/**
 * app/advisor.tsx
 * Khetha AI Career Advisor — personalised recommendations from user profile.
 * Responsible AI: transparent, explainable, human-in-the-loop.
 */

import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { colors, spacing, radius, shadow } from '../src/theme';
import { useUserStore, useResultByType } from '../src/store/user';
import { CAREERS, QUALIFICATIONS, PROVIDERS, ADVISERS } from '../src/data/seed';

// ── Advice engine ─────────────────────────────────────────────────────────────

type Advice = {
  type: 'insight' | 'action' | 'warning' | 'opportunity';
  icon: string;
  title: string;
  body: string;
  cta?: { label: string; route: string };
};

function generateAdvice(profile: {
  grade: string; province: string; language: string;
  saved: string[]; allResults: any[]; streakDays: number;
  careerResult: any; jobFitResult: any;
}): Advice[] {
  const advice: Advice[] = [];
  const { grade, province, saved, allResults, careerResult, jobFitResult, streakDays } = profile;

  // ── Profile completeness ──
  if (!grade) {
    advice.push({ type: 'warning', icon: '⚠️', title: 'Grade not set', body: 'Setting your grade helps us show qualifications and entry requirements that are relevant to where you are right now.', cta: { label: 'Set grade', route: '/(tabs)/profile' } });
  }
  if (!province) {
    advice.push({ type: 'warning', icon: '📍', title: 'Province not set', body: 'Your province helps us show TVET colleges, universities and Khetha advisers near you.', cta: { label: 'Set province', route: '/(tabs)/profile' } });
  }

  // ── Quiz insights ──
  if (!careerResult && !jobFitResult) {
    advice.push({ type: 'action', icon: '🎯', title: 'Start your career assessment', body: 'You have not taken any quizzes yet. The Career Choice quiz takes 5 minutes and gives you personalised career matches based on your interests.', cta: { label: 'Take Career Choice', route: '/questionnaire/career' } });
  }

  if (careerResult) {
    const topMatch = CAREERS.find((c) => c.id === careerResult.careers[0]?.id);
    if (topMatch) {
      advice.push({
        type: 'insight', icon: '💡', title: `Your top career match: ${topMatch.title}`,
        body: `Based on your Career Choice results, ${topMatch.title} aligns strongly with your interests. This career is in the ${topMatch.field} field with a ${topMatch.outlook} outlook and earns ${topMatch.salary_range}.`,
        cta: { label: 'Explore this career', route: `/career/${topMatch.id}` },
      });

      // Qualification recommendation
      const relatedQual = QUALIFICATIONS.find((q) => q.field === topMatch.field);
      if (relatedQual) {
        advice.push({
          type: 'opportunity', icon: '🎓', title: `Recommended qualification`,
          body: `For ${topMatch.title}, consider the "${relatedQual.title}" (NQF ${relatedQual.nqf_level}) at ${relatedQual.provider_name}. Duration: ${relatedQual.duration}. Entry: ${relatedQual.entry_requirements}.`,
          cta: { label: 'View qualification', route: `/qualification/${relatedQual.id}` },
        });
      }
    }

    // Cross-quiz nudge
    if (!jobFitResult) {
      advice.push({ type: 'action', icon: '🧩', title: 'Complete your profile with Job Fit', body: 'You have done Career Choice. Adding Job Fit gives a 2D picture — both what you are interested in AND how you like to work. This combination produces much stronger recommendations.', cta: { label: 'Take Job Fit', route: '/questionnaire/job-fit' } });
    }
  }

  if (jobFitResult && careerResult) {
    advice.push({ type: 'insight', icon: '🔗', title: 'Both assessments complete', body: 'Having both Career Choice and Job Fit results means your recommendations are based on your interests AND your work style. This is the strongest signal for career fit.' });
  }

  // ── Province-based adviser ──
  if (province) {
    const adviser = ADVISERS.find((a) => a.province === province);
    if (adviser) {
      advice.push({
        type: 'opportunity', icon: '🧑‍💼', title: `Adviser available in ${province}`,
        body: `${adviser.name} (${adviser.role}) is available in ${adviser.city}. Specialises in ${adviser.specialisation}. Speaks: ${adviser.languages.join(', ')}. Hours: ${adviser.availability}.`,
        cta: { label: 'Contact advisers', route: '/contact' },
      });
    }

    // Province-based provider
    const provider = PROVIDERS.find((p) => p.province === province);
    if (provider) {
      advice.push({
        type: 'opportunity', icon: '🏫', title: `Provider near you: ${provider.name}`,
        body: `${provider.name} is a ${provider.provider_type} in ${provider.city} offering ${provider.qualifications_count} qualification(s) in this app's directory.${provider.distance_learning ? ' Also offers distance learning.' : ''}`,
        cta: { label: 'View provider', route: `/provider/${provider.id}` },
      });
    }
  }

  // ── Saved items ──
  if (saved.length === 0 && careerResult) {
    advice.push({ type: 'action', icon: '🔖', title: 'Save careers you like', body: 'You have not saved any careers yet. Saving careers lets you set application deadlines, add notes and get reminders. Tap the bookmark icon on any career card.', cta: { label: 'Browse careers', route: '/(tabs)/explore' } });
  }
  if (saved.length >= 3) {
    advice.push({ type: 'insight', icon: '📋', title: `${saved.length} items saved`, body: 'You have a solid shortlist. Check your Saved tab to set application deadlines and notes for each one. Missing a deadline is the most common reason applications fail.' , cta: { label: 'View saved', route: '/(tabs)/saved' } });
  }

  // ── Streak ──
  if (streakDays >= 3) {
    advice.push({ type: 'insight', icon: '🔥', title: `${streakDays}-day streak — keep it up!`, body: 'Consistent engagement with career planning significantly improves outcomes. Learners who return daily are 3× more likely to complete their journey and contact an adviser.' });
  }

  // ── Subject check ──
  if (careerResult) {
    advice.push({ type: 'action', icon: '📚', title: 'Check your subject alignment', body: 'Use the Subject Chooser to verify that your current subjects match the requirements for your top career matches. Changing subjects in Grade 10 is much easier than in Grade 11.', cta: { label: 'Open Subject Chooser', route: '/subject-chooser' } });
  }

  return advice.length > 0 ? advice : [
    { type: 'action', icon: '🚀', title: 'Start your journey', body: 'Complete your profile and take the Career Choice quiz to get personalised recommendations here.', cta: { label: 'Set up profile', route: '/(tabs)/profile' } },
  ];
}

// ── Advice card ───────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, { bg: string; border: string; badge: string; badgeBg: string }> = {
  insight:     { bg: colors.blue + '0D',   border: colors.blue,   badge: 'INSIGHT',     badgeBg: colors.blue },
  action:      { bg: colors.teal + '0D',   border: colors.teal,   badge: 'ACTION',      badgeBg: colors.teal },
  warning:     { bg: colors.yellow + '18', border: colors.yellow, badge: 'HEADS UP',    badgeBg: '#E09000' },
  opportunity: { bg: colors.purple + '0D', border: colors.purple, badge: 'OPPORTUNITY', badgeBg: colors.purple },
};

function AdviceCard({ item }: { item: Advice }) {
  const s = TYPE_STYLE[item.type];
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: radius.lg, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: s.border, borderWidth: 1, borderColor: s.border + '33', ...shadow.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 22 }}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <View style={{ backgroundColor: s.badgeBg, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: colors.white, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>{s.badge}</Text>
            </View>
          </View>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, lineHeight: 21 }}>{item.title}</Text>
        </View>
      </View>
      <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 21 }}>{item.body}</Text>
      {item.cta && (
        <Pressable
          onPress={() => router.push(item.cta!.route as any)}
          style={{ backgroundColor: s.border, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', marginTop: 12 }}
          accessibilityRole="button"
        >
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 13 }}>{item.cta.label} →</Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Advisor() {
  const { grade, province, language, saved, allResults, streakDays } = useUserStore();
  const careerResult = useResultByType('career');
  const jobFitResult = useResultByType('job-fit');
  const [accepted, setAccepted] = useState(false);

  const advice = generateAdvice({ grade, province, language, saved, allResults, streakDays, careerResult, jobFitResult });
  const completeness = [grade, province, careerResult, jobFitResult, saved.length > 0].filter(Boolean).length;
  const pct = Math.round((completeness / 5) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: 'AI Career Advisor', headerStyle: { backgroundColor: colors.navy }, headerTintColor: colors.white, headerTitleStyle: { fontWeight: '800' } }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}>

        {/* Hero */}
        <View style={{ backgroundColor: colors.navy, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg, overflow: 'hidden', ...shadow.xl }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: colors.tealGlow }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.sm }}>
            <View style={{ width: 54, height: 54, borderRadius: radius.md, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', ...shadow.teal }}>
              <Text style={{ fontSize: 26 }}>🤖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 20 }}>AI Career Advisor</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Powered by your Khetha profile</Text>
            </View>
            <View style={{ backgroundColor: colors.teal, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: colors.white, fontSize: 10, fontWeight: '800' }}>RESPONSIBLE AI</Text>
            </View>
          </View>

          {/* Profile strength */}
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6 }}>Profile strength: {pct}%</Text>
          <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full }}>
            <View style={{ height: 6, width: `${pct}%`, backgroundColor: colors.tealLight, borderRadius: radius.full }} />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6 }}>
            {advice.length} personalised recommendation{advice.length !== 1 ? 's' : ''} generated
          </Text>
        </View>

        {/* Responsible AI disclaimer — must accept before seeing advice */}
        {!accepted ? (
          <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginBottom: spacing.sm }}>Before you continue</Text>

            {[
              { icon: '🔍', title: 'Transparent', body: 'All recommendations are generated from your profile data stored on this device. No external AI model is used — logic is rule-based and fully auditable.' },
              { icon: '🧑‍💼', title: 'Human-in-the-loop', body: 'This advisor supports — not replaces — qualified Khetha career practitioners. Always verify important decisions with a human adviser.' },
              { icon: '🔒', title: 'Privacy-first', body: 'Your profile data never leaves your device unless you explicitly sign in and consent to sync. Guest mode is fully local.' },
              { icon: '⚖️', title: 'No bias guarantee', body: 'Recommendations are based solely on your quiz results, grade, province and saved items — not on race, gender or socioeconomic background.' },
              { icon: '📋', title: 'Not a final decision', body: 'Career guidance is a journey. These recommendations are a starting point. Speak to a Khetha adviser for a full consultation.' },
            ].map(({ icon, title, body }) => (
              <View key={title} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                <Text style={{ fontSize: 20, marginTop: 2 }}>{icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>{title}</Text>
                  <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{body}</Text>
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => setAccepted(true)}
              style={{ backgroundColor: colors.navy, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 8, ...shadow.md }}
              accessibilityRole="button"
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>I understand — show my advice</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Profile snapshot */}
            <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15, marginBottom: 10 }}>Your profile snapshot</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: grade || 'Grade not set',       icon: '🎓', set: !!grade },
                  { label: province || 'Province not set', icon: '📍', set: !!province },
                  { label: careerResult ? 'Career Choice ✓' : 'Career quiz pending', icon: '🎯', set: !!careerResult },
                  { label: jobFitResult ? 'Job Fit ✓' : 'Job Fit pending',           icon: '🧩', set: !!jobFitResult },
                  { label: `${saved.length} saved`,                                  icon: '🔖', set: saved.length > 0 },
                ].map(({ label, icon, set }) => (
                  <View key={label} style={{ backgroundColor: set ? colors.teal + '12' : colors.border + '44', borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 13 }}>{icon}</Text>
                    <Text style={{ color: set ? colors.teal : colors.muted, fontSize: 12, fontWeight: '700' }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Advice cards */}
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginBottom: spacing.sm }}>
              Your personalised advice
            </Text>
            {advice.map((item, i) => <AdviceCard key={i} item={item} />)}

            {/* Human adviser CTA */}
            <View style={{ backgroundColor: colors.navy, borderRadius: radius.lg, padding: spacing.md, marginTop: 8, overflow: 'hidden', ...shadow.xl }}>
              <View style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.yellowGlow }} />
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>Want human guidance?</Text>
              <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 19, marginBottom: 14 }}>
                A Khetha career practitioner can give you a full consultation — free of charge, in your language, in your province.
              </Text>
              <Pressable
                onPress={() => router.push('/contact' as any)}
                style={{ backgroundColor: colors.yellow, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' }}
                accessibilityRole="button"
              >
                <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>Contact an adviser →</Text>
              </Pressable>
            </View>

            {/* Re-run */}
            <Pressable
              onPress={() => setAccepted(false)}
              style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: 12 }}
              accessibilityRole="button"
            >
              <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 14 }}>View AI disclaimer again</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
