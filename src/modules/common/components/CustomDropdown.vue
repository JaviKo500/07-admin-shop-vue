<template>
  <div>
    <select 
      @input="$emit('update:modelValue', ( $event.target as HTMLInputElement).value)" 
      @blur="$emit('blur')" 
      :class="[
        'form-control',
        {
          'border-red-500': error,
        }
      ]">
      <option value="">Seleccione</option>
      <option value="kid">Niño</option>
      <option value="women">Mujer</option>
      <option value="men">Hombre</option>
    </select>
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
<style scoped>
  .form-control {
    @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none;
  }
</style>