import type { ThemeState } from './state';

export default {
  theme: (state: ThemeState): string => state.theme,
  isDark: (state: ThemeState): boolean => state.theme === 'dark',
};
