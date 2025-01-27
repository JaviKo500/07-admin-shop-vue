import { defineComponent, ref, watch, watchEffect } from 'vue';

import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';

import { createUpdateProductAction, getProductByIdAction } from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import CustomDropdown from '@/modules/common/components/CustomDropdown.vue';

const validationSchema = yup.object({
  title: yup.string().required('Este campo es super importante').min(2),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  gender: yup.string().required().oneOf(['kid', 'women', 'men', 'unisex']),
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
    const toast = useToast();

    const { data: product, isError, isLoading, refetch } = useQuery({
      queryKey: [ 'product', props.productId ],
      queryFn: () => getProductByIdAction( props.productId ),
      retry: false,
    });

    const {
      mutate,  
      isPending, 
      isSuccess: isUpdateProductSuccess, 
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
      // initialValues: product.value,
    });

    const [ title, titleAttrs ] = defineField('title');
    const [ slug, slugAttrs ] = defineField('slug');
    const [ description, descriptionAttrs ] = defineField('description');
    const [ price, priceAttrs ] = defineField('price');
    const [ stock, stockAttrs ] = defineField('stock');
    const [ gender, genderAttrs ] = defineField('gender');

    const { fields: images } = useFieldArray<string>('images');
    const { fields: sizes, remove: removeSize, push: addSize } = useFieldArray<string>('sizes');

    const imageFiles = ref<File[]>([]);

    const onSubmit = handleSubmit(( values ) => {
      mutate( values )
    })

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map( s => s.value );
      const hasSize =  currentSizes.includes(size);
      if ( hasSize ) {
        removeSize(currentSizes.indexOf(size));
      } else {
        addSize(size);
      }
    }

    const onFileChange = ( event: Event ) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files;

      if ( !fileList ) return;
      if ( !fileList.length ) return;

      for (const imageFile of fileList) {
        const { type } = imageFile;
        if ( !type.includes('image/') ) continue;
        imageFiles.value.push( imageFile );
      }
    }

    watchEffect(() => {
      if ( isError.value && !isLoading.value ) {
        router.replace({ name: 'admin-products' });
        return;
      }
    });

    watch(
      product,
      () => {
        if ( !product ) return;

        resetForm({
          values: product.value,
        });

      },
      {
        deep: true,
        immediate: true,
      }
    );

    watch(
      isUpdateProductSuccess,
      ( value ) => {
        if ( !value ) return;
        if ( props.productId === '+' ) {
          toast.success('Created product successfully');
        } else {
          toast.success('Product updated successfully');
        }
        router.replace(`/admin/products/${updatedProduct.value.id}`);
        resetForm({
          values: updatedProduct.value
        });
      }
    );

    watch(
      () => props.productId,
      () => {
        refetch();
      },
      {
        immediate: true,
      }
    );

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
      sizes,
      meta,
      isPending,
      imageFiles,

      // getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      
      // actions
      onSubmit,
      toggleSize,
      hasSize : ( size: string ) => {
        const currentSizes = sizes.value.map( size => size.value );
        return currentSizes.includes(size);
      },
      onFileChange,
      tempImageUrl: ( imageFile: File ) => {
        return URL.createObjectURL(imageFile);
      },
    };
  }
});