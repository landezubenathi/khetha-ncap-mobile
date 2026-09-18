export type Career = {
  id: string; slug: string; title: string; description: string;
  skills: string[]; subjects: string[]; education_path: string;
  salary_range: string; field: string;
  outlook: 'High demand' | 'Growing' | 'Stable' | 'Competitive';
  work_environment: string;
  related_careers: string[];
};

export type Qualification = {
  id: string; title: string; description: string; nqf_level: string;
  duration: string; field: string; provider_id: string; provider_name: string;
  entry_requirements: string;
  career_outcomes: string[];
  application_url: string;
};

export type Provider = {
  id: string; name: string; provider_type: string; province: string;
  city: string; address: string; website: string; phone: string;
  latitude: number; longitude: number;
  qualifications_count: number;
  distance_learning: boolean;
};

export type Adviser = {
  id: string; name: string; role: string; province: string;
  city: string; phone: string; email: string;
  languages: string[];       // languages the adviser speaks
  availability: string;      // e.g. 'Mon–Fri 08:00–16:00'
  walk_in: boolean;          // accepts walk-in appointments
  specialisation: string;    // e.g. 'TVET & artisan pathways'
};

export type KhethaEvent = {
  id: string; title: string; description: string;
  date: string;              // ISO date string
  time: string;              // e.g. '09:00–13:00'
  venue: string;
  province: string;
  type: 'Career Expo' | 'Workshop' | 'Open Day' | 'Webinar';
  registration_url: string;
};

export type WalkInCentre = {
  id: string; name: string; province: string;
  address: string; phone: string;
  hours: string;
  latitude: number; longitude: number;
};

export const CAREERS: Career[] = [
  {
    id: 'health-scientist', slug: 'health-scientist', title: 'Health Scientist',
    description: 'Research and improve health outcomes for communities. Work in laboratories, hospitals or public health organisations to diagnose disease, develop treatments and protect population health.',
    skills: ['Research', 'Communication', 'Analysis', 'Critical thinking'],
    subjects: ['Mathematics', 'Life Sciences', 'Physical Sciences'],
    education_path: 'Diploma or degree (NQF 6–8)', salary_range: 'R180 000 – R650 000 p/a',
    field: 'Health', outlook: 'High demand',
    work_environment: 'Laboratories, hospitals, research institutions, public health departments',
    related_careers: ['nurse', 'agricultural-scientist'],
  },
  {
    id: 'software-developer', slug: 'software-developer', title: 'Software Developer',
    description: 'Design and build digital products that solve real problems. Write code for mobile apps, websites, enterprise systems and everything in between.',
    skills: ['Logic', 'Creativity', 'Problem solving', 'Collaboration'],
    subjects: ['Mathematics', 'Information Technology', 'Physical Sciences'],
    education_path: 'Diploma, degree or learnership (NQF 5–7)', salary_range: 'R200 000 – R900 000 p/a',
    field: 'Technology', outlook: 'High demand',
    work_environment: 'Tech companies, startups, banks, government, remote work',
    related_careers: ['data-analyst', 'graphic-designer'],
  },
  {
    id: 'social-worker', slug: 'social-worker', title: 'Social Worker',
    description: 'Support individuals, families and communities to overcome challenges and improve their wellbeing. Work in government, NGOs, schools and hospitals.',
    skills: ['Empathy', 'Communication', 'Problem solving', 'Resilience'],
    subjects: ['Life Orientation', 'Languages', 'Social Sciences'],
    education_path: 'Bachelor of Social Work (NQF 7)', salary_range: 'R120 000 – R380 000 p/a',
    field: 'Social Sciences', outlook: 'High demand',
    work_environment: 'Government departments, NGOs, schools, hospitals, community centres',
    related_careers: ['teacher', 'nurse'],
  },
  {
    id: 'accountant', slug: 'accountant', title: 'Accountant',
    description: 'Manage financial records, prepare reports and ensure organisations comply with tax and financial regulations. Work in every sector of the economy.',
    skills: ['Numeracy', 'Attention to detail', 'Integrity', 'Analysis'],
    subjects: ['Mathematics', 'Accounting', 'Business Studies'],
    education_path: 'Diploma or degree + articles (NQF 6–8)', salary_range: 'R180 000 – R700 000 p/a',
    field: 'Business', outlook: 'Stable',
    work_environment: 'Accounting firms, corporates, government, NGOs',
    related_careers: ['financial-advisor', 'lawyer'],
  },
  {
    id: 'teacher', slug: 'teacher', title: 'Teacher',
    description: 'Educate and inspire learners from foundation phase through to matric. Shape the next generation and make a lasting impact on your community.',
    skills: ['Communication', 'Patience', 'Planning', 'Leadership'],
    subjects: ['Languages', 'Mathematics', 'Life Orientation'],
    education_path: 'Bachelor of Education (NQF 7)', salary_range: 'R180 000 – R420 000 p/a',
    field: 'Education', outlook: 'High demand',
    work_environment: 'Public and private schools, early childhood centres, TVET colleges',
    related_careers: ['social-worker', 'educational-psychologist'],
  },
  {
    id: 'civil-engineer', slug: 'civil-engineer', title: 'Civil Engineer',
    description: 'Design and oversee construction of roads, bridges, water systems and buildings. Solve infrastructure challenges that affect millions of people.',
    skills: ['Mathematics', 'Problem solving', 'Project management', 'Technical drawing'],
    subjects: ['Mathematics', 'Physical Sciences', 'Technology'],
    education_path: 'Bachelor of Engineering (NQF 8)', salary_range: 'R300 000 – R900 000 p/a',
    field: 'Engineering', outlook: 'Growing',
    work_environment: 'Construction sites, government infrastructure, consulting firms',
    related_careers: ['architect', 'quantity-surveyor'],
  },
  {
    id: 'graphic-designer', slug: 'graphic-designer', title: 'Graphic Designer',
    description: 'Create visual content for brands, media and digital platforms. Combine creativity and technology to communicate ideas through images and typography.',
    skills: ['Creativity', 'Visual thinking', 'Software proficiency', 'Communication'],
    subjects: ['Visual Arts', 'Information Technology', 'Languages'],
    education_path: 'Diploma or degree (NQF 6–7)', salary_range: 'R120 000 – R450 000 p/a',
    field: 'Arts', outlook: 'Competitive',
    work_environment: 'Design agencies, media houses, in-house brand teams, freelance',
    related_careers: ['software-developer', 'multimedia-producer'],
  },
  {
    id: 'lawyer', slug: 'lawyer', title: 'Lawyer',
    description: 'Advise clients on legal matters, represent them in court and draft legal documents. Specialise in criminal law, human rights, corporate or family law.',
    skills: ['Analytical thinking', 'Persuasion', 'Research', 'Ethics'],
    subjects: ['Languages', 'History', 'Life Orientation', 'Mathematics'],
    education_path: 'LLB degree + articles (NQF 8)', salary_range: 'R250 000 – R1 200 000 p/a',
    field: 'Law', outlook: 'Competitive',
    work_environment: 'Law firms, courts, government legal departments, NGOs',
    related_careers: ['accountant', 'social-worker'],
  },
  {
    id: 'agricultural-scientist', slug: 'agricultural-scientist', title: 'Agricultural Scientist',
    description: 'Research and develop methods to improve crop yields, livestock health and sustainable farming. Critical for food security across South Africa.',
    skills: ['Research', 'Field work', 'Analysis', 'Environmental awareness'],
    subjects: ['Life Sciences', 'Mathematics', 'Physical Sciences', 'Agricultural Sciences'],
    education_path: 'Diploma or degree (NQF 6–8)', salary_range: 'R150 000 – R500 000 p/a',
    field: 'Agriculture', outlook: 'Growing',
    work_environment: 'Farms, research stations, government agriculture departments, NGOs',
    related_careers: ['health-scientist', 'environmental-scientist'],
  },
  {
    id: 'nurse', slug: 'nurse', title: 'Nurse',
    description: 'Provide direct patient care in hospitals, clinics and communities. One of the most in-demand professions in South Africa with opportunities across all provinces.',
    skills: ['Empathy', 'Clinical skills', 'Communication', 'Resilience'],
    subjects: ['Life Sciences', 'Mathematics', 'Physical Sciences'],
    education_path: 'Diploma or degree in Nursing (NQF 6–7)', salary_range: 'R150 000 – R480 000 p/a',
    field: 'Health', outlook: 'High demand',
    work_environment: 'Public and private hospitals, clinics, community health centres',
    related_careers: ['health-scientist', 'social-worker'],
  },
  {
    id: 'data-analyst', slug: 'data-analyst', title: 'Data Analyst',
    description: 'Collect, process and interpret data to help organisations make better decisions. Work across finance, health, retail and government sectors.',
    skills: ['Statistics', 'Critical thinking', 'Data visualisation', 'Communication'],
    subjects: ['Mathematics', 'Information Technology', 'Business Studies'],
    education_path: 'Diploma or degree in Statistics/Data Science (NQF 6–8)', salary_range: 'R220 000 – R750 000 p/a',
    field: 'Technology', outlook: 'High demand',
    work_environment: 'Banks, tech companies, government, consulting firms, remote work',
    related_careers: ['software-developer', 'accountant'],
  },
  {
    id: 'paramedic', slug: 'paramedic', title: 'Paramedic',
    description: 'Respond to medical emergencies and provide pre-hospital care. Work in ambulance services, disaster management and event medical support.',
    skills: ['Emergency response', 'Clinical skills', 'Decision making', 'Physical fitness'],
    subjects: ['Life Sciences', 'Mathematics', 'Physical Sciences'],
    education_path: 'Diploma in Emergency Medical Care (NQF 6)', salary_range: 'R130 000 – R380 000 p/a',
    field: 'Health', outlook: 'High demand',
    work_environment: 'Ambulance services, hospitals, disaster management, events',
    related_careers: ['nurse', 'health-scientist'],
  },
  {
    id: 'electrician', slug: 'electrician', title: 'Electrician',
    description: 'Install, maintain and repair electrical systems in homes, businesses and industrial facilities. A critical trade with strong demand across South Africa.',
    skills: ['Technical skills', 'Problem solving', 'Safety awareness', 'Attention to detail'],
    subjects: ['Mathematics', 'Physical Sciences', 'Technology'],
    education_path: 'Trade test + apprenticeship (NQF 4–5)', salary_range: 'R120 000 – R480 000 p/a',
    field: 'Engineering', outlook: 'High demand',
    work_environment: 'Construction sites, factories, municipalities, self-employment',
    related_careers: ['civil-engineer', 'mechanical-technician'],
  },
  {
    id: 'financial-advisor', slug: 'financial-advisor', title: 'Financial Advisor',
    description: 'Help individuals and businesses plan their finances, investments and retirement. Requires FSCA licensing and strong interpersonal skills.',
    skills: ['Financial planning', 'Communication', 'Analysis', 'Ethics'],
    subjects: ['Mathematics', 'Accounting', 'Business Studies', 'Economics'],
    education_path: 'Diploma or degree + FSCA licence (NQF 6–7)', salary_range: 'R180 000 – R800 000 p/a',
    field: 'Business', outlook: 'Growing',
    work_environment: 'Banks, insurance companies, independent practices',
    related_careers: ['accountant', 'lawyer'],
  },
  {
    id: 'early-childhood-practitioner', slug: 'early-childhood-practitioner', title: 'Early Childhood Practitioner',
    description: 'Support the development of children from birth to age 6. Work in crèches, ECD centres and foundation phase classrooms across South Africa.',
    skills: ['Patience', 'Communication', 'Creativity', 'Child development knowledge'],
    subjects: ['Life Orientation', 'Languages', 'Social Sciences'],
    education_path: 'Certificate or Diploma in ECD (NQF 4–6)', salary_range: 'R60 000 – R200 000 p/a',
    field: 'Education', outlook: 'High demand',
    work_environment: 'ECD centres, crèches, foundation phase schools, NGOs',
    related_careers: ['teacher', 'social-worker'],
  },
];

export const QUALIFICATIONS: Qualification[] = [
  {
    id: 'q1', title: 'Bachelor of Health Sciences',
    description: 'A comprehensive degree covering biomedical sciences, public health and clinical practice.',
    nqf_level: '7', duration: '3 years', field: 'Health',
    provider_id: 'p1', provider_name: 'University of Pretoria',
    entry_requirements: 'NSC Bachelor pass, Mathematics 50%, Life Sciences 50%, APS 30+',
    career_outcomes: ['Health Scientist', 'Public Health Officer', 'Laboratory Technician'],
    application_url: 'https://www.up.ac.za/apply',
  },
  {
    id: 'q2', title: 'Diploma in Information Technology',
    description: 'Practical training in software development, networking and systems administration.',
    nqf_level: '6', duration: '3 years', field: 'Technology',
    provider_id: 'p2', provider_name: 'UNISA',
    entry_requirements: 'NSC Diploma pass, Mathematics 40%, English 40%',
    career_outcomes: ['Software Developer', 'Network Administrator', 'IT Support Specialist'],
    application_url: 'https://www.unisa.ac.za/apply',
  },
  {
    id: 'q3', title: 'Bachelor of Social Work',
    description: 'Prepares graduates to work with individuals, families and communities in diverse social contexts.',
    nqf_level: '7', duration: '4 years', field: 'Social Sciences',
    provider_id: 'p3', provider_name: 'University of the Witwatersrand',
    entry_requirements: 'NSC Bachelor pass, English 50%, APS 26+',
    career_outcomes: ['Social Worker', 'Community Development Officer', 'Child Protection Officer'],
    application_url: 'https://www.wits.ac.za/apply',
  },
  {
    id: 'q4', title: 'National Diploma: Accounting',
    description: 'Covers financial accounting, management accounting, taxation and auditing.',
    nqf_level: '6', duration: '3 years', field: 'Business',
    provider_id: 'p4', provider_name: 'Tshwane University of Technology',
    entry_requirements: 'NSC Diploma pass, Mathematics 40%, Accounting 40%',
    career_outcomes: ['Accountant', 'Bookkeeper', 'Tax Consultant'],
    application_url: 'https://www.tut.ac.za/apply',
  },
  {
    id: 'q5', title: 'Bachelor of Education (Foundation Phase)',
    description: 'Trains teachers to educate learners in Grades R–3 across all learning areas.',
    nqf_level: '7', duration: '4 years', field: 'Education',
    provider_id: 'p1', provider_name: 'University of Pretoria',
    entry_requirements: 'NSC Bachelor pass, English 50%, APS 26+',
    career_outcomes: ['Foundation Phase Teacher', 'ECD Specialist', 'Curriculum Developer'],
    application_url: 'https://www.up.ac.za/apply',
  },
  {
    id: 'q6', title: 'Bachelor of Engineering (Civil)',
    description: 'Covers structural, geotechnical, hydraulic and transportation engineering.',
    nqf_level: '8', duration: '4 years', field: 'Engineering',
    provider_id: 'p3', provider_name: 'University of the Witwatersrand',
    entry_requirements: 'NSC Bachelor pass, Mathematics 70%, Physical Sciences 60%, APS 34+',
    career_outcomes: ['Civil Engineer', 'Structural Engineer', 'Project Manager'],
    application_url: 'https://www.wits.ac.za/apply',
  },
  {
    id: 'q7', title: 'Diploma in Graphic Design',
    description: 'Studio-based training in visual communication, typography, branding and digital media.',
    nqf_level: '6', duration: '3 years', field: 'Arts',
    provider_id: 'p5', provider_name: 'Cape Peninsula University of Technology',
    entry_requirements: 'NSC Diploma pass, Visual Arts 50%, portfolio submission required',
    career_outcomes: ['Graphic Designer', 'Brand Designer', 'Digital Media Producer'],
    application_url: 'https://www.cput.ac.za/apply',
  },
  {
    id: 'q8', title: 'Diploma in Nursing',
    description: 'Clinical and theoretical training for professional nurses across all healthcare settings.',
    nqf_level: '6', duration: '3 years', field: 'Health',
    provider_id: 'p6', provider_name: 'Durban University of Technology',
    entry_requirements: 'NSC Diploma pass, Mathematics 40%, Life Sciences 50%, APS 25+',
    career_outcomes: ['Registered Nurse', 'Community Health Nurse', 'Clinic Sister'],
    application_url: 'https://www.dut.ac.za/apply',
  },
  {
    id: 'q9', title: 'Higher Certificate in Early Childhood Development',
    description: 'Equips practitioners with skills to support children aged 0–6 in ECD centres and schools.',
    nqf_level: '5', duration: '1 year', field: 'Education',
    provider_id: 'p2', provider_name: 'UNISA',
    entry_requirements: 'NSC or equivalent, English 40%',
    career_outcomes: ['ECD Practitioner', 'Crèche Owner', 'Foundation Phase Assistant'],
    application_url: 'https://www.unisa.ac.za/apply',
  },
  {
    id: 'q10', title: 'National Certificate: Electrical Engineering (Trade)',
    description: 'Prepares learners for the electrician trade test through theory and practical training.',
    nqf_level: '4', duration: '3–4 years (apprenticeship)', field: 'Engineering',
    provider_id: 'p7', provider_name: 'Ekurhuleni East TVET College',
    entry_requirements: 'Grade 10 or NSC, Mathematics 40%, Physical Sciences 30%',
    career_outcomes: ['Electrician', 'Electrical Technician', 'Maintenance Artisan'],
    application_url: 'https://www.eec.edu.za',
  },
  {
    id: 'q11', title: 'Diploma in Agricultural Management',
    description: 'Covers crop production, livestock management, agribusiness and sustainable farming practices.',
    nqf_level: '6', duration: '3 years', field: 'Agriculture',
    provider_id: 'p8', provider_name: 'University of Limpopo',
    entry_requirements: 'NSC Diploma pass, Mathematics 40%, Agricultural Sciences or Life Sciences 40%',
    career_outcomes: ['Agricultural Scientist', 'Farm Manager', 'Agribusiness Consultant'],
    application_url: 'https://www.ul.ac.za/apply',
  },
  {
    id: 'q12', title: 'Bachelor of Laws (LLB)',
    description: 'The professional law degree required to practise as an attorney or advocate in South Africa.',
    nqf_level: '8', duration: '4 years', field: 'Law',
    provider_id: 'p3', provider_name: 'University of the Witwatersrand',
    entry_requirements: 'NSC Bachelor pass, English 60%, APS 30+',
    career_outcomes: ['Attorney', 'Advocate', 'Legal Advisor', 'Magistrate'],
    application_url: 'https://www.wits.ac.za/apply',
  },
  {
    id: 'q13', title: 'Diploma in Emergency Medical Care',
    description: 'Trains paramedics in pre-hospital emergency care, trauma management and patient transport.',
    nqf_level: '6', duration: '3 years', field: 'Health',
    provider_id: 'p6', provider_name: 'Durban University of Technology',
    entry_requirements: 'NSC Diploma pass, Mathematics 40%, Life Sciences 50%, physical fitness test',
    career_outcomes: ['Paramedic', 'Emergency Medical Technician', 'Disaster Management Officer'],
    application_url: 'https://www.dut.ac.za/apply',
  },
  {
    id: 'q14', title: 'BSc in Data Science',
    description: 'Combines statistics, computer science and domain knowledge to extract insights from large datasets.',
    nqf_level: '7', duration: '3 years', field: 'Technology',
    provider_id: 'p1', provider_name: 'University of Pretoria',
    entry_requirements: 'NSC Bachelor pass, Mathematics 70%, APS 32+',
    career_outcomes: ['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst'],
    application_url: 'https://www.up.ac.za/apply',
  },
  {
    id: 'q15', title: 'National Certificate: Business Administration (NQF 3)',
    description: 'Entry-level business administration skills for office environments, customer service and administration roles.',
    nqf_level: '3', duration: '1 year', field: 'Business',
    provider_id: 'p9', provider_name: 'Northlink TVET College',
    entry_requirements: 'Grade 9 or equivalent',
    career_outcomes: ['Office Administrator', 'Receptionist', 'Customer Service Agent'],
    application_url: 'https://www.northlink.edu.za',
  },
];

export const PROVIDERS: Provider[] = [
  {
    id: 'p1', name: 'University of Pretoria', provider_type: 'University',
    province: 'Gauteng', city: 'Pretoria', address: 'Lynnwood Rd, Hatfield, Pretoria, 0002',
    website: 'https://www.up.ac.za', phone: '+27 12 420 3111',
    latitude: -25.7545, longitude: 28.2314,
    qualifications_count: 3, distance_learning: false,
  },
  {
    id: 'p2', name: 'University of South Africa (UNISA)', provider_type: 'Distance Learning',
    province: 'Gauteng', city: 'Pretoria', address: 'Preller St, Muckleneuk, Pretoria, 0002',
    website: 'https://www.unisa.ac.za', phone: '+27 12 429 3111',
    latitude: -25.7737, longitude: 28.1947,
    qualifications_count: 2, distance_learning: true,
  },
  {
    id: 'p3', name: 'University of the Witwatersrand', provider_type: 'University',
    province: 'Gauteng', city: 'Johannesburg', address: '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000',
    website: 'https://www.wits.ac.za', phone: '+27 11 717 1000',
    latitude: -26.1929, longitude: 28.0305,
    qualifications_count: 3, distance_learning: false,
  },
  {
    id: 'p4', name: 'Tshwane University of Technology', provider_type: 'University of Technology',
    province: 'Gauteng', city: 'Pretoria', address: '159 Staatsartillerie Rd, Pretoria West, 0183',
    website: 'https://www.tut.ac.za', phone: '+27 12 382 5911',
    latitude: -25.7460, longitude: 28.1576,
    qualifications_count: 1, distance_learning: false,
  },
  {
    id: 'p5', name: 'Cape Peninsula University of Technology', provider_type: 'University of Technology',
    province: 'Western Cape', city: 'Cape Town', address: 'Symphony Way, Bellville, Cape Town, 7535',
    website: 'https://www.cput.ac.za', phone: '+27 21 959 6767',
    latitude: -33.9258, longitude: 18.6293,
    qualifications_count: 1, distance_learning: false,
  },
  {
    id: 'p6', name: 'Durban University of Technology', provider_type: 'University of Technology',
    province: 'KwaZulu-Natal', city: 'Durban', address: '41-43 ML Sultan Rd, Durban Central, 4001',
    website: 'https://www.dut.ac.za', phone: '+27 31 373 2000',
    latitude: -29.8587, longitude: 31.0218,
    qualifications_count: 2, distance_learning: false,
  },
  {
    id: 'p7', name: 'Ekurhuleni East TVET College', provider_type: 'TVET College',
    province: 'Gauteng', city: 'Boksburg', address: 'Cnr Trichardt & Van Riebeeck Rd, Boksburg, 1459',
    website: 'https://www.eec.edu.za', phone: '+27 11 730 6600',
    latitude: -26.2144, longitude: 28.2600,
    qualifications_count: 1, distance_learning: false,
  },
  {
    id: 'p8', name: 'University of Limpopo', provider_type: 'University',
    province: 'Limpopo', city: 'Polokwane', address: 'University Rd, Mankweng, Polokwane, 0727',
    website: 'https://www.ul.ac.za', phone: '+27 15 268 9111',
    latitude: -23.8800, longitude: 29.7300,
    qualifications_count: 1, distance_learning: false,
  },
  {
    id: 'p9', name: 'Northlink TVET College', provider_type: 'TVET College',
    province: 'Western Cape', city: 'Cape Town', address: 'Plattekloof Rd, Panorama, Cape Town, 7500',
    website: 'https://www.northlink.edu.za', phone: '+27 21 970 9000',
    latitude: -33.8700, longitude: 18.5800,
    qualifications_count: 1, distance_learning: false,
  },
  {
    id: 'p10', name: 'Umfolozi TVET College', provider_type: 'TVET College',
    province: 'KwaZulu-Natal', city: 'Richards Bay', address: 'Cnr Boundary & Union Rd, Richards Bay, 3900',
    website: 'https://www.umfolozi.edu.za', phone: '+27 35 902 9500',
    latitude: -28.7800, longitude: 32.0500,
    qualifications_count: 0, distance_learning: false,
  },
];

export const ADVISERS: Adviser[] = [
  { id: 'a1', name: 'Nomsa Dlamini',    role: 'Career Development Practitioner', province: 'Gauteng',       city: 'Johannesburg', phone: '+27 11 560 0000', email: 'ndlamini@khetha.org.za',   languages: ['English', 'isiZulu', 'Sesotho'],    availability: 'Mon–Fri 08:00–16:00', walk_in: true,  specialisation: 'School-to-work transitions' },
  { id: 'a2', name: 'Thabo Mokoena',    role: 'Career Development Practitioner', province: 'KwaZulu-Natal', city: 'Durban',        phone: '+27 31 560 0001', email: 'tmokoena@khetha.org.za',   languages: ['English', 'isiZulu'],               availability: 'Mon–Fri 08:00–16:00', walk_in: true,  specialisation: 'Health & social services careers' },
  { id: 'a3', name: 'Ayanda Nkosi',     role: 'Senior Career Adviser',           province: 'Western Cape',  city: 'Cape Town',     phone: '+27 21 560 0002', email: 'ankosi@khetha.org.za',    languages: ['English', 'Afrikaans', 'isiXhosa'], availability: 'Mon–Thu 09:00–15:00', walk_in: false, specialisation: 'Higher education pathways' },
  { id: 'a4', name: 'Lerato Sithole',   role: 'Career Development Practitioner', province: 'Limpopo',       city: 'Polokwane',     phone: '+27 15 560 0003', email: 'lsithole@khetha.org.za',  languages: ['English', 'Sepedi', 'Xitsonga'],    availability: 'Mon–Fri 08:00–16:00', walk_in: true,  specialisation: 'Agriculture & rural livelihoods' },
  { id: 'a5', name: 'Zanele Khumalo',   role: 'Career Development Practitioner', province: 'Mpumalanga',    city: 'Nelspruit',     phone: '+27 13 560 0004', email: 'zkhumalo@khetha.org.za',  languages: ['English', 'isiSwati', 'isiZulu'],   availability: 'Tue–Sat 08:00–14:00', walk_in: true,  specialisation: 'TVET & artisan pathways' },
  { id: 'a6', name: 'Pieter van Wyk',   role: 'Career Development Practitioner', province: 'Northern Cape', city: 'Kimberley',     phone: '+27 53 560 0005', email: 'pvanwyk@khetha.org.za',   languages: ['English', 'Afrikaans', 'Setswana'], availability: 'Mon–Fri 08:00–16:00', walk_in: false, specialisation: 'Mining & engineering trades' },
  { id: 'a7', name: 'Dineo Molefe',     role: 'Senior Career Adviser',           province: 'North West',    city: 'Mahikeng',      phone: '+27 18 560 0006', email: 'dmolefe@khetha.org.za',   languages: ['English', 'Setswana', 'Sesotho'],   availability: 'Mon–Fri 09:00–15:00', walk_in: true,  specialisation: 'Business & entrepreneurship' },
  { id: 'a8', name: 'Sipho Radebe',     role: 'Career Development Practitioner', province: 'Free State',    city: 'Bloemfontein',  phone: '+27 51 560 0007', email: 'sradebe@khetha.org.za',   languages: ['English', 'Sesotho', 'Afrikaans'],  availability: 'Mon–Fri 08:00–16:00', walk_in: true,  specialisation: 'Education & teaching careers' },
  { id: 'a9', name: 'Nolwazi Mthembu',  role: 'Career Development Practitioner', province: 'Eastern Cape',  city: 'East London',   phone: '+27 43 560 0008', email: 'nmthembu@khetha.org.za',  languages: ['English', 'isiXhosa'],              availability: 'Mon–Fri 08:00–16:00', walk_in: false, specialisation: 'Technology & digital careers' },
];

export const EVENTS: KhethaEvent[] = [
  {
    id: 'e1', title: 'Khetha Career Expo — Gauteng',
    description: 'Meet career advisers, universities, TVET colleges and employers under one roof. Free entry for learners and job seekers.',
    date: '2025-08-16', time: '09:00–15:00',
    venue: 'Soweto Theatre, Jabulani, Soweto',
    province: 'Gauteng', type: 'Career Expo',
    registration_url: 'https://khetha.dhet.gov.za/events/gauteng-expo-2025',
  },
  {
    id: 'e2', title: 'NCAP Subject Choice Workshop',
    description: 'Grade 9 learners and parents: understand how subject choices affect your career options. Presented by Khetha career practitioners.',
    date: '2025-07-29', time: '10:00–12:30',
    venue: 'Durban City Hall, Durban',
    province: 'KwaZulu-Natal', type: 'Workshop',
    registration_url: 'https://khetha.dhet.gov.za/events/subject-choice-kzn',
  },
  {
    id: 'e3', title: 'TVET Open Day — Western Cape',
    description: 'Explore TVET college programmes, bursaries and learnerships. Northlink and CPUT representatives will be present.',
    date: '2025-08-02', time: '08:30–13:00',
    venue: 'Northlink TVET College, Panorama, Cape Town',
    province: 'Western Cape', type: 'Open Day',
    registration_url: 'https://khetha.dhet.gov.za/events/tvet-open-day-wc',
  },
  {
    id: 'e4', title: 'Career Guidance Webinar: Health Careers',
    description: 'Online session covering nursing, paramedics, health sciences and bursary opportunities in the public health sector.',
    date: '2025-07-24', time: '17:00–18:30',
    venue: 'Online (Zoom — link sent on registration)',
    province: 'All provinces', type: 'Webinar',
    registration_url: 'https://khetha.dhet.gov.za/events/health-careers-webinar',
  },
  {
    id: 'e5', title: 'Khetha Career Expo — Limpopo',
    description: 'Career guidance, university applications support and bursary information for Limpopo learners.',
    date: '2025-09-06', time: '09:00–14:00',
    venue: 'University of Limpopo, Mankweng',
    province: 'Limpopo', type: 'Career Expo',
    registration_url: 'https://khetha.dhet.gov.za/events/limpopo-expo-2025',
  },
  {
    id: 'e6', title: 'Entrepreneurship & Artisan Pathways Workshop',
    description: 'Learn about trade apprenticeships, SETA learnerships and starting your own business after matric.',
    date: '2025-08-23', time: '09:00–12:00',
    venue: 'Ekurhuleni East TVET College, Boksburg',
    province: 'Gauteng', type: 'Workshop',
    registration_url: 'https://khetha.dhet.gov.za/events/artisan-workshop-gp',
  },
];

export const WALK_IN_CENTRES: WalkInCentre[] = [
  { id: 'w1', name: 'Khetha Johannesburg',  province: 'Gauteng',       address: '123 Eloff St, Johannesburg CBD, 2001',          phone: '+27 11 560 0100', hours: 'Mon–Fri 08:00–16:00', latitude: -26.2041, longitude: 28.0473 },
  { id: 'w2', name: 'Khetha Durban',        province: 'KwaZulu-Natal', address: '45 Dr Pixley KaSeme St, Durban Central, 4001',   phone: '+27 31 560 0101', hours: 'Mon–Fri 08:00–16:00', latitude: -29.8587, longitude: 31.0218 },
  { id: 'w3', name: 'Khetha Cape Town',     province: 'Western Cape',  address: '14 Adderley St, Cape Town CBD, 8001',            phone: '+27 21 560 0102', hours: 'Mon–Thu 09:00–15:00', latitude: -33.9249, longitude: 18.4241 },
  { id: 'w4', name: 'Khetha Polokwane',     province: 'Limpopo',       address: '78 Landdros Mare St, Polokwane, 0699',           phone: '+27 15 560 0103', hours: 'Mon–Fri 08:00–16:00', latitude: -23.9045, longitude: 29.4689 },
  { id: 'w5', name: 'Khetha Nelspruit',     province: 'Mpumalanga',    address: '32 Brown St, Nelspruit CBD, 1200',               phone: '+27 13 560 0104', hours: 'Tue–Sat 08:00–14:00',  latitude: -25.4753, longitude: 30.9694 },
  { id: 'w6', name: 'Khetha Kimberley',     province: 'Northern Cape', address: '5 Chapel St, Kimberley, 8301',                  phone: '+27 53 560 0105', hours: 'Mon–Fri 08:00–16:00', latitude: -28.7282, longitude: 24.7499 },
  { id: 'w7', name: 'Khetha Mahikeng',      province: 'North West',    address: '10 Robinson St, Mahikeng, 2745',                phone: '+27 18 560 0106', hours: 'Mon–Fri 09:00–15:00', latitude: -25.8653, longitude: 25.6432 },
  { id: 'w8', name: 'Khetha Bloemfontein', province: 'Free State',    address: '22 St Andrews St, Bloemfontein, 9301',          phone: '+27 51 560 0107', hours: 'Mon–Fri 08:00–16:00', latitude: -29.1210, longitude: 26.2140 },
  { id: 'w9', name: 'Khetha East London',   province: 'Eastern Cape',  address: '67 Oxford St, East London CBD, 5201',           phone: '+27 43 560 0108', hours: 'Mon–Fri 08:00–16:00', latitude: -33.0153, longitude: 27.9116 },
];
