import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-product-image.action';

export const getProductByIdAction = async ( productId: string ): Promise<Product> => {
  try {
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