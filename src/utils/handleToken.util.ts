import revalidateAllPath from '@/app/actions/revalidateAllPath';
import { Cookies } from 'react-cookie';

// Token
export const TOKEN = 'token';

export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN);
};

// Is Logged In
const cookieStorage = new Cookies();
export const IS_LOGGED_IN = 'is-logged-in';
export const COOKIE_OPTIONS = {
  secure: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',
  sameSite: 'strict',
  path: '/',
} as const;

export const getIsLoggedIn = () => {
  return Boolean(cookieStorage.get(IS_LOGGED_IN));
};

export const setIsLoggedIn = () => {
  cookieStorage.set(IS_LOGGED_IN, '1', COOKIE_OPTIONS);
};

export const removeIsLoggedIn = () => {
  cookieStorage.remove(IS_LOGGED_IN, COOKIE_OPTIONS);
};

// 로그아웃
export const logout = async () => {
  removeToken();
  removeIsLoggedIn();
  await revalidateAllPath();
};
