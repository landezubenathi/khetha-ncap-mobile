import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { colors, spacing, MIN_TOUCH, fs, radius, shadow } from '../src/theme';
import { useUserStore } from '../src/store/user';
import { useT, LANGUAGE_LIST } from '../src/i18n';

const FONT_SCALES = [
  { label: 'A', value: 1,   size: 14 },
  { label: 'A', value: 1.2, size: 17 },
  { label: 'A', value: 1.5, size: 21 },
];

export default function Onboarding() {
  const [language, setLocalLanguage] = useState<string>('English');
  const [scale, setScale] = useState(1);
  const { setLanguage, setFontScale, completeOnboarding } = useUserStore();
  const t = useT();

  function handleStart() {
    setLanguage(language);
    setFontScale(scale);
    completeOnboarding();
    router.replace('/auth');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand logos */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <Image source={require('../assets/khetha_logo.png')} style={{ height: 52, width: 140 }} resizeMode="contain" />
          <View style={{ backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 6, ...shadow.sm }}>
            <Image source={require('../assets/DHET-FC-logo.png')} style={{ height: 44, width: 100 }} resizeMode="contain" />
          </View>
        </View>
        <Text style={{ color: colors.white, fontSize: fs(34, scale), fontWeight: '800', marginTop: 16, lineHeight: fs(34, scale) * 1.25 }}>
          {t('tagline')}
        </Text>

        {/* Offline reassurance */}
        <View style={{ backgroundColor: colors.teal + '33', borderRadius: 12, padding: spacing.sm, marginTop: 20, flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: fs(16, scale) }}>📶</Text>
          <Text style={{ color: colors.white, fontSize: fs(13, scale), lineHeight: fs(13, scale) * 1.6, flex: 1 }}>
            {t('offline_works')}
          </Text>
        </View>

        {/* Language picker */}
        <Text style={{ color: colors.white, fontWeight: '700', marginTop: 36, fontSize: fs(15, scale) }}>
          {t('language_prompt')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {LANGUAGE_LIST.map((lang) => (
            <Pressable
              key={lang}
              onPress={() => setLocalLanguage(lang)}
              style={{
                borderWidth: 2,
                borderColor: language === lang ? colors.yellow : '#829AB1',
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: language === lang ? colors.yellow + '22' : 'transparent',
                minHeight: MIN_TOUCH,
                justifyContent: 'center',
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: language === lang }}
              accessibilityLabel={lang}
            >
              <Text style={{ color: language === lang ? colors.yellow : colors.white, fontWeight: '700', fontSize: fs(13, scale) }}>
                {lang}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Text size picker */}
        <Text style={{ color: colors.white, fontWeight: '700', marginTop: 32, fontSize: fs(15, scale) }}>
          {t('text_size')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          {FONT_SCALES.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setScale(opt.value)}
              style={{
                borderWidth: 2,
                borderColor: scale === opt.value ? colors.yellow : '#829AB1',
                borderRadius: 12,
                paddingHorizontal: 18,
                paddingVertical: 10,
                backgroundColor: scale === opt.value ? colors.yellow + '22' : 'transparent',
                minHeight: MIN_TOUCH,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: scale === opt.value }}
              accessibilityLabel={`Text size ${opt.value === 1 ? 'small' : opt.value === 1.2 ? 'medium' : 'large'}`}
            >
              <Text style={{ color: scale === opt.value ? colors.yellow : colors.white, fontWeight: '800', fontSize: opt.size }}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Start CTA */}
        <Pressable
          onPress={handleStart}
          style={{
            backgroundColor: colors.yellow,
            padding: 18,
            borderRadius: 14,
            marginTop: 40,
            alignItems: 'center',
            minHeight: MIN_TOUCH + 12,
            justifyContent: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel={t('start')}
        >
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, scale) }}>{t('start')}</Text>
        </Pressable>

        {/* USSD / no-smartphone fallback */}
        <View style={{ marginTop: 28, borderTopWidth: 1, borderTopColor: '#829AB144', paddingTop: 20 }}>
          <Text style={{ color: '#829AB1', fontSize: fs(12, scale), textAlign: 'center', lineHeight: fs(12, scale) * 1.7 }}>
            {t('ussd_tip')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
