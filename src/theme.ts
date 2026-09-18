export const colors = {
  navy: '#102A43', blue: '#1677FF', teal: '#0E9384',
  yellow: '#F4B740', ink: '#243B53', muted: '#627D98',
  bg: '#F5F7FA', white: '#FFFFFF', border: '#D9E2EC',
  danger: '#D64545',
  // High-contrast overrides (WCAG AA — used when highContrast is true)
  hcText: '#000000', hcBg: '#FFFFFF', hcBorder: '#000000', hcAccent: '#005EA2',
};

export const spacing = { xs: 6, sm: 12, md: 18, lg: 26, xl: 36 };

// Minimum touch target per WCAG 2.5.5 (44×44 pt)
export const MIN_TOUCH = 44;

// Scale a font size by the user's fontScale preference (1 = default)
export function fs(base: number, scale: number): number {
  return Math.round(base * scale);
}
