import { Linking, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { colors, spacing } from '../../src/theme';
import { QUALIFICATIONS, PROVIDERS } from '../../src/data/seed';
import { useUserStore } from '../../src/store/user';

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

export default function QualificationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saved, toggleSaved } = useUserStore();
  const qual = QUALIFICATIONS.find((q) => q.id === id);
  const isSaved = saved.includes(id ?? '');

  if (!qual) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Qualification not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }} accessibilityRole="button">
          <Text style={{ color: colors.blue, fontWeight: '700' }}>← Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const provider = PROVIDERS.find((p) => p.id === qual.provider_id);
  const fieldColor = FIELD_COLORS[qual.field] ?? colors.muted;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        {/* Badges */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: colors.blue + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: colors.blue, fontWeight: '700', fontSize: 12 }}>NQF {qual.nqf_level}</Text>
          </View>
          <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 12 }}>{qual.duration}</Text>
          </View>
          <View style={{ backgroundColor: fieldColor + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: fieldColor, fontWeight: '700', fontSize: 12 }}>{qual.field}</Text>
          </View>
        </View>

        <Text style={{ color: colors.navy, fontSize: 26, fontWeight: '800', lineHeight: 34, marginBottom: 8 }}>{qual.title}</Text>
        <Text style={{ color: colors.ink, fontSize: 15, lineHeight: 24, marginBottom: 20 }}>{qual.description}</Text>

        {/* Entry requirements */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 10 }}>Entry requirements</Text>
          <Text style={{ color: colors.ink, fontSize: 14, lineHeight: 22 }}>📋 {qual.entry_requirements}</Text>
        </View>

        {/* Career outcomes */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 12 }}>Where this can take you</Text>
          {qual.career_outcomes.map((outcome) => (
            <View key={outcome} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: fieldColor }} />
              <Text style={{ color: colors.ink, fontSize: 14 }}>{outcome}</Text>
            </View>
          ))}
        </View>

        {/* Provider */}
        {provider && (
          <Link href={`/provider/${provider.id}`} asChild>
            <Pressable
              style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
              accessibilityRole="button"
              accessibilityLabel={`View provider: ${provider.name}`}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>OFFERED BY</Text>
                <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>{provider.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                  {provider.provider_type} · {provider.city}, {provider.province}
                </Text>
              </View>
              <Text style={{ color: colors.blue, fontSize: 20 }}>›</Text>
            </Pressable>
          </Link>
        )}

        {/* Apply CTA */}
        <Pressable
          onPress={() => Linking.openURL(qual.application_url)}
          style={{ backgroundColor: colors.teal, borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 10, minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Apply online"
        >
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>Apply online →</Text>
        </Pressable>

        {/* Save */}
        <Pressable
          onPress={() => toggleSaved(qual.id)}
          style={{ backgroundColor: isSaved ? colors.border : colors.navy, borderRadius: 14, padding: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
        >
          <Text style={{ color: isSaved ? colors.ink : colors.white, fontWeight: '800', fontSize: 16 }}>
            {isSaved ? '✓ Saved' : 'Save this qualification'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
