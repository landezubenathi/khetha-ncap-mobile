import { Linking, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { colors, spacing } from '../../src/theme';
import { PROVIDERS, QUALIFICATIONS } from '../../src/data/seed';
import { useUserStore } from '../../src/store/user';

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'University':               { bg: colors.blue + '18',   text: colors.blue },
  'University of Technology': { bg: '#7B61FF18',          text: '#7B61FF' },
  'TVET College':             { bg: colors.teal + '18',   text: colors.teal },
  'Distance Learning':        { bg: colors.yellow + '33', text: '#92600A' },
};

export default function ProviderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saved, toggleSaved } = useUserStore();
  const provider = PROVIDERS.find((p) => p.id === id);
  const isSaved = saved.includes(id ?? '');

  if (!provider) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Provider not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }} accessibilityRole="button">
          <Text style={{ color: colors.blue, fontWeight: '700' }}>← Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const typeStyle = TYPE_COLORS[provider.provider_type] ?? { bg: colors.border, text: colors.muted };
  const offeredQuals = QUALIFICATIONS.filter((q) => q.provider_id === provider.id);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${provider.latitude},${provider.longitude}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        {/* Badges */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: typeStyle.bg, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ color: typeStyle.text, fontWeight: '700', fontSize: 12 }}>{provider.provider_type.toUpperCase()}</Text>
          </View>
          {provider.distance_learning && (
            <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 12 }}>DISTANCE LEARNING</Text>
            </View>
          )}
        </View>

        <Text style={{ color: colors.navy, fontSize: 26, fontWeight: '800', lineHeight: 34, marginBottom: 4 }}>{provider.name}</Text>
        <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 20 }}>📍 {provider.city}, {provider.province}</Text>

        {/* Contact */}
        <View style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 14, gap: 12 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>Contact</Text>
          <Pressable onPress={() => Linking.openURL(`tel:${provider.phone}`)} accessibilityRole="button" accessibilityLabel={`Call ${provider.name}`}>
            <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 15 }}>📞 {provider.phone}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(provider.website)} accessibilityRole="button" accessibilityLabel={`Visit ${provider.name} website`}>
            <Text style={{ color: colors.blue, fontSize: 14 }}>🌐 {provider.website}</Text>
          </Pressable>
          <Text style={{ color: colors.muted, fontSize: 13 }}>🏠 {provider.address}</Text>
        </View>

        {/* Directions */}
        <Pressable
          onPress={() => Linking.openURL(mapsUrl)}
          style={{ backgroundColor: colors.blue + '12', borderRadius: 14, padding: spacing.md, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Get directions"
        >
          <Text style={{ fontSize: 22 }}>🗺</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 14 }}>Get directions</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
              {provider.latitude.toFixed(4)}, {provider.longitude.toFixed(4)}
            </Text>
          </View>
          <Text style={{ color: colors.blue, fontSize: 18 }}>›</Text>
        </Pressable>

        {/* Qualifications offered */}
        {offeredQuals.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>
              Qualifications offered
            </Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 12 }}>
              {offeredQuals.length} qualification{offeredQuals.length !== 1 ? 's' : ''} at this institution
            </Text>
            {offeredQuals.map((q) => (
              <Link key={q.id} href={`/qualification/${q.id}`} asChild>
                <Pressable
                  style={{ backgroundColor: colors.white, borderRadius: 12, padding: spacing.sm, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${q.title}`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.navy, fontWeight: '700', fontSize: 14 }}>{q.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>NQF {q.nqf_level} · {q.duration} · {q.field}</Text>
                  </View>
                  <Text style={{ color: colors.blue, fontSize: 18 }}>›</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}

        {/* Save */}
        <Pressable
          onPress={() => toggleSaved(provider.id)}
          style={{ backgroundColor: isSaved ? colors.border : colors.navy, borderRadius: 14, padding: 18, alignItems: 'center', minHeight: 56, justifyContent: 'center' }}
          accessibilityRole="button"
        >
          <Text style={{ color: isSaved ? colors.ink : colors.white, fontWeight: '800', fontSize: 16 }}>
            {isSaved ? '✓ Saved' : 'Save this provider'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
