import { tesloApi } from '@/api/teslo.api';
import type { AuthError, AuthResponse, AuthSuccess } from '../interfaces';
import { isAxiosError } from 'axios';

export const checkAuthAction = async (): Promise<AuthError | AuthSuccess> => {
  try {
    const token = localStorage.getItem('token');
    if ( token && token?.length < 10) return {
      ok: false,
      error: 'Not exist token',
    };

    const resp = await tesloApi.get<AuthResponse>('/auth/check-status');
    
    return {
      ok: true,
      ...resp.data,
    };
  } catch (error) {
    console.log('<--------------- JK Check-auth.action Error --------------->');
    console.log(error);
    if ( isAxiosError(error) && error.response?.status === 401 ) {
      return { 
        ok: false, 
        error: 'Invalid authentication token'
      };
    }
     return { ok: false, error: 'Not can\'t verify authentication' };
  }
}