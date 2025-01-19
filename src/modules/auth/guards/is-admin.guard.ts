import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {

  const authStore = useAuthStore();
  await authStore.checkAuthStatus();
  
  return authStore.isAdmin ? next() : next({ name: from.name });
}

export default isAdminGuard;