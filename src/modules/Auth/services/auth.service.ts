import apiClient from '@/shared/http/api-client';
import type { UserInterface } from '../components/interfaces/user.interface';

interface LoginResponse {
  user: UserInterface;
  token: string;
}

class AuthService {
  public async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<UserInterface> {
    const { data } = await apiClient.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return data.data;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/login', { email, password });
    return data;
  }

  public async logout(): Promise<void> {
    await apiClient.post('/logout');
  }

  public async me(): Promise<UserInterface> {
    const { data } = await apiClient.get('/user');
    return data.data;
  }
}

export default new AuthService();
