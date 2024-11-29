import 'server-only';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { accessToken } from '@/utils/auth.util';

export const BASE_URL = process.env.BASE_URL;

const cookiesInterceptor = async (req: InternalAxiosRequestConfig) => {
  const token = await accessToken();
  req.headers.set('Authorization', `Bearer ${token}`);
  return req;
};

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(cookiesInterceptor);

export { instance };
