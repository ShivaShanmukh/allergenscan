import { Platform } from 'react-native';

// VERDANT Design System — Nature-inspired palette
export const V = {
  // Primary colors
  forest: '#2D5F3F',
  sage: '#8BA888',
  cream: '#F8F6F1',
  white: '#FFFFFF',
  terracotta: '#D97757',
  mint: '#2ECC71',
  mintDark: '#27AE60',
  pine: '#1F3F2B',
  sky: '#DCEEFF',
  skyStrong: '#4E8EF7',
  roseSoft: '#FDECEC',
  amberSoft: '#FFF3E0',
  neutralSoft: '#F3F5F7',

  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#E57373',
  dangerDark: '#C62828',

  // Neutrals
  textPrimary: '#1B1B1B',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  cardBg: '#FFFFFF',
  inputBg: '#F9FAFB',

  // Dark accents
  forestDark: '#1A3D28',
  sageDark: '#6B8B6B',
  shadow: 'rgba(27, 27, 27, 0.08)',
};

export const Colors = {
  light: {
    text: V.textPrimary,
    background: V.cream,
    tint: V.forest,
    icon: V.textSecondary,
    tabIconDefault: V.textSecondary,
    tabIconSelected: V.forest,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: V.sage,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: V.sage,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
