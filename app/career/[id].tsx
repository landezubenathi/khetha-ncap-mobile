import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { colors, spacing } from '../../src/theme';
import { useUserStore } from '../../src/store/user';
import { CAREERS, QUALIFICATIONS } from '../../src/data/seed';
import QualCard from '../../src/components/QualCard';
import { notifySaved } from '../../src/lib/notifications';

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

const OUTLOOK_COLORS: Record<string, { bg: string; text: string }> = {
  'High demand': { bg: colors.teal + '22', text: colors.teal },
  'Growing':     { bg: colors.blue + '18', text: colors.blue },
  'Stable':      { bg: colors.yellow + '33', text: '#92600A' },
  'Competitive': { bg: '#D6454518', text: '#D64545' },
};

export default function CareerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saved, toggleSaved } = useUserStore();

  const career = CAREERS.find((c) => c.id === id);
  const isSaved = saved.includes(id ?? '');

  if (!career) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted, fontSize: 16 }}>Career not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }} accessibilityRole="button">
          <Text style={{ color: colors.blue, fontWeight: '700' }}>← Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const fieldColor = FIELD_COLORS[career.field] ?? colors.muted;
  const outlook = OUTLOOK_COLORS[career.outlook] ?? OUTLOOK_COLORS['Stable'];
  const relatedQuals = QUALIFICATIONS.filter((q) => q.field === career.field);
  const relatedCareers = CAREERS.filter((c) => career.related_careers.includes(c.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        {/* Hero */}
        <View style={{ backgroundColor: fieldColor + '18', borderRadius: 16, padding: spacing.md, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <View style={{ backgroundColor: fieldColor + '33', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: fieldColor, fontWeight: '700', fontSize: 12 }}>{career.field.toUpperCase()}</Text>
            </View>
            <View style={{ backgroundColor: outlook.bg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: outlook.text, fontWeight: '700', fontSize: 12 }}>{career.outlook}</Text>
            </View>
          </View>
          <Text style={{ color: colors.navy, fontSize: 28, fontWeight: '800', lineHeight: 36 }}>{career.title}</Text>
          <Text style={{ color: colors.teal, fontSize: 15, marginTop: 6, fontWeight: '700' }}>{career.salary_range}</Text>
        </View>

        {/* About */}
        <Text style={{ color: colors.ink, fontSize: 15, lineHeight: 24, marginBottom: 20 }}>{career.description}</Text>

        {/* Work environment */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 10 }}>Where you will work</Text>
          <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22 }}>🏢 {career.work_environment}</Text>
        </View>

        {/* Pathway */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 10 }}>Study pathway</Text>
          <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 8 }}>📚 {career.education_path}</Text>
          <Text style={{ color: colors.muted, fontSize: 14 }}>
            📐 Recommended subjects: {career.subjects.join(', ')}
          </Text>
        </View>

        {/* Skills */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Key skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {career.skills.map((s) => (
              <View key={s} style={{ backgroundColor: fieldColor + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={{ color: fieldColor, fontWeight: '700', fontSize: 13 }}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Where to study */}
        {relatedQuals.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>What to study</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 12 }}>
              Qualifications in {career.field} that lead to this career:
            </Text>
            {relatedQuals.map((q) => <QualCard key={q.id} qual={q} />)}
          </View>
        )}

        {/* Related careers */}
        {relatedCareers.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Related careers</Text>
            {relatedCareers.map((rc) => {
              const rc_color = FIELD_COLORS[rc.field] ?? colors.muted;
              return (
                <Link key={rc.id} href={`/career/${rc.id}`} asChild>
                  <Pressable
                    style={{ backgroundColor: colors.white, borderRadius: 12, padding: spacing.sm, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 3, borderLeftColor: rc_color }}
                    accessibilityRole="button"
                    accessibilityLabel={`View ${rc.title}`}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 14 }}>{rc.title}</Text>
                      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{rc.field}</Text>
                    </View>
                    <Text style={{ color: colors.blue, fontSize: 18 }}>›</Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        )}

        {/* Subject Chooser CTA */}
        <Link href="/subject-chooser" asChild>
          <Pressable
            style={{ backgroundColor: colors.teal + '12', borderRadius: 14, padding: spacing.md, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Check which subjects you need"
          >
            <Text style={{ fontSize: 24 }}>📐</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>Check your subjects</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>See exactly which subjects you need for this career.</Text>
            </View>
            <Text style={{ color: colors.teal, fontSize: 18 }}>›</Text>
          </Pressable>
        </Link>

        {/* Save */}
        <Pressable
          onPress={() => {
            toggleSaved(career.id);
            if (!isSaved) notifySaved(career.title, 'career');
          }}
          style={{ backgroundColor: isSaved ? colors.border : colors.navy, borderRadius: 14, padding: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save this career'}
        >
          <Text style={{ color: isSaved ? colors.ink : colors.white, fontWeight: '800', fontSize: 16 }}>
            {isSaved ? '✓ Saved' : 'Save this career'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
