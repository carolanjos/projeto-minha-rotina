import { Mutations } from '../mutations.enum';
import type { ThemeName } from './state';

const STORAGE_KEY = 'theme';

function persist(theme: ThemeName): void {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export default {
  setTheme({ commit }: any, theme: ThemeName): void {
    persist(theme);
    commit(Mutations.SET_THEME, theme);
  },

  toggleTheme({ commit, state }: any): void {
    const next: ThemeName = state.theme === 'dark' ? 'light' : 'dark';
    persist(next);
    commit(Mutations.SET_THEME, next);
  },
};
