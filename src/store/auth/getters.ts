import type { UserInterface } from '@/modules/Auth/components/interfaces/user.interface';
import type { AuthState } from './state';

export default {
  isAuthenticated: (state: AuthState): boolean => !!state.token,

  currentUser: (state: AuthState): UserInterface | null => state.user,
};
