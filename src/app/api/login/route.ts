import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/auth';
import { NextResponse, type NextRequest } from 'next/server';
import { instance } from '@/services/config';
import { formToJSON } from 'axios';

export const POST = async (request: NextRequest) => {
  try {
    const apiResponse = await instance.post<LoginResponse>(
      '/auth/admin/login',
      formToJSON(await request.formData()),
    );

    // ASSERT : apiResponse.status === 200
    const issuedToken = (await apiResponse).data.token;

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

interface LoginResponse {
  statusCode: number;
  ok: boolean;
  token: string;
}
