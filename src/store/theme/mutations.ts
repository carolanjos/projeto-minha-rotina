import { Mutations } from '../mutations.enum';
import type { ThemeState, ThemeName } from './state';

export default {
  [Mutations.SET_THEME](state: ThemeState, theme: ThemeName): void {
    state.theme = theme;
  },
};
