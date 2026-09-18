import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { colors, spacing } from '../theme';
import type { Provider } from '../data/seed';

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'University':             { bg: colors.blue + '18',   text: colors.blue },
  'University of Technology': { bg: '#7B61FF18',        text: '#7B61FF' },
  'TVET College':           { bg: colors.teal + '18',   text: colors.teal },
  'Distance Learning':      { bg: colors.yellow + '33', text: '#92600A' },
};

type Props = { provider: Provider };

export default function ProviderCard({ provider }: Props) {
  const typeStyle = TYPE_COLORS[provider.provider_type] ?? { bg: colors.border, text: colors.muted };
  return (
    <Link href={`/provider/${provider.id}`} asChild>
      <Pressable
        style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12 }}
        accessibilityRole="button"
        accessibilityLabel={`View provider: ${provider.name}`}
      >
        {/* Top row: type badge + distance learning flag */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: typeStyle.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: typeStyle.text, fontSize: 11, fontWeight: '700' }}>{provider.provider_type.toUpperCase()}</Text>
          </View>
          {provider.distance_learning && (
            <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
              <Text style={{ color: colors.teal, fontSize: 11, fontWeight: '700' }}>DISTANCE LEARNING</Text>
            </View>
          )}
        </View>

        {/* Name + arrow */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800', flex: 1 }}>{provider.name}</Text>
          <Text style={{ color: colors.blue, fontSize: 20, marginLeft: 8 }}>›</Text>
        </View>

        {/* Location + qual count */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <Text style={{ color: colors.muted, fontSize: 13 }}>📍 {provider.city}, {provider.province}</Text>
          {provider.qualifications_count > 0 && (
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {provider.qualifications_count} qual{provider.qualifications_count !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
