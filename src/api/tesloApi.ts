import axios from 'axios';

const tesloApi = axios.create({
  baseURL: import.meta.env.TESLO_API_URL,
});

// * interceptors

export { tesloApi }