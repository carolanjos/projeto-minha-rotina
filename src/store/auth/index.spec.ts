jest.mock('@/modules/Auth/services/auth.service', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    me: jest.fn(),
  },
}));

// eslint-disable-next-line import/first
import Vue from 'vue';
// eslint-disable-next-line import/first
import Vuex from 'vuex';
// eslint-disable-next-line import/first
import authService from '@/modules/Auth/services/auth.service';
// eslint-disable-next-line import/first
import authModule from './index';
// eslint-disable-next-line import/first
import type { AuthState } from './state';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    modules: {
      auth: authModule,
    },
  });
}

function authState(store: any): AuthState {
  return store.state.auth;
}

const mockedRegister = authService.register as jest.Mock;
const mockedLogin = authService.login as jest.Mock;
const mockedLogout = authService.logout as jest.Mock;

const USER = { id: 1, name: 'Carolina', email: 'carolina@example.com' };

describe('store/auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('login stores the user and token, and persists the token', async () => {
    mockedLogin.mockResolvedValue({ user: USER, token: 'abc123' });
    const store = createStore();

    await store.dispatch('auth/login', { email: USER.email, password: 'secret' });

    expect(mockedLogin).toHaveBeenCalledWith(USER.email, 'secret');
    expect(authState(store).user).toEqual(USER);
    expect(store.getters['auth/isAuthenticated']).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'abc123');
  });

  it('register creates the account and then logs in with the same credentials', async () => {
    mockedRegister.mockResolvedValue(USER);
    mockedLogin.mockResolvedValue({ user: USER, token: 'abc123' });
    const store = createStore();

    await store.dispatch('auth/register', {
      name: USER.name, email: USER.email, password: 'secret', passwordConfirmation: 'secret',
    });

    expect(mockedRegister).toHaveBeenCalledWith(USER.name, USER.email, 'secret', 'secret');
    expect(mockedLogin).toHaveBeenCalledWith(USER.email, 'secret');
    expect(store.getters['auth/isAuthenticated']).toBe(true);
  });

  it('logout clears the session even if the API call fails', async () => {
    mockedLogin.mockResolvedValue({ user: USER, token: 'abc123' });
    mockedLogout.mockRejectedValue(new Error('network error'));
    const store = createStore();
    await store.dispatch('auth/login', { email: USER.email, password: 'secret' });

    await expect(store.dispatch('auth/logout')).rejects.toThrow();

    expect(authState(store).user).toBeNull();
    expect(store.getters['auth/isAuthenticated']).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });
});
