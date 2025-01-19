<template>
  <RouterView/>
  <VueQueryDevtools/>
</template>
<script setup lang="ts">
  import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
  import { useRoute, useRouter } from 'vue-router';

  import { useAuthStore } from './modules/auth/stores/auth.store';
  import { AuthStatus } from './modules/auth/interfaces';
  
  const authStore = useAuthStore();

  const router = useRouter();
  const route = useRoute();

  

  authStore.$subscribe( ( _, state ) => {
    if ( state.authStatus === AuthStatus.CHECKING ) {
      authStore.checkAuthStatus();
      return;
    }

    if ( route.path.includes('/auth') && state.authStatus === AuthStatus.AUTHENTICATED ) {
      router.replace({ name: 'home' });
      return;
    }
  }, {
    immediate: true,
  });
</script>
