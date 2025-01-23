<template>
  <div>
    <textarea
      @input="$emit('update:modelValue', ( $event.target as HTMLInputElement).value)" 
      @blur="$emit('blur')"
      :class="[
        'shadow h-32 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
        {
          'border-red-500': error,
        }
      ]"
    ></textarea>
    <span class="capitalize text-red-500" v-if="error">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
  interface Props {
    modelValue?: string | number;
    error?: string;
  }
  defineProps<Props>();
  defineEmits(['update:modelValue', 'blur']);
</script>