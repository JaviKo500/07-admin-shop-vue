import { defineComponent, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';

import { getProductByIdAction } from '@/modules/products/actions';

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

    const { values } = useForm();
    console.log('<--------------- JK ProductView --------------->');
    console.log(values);

    watchEffect(() => {
      if ( isError.value && !isLoading.value ) {
        router.replace({ name: 'admin-products' });
        return;
      }
    });

    return {
      // properties
      product,
      values,
      // getters
      allSizes: ['XS', 'S', 'M'],
      // actions
    };
  }
});