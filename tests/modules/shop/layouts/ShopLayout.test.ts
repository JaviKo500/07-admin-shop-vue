import { shallowMount } from '@vue/test-utils';

import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';

describe('ShopLayout.test', () => {
  test( 'render top menu, router view and footer', () => {
    const wrapper = shallowMount(ShopLayout, {
      global: {
        stubs: ['RouterView'],
      },
    });
    expect( wrapper.findComponent({name: 'TopMenu'}).exists() ).toBe(true);
    expect( wrapper.findComponent({name: 'RouterView'}).exists() ).toBe(true);
    expect( wrapper.findComponent({name: 'CustomFooter'}).exists() ).toBe(true);
  });
});