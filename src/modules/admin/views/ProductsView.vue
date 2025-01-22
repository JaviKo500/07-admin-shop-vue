<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">Products</h1>

    <!-- Product List -->
    <div class="text-center h-[500px]" v-if="isLoading">
      <h1 class="text-xl">Loading products...</h1>
      <p>awaiting please...</p>
    </div>
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">Image</th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">Title</th>
              <th class="w-28 py-3 px-4 uppercase font-semibold text-sm">Price</th>
              <th class="w-60 text-left py-3 px-4 uppercase font-semibold text-sm">Size</th>
            </tr>
          </thead>
        <tbody class="text-gray-700">
          <tr 
            v-for="(product, index) in products" :key="product.id"
            :class="{
              'bg-gray-100': index % 2 === 0
            }">
            <td class="text-left py-3 px-4">
              <img :src="product.images[0]" :alt="product.title" srcset="" class="h-10 w-10 object-cover rounded-full">
            </td>
            <td class="text-left py-3 px-4">
              <RouterLink :to="`/products/${product.id}`" class="hover:text-blue-500 hover:underline">
                {{ product.title }}
              </RouterLink>
            </td>
            <td class="text-left py-3 px-4">
              <span class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs font-semibold">
                {{ product.price }}
              </span>
            </td>
            <td class="text-left py-3 px-4">{{ product.sizes.join(', ') }}</td>
          </tr>
        </tbody>
        </table>
      </div>
      <BottomPagination :page="page" :has-more-data="!!products && products.length < 10" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useQuery, useQueryClient } from '@tanstack/vue-query';
  import { watchEffect } from 'vue';

  import { getProductsAction } from '@/modules/products/actions';
  import BottomPagination from '@/modules/common/components/BottomPagination.vue';
  import { usePagination } from '@/modules/common/composables/usePagination';

  
  const { page } =  usePagination();

  const queryClient = useQueryClient();
  const { data: products = [], isLoading,  } = useQuery({
    queryKey: ['products', { page: page }],
    queryFn: () => getProductsAction(page.value),
    // staleTime: 1000 * 60, // 1 minute
  });

  watchEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['products', { page: page.value + 1 }],
      queryFn: () => getProductsAction(page.value + 1),
    })
  });
</script>