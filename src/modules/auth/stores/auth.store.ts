import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type AuthError, type AuthSuccess, type RegisterPayload, type User } from '../interfaces';
import { loginActions, registerAction } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined>();
  const token = ref( useLocalStorage('token', '') );
  const authStatus = ref<AuthStatus>(AuthStatus.CHECKING);

  const login = async ( email: string, password: string ) => { 
    try {
      const loginResponse = await loginActions( email, password );
     authUser( loginResponse );
      return true;
    } catch {
      logout();
      return false;
    }
  }

  const register = async ( payload: RegisterPayload ) => {
    try {
      const  registerResponse = await registerAction( payload );
      authUser( registerResponse );
      return true;
    } catch {
      logout();
      return false;
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
  }
  
  const logout = () => {
    authStatus.value = AuthStatus.NOT_AUTHENTICATED;
    user.value = undefined;
    token.value = '';
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

    // actions
    login,
    logout,
    register,
  };
})
