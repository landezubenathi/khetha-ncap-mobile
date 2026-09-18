import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing } from '../theme';
import type { Qualification } from '../data/seed';

const FIELD_COLORS: Record<string, string> = {
  Health: colors.teal, Technology: colors.blue, Business: '#7B61FF',
  Education: '#F4A740', Engineering: '#E05C2A', Arts: '#D64545',
  Law: '#0E7490', 'Social Sciences': '#059669', Agriculture: '#65A30D',
};

type Props = { qual: Qualification };

export default function QualCard({ qual }: Props) {
  const fieldColor = FIELD_COLORS[qual.field] ?? colors.muted;
  return (
    <Link href={`/qualification/${qual.id}`} asChild>
      <Pressable
        style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: fieldColor }}
        accessibilityRole="button"
        accessibilityLabel={`View qualification: ${qual.title}`}
      >
        {/* Badges row */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <View style={{ backgroundColor: colors.blue + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: colors.blue, fontSize: 11, fontWeight: '700' }}>NQF {qual.nqf_level}</Text>
          </View>
          <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: colors.teal, fontSize: 11, fontWeight: '700' }}>{qual.duration}</Text>
          </View>
          <View style={{ backgroundColor: fieldColor + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: fieldColor, fontSize: 11, fontWeight: '700' }}>{qual.field}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>{qual.title}</Text>

        {/* Provider */}
        <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 6 }}>🎓 {qual.provider_name}</Text>

        {/* Entry req preview + arrow */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }} numberOfLines={1}>
            {qual.entry_requirements}
          </Text>
          <Text style={{ color: colors.blue, fontSize: 20, marginLeft: 8 }}>›</Text>
        </View>
      </Pressable>
    </Link>
  );
}
