import { CAREERS } from '../data/seed';
import { CC_AFFINITY, JF_AFFINITY } from '../data/questionnaire';
import { supabase } from './supabase';

export type MatchedCareer = { id: string; score: number; reason: string };
export type MatchResult = { careers: MatchedCareer[]; source: 'ai' | 'local' };

// Legacy subject-quiz affinity (kept for /questionnaire/subjects backward compat)
const SUB_AFFINITY: Record<string, Array<[string, number]>> = {
  sub_mathematics: [['software-developer', 3], ['civil-engineer', 3], ['accountant', 2], ['health-scientist', 2]],
  sub_sciences:    [['health-scientist', 3], ['nurse', 3], ['agricultural-scientist', 3]],
  sub_languages:   [['lawyer', 3], ['teacher', 2], ['social-worker', 2]],
  sub_arts:        [['graphic-designer', 3]],
  sub_technology:  [['software-developer', 3], ['graphic-designer', 1]],
  sub_business:    [['accountant', 3], ['lawyer', 1]],
  sub_social:      [['social-worker', 3], ['teacher', 2]],
  sub_health:      [['nurse', 3], ['health-scientist', 3]],
};

const AFFINITY_MAP: Record<string, Record<string, Array<[string, number]>>> = {
  career:    CC_AFFINITY,
  'job-fit': JF_AFFINITY,
  subjects:  SUB_AFFINITY,
};

// Derive a personalised reason from the top-scoring answer keys for this career
function deriveReason(careerId: string, answers: Record<string, number>, affinity: Record<string, Array<[string, number]>>): string {
  // Find which answer keys contributed most to this career's score
  const contributors: Array<{ key: string; contribution: number }> = [];
  for (const [key, value] of Object.entries(answers)) {
    const pairs = affinity[key];
    if (!pairs) continue;
    const pair = pairs.find(([id]) => id === careerId);
    if (pair) contributors.push({ key, contribution: value * pair[1] });
  }
  contributors.sort((a, b) => b.contribution - a.contribution);
  const topKey = contributors[0]?.key ?? '';

  // Human-readable reason fragments keyed by question key
  const FRAGMENTS: Record<string, Record<string, string>> = {
    // Career Choice
    cc_realistic_1:      { 'civil-engineer': 'your love of building and making things', 'agricultural-scientist': 'your hands-on, practical nature' },
    cc_realistic_2:      { 'civil-engineer': 'your comfort with tools and physical work' },
    cc_investigative_1:  { 'health-scientist': 'your analytical problem-solving mind', 'software-developer': 'your drive to understand how things work', 'lawyer': 'your investigative thinking' },
    cc_investigative_2:  { 'health-scientist': 'your curiosity about how things work', 'software-developer': 'your love of understanding systems' },
    cc_artistic_1:       { 'graphic-designer': 'your creative and expressive nature' },
    cc_artistic_2:       { 'graphic-designer': 'your imagination and original thinking' },
    cc_social_1:         { 'teacher': 'your drive to help others learn and grow', 'social-worker': 'your empathy and desire to support people', 'nurse': 'your caring nature' },
    cc_social_2:         { 'social-worker': 'your commitment to making a difference', 'nurse': 'your dedication to people\'s wellbeing', 'teacher': 'your passion for positive impact' },
    cc_enterprising_1:   { 'lawyer': 'your leadership and persuasive ability', 'teacher': 'your ability to motivate others' },
    cc_enterprising_2:   { 'accountant': 'your interest in business and finance', 'lawyer': 'your entrepreneurial and strategic thinking' },
    cc_conventional_1:   { 'accountant': 'your strength with data and numbers', 'health-scientist': 'your methodical, detail-oriented approach' },
    cc_conventional_2:   { 'accountant': 'your preference for structure and clear processes' },
    // Job Fit
    jf_adaptability_1:   { 'nurse': 'your ability to stay calm under pressure', 'social-worker': 'your resilience in changing situations' },
    jf_adaptability_2:   { 'nurse': 'your composure when plans change', 'lawyer': 'your ability to think on your feet' },
    jf_collaboration_1:  { 'teacher': 'your team-oriented working style', 'social-worker': 'your collaborative nature' },
    jf_collaboration_2:  { 'teacher': 'your strong listening and communication skills' },
    jf_learning_1:       { 'health-scientist': 'your self-driven curiosity', 'software-developer': 'your constant drive to learn new things' },
    jf_learning_2:       { 'software-developer': 'your love of growth-oriented environments' },
    jf_structure_1:      { 'accountant': 'your preference for clear structure and routine', 'civil-engineer': 'your methodical approach to work' },
    jf_structure_2:      { 'accountant': 'your ability to manage structured workloads' },
    jf_innovation_1:     { 'software-developer': 'your creative problem-solving approach', 'graphic-designer': 'your original thinking' },
    jf_innovation_2:     { 'graphic-designer': 'your love of brainstorming and new ideas' },
    jf_pace_1:           { 'lawyer': 'your comfort in fast-paced, high-stakes environments' },
    jf_pace_2:           { 'health-scientist': 'your deliberate, thorough working style' },
    jf_autonomy_1:       { 'graphic-designer': 'your self-directed, independent work style', 'agricultural-scientist': 'your ability to manage your own time' },
    jf_autonomy_2:       { 'graphic-designer': 'your confidence in making independent decisions' },
    jf_execution_1:      { 'civil-engineer': 'your strong delivery focus', 'nurse': 'your conscientiousness and reliability', 'accountant': 'your pride in completing work thoroughly' },
    jf_execution_2:      { 'civil-engineer': 'your preference for executing well-planned work' },
    // Subjects
    sub_mathematics:     { 'software-developer': 'your strength in mathematics', 'civil-engineer': 'your mathematical ability', 'accountant': 'your numerical aptitude' },
    sub_sciences:        { 'health-scientist': 'your interest in the sciences', 'nurse': 'your science background', 'agricultural-scientist': 'your science foundation' },
    sub_languages:       { 'lawyer': 'your language and communication skills', 'teacher': 'your love of languages' },
    sub_arts:            { 'graphic-designer': 'your creative arts background' },
    sub_technology:      { 'software-developer': 'your technology interest' },
    sub_business:        { 'accountant': 'your business and accounting interest' },
    sub_social:          { 'social-worker': 'your social sciences background', 'teacher': 'your interest in social subjects' },
    sub_health:          { 'nurse': 'your health sciences background', 'health-scientist': 'your health subject interest' },
  };

  const fragment = FRAGMENTS[topKey]?.[careerId];
  if (fragment) return `This career suits you because of ${fragment}.`;

  // Fallback static reasons
  const STATIC: Record<string, string> = {
    'health-scientist':       'Your analytical mindset and interest in sciences make this a strong fit.',
    'software-developer':     'Your love of logic, technology and problem-solving aligns perfectly.',
    'social-worker':          'Your empathy and drive to help people are exactly what this career needs.',
    'accountant':             'Your attention to detail and numerical strength are ideal here.',
    'teacher':                'Your communication skills and patience point strongly to education.',
    'civil-engineer':         'Your practical, mathematical approach suits engineering well.',
    'graphic-designer':       'Your creativity and visual thinking are a natural match.',
    'lawyer':                 'Your analytical and language skills are core to legal work.',
    'agricultural-scientist': 'Your interest in the outdoors and research fits this field.',
    'nurse':                  'Your empathy and resilience are exactly what nursing demands.',
  };
  return STATIC[careerId] ?? 'This career matches your profile.';
}

function scoreLocally(type: string, answers: Record<string, number>): MatchedCareer[] {
  const affinity = AFFINITY_MAP[type] ?? CC_AFFINITY;
  const scores: Record<string, number> = {};
  CAREERS.forEach((c) => { scores[c.id] = 0; });

  for (const [key, value] of Object.entries(answers)) {
    const pairs = affinity[key];
    if (!pairs) continue;
    for (const [careerId, weight] of pairs) {
      scores[careerId] = (scores[careerId] ?? 0) + value * weight;
    }
  }

  const max = Math.max(...Object.values(scores), 1);
  return CAREERS
    .map((c) => ({
      id: c.id,
      score: Math.round((scores[c.id] / max) * 100),
      reason: deriveReason(c.id, answers, affinity),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

async function scoreWithAI(type: string, answers: Record<string, number>): Promise<MatchedCareer[]> {
  if (!supabase) throw new Error('no supabase');
  const { data, error } = await supabase.functions.invoke('career-match', {
    body: { type, answers, careers: CAREERS.map(({ id, title, skills, subjects, field }) => ({ id, title, skills, subjects, field })) },
  });
  if (error || !data?.careers) throw new Error(error?.message ?? 'bad response');
  return (data.careers as MatchedCareer[]).slice(0, 5);
}

export async function matchCareers(type: string, answers: Record<string, number>): Promise<MatchResult> {
  try {
    const careers = await scoreWithAI(type, answers);
    return { careers, source: 'ai' };
  } catch {
    return { careers: scoreLocally(type, answers), source: 'local' };
  }
}
