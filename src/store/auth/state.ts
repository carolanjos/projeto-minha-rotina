import type { UserInterface } from '@/modules/Auth/components/interfaces/user.interface';
import { TOKEN_STORAGE_KEY } from '@/shared/http/token-storage-key';

export interface AuthState {
  user: UserInterface | null;
  token: string | null;
}

export default (): AuthState => ({
  user: null,
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
});
