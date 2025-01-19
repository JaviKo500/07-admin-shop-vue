
<template>
  <div class="flex justify-center space-x-3 py-10 bg-gray-100">
    <button class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 bg-blue-500 disabled:bg-gray-100 text-white hover:bg-blue-600 transition-all">
      <ArrowLeftIcon/>
      <span>Previous</span>
    </button>

    <button class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 bg-blue-500 disabled:bg-gray-100 text-white hover:bg-blue-600 transition-all">
      <span>Next</span>
      <ArrowRightIcon/>
    </button>
  </div>
</template>
<script setup lang="ts">
  import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';
  interface Props {

  }

  defineProps<Props>();
</script>