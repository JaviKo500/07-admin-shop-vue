import { shallowMount } from "@vue/test-utils";

import ProductsView from "@/modules/admin/views/ProductsView.vue";
import router from "@/router";
import { useQuery } from "@tanstack/vue-query";
import type { Mock } from "vitest";
import { fakeProducts } from "../../../fake/product.fake";

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

  test( 'should render with default values', async () => {
    const wrapper = shallowMount(ProductsView, {
      global: {
        plugins: [
          router,
        ]
      }
    });

    expect( wrapper.html() ).toMatchSnapshot();
  });
});