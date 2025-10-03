export const colors = {
  neutral: {
    0: '#f8f7f1',
    50: '#ede9dd',
    200: '#dcd5c6',
    700: '#3f3d38',
    900: '#171613',
  },
  accent: {
    balance: '#c9d3b0',
    earn: '#f0ce6e',
    invest: '#b8b4ff',
    spend: '#edc7a5',
    donate: '#f3bbd0',
    upgrade: '#9f8cff',
  },
  status: {
    success: '#59b37b',
    warning: '#e8a552',
    error: '#d36166',
    info: '#76a7e0',
  },
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '32px',
  8: '40px',
  9: '48px',
  10: '64px',
};

export const radii = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const typography = {
  fontFamilySans: '"Poppins", "DM Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
};

export const shadows = {
  raised: '0 12px 35px rgba(31, 30, 27, 0.06)',
  float: '0 20px 40px rgba(31, 30, 27, 0.12)',
};

export const motion = {
  duration: {
    short: '200ms',
    medium: '280ms',
  },
  easing: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    snappy: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

export const domainAccents = {
  dashboard: 'balance',
  earn: 'earn',
  save: 'balance',
  invest: 'invest',
  spend: 'spend',
  donate: 'donate',
  automations: 'upgrade',
  learn: 'upgrade',
};

export function accentVar(key) {
  return `var(--accent-${key})`;
}

/**
 * Return CSS variable reference for a domain accent.
 * @param {keyof typeof domainAccents} domain
 */
export function domainAccentVar(domain) {
  const accent = domainAccents[domain];
  if (!accent) {
    return accentVar('balance');
  }
  return accentVar(accent);
}

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  motion,
  domainAccents,
};

export default tokens;
