import { z } from 'zod';
import { instance } from './config';

export const postLogin = async (body: {
  identifier: string;
  password: string;
}) => {
  const res = await instance.post('/v1/auth/admin/login', body, {
    shape: {
      token: z.string(),
    },
  });
  return res.token;
};
