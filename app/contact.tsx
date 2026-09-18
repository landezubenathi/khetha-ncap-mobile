import { useMemo, useState } from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors, spacing, fs, MIN_TOUCH } from '../src/theme';
import { useUserStore, useResultByType } from '../src/store/user';
import { ADVISERS, EVENTS, WALK_IN_CENTRES } from '../src/data/seed';
import { useT } from '../src/i18n';

const PROVINCES = [
  'All provinces', 'Gauteng', 'Western Cape', 'KwaZulu-Natal',
  'Limpopo', 'Eastern Cape', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
];

const EVENT_COLORS: Record<string, string> = {
  'Career Expo': colors.teal,
  'Workshop':    colors.blue,
  'Open Day':    '#7B61FF',
  'Webinar':     '#F4B740',
};

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onSelect, fontScale }: {
  tabs: string[]; active: number; onSelect: (i: number) => void; fontScale: number;
}) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderRadius: 14, padding: 4, marginBottom: 20 }}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab}
          onPress={() => onSelect(i)}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
            backgroundColor: active === i ? colors.navy : 'transparent',
            minHeight: MIN_TOUCH,
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === i }}
          accessibilityLabel={tab}
        >
          <Text style={{ color: active === i ? colors.white : colors.muted, fontWeight: '700', fontSize: fs(12, fontScale) }}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ── Contact channels tab ──────────────────────────────────────────────────────
function ContactTab({ fontScale, hasResults }: { fontScale: number; hasResults: boolean }) {
  return (
    <View>
      {/* Contextual tip when user has quiz results */}
      {hasResults && (
        <View style={{ backgroundColor: colors.teal + '12', borderRadius: 14, padding: spacing.sm, marginBottom: 16, flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: 18 }}>💡</Text>
          <Text style={{ color: colors.ink, fontSize: fs(13, fontScale), lineHeight: fs(13, fontScale) * 1.6, flex: 1 }}>
            You have quiz results ready. When you call or chat, mention your top career matches — your adviser can give you more targeted guidance.
          </Text>
        </View>
      )}

      {/* Hotline */}
      <Pressable
        onPress={() => Linking.openURL('tel:0869990123')}
        style={{ backgroundColor: colors.teal, borderRadius: 16, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: MIN_TOUCH + 20 }}
        accessibilityRole="button"
        accessibilityLabel="Call Khetha on 086 999 0123"
      >
        <Text style={{ fontSize: 28 }}>📞</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(17, fontScale) }}>086 999 0123</Text>
          <Text style={{ color: '#D9E2EC', fontSize: fs(13, fontScale), marginTop: 2 }}>Khetha Career Helpline · Free call</Text>
        </View>
        <Text style={{ color: colors.white + 'AA', fontSize: 22 }}>›</Text>
      </Pressable>

      {/* WhatsApp */}
      <Pressable
        onPress={() => Linking.openURL('https://wa.me/27869990123?text=Hi%20Khetha%2C%20I%20need%20career%20advice')}
        style={{ backgroundColor: '#25D366', borderRadius: 16, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: MIN_TOUCH + 20 }}
        accessibilityRole="button"
        accessibilityLabel="Chat on WhatsApp"
      >
        <Text style={{ fontSize: 28 }}>💬</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(17, fontScale) }}>WhatsApp Chat</Text>
          <Text style={{ color: '#D9E2EC', fontSize: fs(13, fontScale), marginTop: 2 }}>Message a practitioner now</Text>
        </View>
        <Text style={{ color: colors.white + 'AA', fontSize: 22 }}>›</Text>
      </Pressable>

      {/* Email */}
      <Pressable
        onPress={() => Linking.openURL('mailto:khetha@dhet.gov.za?subject=Career%20Advice%20Request')}
        style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border, minHeight: MIN_TOUCH + 20 }}
        accessibilityRole="button"
        accessibilityLabel="Email khetha@dhet.gov.za"
      >
        <Text style={{ fontSize: 28 }}>✉️</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>khetha@dhet.gov.za</Text>
          <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginTop: 2 }}>Email a career adviser</Text>
        </View>
        <Text style={{ color: colors.blue, fontSize: 22 }}>›</Text>
      </Pressable>

      {/* Website */}
      <Pressable
        onPress={() => Linking.openURL('https://khetha.dhet.gov.za')}
        style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border, minHeight: MIN_TOUCH + 20 }}
        accessibilityRole="button"
        accessibilityLabel="Visit khetha.dhet.gov.za"
      >
        <Text style={{ fontSize: 28 }}>🌐</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>khetha.dhet.gov.za</Text>
          <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginTop: 2 }}>Full NCAP resource portal</Text>
        </View>
        <Text style={{ color: colors.blue, fontSize: 22 }}>›</Text>
      </Pressable>

      {/* SMS fallback */}
      <Pressable
        onPress={() => Linking.openURL('sms:0869990123')}
        style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border, minHeight: MIN_TOUCH + 20 }}
        accessibilityRole="button"
        accessibilityLabel="SMS Khetha on 086 999 0123"
      >
        <Text style={{ fontSize: 28 }}>📱</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>SMS: 086 999 0123</Text>
          <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginTop: 2 }}>No data needed · works on any phone</Text>
        </View>
        <Text style={{ color: colors.blue, fontSize: 22 }}>›</Text>
      </Pressable>

      {/* Prepare tip */}
      <View style={{ backgroundColor: colors.yellow + '22', borderRadius: 14, padding: spacing.sm, marginTop: 8, flexDirection: 'row', gap: 8 }}>
        <Text style={{ fontSize: 16 }}>📋</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#92600A', fontWeight: '800', fontSize: fs(13, fontScale), marginBottom: 4 }}>Prepare for your session</Text>
          <Text style={{ color: colors.ink, fontSize: fs(12, fontScale), lineHeight: fs(12, fontScale) * 1.7 }}>
            {'• Your current grade or qualification level\n• Subjects you are taking or have passed\n• 2–3 careers you are interested in\n• Any bursary or financial aid questions'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Advisers tab ──────────────────────────────────────────────────────────────
function AdvisersTab({ fontScale, userProvince }: { fontScale: number; userProvince: string }) {
  const [filter, setFilter] = useState(userProvince || 'All provinces');

  const filtered = useMemo(() =>
    filter === 'All provinces' ? ADVISERS : ADVISERS.filter((a) => a.province === filter),
    [filter]
  );

  return (
    <View>
      {/* Province filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingRight: 8 }}>
          {PROVINCES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setFilter(p)}
              style={{
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                backgroundColor: filter === p ? colors.navy : colors.white,
                borderWidth: 1, borderColor: filter === p ? colors.navy : colors.border,
                minHeight: MIN_TOUCH, justifyContent: 'center',
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: filter === p }}
            >
              <Text style={{ color: filter === p ? colors.white : colors.muted, fontWeight: '700', fontSize: fs(12, fontScale) }}>
                {p === 'All provinces' ? 'All' : p}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginBottom: 12 }}>
        {filtered.length} adviser{filtered.length !== 1 ? 's' : ''} found
      </Text>

      {filtered.map((a) => (
        <View key={a.id} style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: a.walk_in ? colors.teal : colors.border }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }}>{a.name}</Text>
              <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginTop: 2 }}>{a.role}</Text>
            </View>
            {a.walk_in && (
              <View style={{ backgroundColor: colors.teal + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: colors.teal, fontSize: 11, fontWeight: '700' }}>Walk-in ✓</Text>
              </View>
            )}
          </View>

          {/* Meta chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <View style={{ backgroundColor: colors.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: colors.ink, fontSize: fs(11, fontScale) }}>📍 {a.city}, {a.province}</Text>
            </View>
            <View style={{ backgroundColor: colors.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: colors.ink, fontSize: fs(11, fontScale) }}>🕐 {a.availability}</Text>
            </View>
            <View style={{ backgroundColor: colors.blue + '12', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: colors.blue, fontSize: fs(11, fontScale) }}>🎯 {a.specialisation}</Text>
            </View>
          </View>

          {/* Languages */}
          <Text style={{ color: colors.muted, fontSize: fs(11, fontScale), marginBottom: 10 }}>
            🗣 {a.languages.join(' · ')}
          </Text>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => Linking.openURL(`tel:${a.phone.replace(/\s/g, '')}`)}
              style={{ flex: 1, backgroundColor: colors.teal, borderRadius: 10, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={`Call ${a.name}`}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(13, fontScale) }}>📞 Call</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`https://wa.me/${a.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(a.name)}%2C%20I%20need%20career%20advice`)}
              style={{ flex: 1, backgroundColor: '#25D366', borderRadius: 10, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={`WhatsApp ${a.name}`}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(13, fontScale) }}>💬 WhatsApp</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`mailto:${a.email}?subject=Career%20Advice%20Request`)}
              style={{ flex: 1, backgroundColor: colors.white, borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border, minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={`Email ${a.name}`}
            >
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(13, fontScale) }}>✉️ Email</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Events tab ────────────────────────────────────────────────────────────────
function EventsTab({ fontScale }: { fontScale: number }) {
  const sorted = useMemo(() =>
    [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    []
  );

  return (
    <View>
      <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginBottom: 16, lineHeight: fs(13, fontScale) * 1.6 }}>
        Upcoming Khetha career events, expos and workshops across South Africa.
      </Text>
      {sorted.map((e) => {
        const days = daysUntil(e.date);
        const accent = EVENT_COLORS[e.type] ?? colors.blue;
        const past = days < 0;
        return (
          <View key={e.id} style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: past ? colors.border : accent, opacity: past ? 0.6 : 1 }}>
            {/* Type + countdown */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ backgroundColor: accent + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: accent, fontSize: fs(11, fontScale), fontWeight: '700' }}>{e.type}</Text>
              </View>
              <Text style={{ color: past ? colors.muted : days <= 7 ? colors.danger : colors.teal, fontWeight: '800', fontSize: fs(12, fontScale) }}>
                {past ? 'Past event' : days === 0 ? 'Today!' : `${days} days away`}
              </Text>
            </View>

            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale), marginBottom: 4 }}>{e.title}</Text>
            <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginBottom: 8, lineHeight: fs(12, fontScale) * 1.6 }}>{e.description}</Text>

            {/* Date / time / venue */}
            <View style={{ gap: 4, marginBottom: 12 }}>
              <Text style={{ color: colors.ink, fontSize: fs(12, fontScale) }}>📅 {formatDate(e.date)} · {e.time}</Text>
              <Text style={{ color: colors.ink, fontSize: fs(12, fontScale) }}>📍 {e.venue}</Text>
              <Text style={{ color: colors.ink, fontSize: fs(12, fontScale) }}>🗺 {e.province}</Text>
            </View>

            {!past && (
              <Pressable
                onPress={() => Linking.openURL(e.registration_url)}
                style={{ backgroundColor: accent, borderRadius: 10, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
                accessibilityRole="button"
                accessibilityLabel={`Register for ${e.title}`}
              >
                <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(13, fontScale) }}>Register free →</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── Walk-in centres tab ───────────────────────────────────────────────────────
function WalkInTab({ fontScale, userProvince }: { fontScale: number; userProvince: string }) {
  const [filter, setFilter] = useState(userProvince || 'All provinces');

  const filtered = useMemo(() =>
    filter === 'All provinces' ? WALK_IN_CENTRES : WALK_IN_CENTRES.filter((c) => c.province === filter),
    [filter]
  );

  return (
    <View>
      <Text style={{ color: colors.muted, fontSize: fs(13, fontScale), marginBottom: 14, lineHeight: fs(13, fontScale) * 1.6 }}>
        Visit a Khetha walk-in centre for free face-to-face career guidance. No appointment needed at walk-in centres.
      </Text>

      {/* Province filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, paddingRight: 8 }}>
          {PROVINCES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setFilter(p)}
              style={{
                borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
                backgroundColor: filter === p ? colors.navy : colors.white,
                borderWidth: 1, borderColor: filter === p ? colors.navy : colors.border,
                minHeight: MIN_TOUCH, justifyContent: 'center',
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: filter === p }}
            >
              <Text style={{ color: filter === p ? colors.white : colors.muted, fontWeight: '700', fontSize: fs(12, fontScale) }}>
                {p === 'All provinces' ? 'All' : p}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {filtered.map((c) => (
        <View key={c.id} style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.md, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: colors.teal }}>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale), marginBottom: 4 }}>{c.name}</Text>
          <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginBottom: 2 }}>📍 {c.address}</Text>
          <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginBottom: 2 }}>🕐 {c.hours}</Text>
          <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), marginBottom: 12 }}>📞 {c.phone}</Text>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => Linking.openURL(`tel:${c.phone.replace(/\s/g, '')}`)}
              style={{ flex: 1, backgroundColor: colors.teal, borderRadius: 10, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={`Call ${c.name}`}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(13, fontScale) }}>📞 Call</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`)}
              style={{ flex: 1, backgroundColor: colors.navy, borderRadius: 10, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={`Get directions to ${c.name}`}
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(13, fontScale) }}>🗺 Directions</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function Contact() {
  const [tab, setTab] = useState(0);
  const { fontScale, province } = useUserStore();
  const t = useT();
  const careerResult = useResultByType('career');
  const jobFitResult = useResultByType('job-fit');
  const hasResults = !!(careerResult || jobFitResult);

  const TABS = ['Contact', 'Advisers', 'Events', 'Walk-in'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: t('contact_adviser') }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 56 }}>
        <Text style={{ fontSize: fs(28, fontScale), fontWeight: '800', color: colors.navy }}>Get Advice</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20, fontSize: fs(14, fontScale) }}>
          Reach a Khetha career practitioner — free, confidential and in your language.
        </Text>

        <TabBar tabs={TABS} active={tab} onSelect={setTab} fontScale={fontScale} />

        {tab === 0 && <ContactTab fontScale={fontScale} hasResults={hasResults} />}
        {tab === 1 && <AdvisersTab fontScale={fontScale} userProvince={province} />}
        {tab === 2 && <EventsTab fontScale={fontScale} />}
        {tab === 3 && <WalkInTab fontScale={fontScale} userProvince={province} />}
      </ScrollView>
    </SafeAreaView>
  );
}
