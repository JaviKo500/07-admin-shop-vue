import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';

export const getProductsAction = async ( page: number, limit: number = 10 ) => {
  try {
    const { data } = await tesloApi.get<Product[]>('/products', {
      params: {
        offset: page * limit,
        limit,
      }
    });
    console.log('<--------------- JK Get-products --------------->');
    console.log(data);
  } catch (error) {
    console.log('<--------------- JK Get-products Error --------------->');
    console.log(error);
    throw new Error('Error getting products');
  }
}