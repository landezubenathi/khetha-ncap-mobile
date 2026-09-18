/**
 * app/chatbot.tsx
 * Khetha FAQ Chatbot — premium dark UI with full seed-data knowledge base.
 */

import { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, Text, TextInput, View, Animated,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../src/theme';
import { findAnswer, SUGGESTED_QUESTIONS, QUICK_CATEGORIES } from '../src/lib/chatKnowledge';

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = { id: string; role: 'user' | 'bot'; text: string; ts: Date };

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 160),
        Animated.timing(dot, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]))
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 4, paddingHorizontal: 2 }}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 7, height: 7, borderRadius: 4,
            backgroundColor: colors.teal,
            opacity: dot,
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
          }}
        />
      ))}
    </View>
  );
}

// ── Bot avatar ────────────────────────────────────────────────────────────────

function BotAvatar({ size = 36 }: { size?: number }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: colors.navyMid,
      borderWidth: 1.5, borderColor: colors.teal + '60',
      alignItems: 'center', justifyContent: 'center',
      ...shadow.teal,
    }}>
      <Ionicons name="sparkles" size={size * 0.44} color={colors.teal} />
    </View>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  const time = msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 14,
      paddingHorizontal: spacing.md,
      alignItems: 'flex-end',
      gap: 8,
    }}>
      {!isUser && <BotAvatar />}
      <View style={{ maxWidth: '76%' }}>
        <View style={{
          backgroundColor: isUser ? colors.teal : colors.navyMid,
          borderRadius: radius.md,
          borderBottomRightRadius: isUser ? 4 : radius.md,
          borderBottomLeftRadius: isUser ? radius.md : 4,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.sm,
          borderWidth: 1,
          borderColor: isUser ? colors.tealLight + '40' : colors.glassBorder,
          ...(isUser ? shadow.teal : shadow.sm),
        }}>
          <Text style={{
            color: colors.white,
            fontSize: 14,
            lineHeight: 22,
            fontWeight: isUser ? '600' : '400',
          }}>
            {msg.text}
          </Text>
        </View>
        <Text style={{
          color: colors.mutedLight,
          fontSize: 10,
          marginTop: 4,
          textAlign: isUser ? 'right' : 'left',
          paddingHorizontal: 4,
        }}>
          {time}
        </Text>
      </View>
      {isUser && (
        <View style={{
          width: 30, height: 30, borderRadius: 15,
          backgroundColor: colors.navyLight,
          borderWidth: 1, borderColor: colors.glassBorder,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Feather name="user" size={14} color={colors.mutedLight} />
        </View>
      )}
    </View>
  );
}

// ── Category chip row ─────────────────────────────────────────────────────────

function CategoryChips({ onSelect }: { onSelect: (q: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const activeData = QUICK_CATEGORIES.find((c) => c.label === active);

  return (
    <View style={{ backgroundColor: colors.navy, borderTopWidth: 1, borderTopColor: colors.glassBorder }}>
      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: 10, gap: 8 }}
      >
        {QUICK_CATEGORIES.map((cat) => {
          const isActive = active === cat.label;
          return (
            <Pressable
              key={cat.label}
              onPress={() => setActive(isActive ? null : cat.label)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                backgroundColor: isActive ? cat.color : colors.navyMid,
                borderRadius: radius.full,
                paddingHorizontal: 14, paddingVertical: 7,
                borderWidth: 1,
                borderColor: isActive ? cat.color : colors.glassBorder,
                ...(isActive ? { shadowColor: cat.color, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 } : {}),
              }}
            >
              <Text style={{ color: isActive ? colors.white : colors.mutedLight, fontSize: 12, fontWeight: '700' }}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sub-questions for active category */}
      {activeData && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: 10, gap: 8 }}
        >
          {activeData.questions.map((q) => (
            <Pressable
              key={q}
              onPress={() => { onSelect(q); setActive(null); }}
              style={{
                backgroundColor: activeData.color + '18',
                borderRadius: radius.full,
                paddingHorizontal: 14, paddingVertical: 7,
                borderWidth: 1, borderColor: activeData.color + '40',
              }}
            >
              <Text style={{ color: activeData.color, fontSize: 12, fontWeight: '600' }}>{q}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0', role: 'bot', ts: new Date(),
      text: "Hi! 👋 I'm the Khetha FAQ assistant.\n\nI know about all 15 careers, 15 qualifications, 10 providers, 9 advisers, 6 events and 9 walk-in centres in the app.\n\nAsk me anything — or tap a category below to get started.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed, ts: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const answer = findAnswer(trimmed);
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now().toString() + 'b', role: 'bot', text: answer, ts: new Date() }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }, 800 + Math.random() * 400);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  const showSuggested = messages.length <= 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy }}>
      <Stack.Screen options={{
        title: '',
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        headerLeft: () => null,
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <BotAvatar size={32} />
            <View>
              <Text style={{ color: colors.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.2 }}>
                Ask Khetha
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal }} />
                <Text style={{ color: colors.teal, fontSize: 11, fontWeight: '600' }}>
                  Always available
                </Text>
              </View>
            </View>
          </View>
        ),
      }} />

      {/* Ambient glow orb */}
      <View style={{
        position: 'absolute', top: -40, right: -40,
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: colors.tealGlow,
      }} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.sm }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => <Bubble key={m.id} msg={m} />)}

          {/* Typing indicator */}
          {typing && (
            <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: 14, alignItems: 'flex-end', gap: 8 }}>
              <BotAvatar />
              <View style={{
                backgroundColor: colors.navyMid,
                borderRadius: radius.md, borderBottomLeftRadius: 4,
                paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.sm,
                borderWidth: 1, borderColor: colors.glassBorder,
                ...shadow.sm,
              }}>
                <TypingDots />
              </View>
            </View>
          )}

          {/* Suggested questions on first load */}
          {showSuggested && (
            <View style={{ paddingHorizontal: spacing.md, marginTop: 4 }}>
              <Text style={{ color: colors.mutedLight, fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Suggested
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <Pressable
                    key={q}
                    onPress={() => send(q)}
                    style={{
                      backgroundColor: colors.navyMid,
                      borderRadius: radius.full,
                      paddingHorizontal: 13, paddingVertical: 7,
                      borderWidth: 1, borderColor: colors.glassBorder,
                    }}
                  >
                    <Text style={{ color: colors.mutedLight, fontSize: 12, fontWeight: '600' }}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Category chips */}
        <CategoryChips onSelect={send} />

        {/* Input bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          paddingHorizontal: spacing.md, paddingVertical: 10,
          backgroundColor: colors.navyMid,
          borderTopWidth: 1, borderTopColor: colors.glassBorder,
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about careers…"
            placeholderTextColor={colors.mutedLight}
            style={{
              flex: 1,
              backgroundColor: colors.navy,
              borderRadius: radius.full,
              paddingHorizontal: 18, paddingVertical: 11,
              fontSize: 14, color: colors.white,
              borderWidth: 1, borderColor: colors.glassBorder,
            }}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            accessibilityLabel="Type your question"
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: input.trim() ? colors.teal : colors.navyLight,
              alignItems: 'center', justifyContent: 'center',
              ...(input.trim() ? shadow.teal : {}),
            }}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Feather name="send" size={18} color={input.trim() ? colors.white : colors.mutedLight} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
