<template>
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form @submit.prevent="onLogin" method="POST">
    <!-- Email Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        v-model="myForm.email"
        ref="emailInputRef"
        type="email"
        id="email"
        name="email"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Password Input -->
    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input
        v-model="myForm.password"
        ref="passwordInputRef"
        type="password"
        id="password"
        name="password"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    <!-- Remember Me Checkbox -->
    <div class="mb-4 flex items-center">
      <input 
        v-model="myForm.rememberMe"
        type="checkbox" id="remember" name="remember" class="text-blue-500" />
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div>
    <!-- Forgot Password Link -->
    <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div>
    <!-- Login Button -->
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
    >
      Login
    </button>
  </form>
  <!-- Sign up  Link -->
  <div class="mt-6 text-blue-500 text-center">
    <RouterLink :to="{ name: 'register' }" class="hover:underline">Sign up Here</RouterLink>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, watchEffect } from 'vue';
  import { useToast } from 'vue-toastification';

  import { useAuthStore } from '../stores/auth.store';

  const myForm = reactive({
    email: '',
    password: '',
    rememberMe: false,
  });

  const emailInputRef = ref<HTMLInputElement | null>(null);
  const passwordInputRef = ref<HTMLInputElement | null>(null);

  const toast = useToast();
  const authStore = useAuthStore();
  const onLogin = async () => {
    if( myForm.email.trim() === '' ) return emailInputRef.value?.focus();
    if( myForm.password === '' || myForm.password.length < 6 ) return passwordInputRef.value?.focus();

    const ok = await authStore.login( myForm.email, myForm.password );
    
    if( ok ) {
      authStore.rememberMe( myForm.rememberMe, myForm.email );
      return;
    }

    toast.error('Invalid email or password');
  };

  // Restore last email and check if it is valid 
  watchEffect(() => {
    const email = localStorage.getItem('email');
    if ( email ) {
      myForm.email = email;
      myForm.rememberMe = true;
      passwordInputRef.value?.focus();
    }
  });
</script>
