import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

async function N() {
  if (!isNative) return null;
  return (await import('expo-notifications')).default ?? (await import('expo-notifications'));
}

// ── Setup ─────────────────────────────────────────────────────────────────────

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
    // Channel: general journey
    await Notifications.setNotificationChannelAsync('journey', {
      name: 'Career Journey',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
    // Channel: saved items & deadlines
    await Notifications.setNotificationChannelAsync('deadlines', {
      name: 'Application Deadlines',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
    // Channel: bursaries
    await Notifications.setNotificationChannelAsync('bursaries', {
      name: 'Bursaries & Funding',
      importance: Notifications.AndroidImportance.HIGH,
    });
    // Channel: events
    await Notifications.setNotificationChannelAsync('events', {
      name: 'Khetha Events',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    // Channel: university applications
    await Notifications.setNotificationChannelAsync('applications', {
      name: 'University Applications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function cancel(id: string) {
  const Notifications = await N();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}

async function schedule(
  identifier: string,
  title: string,
  body: string,
  trigger: any,
  data: Record<string, string> = {},
  channelId = 'journey',
) {
  const Notifications = await N();
  if (!Notifications) return;
  await cancel(identifier);
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body, data, ...(Platform.OS === 'android' ? { channelId } : {}) },
    trigger,
  });
}

// ── 1. Saved item alert — fires immediately when user saves something ──────────
export async function notifySaved(itemTitle: string, itemType: 'career' | 'qualification' | 'provider'): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  const icons: Record<string, string> = { career: '💼', qualification: '🎓', provider: '🏫' };
  const icon = icons[itemType] ?? '🔖';
  await Notifications.scheduleNotificationAsync({
    identifier: `saved-${Date.now()}`,
    content: {
      title: `${icon} Saved to your shortlist`,
      body: `"${itemTitle}" has been added. Tap to set a deadline or add a note.`,
      data: { route: '/(tabs)/saved' },
      ...(Platform.OS === 'android' ? { channelId: 'deadlines' } : {}),
    },
    trigger: null, // immediate
  });
}

// ── 2. Saved item deadline reminder — 7 days before deadline ─────────────────
export async function scheduleDeadlineReminder(
  itemId: string,
  itemTitle: string,
  deadlineISO: string,
): Promise<void> {
  const deadlineMs = new Date(deadlineISO).getTime();
  const sevenDaysBefore = deadlineMs - 7 * 24 * 60 * 60 * 1000;
  const oneDayBefore    = deadlineMs - 1 * 24 * 60 * 60 * 1000;

  if (sevenDaysBefore > Date.now()) {
    await schedule(
      `deadline-7d-${itemId}`,
      '📅 Application deadline in 7 days',
      `Don't miss the closing date for "${itemTitle}". Check your saved items.`,
      { date: new Date(sevenDaysBefore) },
      { route: '/(tabs)/saved' },
      'deadlines',
    );
  }
  if (oneDayBefore > Date.now()) {
    await schedule(
      `deadline-1d-${itemId}`,
      '⚠️ Application deadline TOMORROW',
      `"${itemTitle}" closes tomorrow. Submit your application today!`,
      { date: new Date(oneDayBefore) },
      { route: '/(tabs)/saved' },
      'deadlines',
    );
  }
}

export async function cancelDeadlineReminder(itemId: string): Promise<void> {
  await cancel(`deadline-7d-${itemId}`);
  await cancel(`deadline-1d-${itemId}`);
}

// ── 3. University application season alerts ───────────────────────────────────
// South African universities typically open April and close September
export async function scheduleUniversityApplicationAlerts(): Promise<void> {
  const now = new Date();
  const year = now.getFullYear() + (now.getMonth() >= 9 ? 1 : 0); // next cycle if past Sept

  // Opening alert — 1 April
  const openDate = new Date(year, 3, 1, 8, 0, 0);
  if (openDate > now) {
    await schedule(
      'uni-apps-open',
      '🎓 University applications are now open!',
      `Apply for ${year + 1} — check your saved qualifications and providers before deadlines fill up.`,
      { date: openDate },
      { route: '/(tabs)/saved' },
      'applications',
    );
  }

  // Mid-season reminder — 1 July
  const midDate = new Date(year, 6, 1, 8, 0, 0);
  if (midDate > now) {
    await schedule(
      'uni-apps-mid',
      '📋 University applications: halfway through',
      'Most universities close in September. Have you submitted your applications yet?',
      { date: midDate },
      { route: '/(tabs)/explore' },
      'applications',
    );
  }

  // Closing warning — 1 September
  const closeDate = new Date(year, 8, 1, 8, 0, 0);
  if (closeDate > now) {
    await schedule(
      'uni-apps-closing',
      '🚨 University applications closing soon!',
      'Most universities close in September. Submit your applications now — don\'t miss out.',
      { date: closeDate },
      { route: '/(tabs)/saved' },
      'applications',
    );
  }

  // TVET rolling admissions reminder — 1 February
  const tvetYear = now.getFullYear() + (now.getMonth() >= 1 ? 1 : 0);
  const tvetDate = new Date(tvetYear, 1, 1, 8, 0, 0);
  if (tvetDate > now) {
    await schedule(
      'tvet-apps',
      '🔧 TVET College applications open',
      'TVET colleges accept applications year-round. Explore programmes in the Explore tab.',
      { date: tvetDate },
      { route: '/(tabs)/explore' },
      'applications',
    );
  }
}

// ── 4. Bursary season reminders ───────────────────────────────────────────────
// NSFAS opens ~August, most private bursaries open April–August
export async function scheduleBursaryReminders(): Promise<void> {
  const now = new Date();
  const year = now.getFullYear() + (now.getMonth() >= 10 ? 1 : 0);

  // NSFAS opens — 1 August
  const nsfasOpen = new Date(year, 7, 1, 8, 0, 0);
  if (nsfasOpen > now) {
    await schedule(
      'nsfas-open',
      '💰 NSFAS applications are open!',
      'Apply for NSFAS funding at nsfas.org.za — free university and TVET funding for qualifying students.',
      { date: nsfasOpen },
      { route: '/chatbot' },
      'bursaries',
    );
  }

  // NSFAS closing warning — 15 November
  const nsfasClose = new Date(year, 10, 15, 8, 0, 0);
  if (nsfasClose > now) {
    await schedule(
      'nsfas-closing',
      '⏰ NSFAS closing soon — apply now!',
      'NSFAS applications close in November. Don\'t miss free funding for your studies.',
      { date: nsfasClose },
      { route: '/chatbot' },
      'bursaries',
    );
  }

  // Private bursaries reminder — 1 April
  const bursaryOpen = new Date(year, 3, 1, 8, 0, 0);
  if (bursaryOpen > now) {
    await schedule(
      'bursaries-open',
      '🏆 Bursary season has started',
      'Many companies and government departments open bursary applications in April. Ask Khetha for guidance.',
      { date: bursaryOpen },
      { route: '/chatbot' },
      'bursaries',
    );
  }

  // Mid-year bursary nudge — 1 June
  const bursaryMid = new Date(year, 5, 1, 8, 0, 0);
  if (bursaryMid > now) {
    await schedule(
      'bursaries-mid',
      '📚 Have you applied for a bursary?',
      'Bursaries from SETAs, government and private companies are still open. Speak to a Khetha adviser.',
      { date: bursaryMid },
      { route: '/contact' },
      'bursaries',
    );
  }
}

// ── 5. Event reminders — 2 days before each event ────────────────────────────
export async function scheduleEventReminders(
  events: Array<{ id: string; title: string; date: string; venue: string; province: string }>,
): Promise<void> {
  for (const event of events) {
    const eventMs = new Date(event.date).getTime();
    const twoDaysBefore = eventMs - 2 * 24 * 60 * 60 * 1000;
    const oneDayBefore  = eventMs - 1 * 24 * 60 * 60 * 1000;

    if (twoDaysBefore > Date.now()) {
      await schedule(
        `event-2d-${event.id}`,
        `📅 Khetha event in 2 days`,
        `"${event.title}" is on ${new Date(event.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} at ${event.venue}.`,
        { date: new Date(twoDaysBefore) },
        { route: '/contact' },
        'events',
      );
    }
    if (oneDayBefore > Date.now()) {
      await schedule(
        `event-1d-${event.id}`,
        `🔔 Khetha event TOMORROW`,
        `"${event.title}" is tomorrow at ${event.venue}. Don't miss it!`,
        { date: new Date(oneDayBefore) },
        { route: '/contact' },
        'events',
      );
    }
  }
}

// ── 6. Quiz nudge — 3 days after install if no quiz taken ────────────────────
export async function scheduleQuizNudge(): Promise<void> {
  await schedule(
    'quiz-nudge',
    'Discover your career path 🎯',
    'Take the Career Choice quiz — it only takes 5 minutes and gives you personalised matches.',
    { seconds: 60 * 60 * 24 * 3, repeats: false },
    { route: '/questionnaire/career' },
    'journey',
  );
}

// ── 7. Journey re-engagement — 7 days without opening ────────────────────────
export async function scheduleJourneyReminder(): Promise<void> {
  await schedule(
    'journey-reminder',
    'Your career journey is waiting 🗺️',
    'You have saved careers to explore. Pick up where you left off.',
    { seconds: 60 * 60 * 24 * 7, repeats: false },
    { route: '/(tabs)/journey' },
    'journey',
  );
}

export async function cancelJourneyReminder(): Promise<void> {
  await cancel('journey-reminder');
}

// ── 8. Streak lapse — 48 hours without opening ───────────────────────────────
export async function scheduleStreakLapse(streakDays: number): Promise<void> {
  if (streakDays < 2) return;
  await schedule(
    'streak-lapse',
    `Keep your ${streakDays}-day streak alive 🔥`,
    'Open Khetha today to stay on track with your career journey.',
    { seconds: 60 * 60 * 48, repeats: false },
    { route: '/(tabs)/journey' },
    'journey',
  );
}

// ── 9. Weekly digest — every Monday at 09:00 ─────────────────────────────────
export async function scheduleWeeklyDigest(): Promise<void> {
  const Notifications = await N();
  if (!Notifications) return;
  await cancel('weekly-digest');
  await Notifications.scheduleNotificationAsync({
    identifier: 'weekly-digest',
    content: {
      title: '📰 Your weekly Khetha update',
      body: 'New events, bursary tips and career insights are waiting for you.',
      data: { route: '/(tabs)' },
      ...(Platform.OS === 'android' ? { channelId: 'journey' } : {}),
    },
    trigger: { weekday: 2, hour: 9, minute: 0, repeats: true } as any, // Monday
  });
}

// ── Legacy alias kept for _layout.tsx compatibility ──────────────────────────
export async function scheduleApplicationSeasonAlert(): Promise<void> {
  await scheduleUniversityApplicationAlerts();
}
