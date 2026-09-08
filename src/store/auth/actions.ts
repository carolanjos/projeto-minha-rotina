import authService from '@/modules/Auth/services/auth.service';
import { Mutations } from '../mutations.enum';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export default {
  async register({ dispatch }: any, payload: RegisterPayload): Promise<void> {
    await authService.register(
      payload.name,
      payload.email,
      payload.password,
      payload.passwordConfirmation,
    );
    await dispatch('login', { email: payload.email, password: payload.password });
  },

  async login({ commit }: any, payload: LoginPayload): Promise<void> {
    const { user, token } = await authService.login(payload.email, payload.password);
    commit(Mutations.SET_AUTH, { user, token });
  },

  async logout({ commit }: any): Promise<void> {
    try {
      await authService.logout();
    } finally {
      commit(Mutations.CLEAR_AUTH);
    }
  },

  async fetchCurrentUser({ commit }: any): Promise<void> {
    const user = await authService.me();
    commit(Mutations.SET_CURRENT_USER, user);
  },
};
