import { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, Pressable, TextInput, Share, Platform, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow, fs, MIN_TOUCH } from '../../src/theme';
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
    <View style={{ backgroundColor: colors.bgCard, borderRadius: radius.md, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderLight, ...shadow.md }}>
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

      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg }}>
        <Pressable onPress={() => setOpen((o) => !o)}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center' }}
          accessibilityRole="button" accessibilityLabel="Add note">
          <Ionicons name="create-outline" size={18} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>Note</Text>
        </Pressable>
        <Pressable onPress={toggleNotify}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="switch" accessibilityState={{ checked: meta.notifyMe }} accessibilityLabel="Remind me">
          <Ionicons name={meta.notifyMe ? 'notifications' : 'notifications-outline'} size={18} color={meta.notifyMe ? colors.teal : colors.muted} />
          <Text style={{ color: meta.notifyMe ? colors.teal : colors.muted, fontSize: 10, marginTop: 2, fontWeight: meta.notifyMe ? '700' : '400' }}>{meta.notifyMe ? 'On' : 'Remind'}</Text>
        </Pressable>
        <Pressable onPress={shareToWhatsApp}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="button" accessibilityLabel={`Share ${title}`}>
          <Ionicons name="share-social-outline" size={18} color={colors.muted} />
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>Share</Text>
        </Pressable>
        <Pressable onPress={() => useUserStore.getState().toggleSaved(id)}
          style={{ flex: 1, paddingVertical: 10, alignItems: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.border }}
          accessibilityRole="button" accessibilityLabel={`Remove ${title}`}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
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
        <View style={{ backgroundColor: colors.navy, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: colors.blueGlow }} />
          <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800' }}>Saved</Text>
          <Text style={{ color: colors.mutedLight, fontSize: 13, marginTop: 2 }}>Your shortlist of careers, qualifications & providers</Text>
        </View>
        <View style={{ flex: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.blue + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 }}>
            <Ionicons name="bookmark-outline" size={40} color={colors.blue} />
          </View>
          <Text style={{ fontSize: fs(22, fontScale), fontWeight: '800', color: colors.navy, textAlign: 'center' }}>Nothing saved yet</Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center', lineHeight: 22, fontSize: fs(14, fontScale) }}>
            Save careers, qualifications and providers to track them, set deadlines and get reminders.
          </Text>
          <Link href="/(tabs)/explore" asChild>
            <Pressable style={{ backgroundColor: colors.navy, borderRadius: radius.md, paddingHorizontal: 24, paddingVertical: 14, marginTop: 24, minHeight: MIN_TOUCH, justifyContent: 'center', ...shadow.md }} accessibilityRole="button">
              <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(14, fontScale) }}>Browse Explore →</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Dark header */}
        <View style={{ backgroundColor: colors.navy, paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, marginBottom: spacing.md, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: colors.blueGlow }} />
          <Text style={{ color: colors.white, fontSize: 26, fontWeight: '800' }}>{t('saved_tab')}</Text>
          <Text style={{ color: colors.mutedLight, fontSize: 13, marginTop: 2 }}>{total} saved item{total !== 1 ? 's' : ''}</Text>
        </View>
        <View style={{ paddingHorizontal: spacing.md }}>
        {/* Tip */}
        <View style={{ backgroundColor: colors.blue + '0F', borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md, flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.blue + '22' }}>
          <Ionicons name="information-circle-outline" size={20} color={colors.teal} />
          <Text style={{ color: colors.ink, fontSize: fs(12, fontScale), lineHeight: 18, flex: 1 }}>Tap the note icon to add notes, bell for reminders, or share via WhatsApp.</Text>
        </View>

        {savedCareers.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ionicons name="briefcase-outline" size={16} color={colors.navy} />
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>Careers</Text>
            </View>
            {savedCareers.map((c) => <ItemEngagement key={c.id} id={c.id} title={c.title} detailRoute={`/career/${c.id}`} />)}
          </View>
        )}
        {savedQuals.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ionicons name="school-outline" size={16} color={colors.navy} />
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>Qualifications</Text>
            </View>
            {savedQuals.map((q) => <ItemEngagement key={q.id} id={q.id} title={q.title} detailRoute={`/qualification/${q.id}`} />)}
          </View>
        )}
        {savedProviders.length > 0 && (
          <View style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ionicons name="business-outline" size={16} color={colors.navy} />
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: fs(16, fontScale) }}>Providers</Text>
            </View>
            {savedProviders.map((p) => <ItemEngagement key={p.id} id={p.id} title={p.name} detailRoute={`/provider/${p.id}`} />)}
          </View>
        )}
        <Pressable onPress={() => router.push('/(tabs)/journey' as any)}
          style={{ backgroundColor: colors.navy, borderRadius: radius.md, padding: 16, alignItems: 'center', marginTop: 8, minHeight: MIN_TOUCH, justifyContent: 'center', ...shadow.md }}
          accessibilityRole="button" accessibilityLabel="View my journey">
          <Text style={{ color: colors.white, fontWeight: '800', fontSize: fs(15, fontScale) }}>View my journey →</Text>
        </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
