import 'server-only';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/utils/auth.util';

export const BASE_URL = process.env.BASE_URL;

const cookiesInterceptor = async (req: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  req.headers.set('Authorization', `Bearer ${token}`);
  return req;
};

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(cookiesInterceptor);

export { instance };
