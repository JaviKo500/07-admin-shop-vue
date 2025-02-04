import path from 'path';
import fs from 'fs';

import { tesloApi } from "@/api/teslo.api";
import { loginActions } from "@/modules/auth/actions";
import type { AuthSuccess } from "@/modules/auth/interfaces";
import { createUpdateProductAction } from "@/modules/products/actions";
import type { Product } from "@/modules/products/interfaces/product.interface";

describe('Create-update-product.action.test', () => {

  beforeAll( async () => {
    const resp = await loginActions( 'test1@google.com', 'Abc123' );
    
    if ( !resp.ok ) throw new Error('Error logging in');

    localStorage.setItem('token', (resp as AuthSuccess).token );
  });
  test( 'should create a new product', async () => {
    const product: Product = {
      id: '',
      title: "test-product-1",
      price: 100,
      description: "test-description-1",
      slug: "test-slug-1",
      stock: 10,
      sizes: [],
      gender: "kid",
      tags: [],
      images: [],
      // eslint-disable-next-line
      user: {} as any,
    };
    const resp = await createUpdateProductAction(product);

    await tesloApi.delete(`/products/${resp.id}`);

    expect( resp ).toEqual({
      title: 'test-product-1',
      price: 100,
      description: 'test-description-1',
      slug: 'test-slug-1',
      stock: 10,
      sizes: [],
      gender: 'kid',
      tags: [],
      images: [],
      user: {
        id: expect.any(String),
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: expect.any(Array),
      },
      id: expect.any(String),
    })
  });

  test( 'should update a product', async () => {
    const product = await tesloApi.get<Product[]>('/products');

    const firstProduct = product.data.at(0);
    const productId = firstProduct?.id ?? '';

    const updatedProduct = {
      ...firstProduct,
      title: 'updated-product-title',
      description: 'updated-product-description',
      stock: 10,
    };

    const resp = await createUpdateProductAction(updatedProduct);

    expect( resp ).toEqual(
      expect.objectContaining({
        ...updatedProduct,
        id: productId,
        title: 'updated-product-title',
        description: 'updated-product-description',
        stock: 10,
        images: expect.any(Array),
        user: expect.anything(),
      })
    );
  });

  test( 'should upload product images', async () => {

    const imagePath = path.resolve(__dirname, '../../../fake', 't-shirt.fake.jpg');
    const imageBuffer = fs.readFileSync(imagePath);

    const imageFile = new File([imageBuffer], 't-shirt.fake.jpg', { type: 'image/jpeg' });

    const product: Product = {
      id: '',
      title: "test-product-1",
      price: 100,
      description: "test-description-1",
      slug: "test-slug-1",
      stock: 10,
      sizes: [],
      gender: "kid",
      tags: [],
      // eslint-disable-next-line
      images: [ imageFile ] as any,
      // eslint-disable-next-line
      user: {} as any,
    };
    const resp = await createUpdateProductAction(product);

    expect( resp.images.length ).toBe(1);
    
    const [ firstImage ] = resp.images;

    expect( typeof firstImage ).toBe('string');

    await tesloApi.delete(`/products/${resp.id}`);
  });

});