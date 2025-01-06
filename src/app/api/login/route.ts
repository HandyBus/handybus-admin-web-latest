import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';
import { NextResponse, type NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const apiResponse = await fetch(
      new URL('/auth/admin/login', process.env.NEXT_PUBLIC_BASE_URL),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.get('identifier')?.toString(),
          password: formData.get('password')?.toString(),
        }),
      },
    );

    // ASSERT : apiResponse.status === 200
    const issuedToken = (
      (await apiResponse.json()) as {
        statusCode: number;
        ok: boolean;
        token: string;
      }
    ).token;

    if (issuedToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      const response = NextResponse.redirect(url);

      response.cookies.set(AUTH_TOKEN_COOKIE_NAME, issuedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return response;
    } else {
      throw new Error('Token not found in response');
    }
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
};
