import { getProductByIdAction, getProductsAction } from '@/modules/products/actions';

describe('Get-product-by-id.action.test', () => {
  test( 'should return product on create argument', async () => {
    const product = await getProductByIdAction('+');
    expect( product ).toEqual({
      description: '',
      gender: '',
      id: '',
      images: [],
      price: 0,
      sizes: [],
      slug: '',
      stock: 0,
      tags: [],
      title: '',
      user: expect.anything(),
    });
  });

  test( 'should return a product if id is found', async () => {
    const products = await getProductsAction(1,1);
    
    const firstProduct = products.at(0);
    expect( firstProduct ).toBeDefined();

    const product = await getProductByIdAction( firstProduct?.id ?? '' );
    expect( product ).toEqual( firstProduct );
  });
  
  test( 'should return empty product if id is not found', async () => {
    try {
      await getProductByIdAction( 'test-id' );
      expect(true).toBe(false);
      // eslint-disable-next-line
    } catch (error: any) {
      expect( error.message ).toBe('Error getting product by id test-id');
    }
  });
});