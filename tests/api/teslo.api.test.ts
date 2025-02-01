import { tesloApi } from "@/api/teslo.api";

describe('Teslo.api.test', () => {
  test( 'should have base url set to VITE_TESLO_API_URL', () => {
    expect( tesloApi.defaults.baseURL ).toEqual( import.meta.env.VITE_TESLO_API_URL );
  });

  test( 'should set authorization header with token from local storage', async () => { 
    const token = 'my auth token';
    localStorage.setItem('token', token);

    const resp = await tesloApi.get('/api/');

    expect( resp.config.headers.Authorization ).toBe(`Bearer ${token}`);
  });

  test( 'should not set authorization header if token is not in local storage', async () => { 
    localStorage.clear();
    const resp = await tesloApi.get('/api/');

    expect( resp.config.headers.Authorization ).toBeUndefined();
  });
});