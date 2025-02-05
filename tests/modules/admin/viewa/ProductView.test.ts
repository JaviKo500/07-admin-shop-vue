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

  test( 'should render page with a product', async () => {
    ( useQuery as Mock ).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });
    const wrapper = shallowMount(ProductView, {
      props: {
        productId: '1234',
      },
      global: {
        plugins: [
          router,
        ],
      },
    });

    const customInputs = wrapper.findAllComponents({ name: 'CustomInput' });
    const customTextArea = wrapper.findAllComponents({ name: 'CustomTextArea' });
    const sizeButtons = wrapper.findAll('button.flex-1');
    expect( customInputs.length ).toBe(4);
    // eslint-disable-next-line
    const productValues = Object.values(fakeProduct as any);
    customInputs.forEach( customInput => {
      const modelValue = customInput.props('modelValue');
      expect( productValues ).toContain(modelValue);
    });
    customTextArea.forEach( customTextArea => { 
      const modelValue = customTextArea.props('modelValue');
      expect( productValues ).toContain(modelValue);
    });

    sizeButtons.forEach( sizeButton => {
      if ( fakeProduct?.sizes.includes(sizeButton.text()) ) {
        expect( sizeButton.classes() ).toContain('bg-blue-500');
      } else {
        expect( sizeButton.classes() ).toContain('bg-blue-100');
      }
    });
  });

  test( 'should submit a form if data is valid', async () => {
    ( useQuery as Mock ).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });
    const wrapper = shallowMount(ProductView, {
      props: {
        productId: '1234',
      },
      global: {
        plugins: [
          router,
        ],
      },
    });

    const form = wrapper.find('form');
    await form.trigger('submit');

    await new Promise( resolve => setTimeout(resolve, 1000) );

    expect(  mutateSpy ).toHaveBeenCalled();
    expect(  mutateSpy ).toHaveBeenCalledWith(fakeProduct);
  });

  test( 'should not called submit a form if data is invalid', async () => {
    ( useQuery as Mock ).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      refetch: vi.fn(),
      data: ref(fakeProduct),
    });
    const wrapper = shallowMount(ProductView, {
      props: {
        productId: '1234',
      },
      global: {
        plugins: [
          router,
        ],
      },
    });

    const titleInput = wrapper.findComponent({ name: 'CustomInput' });
    titleInput.vm.$emit('update:modelValue');
    const form = wrapper.find('form');
    await form.trigger('submit');

    await new Promise( resolve => setTimeout(resolve, 1000) );

    expect(  mutateSpy ).not.toHaveBeenCalled();
  });
});