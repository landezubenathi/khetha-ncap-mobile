import { SafeAreaView, ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { colors, spacing, MIN_TOUCH, fs } from '../src/theme';
import { useUserStore } from '../src/store/user';
import { useT } from '../src/i18n';

const FONT_SCALES = [
  { label: 'A',  value: 1,   desc: 'Default' },
  { label: 'A',  value: 1.2, desc: 'Medium' },
  { label: 'A',  value: 1.5, desc: 'Large' },
];

export default function Accessibility() {
  const t = useT();
  const { fontScale, setFontScale, highContrast, setHighContrast } = useUserStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: t('accessibility') }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>

        <Text style={{ fontSize: fs(28, fontScale), fontWeight: '800', color: colors.navy }}>
          {t('accessibility')}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 24, fontSize: fs(14, fontScale) }}>
          Adjust the app to suit your needs.
        </Text>

        {/* Text size */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 14 }}>
            {t('text_size')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {FONT_SCALES.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setFontScale(opt.value)}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: fontScale === opt.value ? colors.blue : colors.border,
                  borderRadius: 12,
                  paddingVertical: 14,
                  backgroundColor: fontScale === opt.value ? colors.blue + '12' : colors.bg,
                  alignItems: 'center',
                  minHeight: MIN_TOUCH,
                  justifyContent: 'center',
                  gap: 4,
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: fontScale === opt.value }}
                accessibilityLabel={`Text size ${opt.desc}`}
              >
                <Text style={{ color: fontScale === opt.value ? colors.blue : colors.ink, fontWeight: '800', fontSize: opt.value * 18 }}>
                  {opt.label}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 11 }}>{opt.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* High contrast */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>
                {t('high_contrast')}
              </Text>
              <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginTop: 4, lineHeight: fs(13, fontScale) * 1.5 }}>
                Increases text and border contrast for easier reading in bright light or for low-vision users.
              </Text>
            </View>
            <Pressable
              onPress={() => setHighContrast(!highContrast)}
              style={{
                width: 52, height: 30, borderRadius: 15,
                backgroundColor: highContrast ? colors.teal : colors.border,
                justifyContent: 'center',
                paddingHorizontal: 3,
                marginLeft: 16,
              }}
              accessibilityRole="switch"
              accessibilityState={{ checked: highContrast }}
              accessibilityLabel={t('high_contrast')}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white,
                alignSelf: highContrast ? 'flex-end' : 'flex-start',
              }} />
            </Pressable>
          </View>
        </View>

        {/* Offline info */}
        <View style={{ backgroundColor: colors.teal + '12', borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: colors.teal, fontWeight: '800', fontSize: fs(15, fontScale), marginBottom: 8 }}>
            📶 Works offline
          </Text>
          <Text style={{ color: colors.ink, fontSize: fs(13, fontScale), lineHeight: fs(13, fontScale) * 1.6 }}>
            {t('offline_works')}
          </Text>
        </View>

        {/* USSD / no-smartphone fallback */}
        <View style={{ backgroundColor: colors.yellow + '22', borderRadius: 16, padding: spacing.md, marginBottom: 14 }}>
          <Text style={{ color: '#92600A', fontWeight: '800', fontSize: fs(15, fontScale), marginBottom: 8 }}>
            📞 No smartphone?
          </Text>
          <Text style={{ color: colors.ink, fontSize: fs(13, fontScale), lineHeight: fs(13, fontScale) * 1.6, marginBottom: 12 }}>
            {t('ussd_tip')}
          </Text>
          <Pressable
            onPress={() => Linking.openURL('tel:0869990123')}
            style={{
              backgroundColor: '#92600A', borderRadius: 10, paddingVertical: 12,
              alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Call Khetha on 086 999 0123"
          >
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(14, fontScale) }}>
              Call 086 999 0123
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
