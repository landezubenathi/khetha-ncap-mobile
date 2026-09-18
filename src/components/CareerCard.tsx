import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import type { Career } from '../data/seed';

const FIELD_META: Record<string, { color: string; icon: string; IconSet: any }> = {
  Health:           { color: colors.teal,    icon: 'heart-pulse',      IconSet: MaterialCommunityIcons },
  Technology:       { color: colors.blue,    icon: 'cpu',              IconSet: Feather },
  Business:         { color: '#7B61FF',      icon: 'trending-up',      IconSet: Feather },
  Education:        { color: '#F4A740',      icon: 'book-open',        IconSet: Feather },
  Engineering:      { color: '#E05C2A',      icon: 'settings',         IconSet: Feather },
  Arts:             { color: '#D64545',      icon: 'palette',          IconSet: MaterialCommunityIcons },
  Law:              { color: '#0E7490',      icon: 'scale-balance',    IconSet: MaterialCommunityIcons },
  'Social Sciences':{ color: '#059669',      icon: 'account-group',    IconSet: MaterialCommunityIcons },
  Agriculture:      { color: '#65A30D',      icon: 'leaf',             IconSet: Feather },
};

const OUTLOOK_META: Record<string, { bg: string; text: string; icon: string }> = {
  'High demand': { bg: colors.teal + '1A',   text: colors.teal,   icon: 'trending-up' },
  'Growing':     { bg: colors.blue + '1A',   text: colors.blue,   icon: 'arrow-up-right' },
  'Stable':      { bg: '#F4B74022',          text: '#92600A',     icon: 'minus' },
  'Competitive': { bg: '#D6454518',          text: '#D64545',     icon: 'zap' },
};

type Props = { career: Career };

export default function CareerCard({ career }: Props) {
  const fm = FIELD_META[career.field] ?? { color: colors.muted, icon: 'briefcase', IconSet: Feather };
  const om = OUTLOOK_META[career.outlook] ?? OUTLOOK_META['Stable'];

  return (
    <Link href={`/career/${career.id}`} asChild>
      <Pressable
        style={{
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          marginBottom: 12,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...shadow.md,
        }}
        accessibilityRole="button"
        accessibilityLabel={`View career: ${career.title}`}
      >
        {/* Coloured top accent bar */}
        <View style={{ height: 4, backgroundColor: fm.color }} />

        <View style={{ padding: spacing.md }}>
          {/* Header row: icon + field chip + outlook badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <View style={{
              width: 44, height: 44, borderRadius: radius.md,
              backgroundColor: fm.color,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: fm.color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
            }}>
              <fm.IconSet name={fm.icon} size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <View style={{ backgroundColor: fm.color + '18', borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3 }}>
                  <Text style={{ color: fm.color, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>{career.field.toUpperCase()}</Text>
                </View>
                <View style={{ backgroundColor: om.bg, borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Feather name={om.icon as any} size={9} color={om.text} />
                  <Text style={{ color: om.text, fontSize: 10, fontWeight: '700' }}>{career.outlook}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={{ color: colors.navy, fontSize: 17, fontWeight: '800', marginBottom: 4, lineHeight: 23 }}>
            {career.title}
          </Text>

          {/* Salary */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <Feather name="dollar-sign" size={13} color={colors.teal} />
            <Text style={{ color: colors.teal, fontSize: 13, fontWeight: '700' }}>{career.salary_range}</Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.borderLight, marginBottom: 10 }} />

          {/* Skills + chevron */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 6, flex: 1, flexWrap: 'wrap' }}>
              {career.skills.slice(0, 3).map((skill) => (
                <View key={skill} style={{ backgroundColor: colors.bg, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.borderLight }}>
                  <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600' }}>{skill}</Text>
                </View>
              ))}
            </View>
            <View style={{ width: 30, height: 30, borderRadius: radius.full, backgroundColor: colors.blue + '12', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
              <Feather name="chevron-right" size={16} color={colors.blue} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
