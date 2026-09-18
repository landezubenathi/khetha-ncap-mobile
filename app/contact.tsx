import { Linking, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { colors, spacing } from '../src/theme';
import { ADVISERS } from '../src/data/seed';

export default function Contact() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 48 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.navy }}>Get Advice</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 24, fontSize: 14 }}>
          Reach a Khetha career practitioner directly.
        </Text>

        {/* Hotline */}
        <Pressable
          onPress={() => Linking.openURL('tel:0869990123')}
          style={{ backgroundColor: colors.teal, borderRadius: 16, padding: spacing.md, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64 }}
          accessibilityRole="button"
          accessibilityLabel="Call Khetha on 086 999 0123"
        >
          <Text style={{ fontSize: 28 }}>📞</Text>
          <View>
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>086 999 0123</Text>
            <Text style={{ color: '#D9E2EC', fontSize: 13, marginTop: 2 }}>Khetha Career Helpline</Text>
          </View>
        </Pressable>

        {/* Email */}
        <Pressable
          onPress={() => Linking.openURL('mailto:khetha@dhet.gov.za')}
          style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border, minHeight: 64 }}
          accessibilityRole="button"
          accessibilityLabel="Email khetha@dhet.gov.za"
        >
          <Text style={{ fontSize: 28 }}>✉️</Text>
          <View>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>khetha@dhet.gov.za</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>Email a career adviser</Text>
          </View>
        </Pressable>

        {/* WhatsApp */}
        <Pressable
          onPress={() => Linking.openURL('https://wa.me/27869990123')}
          style={{ backgroundColor: '#25D366', borderRadius: 16, padding: spacing.md, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 64 }}
          accessibilityRole="button"
          accessibilityLabel="Chat on WhatsApp"
        >
          <Text style={{ fontSize: 28 }}>💬</Text>
          <View>
            <Text style={{ color: colors.white, fontWeight: '800', fontSize: 16 }}>WhatsApp Chat</Text>
            <Text style={{ color: '#D9E2EC', fontSize: 13, marginTop: 2 }}>Message a practitioner</Text>
          </View>
        </Pressable>

        {/* Adviser directory */}
        <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 18, marginBottom: 14 }}>Career Advisers</Text>
        {ADVISERS.map((a) => (
          <View key={a.id} style={{ backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: colors.teal }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 15 }}>{a.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>{a.role} · {a.province}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${a.phone}`)} style={{ marginTop: 8 }} accessibilityRole="button">
              <Text style={{ color: colors.teal, fontWeight: '700', fontSize: 13 }}>📞 {a.phone}</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`mailto:${a.email}`)} style={{ marginTop: 4 }} accessibilityRole="button">
              <Text style={{ color: colors.blue, fontSize: 13 }}>✉️ {a.email}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
