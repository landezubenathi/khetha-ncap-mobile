// NCAP-aligned Career Choice and Job Fit questionnaire data

export type AnswerScale = 'agreement' | 'frequency' | 'preference';

export type Question = {
  key: string;
  text: string;
  hint?: string;           // short "why we ask this" note shown below the question
  scale: AnswerScale;
  section: string;
};

export type QuizMeta = {
  title: string;
  subtitle: string;
  description: string;
  duration: string;        // e.g. "5–7 minutes"
  icon: string;
  color: string;
  sections: string[];
};

// Answer labels per scale type
export const SCALE_LABELS: Record<AnswerScale, string[]> = {
  agreement:  ['Strongly disagree', 'Disagree', 'Agree', 'Strongly agree'],
  frequency:  ['Never', 'Sometimes', 'Often', 'Always'],
  preference: ['Not at all', 'A little', 'Quite a bit', 'Very much'],
};

// ── CAREER CHOICE ──────────────────────────────────────────────────────────────
// Modelled on Holland's RIASEC interest theory (Realistic, Investigative,
// Artistic, Social, Enterprising, Conventional) — the same framework NCAP uses.
// Sections map to RIASEC clusters so results can show an interest profile.

export const CAREER_QUESTIONS: Question[] = [
  // Realistic — hands-on, practical, physical
  {
    key: 'cc_realistic_1', section: 'Practical & Hands-On',
    text: 'I enjoy building, fixing or making things with my hands.',
    hint: 'Measures interest in practical, physical work.',
    scale: 'agreement',
  },
  {
    key: 'cc_realistic_2', section: 'Practical & Hands-On',
    text: 'I prefer working with tools, machines or physical materials.',
    hint: 'Relates to technical and trade careers.',
    scale: 'agreement',
  },
  // Investigative — analytical, scientific, research
  {
    key: 'cc_investigative_1', section: 'Analytical & Research',
    text: 'I enjoy solving complex problems by gathering and analysing information.',
    hint: 'Measures curiosity and analytical thinking.',
    scale: 'agreement',
  },
  {
    key: 'cc_investigative_2', section: 'Analytical & Research',
    text: 'I like understanding how and why things work the way they do.',
    hint: 'Relates to science, research and technology careers.',
    scale: 'agreement',
  },
  // Artistic — creative, expressive, original
  {
    key: 'cc_artistic_1', section: 'Creative & Expressive',
    text: 'I enjoy expressing myself through art, music, writing or design.',
    hint: 'Measures creative and expressive interests.',
    scale: 'agreement',
  },
  {
    key: 'cc_artistic_2', section: 'Creative & Expressive',
    text: 'I prefer work that allows me to use my imagination and original ideas.',
    hint: 'Relates to design, media and arts careers.',
    scale: 'agreement',
  },
  // Social — helping, teaching, caring
  {
    key: 'cc_social_1', section: 'People & Helping',
    text: 'I find it rewarding to help others learn, grow or overcome challenges.',
    hint: 'Measures interest in people-centred work.',
    scale: 'agreement',
  },
  {
    key: 'cc_social_2', section: 'People & Helping',
    text: 'I am drawn to careers that make a positive difference in people\'s lives.',
    hint: 'Relates to education, health and social service careers.',
    scale: 'agreement',
  },
  // Enterprising — leadership, persuasion, business
  {
    key: 'cc_enterprising_1', section: 'Leadership & Business',
    text: 'I enjoy taking charge of projects and motivating others to achieve goals.',
    hint: 'Measures leadership and entrepreneurial drive.',
    scale: 'agreement',
  },
  {
    key: 'cc_enterprising_2', section: 'Leadership & Business',
    text: 'I am interested in business, sales, management or starting my own venture.',
    hint: 'Relates to business, law and management careers.',
    scale: 'agreement',
  },
  // Conventional — organised, detail, data
  {
    key: 'cc_conventional_1', section: 'Detail & Organisation',
    text: 'I enjoy working with data, records, numbers or structured systems.',
    hint: 'Measures preference for organised, detail-oriented work.',
    scale: 'agreement',
  },
  {
    key: 'cc_conventional_2', section: 'Detail & Organisation',
    text: 'I prefer clear rules and procedures over open-ended, unstructured tasks.',
    hint: 'Relates to accounting, administration and finance careers.',
    scale: 'agreement',
  },
];

// ── JOB FIT ────────────────────────────────────────────────────────────────────
// Modelled on work-style and personality dimensions used in NCAP's Job Fit tool:
// adaptability, collaboration, learning orientation, structure preference,
// innovation, pace, autonomy, and execution focus.

export const JOB_FIT_QUESTIONS: Question[] = [
  // Adaptability
  {
    key: 'jf_adaptability_1', section: 'Adaptability',
    text: 'When unexpected changes happen at work or school, I adjust quickly.',
    hint: 'Measures how well you handle change and uncertainty.',
    scale: 'frequency',
  },
  {
    key: 'jf_adaptability_2', section: 'Adaptability',
    text: 'I stay calm and productive even when things do not go according to plan.',
    hint: 'Relates to resilience under pressure.',
    scale: 'frequency',
  },
  // Collaboration
  {
    key: 'jf_collaboration_1', section: 'Teamwork',
    text: 'I do my best work when I am part of a team working toward a shared goal.',
    hint: 'Measures preference for collaborative environments.',
    scale: 'agreement',
  },
  {
    key: 'jf_collaboration_2', section: 'Teamwork',
    text: 'I actively listen to others\' ideas and build on them rather than dismissing them.',
    hint: 'Relates to communication and team dynamics.',
    scale: 'frequency',
  },
  // Learning orientation
  {
    key: 'jf_learning_1', section: 'Learning & Curiosity',
    text: 'I regularly seek out new knowledge or skills, even outside of school or work.',
    hint: 'Measures self-directed learning drive.',
    scale: 'frequency',
  },
  {
    key: 'jf_learning_2', section: 'Learning & Curiosity',
    text: 'I enjoy careers or roles where I am constantly learning something new.',
    hint: 'Relates to growth-oriented work environments.',
    scale: 'preference',
  },
  // Structure preference
  {
    key: 'jf_structure_1', section: 'Structure & Routine',
    text: 'I prefer having a clear daily routine and knowing exactly what is expected of me.',
    hint: 'Measures preference for structured vs. flexible environments.',
    scale: 'agreement',
  },
  {
    key: 'jf_structure_2', section: 'Structure & Routine',
    text: 'I find it easier to focus when tasks are well-defined with clear deadlines.',
    hint: 'Relates to how you manage your workload.',
    scale: 'agreement',
  },
  // Innovation
  {
    key: 'jf_innovation_1', section: 'Creativity & Ideas',
    text: 'I often come up with new ways to solve problems that others have not considered.',
    hint: 'Measures creative problem-solving tendency.',
    scale: 'frequency',
  },
  {
    key: 'jf_innovation_2', section: 'Creativity & Ideas',
    text: 'I enjoy brainstorming and exploring ideas, even if they do not always work out.',
    hint: 'Relates to innovation-driven roles.',
    scale: 'preference',
  },
  // Pace
  {
    key: 'jf_pace_1', section: 'Work Pace',
    text: 'I thrive in fast-paced environments where priorities can shift quickly.',
    hint: 'Measures comfort with high-energy, dynamic workplaces.',
    scale: 'agreement',
  },
  {
    key: 'jf_pace_2', section: 'Work Pace',
    text: 'I prefer taking time to think things through carefully rather than acting fast.',
    hint: 'Relates to deliberate, methodical work styles.',
    scale: 'agreement',
  },
  // Autonomy
  {
    key: 'jf_autonomy_1', section: 'Independence',
    text: 'I am most productive when I can manage my own time and work independently.',
    hint: 'Measures preference for autonomous vs. supervised work.',
    scale: 'agreement',
  },
  {
    key: 'jf_autonomy_2', section: 'Independence',
    text: 'I feel confident making decisions on my own without needing frequent guidance.',
    hint: 'Relates to self-directed roles and entrepreneurship.',
    scale: 'frequency',
  },
  // Execution
  {
    key: 'jf_execution_1', section: 'Execution & Delivery',
    text: 'I take pride in completing tasks thoroughly and on time.',
    hint: 'Measures conscientiousness and delivery focus.',
    scale: 'frequency',
  },
  {
    key: 'jf_execution_2', section: 'Execution & Delivery',
    text: 'I prefer implementing well-thought-out plans over constantly generating new ideas.',
    hint: 'Relates to execution-focused vs. ideation-focused roles.',
    scale: 'agreement',
  },
];

export const QUIZ_META: Record<string, QuizMeta> = {
  career: {
    title: 'Career Choice',
    subtitle: 'Discover your interest profile',
    description: 'This questionnaire maps your interests across six career clusters — practical, analytical, creative, people-focused, leadership and detail-oriented. Your results will suggest careers that align with who you are.',
    duration: '5–7 minutes',
    icon: '🎯',
    color: '#1677FF',
    sections: ['Practical & Hands-On', 'Analytical & Research', 'Creative & Expressive', 'People & Helping', 'Leadership & Business', 'Detail & Organisation'],
  },
  'job-fit': {
    title: 'Job Fit',
    subtitle: 'Understand your work style',
    description: 'This questionnaire explores how you prefer to work — your pace, independence, creativity, teamwork style and adaptability. Your results will show which work environments and career types suit you best.',
    duration: '6–8 minutes',
    icon: '🧩',
    color: '#F4B740',
    sections: ['Adaptability', 'Teamwork', 'Learning & Curiosity', 'Structure & Routine', 'Creativity & Ideas', 'Work Pace', 'Independence', 'Execution & Delivery'],
  },
};

// RIASEC cluster → career affinity (Career Choice)
export const CC_AFFINITY: Record<string, Array<[string, number]>> = {
  cc_realistic_1:      [['civil-engineer', 3], ['agricultural-scientist', 3], ['nurse', 1]],
  cc_realistic_2:      [['civil-engineer', 3], ['agricultural-scientist', 2]],
  cc_investigative_1:  [['health-scientist', 3], ['software-developer', 2], ['lawyer', 2]],
  cc_investigative_2:  [['health-scientist', 3], ['software-developer', 3], ['agricultural-scientist', 2]],
  cc_artistic_1:       [['graphic-designer', 3], ['teacher', 1]],
  cc_artistic_2:       [['graphic-designer', 3], ['software-developer', 1]],
  cc_social_1:         [['teacher', 3], ['social-worker', 3], ['nurse', 2]],
  cc_social_2:         [['social-worker', 3], ['nurse', 3], ['teacher', 2]],
  cc_enterprising_1:   [['lawyer', 2], ['teacher', 2], ['civil-engineer', 1]],
  cc_enterprising_2:   [['accountant', 2], ['lawyer', 3]],
  cc_conventional_1:   [['accountant', 3], ['health-scientist', 2], ['lawyer', 1]],
  cc_conventional_2:   [['accountant', 3], ['civil-engineer', 1]],
};

// Work-style dimension → career affinity (Job Fit)
export const JF_AFFINITY: Record<string, Array<[string, number]>> = {
  jf_adaptability_1:  [['nurse', 2], ['social-worker', 2], ['software-developer', 1]],
  jf_adaptability_2:  [['nurse', 2], ['social-worker', 2], ['lawyer', 1]],
  jf_collaboration_1: [['teacher', 2], ['social-worker', 2], ['civil-engineer', 1]],
  jf_collaboration_2: [['teacher', 2], ['social-worker', 2]],
  jf_learning_1:      [['health-scientist', 2], ['software-developer', 2], ['agricultural-scientist', 1]],
  jf_learning_2:      [['health-scientist', 2], ['software-developer', 2]],
  jf_structure_1:     [['accountant', 3], ['lawyer', 2], ['civil-engineer', 1]],
  jf_structure_2:     [['accountant', 3], ['civil-engineer', 2]],
  jf_innovation_1:    [['software-developer', 3], ['graphic-designer', 2]],
  jf_innovation_2:    [['graphic-designer', 3], ['software-developer', 2]],
  jf_pace_1:          [['software-developer', 1], ['lawyer', 2], ['nurse', 1]],
  jf_pace_2:          [['health-scientist', 2], ['accountant', 1]],
  jf_autonomy_1:      [['graphic-designer', 2], ['agricultural-scientist', 2], ['software-developer', 1]],
  jf_autonomy_2:      [['graphic-designer', 2], ['agricultural-scientist', 1]],
  jf_execution_1:     [['civil-engineer', 2], ['nurse', 2], ['accountant', 2]],
  jf_execution_2:     [['civil-engineer', 2], ['accountant', 2], ['nurse', 1]],
};

// Human-readable section summaries shown on results page
export const SECTION_SUMMARIES: Record<string, Record<number, string>> = {
  // Career Choice sections (avg score 0–3 → 0=low, 1=some, 2=moderate, 3=high)
  'Practical & Hands-On':    { 0: 'You prefer desk-based or people work over physical tasks.', 2: 'You have some interest in hands-on work.', 3: 'You are strongly drawn to practical, physical work.' },
  'Analytical & Research':   { 0: 'You prefer action over deep analysis.', 2: 'You enjoy some research and problem-solving.', 3: 'You have a strong analytical and investigative mind.' },
  'Creative & Expressive':   { 0: 'You prefer structured work over open-ended creativity.', 2: 'You have a creative streak worth exploring.', 3: 'Creativity and self-expression are central to who you are.' },
  'People & Helping':        { 0: 'You prefer working with systems or data over people.', 2: 'You care about people and enjoy helping when needed.', 3: 'Helping and supporting others is your core motivation.' },
  'Leadership & Business':   { 0: 'You prefer contributing as part of a team over leading.', 2: 'You have leadership potential worth developing.', 3: 'You are driven to lead, influence and build things.' },
  'Detail & Organisation':   { 0: 'You prefer big-picture thinking over detailed tasks.', 2: 'You can handle detail when needed.', 3: 'You thrive in structured, detail-oriented environments.' },
  // Job Fit sections
  'Adaptability':            { 0: 'You prefer stable, predictable environments.', 2: 'You manage change reasonably well.', 3: 'You are highly adaptable and resilient under pressure.' },
  'Teamwork':                { 0: 'You work best independently.', 2: 'You can collaborate but also value solo work.', 3: 'You are a natural team player and collaborator.' },
  'Learning & Curiosity':    { 0: 'You prefer mastering a set skill over constant learning.', 2: 'You enjoy learning when it is relevant.', 3: 'You are a self-driven, lifelong learner.' },
  'Structure & Routine':     { 0: 'You prefer flexibility and variety over routine.', 2: 'You appreciate some structure but stay flexible.', 3: 'You perform best with clear structure and defined expectations.' },
  'Creativity & Ideas':      { 0: 'You prefer implementing proven solutions over inventing new ones.', 2: 'You bring creative thinking when the situation calls for it.', 3: 'You are an ideas person who thrives on innovation.' },
  'Work Pace':               { 0: 'You prefer a steady, deliberate pace.', 2: 'You can adapt your pace to the situation.', 3: 'You thrive in fast-moving, high-energy environments.' },
  'Independence':            { 0: 'You prefer guidance and collaboration over working alone.', 2: 'You balance independence and teamwork well.', 3: 'You are highly self-directed and autonomous.' },
  'Execution & Delivery':    { 0: 'You focus more on ideas than on follow-through.', 2: 'You deliver reliably when motivated.', 3: 'You are a strong executor who takes pride in completing work.' },
};
