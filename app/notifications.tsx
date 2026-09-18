/**
 * app/notifications.tsx
 * In-app notification centre — shows all app-generated alerts with read/unread state.
 */

import { SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../src/theme';
import { useUserStore } from '../src/store/user';
import type { AppNotification } from '../src/store/user';

const CATEGORY_COLORS: Record<AppNotification['category'], string> = {
  journey:     colors.teal,
  deadline:    colors.danger,
  bursary:     colors.yellow,
  event:       colors.orange,
  application: colors.blue,
  saved:       colors.purple,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function NotifCard({ notif }: { notif: AppNotification }) {
  const { markRead } = useUserStore();
  const accent = CATEGORY_COLORS[notif.category];

  function handlePress() {
    markRead(notif.id);
    if (notif.route) router.push(notif.route as any);
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: notif.read ? colors.bgCard : colors.navy,
        borderRadius: radius.md,
        marginHorizontal: spacing.md,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: notif.read ? colors.borderLight : accent + '40',
        borderLeftWidth: 3,
        borderLeftColor: accent,
        ...shadow.sm,
      }}
      accessibilityRole="button"
    >
      {/* Icon */}
      <View style={{
        width: 40, height: 40, borderRadius: radius.sm,
        backgroundColor: accent + (notif.read ? '18' : '28'),
        alignItems: 'center', justifyContent: 'center',
        marginTop: 2,
      }}>
        <Text style={{ fontSize: 20 }}>{notif.icon}</Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Text style={{
            color: notif.read ? colors.navy : colors.white,
            fontWeight: '800', fontSize: 13, flex: 1, marginRight: 8,
          }} numberOfLines={1}>
            {notif.title}
          </Text>
          <Text style={{ color: colors.mutedLight, fontSize: 10, fontWeight: '600' }}>
            {timeAgo(notif.createdAt)}
          </Text>
        </View>
        <Text style={{
          color: notif.read ? colors.muted : colors.mutedLight,
          fontSize: 12, lineHeight: 18,
        }}>
          {notif.body}
        </Text>
        <View style={{
          marginTop: 6, alignSelf: 'flex-start',
          backgroundColor: accent + '22', borderRadius: radius.full,
          paddingHorizontal: 8, paddingVertical: 2,
        }}>
          <Text style={{ color: accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {notif.category}
          </Text>
        </View>
      </View>

      {/* Unread dot */}
      {!notif.read && (
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent, marginTop: 6 }} />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const { notifications, markAllRead, clearNotifications } = useUserStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{
        title: '',
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: colors.yellow + '22',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Feather name="bell" size={16} color={colors.yellow} />
            </View>
            <View>
              <Text style={{ color: colors.white, fontSize: 15, fontWeight: '800' }}>Notifications</Text>
              <Text style={{ color: colors.mutedLight, fontSize: 11 }}>
                {unread > 0 ? `${unread} unread` : 'All caught up'}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => notifications.length > 0 ? (
          <View style={{ flexDirection: 'row', gap: 16, marginRight: 4 }}>
            {unread > 0 && (
              <Pressable onPress={markAllRead} accessibilityRole="button" accessibilityLabel="Mark all read">
                <Text style={{ color: colors.teal, fontSize: 12, fontWeight: '700' }}>Mark all read</Text>
              </Pressable>
            )}
            <Pressable onPress={clearNotifications} accessibilityRole="button" accessibilityLabel="Clear all">
              <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700' }}>Clear</Text>
            </Pressable>
          </View>
        ) : null,
      }} />

      {/* Ambient glow */}
      <View style={{
        position: 'absolute', top: 0, right: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: colors.yellowGlow,
      }} pointerEvents="none" />

      {notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: colors.yellow + '18',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Feather name="bell-off" size={32} color={colors.yellow} />
          </View>
          <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 20, textAlign: 'center' }}>
            No notifications yet
          </Text>
          <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            Alerts for saved items, bursaries, events and application deadlines will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Unread section */}
          {unread > 0 && (
            <>
              <Text style={{ color: colors.navy, fontWeight: '800', fontSize: 13, marginHorizontal: spacing.md, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Unread · {unread}
              </Text>
              {notifications.filter((n) => !n.read).map((n) => <NotifCard key={n.id} notif={n} />)}
              <View style={{ height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.md, marginVertical: 14 }} />
            </>
          )}

          {/* Read section */}
          {notifications.filter((n) => n.read).length > 0 && (
            <>
              <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 12, marginHorizontal: spacing.md, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Earlier
              </Text>
              {notifications.filter((n) => n.read).map((n) => <NotifCard key={n.id} notif={n} />)}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
