import { useState } from 'react';
import {
  SafeAreaView, ScrollView, Text, View, Pressable,
  TextInput, Share, Platform, Linking,
} from 'react-native';
import { Link, router } from 'expo-router';
import { colors, spacing, fs, MIN_TOUCH } from '../../src/theme';
import { useUserStore } from '../../src/store/user';
import { CAREERS, QUALIFICATIONS, PROVIDERS } from '../../src/data/seed';
import { scheduleDeadlineReminder, cancelDeadlineReminder } from '../../src/lib/notifications';
import { useT } from '../../src/i18n';

// Days until a deadline (negative = past)
function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ days }: { days: number | null }) {
  if (days === null) return null;
  const urgent = days <= 7;
  const past   = days < 0;
  const bg     = past ? colors.danger + '18' : urgent ? '#F4B74022' : colors.teal + '18';
  const text   = past ? colors.danger : urgent ? '#92600A' : colors.teal;
  const label  = past ? 'Deadline passed' : days === 0 ? 'Due today!' : `${days}d left`;
  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 6 }}>
      <Text style={{ color: text, fontSize: 11, fontWeight: '800' }}>📅 {label}</Text>
    </View>
  );
}

// Expandable per-item engagement panel
function ItemEngagement({ id, title, detailRoute }: { id: string; title: string; detailRoute: string }) {
  const [open, setOpen] = useState(false);
  const { savedMeta, setSavedMeta, fontScale } = useUserStore();
  const meta = savedMeta[id] ?? { note: '', deadline: '', notifyMe: false };
  const days = daysUntil(meta.deadline);

  async function toggleNotify() {
    const next = !meta.notifyMe;
    setSavedMeta(id, { notifyMe: next });
    if (next && meta.deadline) {
      await scheduleDeadlineReminder(id, title, meta.deadline);
    } else {
      await cancelDeadlineReminder(id);
    }
  }

  async function shareToWhatsApp() {
    const msg = `Check out this career option on Khetha NCAP: ${title}\nhttps://khetha.dhet.gov.za`;
    if (Platform.OS === 'web') {
      const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      Linking.openURL(url);
    } else {
      await Share.share({ message: msg, title: 'Share via Khetha' });
    }
  }

  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 14, marginBottom: 12, overflow: 'hidden' }}>
      {/* Card header — tappable to detail */}
      <Link href={detailRoute as any} asChild>
        <Pressable
          style={{ padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 10 }}
          accessibilityRole="button"
          accessibilityLabel={`View ${title}`}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(15, fontScale) }} numberOfLines={2}>
              {title}
            </Text>
            <DeadlineBadge days={days} />
          </View>
          <Text style={{ color: colors.blue, fontSize: 20 }}>›</Text>
        </Pressable>
      </Link>

      {/* Engagement toolbar */}
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border }}>
        {/* Notes toggle */}
        <Pressable
          onPress={() => setOpen((o) => !o)}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Add note"
        >
          <Text style={{ fontSize: 16 }}>📝</Text>
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>Note</Text>
        </Pressable>

        {/* Notify-me toggle */}
        <Pressable
          onPress={toggleNotify}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="switch"
          accessibilityState={{ checked: meta.notifyMe }}
          accessibilityLabel="Remind me about deadline"
        >
          <Text style={{ fontSize: 16 }}>{meta.notifyMe ? '🔔' : '🔕'}</Text>
          <Text style={{ color: meta.notifyMe ? colors.teal : colors.muted, fontSize: 10, marginTop: 2, fontWeight: meta.notifyMe ? '700' : '400' }}>
            {meta.notifyMe ? 'Remind on' : 'Remind'}
          </Text>
        </Pressable>

        {/* WhatsApp share */}
        <Pressable
          onPress={shareToWhatsApp}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="button"
          accessibilityLabel={`Share ${title} via WhatsApp`}
        >
          <Text style={{ fontSize: 16 }}>💬</Text>
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>Share</Text>
        </Pressable>

        {/* Remove */}
        <Pressable
          onPress={() => useUserStore.getState().toggleSaved(id)}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${title}`}
        >
          <Text style={{ fontSize: 16 }}>🗑️</Text>
          <Text style={{ color: colors.danger, fontSize: 10, marginTop: 2 }}>Remove</Text>
        </Pressable>
      </View>

      {/* Expandable notes + deadline panel */}
      {open && (
        <View style={{ padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: 10 }}>
          <TextInput
            value={meta.note}
            onChangeText={(note) => setSavedMeta(id, { note })}
            placeholder="Add a personal note…"
            placeholderTextColor={colors.muted}
            multiline
            style={{
              backgroundColor: colors.bg, borderRadius: 10, padding: 10,
              color: colors.ink, fontSize: fs(13, fontScale), minHeight: 60,
              borderWidth: 1, borderColor: colors.border,
            }}
            accessibilityLabel="Personal note"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: colors.muted, fontSize: fs(12, fontScale), fontWeight: '700' }}>📅 Deadline (YYYY-MM-DD):</Text>
            <TextInput
              value={meta.deadline}
              onChangeText={async (deadline) => {
                setSavedMeta(id, { deadline });
                if (meta.notifyMe && deadline.length === 10) {
                  await scheduleDeadlineReminder(id, title, deadline);
                }
              }}
              placeholder="2025-09-30"
              placeholderTextColor={colors.muted}
              style={{
                flex: 1, backgroundColor: colors.bg, borderRadius: 8, padding: 8,
                color: colors.ink, fontSize: fs(13, fontScale),
                borderWidth: 1, borderColor: colors.border,
              }}
              accessibilityLabel="Application deadline date"
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function Saved() {
  const { saved, fontScale } = useUserStore();
  const t = useT();

  const savedCareers   = CAREERS.filter((c) => saved.includes(c.id));
  const savedQuals     = QUALIFICATIONS.filter((q) => saved.includes(q.id));
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));
  const total = savedCareers.length + savedQuals.length + savedProviders.length;

  if (total === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ flex: 1, padding: spacing.md, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40 }}>🔖</Text>
          <Text style={{ fontSize: fs(22, fontScale), fontWeight: '800', color: colors.navy, marginTop: 16, textAlign: 'center' }}>
            Nothing saved yet
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center', lineHeight: 22, fontSize: fs(14, fontScale) }}>
            Save careers, qualifications and providers to track them, set deadlines and get reminders.
          </Text>
          <Link href="/(tabs)/explore" asChild>
            <Pressable
              style={{ backgroundColor: colors.navy, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, marginTop: 24, minHeight: MIN_TOUCH, justifyContent: 'center' }}
              accessibilityRole="button"
            >
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(14, fontScale) }}>Browse Explore →</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 56 }}>
        <Text style={{ fontSize: fs(28, fontScale), fontWeight: '800', color: colors.navy }}>{t('saved_tab')}</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 6, fontSize: fs(14, fontScale) }}>
          {total} saved item{total !== 1 ? 's' : ''}
        </Text>

        {/* Engagement tip */}
        <View style={{ backgroundColor: colors.teal + '12', borderRadius: 12, padding: spacing.sm, marginBottom: 20, flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>💡</Text>
          <Text style={{ color: colors.ink, fontSize: fs(12, fontScale), lineHeight: fs(12, fontScale) * 1.6, flex: 1 }}>
            Tap 📝 to add notes, 🔔 to set a deadline reminder, or 💬 to share with a friend on WhatsApp.
          </Text>
        </View>

        {savedCareers.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 10 }}>
              💼 Careers
            </Text>
            {savedCareers.map((c) => (
              <ItemEngagement key={c.id} id={c.id} title={c.title} detailRoute={`/career/${c.id}`} />
            ))}
          </View>
        )}

        {savedQuals.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 10 }}>
              📚 Qualifications
            </Text>
            {savedQuals.map((q) => (
              <ItemEngagement key={q.id} id={q.id} title={q.title} detailRoute={`/qualification/${q.id}`} />
            ))}
          </View>
        )}

        {savedProviders.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale), marginBottom: 10 }}>
              🏫 Providers
            </Text>
            {savedProviders.map((p) => (
              <ItemEngagement key={p.id} id={p.id} title={p.name} detailRoute={`/provider/${p.id}`} />
            ))}
          </View>
        )}

        {/* Journey CTA */}
        <Pressable
          onPress={() => router.push('/(tabs)/journey' as any)}
          style={{ backgroundColor: colors.navy, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, minHeight: MIN_TOUCH, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="View my journey"
        >
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(15, fontScale) }}>View my journey →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
