import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { useAuthStore } from '../stores/auth.store';
import { AuthStatus } from '../interfaces';

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();
  await authStore.checkAuthStatus();

  if ( authStore.authStatus === AuthStatus.NOT_AUTHENTICATED ) {
    next({ name: 'home' });
  } else {
    next();
  }
};

export default isAuthenticatedGuard;
