import { defineComponent, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { getProductByIdAction } from '@/modules/products/actions';

const validationSchema = yup.object({
  title: yup.string().required().min(2),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  gender: yup.string().required().oneOf(['kid', 'women', 'men']),
});

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

    const { values, defineField, errors } = useForm({
      validationSchema,
    });

    const [ title, titleAttrs ] = defineField('title');
    const [ slug, slugAttrs ] = defineField('slug');
    const [ description, descriptionAttrs ] = defineField('description');
    const [ price, priceAttrs ] = defineField('price');
    const [ stock, stockAttrs ] = defineField('stock');
    const [ gender, genderAttrs ] = defineField('gender');

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
      errors,
      title, 
      titleAttrs,
      slug, 
      slugAttrs,
      description, 
      descriptionAttrs,
      price, 
      priceAttrs,
      stock, 
      stockAttrs,
      gender, 
      genderAttrs,

      // getters
      allSizes: ['XS', 'S', 'M'],
      
      // actions
    };
  }
});