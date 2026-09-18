import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

async function N() {
  if (!isNative) return null;
  return (await import('expo-notifications')).default ?? (await import('expo-notifications'));
}

export function setupNotificationHandler(): void {
  if (!isNative) return;
  import('expo-notifications').then((mod) => {
    const Notifications = mod.default ?? mod;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!isNative) return null;
  const Notifications = await N();
  if (!Notifications) return null;

  const Device = (await import('expo-device')).default;
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('journey', {
      name: 'Career Journey',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
    await Notifications.setNotificationChannelAsync('deadlines', {
      name: 'Application Deadlines',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

// ── Cancel a single scheduled notification ───────────────────────────────────
async function cancel(id: string) {
  const Notifications = await N();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

// ── 1. Quiz nudge — fires 3 days after install if no quiz taken ───────────────
export async function scheduleQuizNudge(): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  await cancel('quiz-nudge');
  await Notifications.scheduleNotificationAsync({
    identifier: 'quiz-nudge',
    content: {
      title: 'Discover your career path 🎯',
      body: 'Take the Career Choice quiz — it only takes 5 minutes.',
      data: { route: '/questionnaire/career' },
    },
    trigger: { seconds: 60 * 60 * 24 * 3, repeats: false } as any,
  });
}

// ── 2. Journey re-engagement — fires if app not opened for 7 days ─────────────
export async function scheduleJourneyReminder(): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  await cancel('journey-reminder');
  await Notifications.scheduleNotificationAsync({
    identifier: 'journey-reminder',
    content: {
      title: 'Your career journey is waiting 🗺️',
      body: 'You have saved careers to explore. Pick up where you left off.',
      data: { route: '/(tabs)/journey' },
    },
    trigger: { seconds: 60 * 60 * 24 * 7, repeats: false } as any,
  });
}

export async function cancelJourneyReminder(): Promise<void> {
  await cancel('journey-reminder');
}

// ── 3. Application deadline reminder — fires 7 days before a saved deadline ───
export async function scheduleDeadlineReminder(
  itemId: string,
  itemTitle: string,
  deadlineISO: string,
): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  const deadlineMs = new Date(deadlineISO).getTime();
  const fireMs = deadlineMs - 7 * 24 * 60 * 60 * 1000; // 7 days before
  if (fireMs <= Date.now()) return; // already past
  await cancel(`deadline-${itemId}`);
  await Notifications.scheduleNotificationAsync({
    identifier: `deadline-${itemId}`,
    content: {
      title: '📅 Application deadline in 7 days',
      body: `Don't miss the deadline for ${itemTitle}.`,
      data: { route: '/(tabs)/saved' },
    },
    trigger: { date: new Date(fireMs) } as any,
  });
}

export async function cancelDeadlineReminder(itemId: string): Promise<void> {
  await cancel(`deadline-${itemId}`);
}

// ── 4. Streak lapse — fires if streak > 2 and app not opened for 2 days ───────
export async function scheduleStreakLapse(streakDays: number): Promise<void> {
  if (streakDays < 2) return;
  const Notifications = await N();
  if (!Notifications) return;
  await cancel('streak-lapse');
  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-lapse',
    content: {
      title: `Keep your ${streakDays}-day streak alive 🔥`,
      body: 'Open Khetha today to stay on track with your career journey.',
      data: { route: '/(tabs)/journey' },
    },
    trigger: { seconds: 60 * 60 * 48, repeats: false } as any,
  });
}

// ── 5. Application season alert — fires every year on 1 April ─────────────────
export async function scheduleApplicationSeasonAlert(): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  await cancel('app-season');
  const now = new Date();
  const nextApril = new Date(now.getFullYear() + (now.getMonth() >= 3 ? 1 : 0), 3, 1, 8, 0, 0);
  await Notifications.scheduleNotificationAsync({
    identifier: 'app-season',
    content: {
      title: '🎓 University applications are open',
      body: 'Apply now for 2026 — check your saved qualifications and providers.',
      data: { route: '/(tabs)/saved' },
    },
    trigger: { date: nextApril } as any,
  });
}
