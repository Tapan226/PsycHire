/**
 * Centralized Design System Constants
 *
 * Use these values when CSS variables are not accessible (e.g. in Canvas, Charts, or third-party libs).
 * For standard styling, prefer using Tailwind classes:
 * - bg-brand-primary, text-brand-primary
 * - bg-brand-secondary, text-brand-secondary
 * - bg-card, text-foreground
 *
 * Source of truth for CSS variables: src/styles/theme.css
 */

export const COLORS = {
  brand: {
    primary: '#1e40af',        // Royal Blue (--brand-primary)
    secondary: '#14b8a6',      // Teal (--brand-secondary)
    secondaryHover: '#0d9488', // Darker Teal (--brand-secondary-hover)
  },
  ui: {
    background: '#f0f4f8',     // Bluish Grey (--background)
    card: '#ffffff',           // White (--card)
    text: '#0F172A',           // Slate 900 (--foreground)
    muted: '#ececf0',          // Muted bg (--muted)
    mutedText: '#64748B',      // Slate 500 (--muted-foreground)
    border: '#e2e8f0',         // Slate 200 (--border)
    input: '#e2e2e2',          // Input border (--input)
    secondary: '#f3f3f5',      // Secondary bg (--secondary)
    destructive: '#d4183d',    // Error red (--destructive)
  },
  charts: {
    primary: '#1e40af',        // Blue (--chart-1)
    secondary: '#14b8a6',      // Teal (--chart-2)
    tertiary: '#64748B',       // Slate (--chart-3)
    quaternary: '#818CF8',     // Light Indigo (--chart-4)
    quinary: '#2DD4BF',        // Light Teal (--chart-5)
  },
  chips: {
    mint: '#E0EFEA',
    blue: '#E0EBF5',
    purple: '#EBE0F5',
    amber: '#F5EFE0',
    rose: '#F5E0E5',
    slate: '#F0F2F5',
  },
  modules: {
    jobs: '#E6F0FF',
    community: '#E9F5E6',
    courses: '#FDF2E9',
    events: '#F5E6FF',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    primary: '#2A4CD0',
    accent: '#18cb96',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

export const LAYOUT = {
  maxWidth: '1440px',
  headerHeight: '72px',
  mobileNavHeight: '60px',
  horizontalPadding: {
    mobile: '24px',  // px-6
    desktop: '40px', // px-10
  },
  radius: {
    sm: '0.5rem',    // 8px  (--radius-sm)
    md: '0.625rem',  // 10px (--radius-md)
    lg: '0.75rem',   // 12px (--radius-lg, base --radius)
    xl: '1rem',      // 16px (--radius-xl)
  },
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
