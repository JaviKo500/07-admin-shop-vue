import { shallowMount } from "@vue/test-utils";

import ProductView from "@/modules/admin/views/ProductView.vue";
import { createRouter, createWebHistory, useRouter } from "vue-router";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { Mock } from "vitest";
import { ref } from "vue";
import { fakeProducts } from "../../../fake/product.fake";

vi.mock('vue-router', async ( original ) => {
  const originalImp = await original();
  return {
    // eslint-disable-next-line
    ...(originalImp as any),
    useRouter: vi.fn(),
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: ProductView,
    }
  ]
});

vi.mock('@tanstack/vue-query');

describe('ProductView.test', () => {
  const mutateSpy = vi.fn();
  const fakeProduct = fakeProducts.at(0);
  const replaceSpy = vi.fn();

  ( useMutation as Mock ).mockReturnValue({
    mutate: mutateSpy,
    isPending: ref(false),
    isSuccess: ref(false),
    data: ref(fakeProduct),
  });

  ( useRouter as Mock ).mockReturnValue({
    replace: replaceSpy,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test( 'should redirect to product if id not found', async () => {
    ( useQuery as Mock ).mockReturnValue({
      data: ref({}),
      isLoading: ref(false),
      isError: ref(true),
      refetch: vi.fn(),
    });

    shallowMount(ProductView, {
      props: {
        productId: '123',
      },
      global: {
        plugins: [
          router,
        ],
      },
    });

    expect( replaceSpy ).toBeCalledWith({
      name: 'admin-products',
    });

  });
});