import 'server-only';
import axios, {
  type InternalAxiosRequestConfig,
  type AxiosRequestTransformer,
} from 'axios';
import { getAccessToken } from '@/utils/auth.util';
import dayjs from 'dayjs';

export const BASE_URL = process.env.BASE_URL;

const cookiesInterceptor = async (req: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  req.headers.set('Authorization', `Bearer ${token}`);
  return req;
};

// date stringify 처리
// NOTE this binding 때문에 arrow function을 사용할 수 없음
const dateTransformer: AxiosRequestTransformer = function (
  this,
  data,
  headers,
) {
  if (data instanceof Date) {
    const date = dayjs(data);

    if (date.startOf('day').isSame(date)) {
      return date.format('YYYY-MM-DD');
    }

    return date.format('YYYY-MM-DD HH:mm:ss');
  }
  if (Array.isArray(data)) {
    return data.map((val) => dateTransformer.call(this, val, headers));
  }
  if (isPlainObject(data)) {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [
        key,
        dateTransformer.call(this, val, headers),
      ]),
    );
  }
  return data;
};

const instance = axios.create({
  baseURL: BASE_URL,
  transformRequest: [dateTransformer].concat(
    axios.defaults.transformRequest || [],
  ),
});

instance.interceptors.request.use(cookiesInterceptor);

export { instance };

const isPlainObject = (v: unknown) =>
  Object.prototype.toString.call(v) === '[object Object]';
