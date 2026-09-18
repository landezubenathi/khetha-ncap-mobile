export const colors = {
  // Core brand
  navy:        '#0A1628',
  navyMid:     '#112240',
  navyLight:   '#1A3A5C',
  blue:        '#1677FF',
  blueMid:     '#3B8EFF',
  blueGlow:    'rgba(22,119,255,0.25)',
  teal:        '#0E9384',
  tealLight:   '#12B5A3',
  tealGlow:    'rgba(14,147,132,0.25)',
  yellow:      '#F4B740',
  yellowLight: '#FFD166',
  yellowGlow:  'rgba(244,183,64,0.3)',
  ink:         '#1E3448',
  muted:       '#5A7A94',
  mutedLight:  '#8BA3B8',
  bg:          '#EEF2F7',
  bgCard:      '#FFFFFF',
  white:       '#FFFFFF',
  border:      '#D1DDE8',
  borderLight: '#E8EFF6',
  danger:      '#E53E3E',
  dangerGlow:  'rgba(229,62,62,0.2)',
  success:     '#38A169',
  purple:      '#7B61FF',
  purpleGlow:  'rgba(123,97,255,0.25)',
  orange:      '#E05C2A',
  // Glass surfaces
  glass:       'rgba(255,255,255,0.10)',
  glassMid:    'rgba(255,255,255,0.16)',
  glassBorder: 'rgba(255,255,255,0.22)',
  glassStrong: 'rgba(255,255,255,0.28)',
  // Dark glass
  darkGlass:   'rgba(10,22,40,0.55)',
  // High-contrast
  hcText: '#000000', hcBg: '#FFFFFF', hcBorder: '#000000', hcAccent: '#005EA2',
};

export const gradients = {
  hero:     ['#0A1628', '#112240', '#1A3A5C'] as [string, string, string],
  heroShort:['#0A1628', '#1A3A5C'] as [string, string],
  teal:     ['#0A7A6E', '#0E9384', '#12B5A3'] as [string, string, string],
  tealShort:['#0E9384', '#12B5A3'] as [string, string],
  blue:     ['#0D5FCC', '#1677FF', '#3B8EFF'] as [string, string, string],
  blueShort:['#1677FF', '#3B8EFF'] as [string, string],
  yellow:   ['#D4960A', '#F4B740', '#FFD166'] as [string, string, string],
  purple:   ['#5B41CC', '#7B61FF', '#9B85FF'] as [string, string, string],
  card:     ['#FFFFFF', '#F5F8FC'] as [string, string],
  dark:     ['#0A1628', '#112240'] as [string, string],
};

export const shadow = {
  xs:  { shadowColor: '#0A1628', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,  elevation: 1 },
  sm:  { shadowColor: '#0A1628', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 8,  elevation: 3 },
  md:  { shadowColor: '#0A1628', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 7 },
  lg:  { shadowColor: '#0A1628', shadowOffset: { width: 0, height: 10}, shadowOpacity: 0.20, shadowRadius: 28, elevation: 14 },
  xl:  { shadowColor: '#0A1628', shadowOffset: { width: 0, height: 16}, shadowOpacity: 0.26, shadowRadius: 40, elevation: 20 },
  teal:{ shadowColor: '#0E9384', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  blue:{ shadowColor: '#1677FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  gold:{ shadowColor: '#F4B740', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
};

export const spacing = { xs: 6, sm: 12, md: 18, lg: 26, xl: 36 };
export const radius  = { xs: 6, sm: 10, md: 16, lg: 22, xl: 32, full: 999 };

export const MIN_TOUCH = 44;

export function fs(base: number, scale: number): number {
  return Math.round(base * scale);
}
