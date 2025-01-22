import { getProductByIdAction } from '@/modules/products/actions';
import { useQuery } from '@tanstack/vue-query';
import { defineComponent, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    productId: {
      type: String,
      required: true,
    }
  },
  setup( props ){
    const router = useRouter();
    const { data: product, isError, isLoading } = useQuery({
      queryKey: [ 'product', props.productId ],
      queryFn: () => getProductByIdAction( props.productId ),
      retry: false,
    });

    watchEffect(() => {
      if ( isError.value && !isLoading.value ) {
        router.replace({ name: 'admin-products' });
        return;
      }
    });

    return {
      // properties
      product,
      // getters
      allSizes: ['XS', 'S', 'M'],
      // actions
    };
  }
});