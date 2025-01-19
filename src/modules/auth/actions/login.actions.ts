import { tesloApi } from '@/api/teslo.api';
import type { AuthError, AuthResponse, AuthSuccess } from '../interfaces';
import { isAxiosError } from 'axios';

export const loginActions = async ( email: string, password: string ): Promise<AuthError | AuthSuccess> => {
  try {
    const resp = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return { ok:true, ...resp.data };
  } catch (error) {
    console.log('<--------------- JK Login.actions Error --------------->');
    console.log(error);
    if ( isAxiosError(error) && error.response?.status === 401) {
      return { ok:false, error: 'Invalid email or password' };
    }
    throw new Error('Error logging in');
  }
}