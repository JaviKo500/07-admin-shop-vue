import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { loginActions } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | undefined>();
  const token = ref( useLocalStorage('token', '') );
  const authStatus = ref<AuthStatus>(AuthStatus.CHECKING);

  const login = async ( email: string, password: string ) => { 
    try {
      const loginResponse = await loginActions( email, password );
      if ( !loginResponse.ok ) {
        logout();
        return false;
      }
      user.value = loginResponse.user;
      token.value = loginResponse.token;
      authStatus.value = AuthStatus.AUTHENTICATED;
      return true;
    } catch {
      logout();
      return false;
    }
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
  };
})
