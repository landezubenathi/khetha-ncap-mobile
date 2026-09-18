/**
 * app/chatbot.tsx
 * Khetha FAQ Chatbot — instant answers to common career guidance questions.
 */

import { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, Text, TextInput, View, Animated,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../src/theme';

// ── FAQ Knowledge Base ────────────────────────────────────────────────────────

const FAQ: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['khetha', 'what is', 'about'],
    answer: 'Khetha is a free career guidance service by the Department of Higher Education and Training (DHET). It helps learners, students and job seekers make informed decisions about careers, qualifications and study pathways.',
  },
  {
    keywords: ['ncap', 'national career'],
    answer: 'NCAP stands for the National Career Advice Portal. It is the online platform that powers Khetha, providing career information, assessments and guidance resources for all South Africans.',
  },
  {
    keywords: ['quiz', 'assessment', 'career choice', 'questionnaire'],
    answer: 'The Career Choice quiz helps you discover careers that match your interests across 6 clusters. The Job Fit quiz reveals your work style across 8 dimensions. Both take about 5–10 minutes and are completely free.',
  },
  {
    keywords: ['nqf', 'level', 'qualification level'],
    answer: 'NQF stands for National Qualifications Framework. It has 10 levels:\n• NQF 1–3: School certificates\n• NQF 4: Matric (Grade 12)\n• NQF 5–6: Diplomas and Higher Certificates\n• NQF 7: Bachelor degrees\n• NQF 8: Honours / Postgraduate Diplomas\n• NQF 9–10: Masters and Doctorates',
  },
  {
    keywords: ['tvet', 'college', 'technical'],
    answer: 'TVET Colleges (Technical and Vocational Education and Training) offer practical, skills-based qualifications at NQF levels 2–6. They are a great alternative to university, especially for artisan trades, engineering, business and IT.',
  },
  {
    keywords: ['bursary', 'scholarship', 'funding', 'financial aid'],
    answer: 'Bursaries are available from NSFAS (for TVET and university students), SETA organisations, government departments, and private companies. Visit nsfas.org.za or contact a Khetha adviser to find bursaries matching your field.',
  },
  {
    keywords: ['nsfas', 'student loan', 'financial'],
    answer: 'NSFAS (National Student Financial Aid Scheme) provides funding for eligible South African students at public universities and TVET colleges. Apply at nsfas.org.za. You need your ID, proof of income and acceptance letter.',
  },
  {
    keywords: ['aps', 'admission point', 'score'],
    answer: 'APS (Admission Point Score) is calculated from your Grade 12 results. Each subject is scored 1–7 based on your percentage. Life Orientation counts as half. Most universities require an APS of 20–35+ depending on the programme.',
  },
  {
    keywords: ['matric', 'grade 12', 'pass'],
    answer: 'There are 3 types of matric pass:\n• NSC Pass (30%+ in 3 subjects): Basic pass\n• Diploma Pass (40%+ in 4 subjects): Qualifies for TVET and some university programmes\n• Bachelor Pass (50%+ in 4 subjects + 30% in 3 others): Qualifies for university degree programmes',
  },
  {
    keywords: ['adviser', 'advisor', 'counsellor', 'contact', 'speak'],
    answer: 'Khetha career advisers are available in all 9 provinces. You can:\n• Call: 086 999 0123 (free)\n• WhatsApp: 083 123 4567\n• Visit a walk-in centre near you\n• Attend a Khetha career expo\nAll services are free of charge.',
  },
  {
    keywords: ['province', 'walk-in', 'centre', 'office'],
    answer: 'Khetha has walk-in centres in all 9 provinces — from Johannesburg and Cape Town to Polokwane and East London. Go to the Contact tab in the app and tap "Walk-in" to find the nearest centre with directions.',
  },
  {
    keywords: ['subject', 'choose', 'which subject'],
    answer: 'Subject choice in Grade 9 is very important. Use the Subject Chooser tool in this app to see which subjects are required, recommended or advantageous for your dream career. Mathematics and Physical Sciences open the most doors.',
  },
  {
    keywords: ['artisan', 'trade', 'apprenticeship'],
    answer: 'Artisan trades (electrician, plumber, welder, etc.) are in high demand in South Africa. You need Grade 10–12 with Mathematics and Physical Sciences, then complete an apprenticeship (3–4 years) and pass a trade test. SETAs fund many apprenticeships.',
  },
  {
    keywords: ['salary', 'earn', 'income', 'pay'],
    answer: 'Salaries vary widely by career and experience. In this app, each career profile shows a salary range. Generally:\n• Artisans: R120k–R480k p/a\n• Nurses: R150k–R480k p/a\n• Engineers: R300k–R900k p/a\n• Doctors/Lawyers: R500k–R1.2M+ p/a',
  },
  {
    keywords: ['online', 'distance', 'unisa', 'remote'],
    answer: 'UNISA (University of South Africa) is the largest distance learning institution in Africa. It offers hundreds of qualifications you can study from home. Visit unisa.ac.za to apply. Many TVET colleges also offer part-time programmes.',
  },
  {
    keywords: ['application', 'apply', 'deadline', 'when'],
    answer: 'University applications typically open in April and close in September for the following year. TVET colleges have rolling admissions. Set a deadline reminder in the Saved tab of this app so you never miss a closing date.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greet'],
    answer: 'Hello! 👋 I am the Khetha FAQ assistant. I can answer questions about careers, qualifications, TVET colleges, bursaries, NQF levels, subject choices and more. What would you like to know?',
  },
  {
    keywords: ['thank', 'thanks'],
    answer: 'You are welcome! 😊 Remember, Khetha advisers are always available on 086 999 0123 if you need more personalised guidance. Good luck on your career journey!',
  },
];

const SUGGESTED = [
  'What is Khetha?',
  'How does the career quiz work?',
  'What is NQF?',
  'How do I get a bursary?',
  'What is NSFAS?',
  'How is APS calculated?',
  'What are TVET colleges?',
  'How do I contact an adviser?',
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = { id: string; role: 'user' | 'bot'; text: string };

// ── Match FAQ ─────────────────────────────────────────────────────────────────

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some((k) => lower.includes(k))) return faq.answer;
  }
  return "I don't have a specific answer for that yet. For personalised guidance, please call Khetha on 086 999 0123 (free) or use the AI Advisor in this app for career-specific recommendations.";
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 150),
        Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]))
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);
  return (
    <View style={{ flexDirection: 'row', gap: 4, padding: 4 }}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.teal, opacity: dot }} />
      ))}
    </View>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <View style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 10, paddingHorizontal: spacing.md }}>
      {!isUser && (
        <View style={{ width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 2, ...shadow.teal }}>
          <Ionicons name="sparkles" size={16} color={colors.white} />
        </View>
      )}
      <View style={{
        maxWidth: '78%',
        backgroundColor: isUser ? colors.navy : colors.white,
        borderRadius: radius.md,
        borderBottomRightRadius: isUser ? 4 : radius.md,
        borderBottomLeftRadius: isUser ? radius.md : 4,
        padding: spacing.sm,
        borderWidth: isUser ? 0 : 1,
        borderColor: colors.borderLight,
        ...shadow.sm,
      }}>
        <Text style={{ color: isUser ? colors.white : colors.ink, fontSize: 14, lineHeight: 21 }}>{msg.text}</Text>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', text: "Hi! 👋 I'm the Khetha FAQ assistant. Ask me anything about careers, qualifications, bursaries, NQF levels or how to use this app." },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const answer = findAnswer(trimmed);
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now().toString() + 'b', role: 'bot', text: answer }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: 'Ask Khetha', headerStyle: { backgroundColor: colors.navy }, headerTintColor: colors.white, headerTitleStyle: { fontWeight: '800' } }} />

      {/* Header info bar */}
      <View style={{ backgroundColor: colors.teal + '18', paddingHorizontal: spacing.md, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: colors.teal + '22' }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.teal }} />
        <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '700' }}>Khetha FAQ Assistant · Always available</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.md }} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((m) => <Bubble key={m.id} msg={m} />)}
          {typing && (
            <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: 10 }}>
              <View style={{ width: 34, height: 34, borderRadius: radius.full, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', marginRight: 8, ...shadow.teal }}>
                <Ionicons name="sparkles" size={16} color={colors.white} />
              </View>
              <View style={{ backgroundColor: colors.white, borderRadius: radius.md, borderBottomLeftRadius: 4, padding: spacing.sm, ...shadow.sm }}>
                <TypingDots />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: 8, gap: 8 }}>
            {SUGGESTED.map((q) => (
              <Pressable key={q} onPress={() => send(q)} style={{ backgroundColor: colors.white, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1.5, borderColor: colors.border, ...shadow.sm }}>
                <Text style={{ color: colors.navy, fontSize: 13, fontWeight: '600' }}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.sm, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a question…"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, backgroundColor: colors.bg, borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.ink, borderWidth: 1, borderColor: colors.border }}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            accessibilityLabel="Type your question"
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: input.trim() ? colors.teal : colors.border, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Text style={{ color: colors.white, fontSize: 18 }}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
