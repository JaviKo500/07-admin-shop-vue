import { tesloApi } from '@/api/teslo.api';
import type { Product } from '../interfaces/product.interface';

export const createUpdateProductAction = async ( product: Partial<Product> ) => {
  const productId = product.id;
  const cleanProduct = cleanProductForCreateOrUpdate(product);

  if ( productId && productId !== '' ) {
    return await updatedProduct( productId, cleanProduct );
  }

  return await createProduct( cleanProduct );
}

const cleanProductForCreateOrUpdate = (product: Partial<Product>) => {
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
  return product;
}
const updatedProduct = async (productId:string, product: Partial<Product> ) => {
  try {
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
    const { data } = await tesloApi.post(`/products`, product);
    return data;
  } catch (error) {
    console.error('<--------------- JK Create-update-product.action Error --------------->');
    console.error(error);
    throw new Error('Error creating product');
  }
}

const uploadImages = async ( images: (string | File)[] ) => {
  try {
    const imageFile = images[0] as File;
    const formData = new FormData();
    formData.append('file', imageFile)
    const { data } = await tesloApi.post<{ secureUrl: string }>('/files/product', formData);
    return data.secureUrl;
  } catch (error) {
    console.error('<--------------- JK Create-update-product.action Error --------------->');
    console.error(error);
    throw new Error('Error uploading image');
  }
}

