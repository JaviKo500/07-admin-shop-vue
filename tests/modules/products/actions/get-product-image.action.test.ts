import { getProductImageAction } from "@/modules/products/actions";

describe('Get-product-image.action.test', () => {
  test( 'should return proper image url', () => {
    const imageName = 'test-image.jpg';
    const url = getProductImageAction(imageName);

    const expectedUrl = `${import.meta.env.VITE_TESLO_API_URL}/files/product/${imageName}`;

    expect( url ).toBe( expectedUrl );
  });
  test( 'should return image url with http includes path', () => {
    const imageUrl = `${import.meta.env.VITE_TESLO_API_URL}/files/product/test-image.jpg`;;
    const url = getProductImageAction(imageUrl);

    expect( url ).toBe( imageUrl );
  });
});