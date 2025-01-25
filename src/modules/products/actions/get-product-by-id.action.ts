import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductByIdAction = async ( productId: string ): Promise<Product> => {
  try {
    if ( productId === '+' ) return {
      id: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      gender: '',
      images: [],
      sizes: [],
      // eslint-disable-next-line
      user: {} as any,
      tags: [],
    };
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);
    return {
      ...data,
      images: data.images.map( getProductImageAction )
    };
  } catch (error) {
    console.log('<--------------- JK Get-product-by-id.action Error --------------->');
    console.log(error);
    throw new Error(`Error getting product by id ${productId}`);
  }
}