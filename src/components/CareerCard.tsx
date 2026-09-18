import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing } from '../theme';
import type { Career } from '../data/seed';

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

type Props = { career: Career };

export default function CareerCard({ career }: Props) {
  const fieldColor = FIELD_COLORS[career.field] ?? colors.muted;
  const outlook = OUTLOOK_COLORS[career.outlook] ?? OUTLOOK_COLORS['Stable'];
  return (
    <Link href={`/career/${career.id}`} asChild>
      <Pressable
        style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: fieldColor }}
        accessibilityRole="button"
        accessibilityLabel={`View career: ${career.title}`}
      >
        {/* Top row: field chip + outlook badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ backgroundColor: fieldColor + '22', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: fieldColor, fontSize: 11, fontWeight: '700' }}>{career.field.toUpperCase()}</Text>
          </View>
          <View style={{ backgroundColor: outlook.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: outlook.text, fontSize: 11, fontWeight: '700' }}>{career.outlook}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>{career.title}</Text>

        {/* Salary */}
        <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '700', marginBottom: 6 }}>{career.salary_range}</Text>

        {/* Skills preview + arrow */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.muted, fontSize: 13, flex: 1 }}>
            {career.skills.slice(0, 3).join(' · ')}
          </Text>
          <Text style={{ color: colors.blue, fontSize: 20, marginLeft: 8 }}>›</Text>
        </View>
      </Pressable>
    </Link>
  );
}
