/**
 * src/lib/chatKnowledge.ts
 * Full FAQ knowledge base — seed data + app features
 */

import {
  CAREERS, QUALIFICATIONS, PROVIDERS, ADVISERS,
  EVENTS, WALK_IN_CENTRES,
} from '../data/seed';

export type FAQ = { keywords: string[]; answer: string };

// ── App feature FAQs ──────────────────────────────────────────────────────────

const APP_FAQS: FAQ[] = [
  {
    keywords: ['khetha', 'what is', 'about', 'ncap', 'national career'],
    answer: 'Khetha is a free career guidance service by the Department of Higher Education and Training (DHET), powered by the National Career Advice Portal (NCAP). This app helps you explore careers, compare qualifications, complete assessments, and connect with advisers — all in one place.',
  },
  {
    keywords: ['app', 'features', 'what can', 'how to use', 'navigate'],
    answer: 'This app has 5 main tabs:\n• 🏠 Home — dashboard, quick actions, AI Advisor\n• 🔍 Explore — search careers, qualifications & providers\n• 🗺️ Journey — your guided career journey with progress tracking\n• 🔖 Saved — bookmarked careers, qualifications & providers\n• 👤 Profile — your settings and journey history\n\nYou can also access the AI Advisor chatbot, career quizzes, and subject chooser from the Home tab.',
  },
  {
    keywords: ['quiz', 'assessment', 'career choice', 'questionnaire', 'job fit', 'job-fit'],
    answer: 'There are 2 assessments in the app:\n• Career Choice Quiz — discover careers matching your interests across 6 clusters. Takes ~5 min.\n• Job Fit Quiz — reveals your work style across 8 dimensions. Takes ~10 min.\nBoth are free and your results are saved to your Journey profile.',
  },
  {
    keywords: ['subject chooser', 'subject tool', 'which subject', 'choose subject'],
    answer: 'The Subject Chooser (on the Home tab) maps your current subjects to career pathways. It shows which subjects are required, recommended or advantageous for each career. Mathematics and Physical Sciences open the most doors.',
  },
  {
    keywords: ['journey', 'progress', 'stages', 'steps'],
    answer: 'Your Journey tracks 7 stages:\n1. Onboarding & profile\n2. Career quiz\n3. Job-fit quiz\n4. Career matching\n5. Subject alignment\n6. Qualification research\n7. Provider & application\nYour progress score updates as you complete each stage.',
  },
  {
    keywords: ['saved', 'bookmark', 'favourite', 'save'],
    answer: 'Tap the bookmark icon on any career, qualification or provider card to save it. All saved items appear in the Saved tab. You can also set deadline reminders for saved qualifications.',
  },
  {
    keywords: ['notification', 'reminder', 'alert'],
    answer: 'The app sends smart reminders for:\n• University application seasons (April, July, September)\n• TVET admissions (February)\n• NSFAS applications (August & November)\n• Private bursaries (April & June)\n• Khetha events (2 days and 1 day before)\n• Weekly career digest (Mondays 09:00)\nEnable notifications when prompted to stay on track.',
  },
  {
    keywords: ['offline', 'no internet', 'data', 'bandwidth'],
    answer: 'The app works offline with bundled demo data for all careers, qualifications and providers. An internet connection is only needed to sync your profile with Supabase or to open external application links.',
  },
  {
    keywords: ['language', 'accessibility', 'text size', 'font'],
    answer: 'You can set your preferred language and text size during onboarding or in the Profile tab. The app supports larger touch targets and text scaling for accessibility.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'start'],
    answer: 'Hello! 👋 I\'m the Khetha FAQ assistant. Ask me about careers, qualifications, providers, bursaries, NQF levels, app features, events, advisers or walk-in centres. What would you like to know?',
  },
  {
    keywords: ['thank', 'thanks', 'helpful'],
    answer: 'You\'re welcome! 😊 Remember, Khetha advisers are available on 086 999 0123 (free) for personalised guidance. Good luck on your career journey!',
  },
];

// ── General education FAQs ────────────────────────────────────────────────────

const EDU_FAQS: FAQ[] = [
  {
    keywords: ['nqf', 'qualification level', 'framework'],
    answer: 'NQF (National Qualifications Framework) has 10 levels:\n• NQF 1–3: School certificates\n• NQF 4: Matric (Grade 12)\n• NQF 5: Higher Certificates\n• NQF 6: Diplomas\n• NQF 7: Bachelor degrees\n• NQF 8: Honours / Postgrad Diplomas\n• NQF 9: Masters\n• NQF 10: Doctorates',
  },
  {
    keywords: ['aps', 'admission point', 'score', 'calculate aps'],
    answer: 'APS (Admission Point Score) is calculated from your Grade 12 results. Each subject scores 1–7 based on your percentage. Life Orientation counts as half. Most universities require APS 20–35+ depending on the programme.',
  },
  {
    keywords: ['matric', 'grade 12', 'pass', 'nsc'],
    answer: 'There are 3 matric pass types:\n• NSC Pass (30%+ in 3 subjects): Basic pass\n• Diploma Pass (40%+ in 4 subjects): TVET & some university programmes\n• Bachelor Pass (50%+ in 4 subjects + 30% in 3 others): University degree programmes',
  },
  {
    keywords: ['tvet', 'college', 'technical', 'vocational'],
    answer: 'TVET Colleges offer practical NQF 2–6 qualifications. They are ideal for artisan trades, engineering, business and IT. Admissions typically open in February. Bursaries are available through SETAs and NSFAS.',
  },
  {
    keywords: ['nsfas', 'student loan', 'financial aid', 'funding'],
    answer: 'NSFAS funds eligible South African students at public universities and TVET colleges. Apply at nsfas.org.za with your ID, proof of income and acceptance letter. Applications open in August and November.',
  },
  {
    keywords: ['bursary', 'scholarship', 'private bursary'],
    answer: 'Bursaries are available from NSFAS, SETAs, government departments and private companies. Private bursary cycles open in April and June. Visit nsfas.org.za or contact a Khetha adviser to find bursaries matching your field.',
  },
  {
    keywords: ['artisan', 'trade', 'apprenticeship', 'seta'],
    answer: 'Artisan trades (electrician, plumber, welder) are in high demand. You need Grade 10–12 with Maths and Physical Sciences, then complete a 3–4 year apprenticeship and pass a trade test. SETAs fund many apprenticeships.',
  },
  {
    keywords: ['application', 'apply', 'deadline', 'when apply', 'university application'],
    answer: 'University applications typically open in April and close in September for the following year. TVET colleges have rolling admissions (main intake February). Set deadline reminders in the Saved tab of this app.',
  },
  {
    keywords: ['unisa', 'distance', 'online study', 'remote'],
    answer: 'UNISA is Africa\'s largest distance learning institution, offering hundreds of qualifications you can study from home. Apply at unisa.ac.za. UNISA offers a Diploma in IT (NQF 6) and Higher Certificate in ECD (NQF 5) in this app.',
  },
];

// ── Career FAQs (generated from seed) ────────────────────────────────────────

const CAREER_FAQS: FAQ[] = CAREERS.map((c) => ({
  keywords: [
    c.title.toLowerCase(),
    c.slug,
    c.field.toLowerCase(),
    ...c.skills.map((s) => s.toLowerCase()),
  ],
  answer: `${c.title} (${c.field})\n\n${c.description}\n\n📚 Subjects: ${c.subjects.join(', ')}\n🎓 Education: ${c.education_path}\n💰 Salary: ${c.salary_range}\n📈 Outlook: ${c.outlook}\n🏢 Work environment: ${c.work_environment}`,
}));

// ── Qualification FAQs (generated from seed) ──────────────────────────────────

const QUAL_FAQS: FAQ[] = QUALIFICATIONS.map((q) => ({
  keywords: [
    q.title.toLowerCase(),
    q.field.toLowerCase(),
    q.provider_name.toLowerCase(),
    `nqf ${q.nqf_level}`,
  ],
  answer: `${q.title}\n\n${q.description}\n\n🏫 Provider: ${q.provider_name}\n📊 NQF Level: ${q.nqf_level}\n⏱ Duration: ${q.duration}\n📋 Entry: ${q.entry_requirements}\n🎯 Careers: ${q.career_outcomes.join(', ')}\n🔗 Apply: ${q.application_url}`,
}));

// ── Provider FAQs (generated from seed) ──────────────────────────────────────

const PROVIDER_FAQS: FAQ[] = PROVIDERS.map((p) => ({
  keywords: [
    p.name.toLowerCase(),
    p.city.toLowerCase(),
    p.province.toLowerCase(),
    p.provider_type.toLowerCase(),
  ],
  answer: `${p.name} (${p.provider_type})\n\n📍 ${p.address}\n🌍 Province: ${p.province}\n📞 ${p.phone}\n🌐 ${p.website}\n📚 Qualifications listed: ${p.qualifications_count}\n💻 Distance learning: ${p.distance_learning ? 'Yes' : 'No'}`,
}));

// ── Adviser FAQs (generated from seed) ───────────────────────────────────────

const ADVISER_FAQS: FAQ[] = [
  {
    keywords: ['adviser', 'advisor', 'counsellor', 'contact', 'speak', 'human', 'person'],
    answer: `Khetha has ${ADVISERS.length} career advisers across all 9 provinces:\n\n` +
      ADVISERS.map((a) => `• ${a.name} — ${a.city}, ${a.province} (${a.phone})\n  Specialises in: ${a.specialisation}`).join('\n') +
      '\n\nAll services are free. Call 086 999 0123 or visit a walk-in centre.',
  },
  ...ADVISERS.map((a) => ({
    keywords: [a.name.toLowerCase(), a.city.toLowerCase(), a.specialisation.toLowerCase()],
    answer: `${a.name} — ${a.role}\n\n📍 ${a.city}, ${a.province}\n📞 ${a.phone}\n📧 ${a.email}\n🗣 Languages: ${a.languages.join(', ')}\n🕐 Availability: ${a.availability}\n🚶 Walk-in: ${a.walk_in ? 'Yes' : 'By appointment'}\n⭐ Specialisation: ${a.specialisation}`,
  })),
];

// ── Event FAQs (generated from seed) ─────────────────────────────────────────

const EVENT_FAQS: FAQ[] = [
  {
    keywords: ['event', 'expo', 'workshop', 'webinar', 'open day', 'upcoming'],
    answer: `Upcoming Khetha events:\n\n` +
      EVENTS.map((e) => `• ${e.title}\n  📅 ${e.date} at ${e.time}\n  📍 ${e.venue}\n  🔗 ${e.registration_url}`).join('\n\n'),
  },
  ...EVENTS.map((e) => ({
    keywords: [e.title.toLowerCase(), e.province.toLowerCase(), e.type.toLowerCase()],
    answer: `${e.title} (${e.type})\n\n${e.description}\n\n📅 Date: ${e.date}\n⏰ Time: ${e.time}\n📍 Venue: ${e.venue}\n🌍 Province: ${e.province}\n🔗 Register: ${e.registration_url}`,
  })),
];

// ── Walk-in centre FAQs ───────────────────────────────────────────────────────

const WALKIN_FAQS: FAQ[] = [
  {
    keywords: ['walk-in', 'walk in', 'centre', 'office', 'visit', 'province', 'nearest'],
    answer: `Khetha walk-in centres across South Africa:\n\n` +
      WALK_IN_CENTRES.map((w) => `• ${w.name}\n  📍 ${w.address}\n  📞 ${w.phone}\n  🕐 ${w.hours}`).join('\n\n'),
  },
  ...WALK_IN_CENTRES.map((w) => ({
    keywords: [w.name.toLowerCase(), w.province.toLowerCase(), w.address.toLowerCase().split(',')[1]?.trim() ?? ''],
    answer: `${w.name}\n\n📍 ${w.address}\n🌍 Province: ${w.province}\n📞 ${w.phone}\n🕐 Hours: ${w.hours}`,
  })),
];

// ── Salary / field overview FAQs ─────────────────────────────────────────────

const SALARY_FAQS: FAQ[] = [
  {
    keywords: ['salary', 'earn', 'income', 'pay', 'how much'],
    answer: 'Salary ranges from the app\'s career data:\n\n' +
      CAREERS.map((c) => `• ${c.title}: ${c.salary_range}`).join('\n'),
  },
  {
    keywords: ['high demand', 'in demand', 'best career', 'top career'],
    answer: 'Careers currently marked as High Demand:\n\n' +
      CAREERS.filter((c) => c.outlook === 'High demand').map((c) => `• ${c.title} (${c.field}) — ${c.salary_range}`).join('\n'),
  },
  {
    keywords: ['health career', 'medical', 'healthcare'],
    answer: 'Health careers in the app:\n\n' +
      CAREERS.filter((c) => c.field === 'Health').map((c) => `• ${c.title} — ${c.salary_range} | ${c.outlook}`).join('\n'),
  },
  {
    keywords: ['technology career', 'tech', 'it career', 'digital'],
    answer: 'Technology careers in the app:\n\n' +
      CAREERS.filter((c) => c.field === 'Technology').map((c) => `• ${c.title} — ${c.salary_range} | ${c.outlook}`).join('\n'),
  },
  {
    keywords: ['engineering career', 'engineer', 'trade career'],
    answer: 'Engineering & trades careers in the app:\n\n' +
      CAREERS.filter((c) => c.field === 'Engineering').map((c) => `• ${c.title} — ${c.salary_range} | ${c.outlook}`).join('\n'),
  },
];

// ── Combined knowledge base ───────────────────────────────────────────────────

export const KNOWLEDGE_BASE: FAQ[] = [
  ...APP_FAQS,
  ...EDU_FAQS,
  ...SALARY_FAQS,
  ...CAREER_FAQS,
  ...QUAL_FAQS,
  ...PROVIDER_FAQS,
  ...ADVISER_FAQS,
  ...EVENT_FAQS,
  ...WALKIN_FAQS,
];

export function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of KNOWLEDGE_BASE) {
    if (faq.keywords.some((k) => k && lower.includes(k))) return faq.answer;
  }
  return "I don't have a specific answer for that yet. For personalised guidance, call Khetha on 086 999 0123 (free) or visit a walk-in centre near you.";
}

export const SUGGESTED_QUESTIONS = [
  'What is Khetha?',
  'How does the career quiz work?',
  'What are the app features?',
  'Show me high demand careers',
  'What is NQF?',
  'How do I get a bursary?',
  'What is NSFAS?',
  'Tell me about Software Developer',
  'Tell me about Nursing',
  'Upcoming events',
  'Walk-in centres',
  'How is APS calculated?',
];

export const QUICK_CATEGORIES = [
  { label: 'App', color: '#7B61FF', questions: ['What is Khetha?', 'What are the app features?', 'How does the career quiz work?', 'How does the Journey work?'] },
  { label: 'Careers', color: '#0E9384', questions: ['Show me high demand careers', 'Tell me about Software Developer', 'Tell me about Nursing', 'Tell me about Electrician'] },
  { label: 'Study', color: '#1677FF', questions: ['What is NQF?', 'How is APS calculated?', 'What are TVET colleges?', 'Tell me about UNISA'] },
  { label: 'Funding', color: '#F4B740', questions: ['How do I get a bursary?', 'What is NSFAS?', 'When do university applications open?'] },
  { label: 'Events', color: '#E05C2A', questions: ['Upcoming events', 'Khetha Career Expo Gauteng', 'Health Careers Webinar'] },
  { label: 'Contact', color: '#38A169', questions: ['Walk-in centres', 'Talk to an adviser', 'Khetha Cape Town', 'Khetha Johannesburg'] },
];
