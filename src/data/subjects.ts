// NCAP Subject Chooser data
// Aligned with South African NSC subject list and NQF pathways

export type SubjectRequirement = 'required' | 'recommended' | 'advantage';

export type SubjectEntry = {
  subject: string;
  requirement: SubjectRequirement;
  note?: string; // e.g. "Maths, NOT Maths Literacy"
};

export type CareerSubjectProfile = {
  careerId: string;
  careerTitle: string;
  field: string;
  minMatric: string; // minimum NSC requirement
  mathsRequired: 'Mathematics' | 'Mathematics Literacy' | 'Either' | 'None';
  subjects: SubjectEntry[];
  pathway: string; // short NQF pathway description
  apsMin: number; // approximate minimum APS
};

export const CAREER_SUBJECT_PROFILES: CareerSubjectProfile[] = [
  {
    careerId: 'health-scientist',
    careerTitle: 'Health Scientist',
    field: 'Health',
    minMatric: 'NSC with Bachelor pass',
    mathsRequired: 'Mathematics',
    apsMin: 30,
    pathway: 'NSC → BSc Health Sciences (NQF 7–8) → Honours/Masters for research roles',
    subjects: [
      { subject: 'Mathematics',        requirement: 'required',     note: 'Pure Maths, NOT Maths Literacy' },
      { subject: 'Life Sciences',       requirement: 'required' },
      { subject: 'Physical Sciences',   requirement: 'required' },
      { subject: 'English',             requirement: 'required' },
      { subject: 'Geography',           requirement: 'recommended' },
      { subject: 'Agricultural Sciences', requirement: 'advantage' },
    ],
  },
  {
    careerId: 'software-developer',
    careerTitle: 'Software Developer',
    field: 'Technology',
    minMatric: 'NSC with Bachelor or Diploma pass',
    mathsRequired: 'Mathematics',
    apsMin: 28,
    pathway: 'NSC → Diploma/Degree in IT or Computer Science (NQF 6–7) → Learnership also available',
    subjects: [
      { subject: 'Mathematics',           requirement: 'required',     note: 'Pure Maths strongly preferred' },
      { subject: 'Information Technology', requirement: 'required' },
      { subject: 'English',               requirement: 'required' },
      { subject: 'Physical Sciences',     requirement: 'recommended' },
      { subject: 'Mathematical Literacy', requirement: 'advantage',    note: 'Accepted for some diplomas only' },
    ],
  },
  {
    careerId: 'social-worker',
    careerTitle: 'Social Worker',
    field: 'Social Sciences',
    minMatric: 'NSC with Bachelor pass',
    mathsRequired: 'Either',
    apsMin: 26,
    pathway: 'NSC → Bachelor of Social Work (NQF 7) — 4-year degree, registration with SACSSP required',
    subjects: [
      { subject: 'English',             requirement: 'required' },
      { subject: 'Life Orientation',    requirement: 'required' },
      { subject: 'Social Sciences',     requirement: 'recommended' },
      { subject: 'Languages (HL/FAL)', requirement: 'recommended',  note: 'Additional language is an advantage' },
      { subject: 'Mathematics',         requirement: 'advantage' },
      { subject: 'Mathematical Literacy', requirement: 'advantage' },
    ],
  },
  {
    careerId: 'accountant',
    careerTitle: 'Accountant',
    field: 'Business',
    minMatric: 'NSC with Bachelor or Diploma pass',
    mathsRequired: 'Mathematics',
    apsMin: 28,
    pathway: 'NSC → Diploma/Degree in Accounting (NQF 6–8) → SAICA/CIMA articles for CA(SA)',
    subjects: [
      { subject: 'Mathematics',        requirement: 'required',     note: 'Pure Maths required for CA(SA) route' },
      { subject: 'Accounting',         requirement: 'required' },
      { subject: 'English',            requirement: 'required' },
      { subject: 'Business Studies',   requirement: 'recommended' },
      { subject: 'Economics',          requirement: 'recommended' },
      { subject: 'Mathematical Literacy', requirement: 'advantage', note: 'Only for some diploma programmes' },
    ],
  },
  {
    careerId: 'teacher',
    careerTitle: 'Teacher',
    field: 'Education',
    minMatric: 'NSC with Bachelor pass',
    mathsRequired: 'Either',
    apsMin: 26,
    pathway: 'NSC → Bachelor of Education (NQF 7) — 4-year degree. Subject specialisation required.',
    subjects: [
      { subject: 'English',             requirement: 'required' },
      { subject: 'Life Orientation',    requirement: 'required' },
      { subject: 'Mathematics',         requirement: 'recommended', note: 'Required if teaching Maths' },
      { subject: 'Languages (HL/FAL)', requirement: 'recommended' },
      { subject: 'Social Sciences',     requirement: 'advantage' },
      { subject: 'Natural Sciences',    requirement: 'advantage' },
    ],
  },
  {
    careerId: 'civil-engineer',
    careerTitle: 'Civil Engineer',
    field: 'Engineering',
    minMatric: 'NSC with Bachelor pass',
    mathsRequired: 'Mathematics',
    apsMin: 34,
    pathway: 'NSC → BEng Civil Engineering (NQF 8) — 4-year degree. ECSA registration after 3 years experience.',
    subjects: [
      { subject: 'Mathematics',        requirement: 'required',     note: 'Pure Maths, minimum 60% recommended' },
      { subject: 'Physical Sciences',  requirement: 'required',     note: 'Minimum 50% required' },
      { subject: 'English',            requirement: 'required' },
      { subject: 'Technology',         requirement: 'recommended' },
      { subject: 'Geography',          requirement: 'recommended' },
      { subject: 'Life Sciences',      requirement: 'advantage' },
    ],
  },
  {
    careerId: 'graphic-designer',
    careerTitle: 'Graphic Designer',
    field: 'Arts',
    minMatric: 'NSC with Diploma or Bachelor pass',
    mathsRequired: 'Either',
    apsMin: 22,
    pathway: 'NSC → Diploma in Graphic Design (NQF 6–7). Portfolio required for most institutions.',
    subjects: [
      { subject: 'Visual Arts',         requirement: 'required' },
      { subject: 'English',             requirement: 'required' },
      { subject: 'Information Technology', requirement: 'recommended' },
      { subject: 'Design',              requirement: 'recommended' },
      { subject: 'Mathematics',         requirement: 'advantage' },
      { subject: 'Mathematical Literacy', requirement: 'advantage' },
    ],
  },
  {
    careerId: 'lawyer',
    careerTitle: 'Lawyer',
    field: 'Law',
    minMatric: 'NSC with Bachelor pass',
    mathsRequired: 'Either',
    apsMin: 30,
    pathway: 'NSC → LLB (NQF 8) — 4-year degree. Candidate attorney articles (2 years) before admission.',
    subjects: [
      { subject: 'English',             requirement: 'required',     note: 'High proficiency essential' },
      { subject: 'Life Orientation',    requirement: 'required' },
      { subject: 'History',             requirement: 'recommended' },
      { subject: 'Social Sciences',     requirement: 'recommended' },
      { subject: 'Mathematics',         requirement: 'advantage' },
      { subject: 'Languages (HL/FAL)', requirement: 'advantage' },
    ],
  },
  {
    careerId: 'agricultural-scientist',
    careerTitle: 'Agricultural Scientist',
    field: 'Agriculture',
    minMatric: 'NSC with Bachelor or Diploma pass',
    mathsRequired: 'Mathematics',
    apsMin: 26,
    pathway: 'NSC → Diploma/Degree in Agricultural Sciences (NQF 6–8). Field work and research roles available.',
    subjects: [
      { subject: 'Agricultural Sciences', requirement: 'required' },
      { subject: 'Life Sciences',         requirement: 'required' },
      { subject: 'Mathematics',           requirement: 'required' },
      { subject: 'Physical Sciences',     requirement: 'recommended' },
      { subject: 'Geography',             requirement: 'recommended' },
      { subject: 'English',               requirement: 'required' },
    ],
  },
  {
    careerId: 'nurse',
    careerTitle: 'Nurse',
    field: 'Health',
    minMatric: 'NSC with Diploma or Bachelor pass',
    mathsRequired: 'Mathematics',
    apsMin: 25,
    pathway: 'NSC → Diploma/Degree in Nursing (NQF 6–7). SANC registration required after qualification.',
    subjects: [
      { subject: 'Mathematics',        requirement: 'required',     note: 'Pure Maths preferred; some programmes accept Maths Literacy' },
      { subject: 'Life Sciences',      requirement: 'required' },
      { subject: 'English',            requirement: 'required' },
      { subject: 'Physical Sciences',  requirement: 'recommended' },
      { subject: 'Mathematical Literacy', requirement: 'advantage', note: 'Accepted at some nursing colleges' },
    ],
  },
];

// All unique NSC subjects used across profiles
export const ALL_SUBJECTS = [
  'Mathematics',
  'Mathematical Literacy',
  'English',
  'Life Sciences',
  'Physical Sciences',
  'Information Technology',
  'Accounting',
  'Business Studies',
  'Economics',
  'History',
  'Geography',
  'Visual Arts',
  'Design',
  'Agricultural Sciences',
  'Social Sciences',
  'Natural Sciences',
  'Technology',
  'Life Orientation',
  'Languages (HL/FAL)',
] as const;

export type SubjectName = (typeof ALL_SUBJECTS)[number];

// Given a list of subjects the learner has, return matching career profiles ranked by fit
export function matchCareersBySubjects(selectedSubjects: string[]): Array<{ profile: CareerSubjectProfile; matchScore: number; missingRequired: string[] }> {
  return CAREER_SUBJECT_PROFILES.map((profile) => {
    const required = profile.subjects.filter((s) => s.requirement === 'required').map((s) => s.subject);
    const recommended = profile.subjects.filter((s) => s.requirement === 'recommended').map((s) => s.subject);

    const metRequired = required.filter((s) => selectedSubjects.includes(s)).length;
    const metRecommended = recommended.filter((s) => selectedSubjects.includes(s)).length;
    const missingRequired = required.filter((s) => !selectedSubjects.includes(s));

    // Score: each required met = 3pts, each recommended met = 1pt, normalised to 100
    const maxScore = required.length * 3 + recommended.length;
    const rawScore = metRequired * 3 + metRecommended;
    const matchScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

    return { profile, matchScore, missingRequired };
  })
    .sort((a, b) => b.matchScore - a.matchScore);
}
