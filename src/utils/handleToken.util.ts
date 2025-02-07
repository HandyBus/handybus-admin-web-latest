import revalidateAllPath from '@/app/actions/revalidateAllPath';

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

// 로그아웃
export const logout = async () => {
  removeToken();
  await revalidateAllPath();
};
