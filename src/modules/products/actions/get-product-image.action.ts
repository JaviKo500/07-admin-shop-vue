export const getProductImageAction = ( imageIdentifier: string ): string => {
  return imageIdentifier.includes('http')
    ? imageIdentifier
    : `${import.meta.env.VITE_TESLO_API_URL}/files/product/${imageIdentifier}`;
}