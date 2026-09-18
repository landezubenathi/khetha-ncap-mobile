import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../theme';
import type { Provider } from '../data/seed';

const TYPE_META: Record<string, { bg: string; text: string; icon: string; IconSet: any; accent: string }> = {
  'University':               { bg: colors.blue + '18',   text: colors.blue,   icon: 'university',      IconSet: FontAwesome5,           accent: colors.blue },
  'University of Technology': { bg: '#7B61FF18',          text: '#7B61FF',     icon: 'flask',           IconSet: MaterialCommunityIcons, accent: '#7B61FF' },
  'TVET College':             { bg: colors.teal + '18',   text: colors.teal,   icon: 'tools',           IconSet: Feather,                accent: colors.teal },
  'Distance Learning':        { bg: colors.yellow + '22', text: '#92600A',     icon: 'wifi',            IconSet: Feather,                accent: colors.yellow },
};

type Props = { provider: Provider };

export default function ProviderCard({ provider }: Props) {
  const tm = TYPE_META[provider.provider_type] ?? { bg: colors.border, text: colors.muted, icon: 'home', IconSet: Feather, accent: colors.muted };

  return (
    <Link href={`/provider/${provider.id}`} asChild>
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
        accessibilityLabel={`View provider: ${provider.name}`}
      >
        {/* Coloured top accent bar */}
        <View style={{ height: 4, backgroundColor: tm.accent }} />

        <View style={{ padding: spacing.md }}>
          {/* Header: icon + type badge + distance badge */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <View style={{
              width: 48, height: 48, borderRadius: radius.md,
              backgroundColor: tm.accent,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: tm.accent, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
            }}>
              <tm.IconSet name={tm.icon} size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1, paddingTop: 2 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                <View style={{ backgroundColor: tm.bg, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ color: tm.text, fontSize: 10, fontWeight: '800', letterSpacing: 0.3 }}>
                    {provider.provider_type.toUpperCase()}
                  </Text>
                </View>
                {provider.distance_learning && (
                  <View style={{ backgroundColor: colors.teal + '18', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Feather name="wifi" size={9} color={colors.teal} />
                    <Text style={{ color: colors.teal, fontSize: 10, fontWeight: '700' }}>DISTANCE</Text>
                  </View>
                )}
              </View>
            </View>
            {/* Chevron */}
            <View style={{ width: 30, height: 30, borderRadius: radius.full, backgroundColor: tm.accent + '12', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="chevron-right" size={16} color={tm.accent} />
            </View>
          </View>

          {/* Name */}
          <Text style={{ color: colors.navy, fontSize: 16, fontWeight: '800', marginBottom: 10, lineHeight: 22 }}>
            {provider.name}
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.borderLight, marginBottom: 10 }} />

          {/* Location + qual count row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 22, height: 22, borderRadius: radius.sm, backgroundColor: colors.danger + '12', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="map-pin" size={11} color={colors.danger} />
              </View>
              <Text style={{ color: colors.muted, fontSize: 13 }}>{provider.city}, {provider.province}</Text>
            </View>
            {provider.qualifications_count > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.bg, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.borderLight }}>
                <MaterialCommunityIcons name="certificate-outline" size={12} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>
                  {provider.qualifications_count} qual{provider.qualifications_count !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
