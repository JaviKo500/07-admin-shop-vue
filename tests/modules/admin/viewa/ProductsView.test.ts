import { shallowMount } from "@vue/test-utils";

import { useQuery, useQueryClient } from "@tanstack/vue-query";

import type { Mock } from "vitest";

import ProductsView from "@/modules/admin/views/ProductsView.vue";
import { fakeProducts } from "../../../fake/product.fake";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: ProductsView,
    }
  ]
});
vi.mock('@tanstack/vue-query', () => {
  return {
    useQueryClient: vi.fn().mockReturnValue({
      prefetchQuery: vi.fn(),
    }),
    useQuery: vi.fn(),
  }
});

describe('ProductsView.test', () => {
  ( useQuery as Mock ).mockReturnValue({
    data: fakeProducts,
    isLoading: false,
  });

  window.scrollTo = vi.fn();

  const wrapper = shallowMount(ProductsView, {
    global: {
      plugins: [
        router,
      ]
    }
  });

  test( 'should render with default values', async () => {
    expect( wrapper.html() ).toMatchSnapshot();
  });

  test( 'should prefetch query on mounted', async () => {
    await router.replace('/?page=2');
    expect( window.scrollTo ).toBeCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    expect( useQueryClient().prefetchQuery ).toBeCalledWith({
      queryFn: expect.any(Function),
      queryKey: [
       'products',
        {
          page: 3,
        },
      ],
    });

  });
});