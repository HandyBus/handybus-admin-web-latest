'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';

export const logout = async () => {
  cookies().delete(AUTH_TOKEN_COOKIE_NAME);
  cookies().set('test cookies', 'true');
  revalidatePath('/', 'layout');
  redirect('/');
};
