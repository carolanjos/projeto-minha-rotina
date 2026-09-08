import type { UserInterface } from '@/modules/Auth/components/interfaces/user.interface';
import { TOKEN_STORAGE_KEY } from '@/shared/http/token-storage-key';
import { Mutations } from '../mutations.enum';
import type { AuthState } from './state';

export default {
  [Mutations.SET_AUTH](state: AuthState, payload: { user: UserInterface; token: string }): void {
    state.user = payload.user;
    state.token = payload.token;
    localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
  },

  [Mutations.SET_CURRENT_USER](state: AuthState, user: UserInterface): void {
    state.user = user;
  },

  [Mutations.CLEAR_AUTH](state: AuthState): void {
    state.user = null;
    state.token = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
