import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type AuthError, type AuthSuccess, type RegisterPayload, type User } from '../interfaces';
import { checkAuthAction, loginActions, registerAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined>();
  const token = ref( useLocalStorage('token', '') );
  const authStatus = ref<AuthStatus>(AuthStatus.CHECKING);

  const login = async ( email: string, password: string ) => { 
    try {
      const loginResponse = await loginActions( email, password );
      const ok = authUser( loginResponse );
      return ok;
    } catch {
      logout();
      return false;
    }
  }

  const register = async ( payload: RegisterPayload ) => {
    try {
      const  registerResponse = await registerAction( payload );
      const ok = authUser( registerResponse );
      return ok ? { ok, } : { ok, error: (registerResponse as AuthError).error  };
    } catch {
      logout();
      return { ok: false, error: 'Not cant complete registration' };
    }
  };

  const authUser = ( authResp: AuthSuccess | AuthError ) => {
    if ( !authResp.ok ) {
      logout();
      return false;
    }
    user.value = authResp.user;
    token.value = authResp.token;
    authStatus.value = AuthStatus.AUTHENTICATED;
    return true;
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();
      return authUser( statusResp );
    } catch  {
      logout();
      return false;
    }
  }
  
  const logout = () => {
    authStatus.value = AuthStatus.NOT_AUTHENTICATED;
    user.value = undefined;
    token.value = '';
    localStorage.removeItem('token');
  }

  const rememberMe = ( remember: boolean, email: string ) => {
    if ( remember ) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }
  return { 
    // Properties
    user,
    token,
    authStatus,

    // getters
    isChecking: computed(() => authStatus.value === AuthStatus.CHECKING),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.AUTHENTICATED),
    isNotAuthenticated: computed(() => authStatus.value === AuthStatus.NOT_AUTHENTICATED),
    username: computed(() => user.value?.fullName ?? ''),
    isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),

    // actions
    login,
    logout,
    register,
    rememberMe,
    checkAuthStatus,
  };
})
