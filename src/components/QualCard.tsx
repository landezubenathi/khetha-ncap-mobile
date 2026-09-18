import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import type { Qualification } from '../data/seed';

const FIELD_META: Record<string, { color: string; icon: string; IconSet: any }> = {
  Health:           { color: colors.teal,    icon: 'heart-pulse',   IconSet: MaterialCommunityIcons },
  Technology:       { color: colors.blue,    icon: 'cpu',           IconSet: Feather },
  Business:         { color: '#7B61FF',      icon: 'trending-up',   IconSet: Feather },
  Education:        { color: '#F4A740',      icon: 'book-open',     IconSet: Feather },
  Engineering:      { color: '#E05C2A',      icon: 'settings',      IconSet: Feather },
  Arts:             { color: '#D64545',      icon: 'palette',       IconSet: MaterialCommunityIcons },
  Law:              { color: '#0E7490',      icon: 'scale-balance', IconSet: MaterialCommunityIcons },
  'Social Sciences':{ color: '#059669',      icon: 'account-group', IconSet: MaterialCommunityIcons },
  Agriculture:      { color: '#65A30D',      icon: 'leaf',          IconSet: Feather },
};

// NQF level → visual weight
function nqfColor(level: string): string {
  const n = Number(level);
  if (n <= 4) return colors.muted;
  if (n <= 6) return colors.blue;
  return colors.purple;
}

type Props = { qual: Qualification };

export default function QualCard({ qual }: Props) {
  const fm = FIELD_META[qual.field] ?? { color: colors.muted, icon: 'award', IconSet: Feather };
  const nc = nqfColor(qual.nqf_level);

  return (
    <Link href={`/qualification/${qual.id}`} asChild>
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
        accessibilityLabel={`View qualification: ${qual.title}`}
      >
        {/* Coloured top accent bar */}
        <View style={{ height: 4, backgroundColor: fm.color }} />

        <View style={{ padding: spacing.md }}>
          {/* Header: icon + badges */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <View style={{
              width: 44, height: 44, borderRadius: radius.md,
              backgroundColor: fm.color,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: fm.color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
            }}>
              <fm.IconSet name={fm.icon} size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingTop: 2 }}>
              {/* NQF badge */}
              <View style={{ backgroundColor: nc + '18', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MaterialCommunityIcons name="certificate-outline" size={11} color={nc} />
                <Text style={{ color: nc, fontSize: 10, fontWeight: '800' }}>NQF {qual.nqf_level}</Text>
              </View>
              {/* Duration badge */}
              <View style={{ backgroundColor: colors.teal + '18', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="clock" size={10} color={colors.teal} />
                <Text style={{ color: colors.teal, fontSize: 10, fontWeight: '700' }}>{qual.duration}</Text>
              </View>
              {/* Field badge */}
              <View style={{ backgroundColor: fm.color + '18', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 }}>
                <Text style={{ color: fm.color, fontSize: 10, fontWeight: '700' }}>{qual.field}</Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800', marginBottom: 6, lineHeight: 22 }}>
            {qual.title}
          </Text>

          {/* Provider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: radius.sm, backgroundColor: colors.blue + '12', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name="school-outline" size={13} color={colors.blue} />
            </View>
            <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600', flex: 1 }} numberOfLines={1}>
              {qual.provider_name}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.borderLight, marginBottom: 10 }} />

          {/* Entry requirements + chevron */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 }}>
              <Feather name="info" size={12} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, flex: 1 }} numberOfLines={1}>
                {qual.entry_requirements}
              </Text>
            </View>
            <View style={{ width: 30, height: 30, borderRadius: radius.full, backgroundColor: colors.teal + '12', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
              <Feather name="chevron-right" size={16} color={colors.teal} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
