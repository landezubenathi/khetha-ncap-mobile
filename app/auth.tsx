import { Stack, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Pressable, SafeAreaView, Text, TextInput, View,
} from 'react-native';
import { colors, spacing, fs, MIN_TOUCH } from '../src/theme';
import { useT } from '../src/i18n';
import { supabase } from '../src/lib/supabase';
import { useUserStore } from '../src/store/user';

type Stage = 'email' | 'otp';

const RESEND_COOLDOWN = 60; // seconds

export default function Auth() {
  const t = useT();
  const { consentGiven, fontScale } = useUserStore();

  const [stage, setStage]       = useState<Stage>('email');
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [cooldown, setCooldown] = useState(0);   // seconds remaining
  const [attempts, setAttempts] = useState(0);   // OTP verify attempts
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.replace(consentGiven ? '/(tabs)' : '/consent');
    });
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [cooldown]);

  function afterAuth() {
    router.replace(consentGiven ? '/(tabs)' : '/consent');
  }

  function friendlyError(msg: string): string {
    if (msg.includes('rate limit') || msg.includes('too many'))
      return 'Too many attempts. Please wait a minute before trying again.';
    if (msg.includes('invalid') || msg.includes('expired'))
      return 'That code is invalid or has expired. Please request a new one.';
    if (msg.includes('network') || msg.includes('fetch'))
      return 'No internet connection. Check your connection and try again.';
    return msg;
  }

  async function sendOtp() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    if (!supabase) {
      // Demo mode — skip real OTP
      setStage('otp');
      setCooldown(RESEND_COOLDOWN);
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });
    setLoading(false);

    if (err) {
      setError(friendlyError(err.message));
      return;
    }
    setStage('otp');
    setCooldown(RESEND_COOLDOWN);
  }

  async function verifyOtp() {
    if (otp.length < 6) { setError('Please enter the full 6-digit code.'); return; }
    if (attempts >= 5) {
      setError('Too many incorrect attempts. Please request a new code.');
      return;
    }
    setError('');
    setLoading(true);

    if (!supabase) { setLoading(false); afterAuth(); return; }

    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    });
    setLoading(false);

    if (err) {
      setAttempts((a) => a + 1);
      setError(friendlyError(err.message));
      return;
    }
    afterAuth();
  }

  async function resendOtp() {
    if (cooldown > 0) return;
    setOtp('');
    setAttempts(0);
    setError('');
    await sendOtp();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, padding: spacing.xl, justifyContent: 'center' }}
      >
        {/* Brand */}
        <Text style={{ color: colors.yellow, fontSize: fs(18, fontScale), fontWeight: '800', letterSpacing: 2 }}>
          KHETHA NCAP
        </Text>
        <Text style={{ color: colors.white, fontSize: fs(30, fontScale), fontWeight: '800', marginTop: 16, lineHeight: fs(30, fontScale) * 1.25 }}>
          {stage === 'email' ? t('sign_in') : 'Check your email'}
        </Text>
        <Text style={{ color: '#D9E2EC', fontSize: fs(15, fontScale), marginTop: 10, lineHeight: fs(15, fontScale) * 1.6 }}>
          {stage === 'email'
            ? 'We\'ll send a one-time code — no password needed.'
            : `${t('otp_prompt')} Sent to ${email}`}
        </Text>

        {/* Input */}
        {stage === 'email' ? (
          <TextInput
            value={email}
            onChangeText={(v) => { setEmail(v); setError(''); }}
            placeholder={t('email_placeholder')}
            placeholderTextColor="#829AB1"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={[inputStyle, { fontSize: fs(16, fontScale) }]}
            accessibilityLabel="Email address"
            accessibilityHint="Enter your email to receive a sign-in code"
          />
        ) : (
          <TextInput
            value={otp}
            onChangeText={(v) => { setOtp(v.replace(/\D/g, '').slice(0, 6)); setError(''); }}
            placeholder="000000"
            placeholderTextColor="#829AB1"
            keyboardType="number-pad"
            maxLength={6}
            style={[inputStyle, { fontSize: fs(28, fontScale), letterSpacing: 10, textAlign: 'center' }]}
            accessibilityLabel="One-time code"
            accessibilityHint="Enter the 6-digit code from your email"
          />
        )}

        {/* Error */}
        {!!error && (
          <View style={{ backgroundColor: colors.danger + '22', borderRadius: 10, padding: 12, marginTop: 10 }}>
            <Text style={{ color: colors.danger, fontSize: fs(13, fontScale), lineHeight: fs(13, fontScale) * 1.5 }} accessibilityRole="alert">
              ⚠️ {error}
            </Text>
          </View>
        )}

        {/* Attempt warning */}
        {attempts > 0 && attempts < 5 && (
          <Text style={{ color: '#F4B740', fontSize: fs(12, fontScale), marginTop: 8 }}>
            {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout.
          </Text>
        )}

        {/* Primary CTA */}
        <Pressable
          onPress={stage === 'email' ? sendOtp : verifyOtp}
          disabled={loading}
          style={{
            backgroundColor: colors.yellow, borderRadius: 14, marginTop: 24,
            minHeight: MIN_TOUCH + 12, alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          accessibilityRole="button"
          accessibilityLabel={stage === 'email' ? t('send_code') : t('verify')}
          accessibilityState={{ disabled: loading }}
        >
          {loading
            ? <ActivityIndicator color={colors.navy} />
            : <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>
                {stage === 'email' ? t('send_code') : t('verify')}
              </Text>
          }
        </Pressable>

        {/* OTP stage controls */}
        {stage === 'otp' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Pressable
              onPress={() => { setStage('email'); setOtp(''); setError(''); setAttempts(0); }}
              style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Change email address"
            >
              <Text style={{ color: '#829AB1', fontSize: fs(14, fontScale) }}>← Change email</Text>
            </Pressable>
            <Pressable
              onPress={resendOtp}
              disabled={cooldown > 0}
              style={{ minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              accessibilityState={{ disabled: cooldown > 0 }}
            >
              <Text style={{ color: cooldown > 0 ? '#627D98' : colors.yellow, fontSize: fs(14, fontScale), fontWeight: '700' }}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Security note */}
        <View style={{ backgroundColor: '#1E3A5F', borderRadius: 12, padding: 12, marginTop: 20, flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: 14 }}>🔒</Text>
          <Text style={{ color: '#829AB1', fontSize: fs(12, fontScale), lineHeight: fs(12, fontScale) * 1.6, flex: 1 }}>
            Your sign-in is secured with a one-time code. We never store passwords. Sessions expire after 7 days.
          </Text>
        </View>

        {/* Guest mode */}
        <View style={{ marginTop: 32, borderTopWidth: 1, borderTopColor: '#1E3A5F', paddingTop: 24 }}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={{ borderWidth: 1, borderColor: '#829AB1', borderRadius: 14, minHeight: MIN_TOUCH + 12, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel={t('guest_continue')}
          >
            <Text style={{ color: '#D9E2EC', fontWeight: '600', fontSize: fs(15, fontScale) }}>{t('guest_continue')}</Text>
          </Pressable>
          <Text style={{ color: '#627D98', fontSize: fs(12, fontScale), textAlign: 'center', marginTop: 10, lineHeight: fs(12, fontScale) * 1.6 }}>
            Guest mode saves your progress on this device only. Sign in to sync across devices.
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
  marginTop: 24,
  borderWidth: 1,
  borderColor: '#2D5A8E',
  minHeight: 56,
} as const;
