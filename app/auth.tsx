import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../src/theme';
import { useT } from '../src/i18n';
import { supabase } from '../src/lib/supabase';
import { useUserStore } from '../src/store/user';

type Stage = 'email' | 'otp';

export default function Auth() {
  const t = useT();
  const consentGiven = useUserStore((s) => s.consentGiven);

  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function afterAuth() {
    router.replace(consentGiven ? '/(tabs)' : '/consent');
  }

  async function sendOtp() {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setError('');
    setLoading(true);
    if (!supabase) { setStage('otp'); setLoading(false); return; } // demo mode
    const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStage('otp');
  }

  async function verifyOtp() {
    if (otp.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setError('');
    setLoading(true);
    if (!supabase) { setLoading(false); afterAuth(); return; } // demo mode
    const { error: err } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type: 'email' });
    setLoading(false);
    if (err) { setError(err.message); return; }
    afterAuth();
  }

  function continueAsGuest() {
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, padding: spacing.xl, justifyContent: 'center' }}
      >
        <Text style={{ color: colors.yellow, fontSize: 18, fontWeight: '800', letterSpacing: 2 }}>KHETHA NCAP</Text>
        <Text style={{ color: colors.white, fontSize: 30, fontWeight: '800', marginTop: 16, lineHeight: 38 }}>
          {stage === 'email' ? t('sign_in') : 'Check your email'}
        </Text>
        <Text style={{ color: '#D9E2EC', fontSize: 15, marginTop: 10, lineHeight: 23 }}>
          {stage === 'email'
            ? 'We\'ll send a one-time code — no password needed.'
            : t('otp_prompt')}
        </Text>

        {stage === 'email' ? (
          <TextInput
            value={email}
            onChangeText={(v) => { setEmail(v); setError(''); }}
            placeholder={t('email_placeholder')}
            placeholderTextColor="#829AB1"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={inputStyle}
            accessibilityLabel="Email address"
          />
        ) : (
          <TextInput
            value={otp}
            onChangeText={(v) => { setOtp(v.replace(/\D/g, '').slice(0, 6)); setError(''); }}
            placeholder="000000"
            placeholderTextColor="#829AB1"
            keyboardType="number-pad"
            maxLength={6}
            style={[inputStyle, { fontSize: 28, letterSpacing: 10, textAlign: 'center' }]}
            accessibilityLabel="One-time code"
          />
        )}

        {!!error && (
          <Text style={{ color: colors.danger, marginTop: 8, fontSize: 13 }} accessibilityRole="alert">
            {error}
          </Text>
        )}

        <Pressable
          onPress={stage === 'email' ? sendOtp : verifyOtp}
          disabled={loading}
          style={{ backgroundColor: colors.yellow, borderRadius: 14, marginTop: 24, minHeight: 56, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={stage === 'email' ? t('send_code') : t('verify')}
        >
          {loading
            ? <ActivityIndicator color={colors.navy} />
            : <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 16 }}>
                {stage === 'email' ? t('send_code') : t('verify')}
              </Text>
          }
        </Pressable>

        {stage === 'otp' && (
          <Pressable
            onPress={() => { setStage('email'); setOtp(''); setError(''); }}
            style={{ marginTop: 16, alignItems: 'center', minHeight: 44, justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Change email address"
          >
            <Text style={{ color: '#829AB1', fontSize: 14 }}>← Change email</Text>
          </Pressable>
        )}

        <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#1E3A5F', paddingTop: 28 }}>
          <Pressable
            onPress={continueAsGuest}
            style={{ borderWidth: 1, borderColor: '#829AB1', borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel={t('guest_continue')}
          >
            <Text style={{ color: '#D9E2EC', fontWeight: '600', fontSize: 15 }}>{t('guest_continue')}</Text>
          </Pressable>
          <Text style={{ color: '#627D98', fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 18 }}>
            Guest mode saves your progress on this device only.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const inputStyle = {
  backgroundColor: '#1E3A5F',
  borderRadius: 12,
  padding: 16,
  color: colors.white,
  fontSize: 16,
  marginTop: 24,
  borderWidth: 1,
  borderColor: '#2D5A8E',
  minHeight: 56,
};
