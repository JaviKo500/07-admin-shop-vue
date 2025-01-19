import type { User } from './user.interface';

export interface AuthError {
  ok: false;
  error: string;
}

export interface AuthSuccess {
  ok: true;
  user: User;
  token: string;
}