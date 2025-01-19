<template>
  <h1 class="text-2xl font-semibold mb-4">Register</h1>
  <form @submit.prevent="onRegister" method="POST">
    <!-- Name Input -->
    <div class="mb-4">
      <label for="name" class="block text-gray-600">Name</label>
      <input
        v-model="myRegisterForm.fullName"
        ref="nameInputRef"
        type="text"
        id="name"
        name="name"
        class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        autocomplete="off"
      />
    </div>
    
    <!-- Email Input -->
    <div class="mb-4">
      <label for="email" class="block text-gray-600">Email</label>
      <input
        v-model="myRegisterForm.email"
        ref="emailInputRef"
        type="text"
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
        v-model="myRegisterForm.password"
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
        v-model="myRegisterForm.rememberMe"
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
    <RouterLink :to="{ name: 'login' }" class="hover:underline">Login Here</RouterLink>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useToast } from 'vue-toastification';

  import { useAuthStore } from '../stores/auth.store';

  const myRegisterForm = reactive({
    email: '',
    password: '',
    fullName: '',
    rememberMe: false,
  });

  const emailInputRef = ref<HTMLInputElement | null>(null);
  const passwordInputRef = ref<HTMLInputElement | null>(null);
  const nameInputRef = ref<HTMLInputElement | null>(null);

  const toast = useToast();
  const authStore = useAuthStore();

  const onRegister = async () => {
    if( myRegisterForm.fullName.trim() === '' ) return nameInputRef.value?.focus();
    if( myRegisterForm.email.trim() === '' ) return emailInputRef.value?.focus();
    if( myRegisterForm.password === '' || myRegisterForm.password.length < 6 ) return passwordInputRef.value?.focus();

    const { rememberMe, ...registerPayload } = myRegisterForm;
    
    const { ok, error } = await authStore.register( registerPayload );
    
    if ( ok ) {
      authStore.rememberMe( rememberMe, registerPayload.email );
      return;
    };
    toast.error( error ?? 'Not can\'t complete registration');
  }
</script>
