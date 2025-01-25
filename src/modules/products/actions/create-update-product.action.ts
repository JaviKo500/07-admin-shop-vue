import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';

export const createUpdateProductAction = async ( product: Partial<Product> ) => {
  if ( product.id && product.id !== '' ) {
    return await updatedProduct( product );
  }
  return await createProduct( product );
}

const updatedProduct = async ( product: Partial<Product> ) => {
  try {
    const images: string[] = product.images?.map( ( img: string ) => {
      if ( img.startsWith('http') ) {
        const imgName = img.split('/').pop();
        return imgName ?? '';
      }
      return img;
    }) ?? [];
    const productId = product.id;
    delete product.id;
    delete product.user;
    product.images = images;

    const { data } = await tesloApi.patch(`/products/${productId}`, product);
    return data;
  } catch (error) {
    console.error('<--------------- JK Create-update-product.action Error --------------->');
    console.error(error);
    throw new Error('Error updating product');
  }
}


const createProduct = async ( product: Partial<Product> ) => {
  try {
    const images: string[] = product.images?.map( ( img: string ) => {
      if ( img.startsWith('http') ) {
        const imgName = img.split('/').pop();
        return imgName ?? '';
      }
      return img;
    }) ?? [];
    
    delete product.id;
    delete product.user;
    product.images = images;

    const { data } = await tesloApi.post(`/products`, product);
    return data;
  } catch (error) {
    console.error('<--------------- JK Create-update-product.action Error --------------->');
    console.error(error);
    throw new Error('Error creating product');
  }
}

