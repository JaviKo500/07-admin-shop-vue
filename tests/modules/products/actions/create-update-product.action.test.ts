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
        id: '1cf94c33-db63-48f1-8a78-21c456ce9f4b',
        email: 'test1@google.com',
        fullName: 'Test One',
        isActive: true,
        roles: expect.any(Array),
      },
      id: expect.any(String),
    })
  });
});