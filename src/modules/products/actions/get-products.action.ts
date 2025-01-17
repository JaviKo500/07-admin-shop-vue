import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './index';

export const getProductsAction = async ( page: number = 1, limit: number = 10 ) => {
  try {
    const { data } = await tesloApi.get<Product[]>('/products', {
      params: {
        offset: page * limit,
        limit,
      }
    });
    return data.map( product => (
      {
        ...product,
        images: product.images.map( image => getProductImageAction(image) ),
      }
    ));
  } catch (error) {
    console.log('<--------------- JK Get-products Error --------------->');
    console.log(error);
    throw new Error('Error getting products');
  }
}