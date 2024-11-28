import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';

export const accessToken = () => {
  return cookies().get(AUTH_TOKEN_COOKIE_NAME)?.value;
};
