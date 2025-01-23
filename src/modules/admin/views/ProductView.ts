import { defineComponent, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';

import { getProductByIdAction } from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import CustomDropdown from '@/modules/common/components/CustomDropdown.vue';

const validationSchema = yup.object({
  title: yup.string().required().min(2),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  gender: yup.string().required().oneOf(['kid', 'women', 'men']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
    CustomDropdown,
  },
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

    const { values, defineField, errors, handleSubmit } = useForm({
      validationSchema,
      initialValues: product.value,
    });

    const [ title, titleAttrs ] = defineField('title');
    const [ slug, slugAttrs ] = defineField('slug');
    const [ description, descriptionAttrs ] = defineField('description');
    const [ price, priceAttrs ] = defineField('price');
    const [ stock, stockAttrs ] = defineField('stock');
    const [ gender, genderAttrs ] = defineField('gender');

    const { fields: images } = useFieldArray<string>('images');

    console.log('<--------------- JK ProductView --------------->');
    console.log(images);
    const onSubmit = handleSubmit(( values ) => {
      console.log('<--------------- JK ProductView --------------->');
      console.log(values);
    })
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
      images,
      // getters
      allSizes: ['XS', 'S', 'M'],
      
      // actions
      onSubmit,
    };
  }
});