import { tesloApi } from '@/api/teslo.api';
import type { AuthError, AuthResponse, AuthSuccess, RegisterPayload } from '../interfaces';
import { isAxiosError } from 'axios';

export const registerAction = async ( payload: RegisterPayload ): Promise<AuthError | AuthSuccess> => {
  try {
    const resp = await tesloApi.post<AuthResponse>('/auth/register', payload);
    return {
      ok: true,
      ...resp.data,
    };
  } catch (error) {
    console.log('<--------------- JK Register.action Error --------------->');
    console.log(error);
    if ( isAxiosError(error) && error.response?.status === 400 ) {
      return { ok: false, error: 'Not cant complete registration' };
    }
    throw new Error('Error registering');
  }
}