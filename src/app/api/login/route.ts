import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';
import { NextResponse, type NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const body = new URLSearchParams(
      Array.from(formData, ([key, value]): [string, string] => {
        if (typeof value === 'string') {
          return [key, value];
        } else {
          return [key, value.name];
        }
      }),
    );

    const apiResponse = await fetch(
      new URL('/auth/admin/login', process.env.BASE_URL),
      {
        method: 'POST',
        body,
      },
    );

    if (apiResponse.status === 200) {
      const token = (await apiResponse.json()).token;

      if (token) {
        const url = request.nextUrl.clone();
        url.pathname = '/';

        const response = NextResponse.redirect(url);
        response.cookies.set(AUTH_TOKEN_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        return response;
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  } catch (error) {
    console.error(error);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect('/login');
  }
};
