'use client';

import Heading from '@/components/text/Heading';
import { postLogin } from '@/services/auth.service';
import { getToken, logout, setToken } from '@/utils/handleToken.util';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface FormValues {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const { handleSubmit, register } = useForm<FormValues>();

  const handleLogin = async (values: FormValues) => {
    try {
      const res = await postLogin(values);
      setToken(res);
      router.push('/');
      toast.success('로그인 되었습니다.');
    } catch {
      toast.error('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleLogout = () => {
    const isLoggedIn = !!getToken();
    if (!isLoggedIn) {
      toast.error('로그인 상태가 아닙니다.');
      return;
    }
    logout();
    router.push('/login');
    toast.success('로그아웃 되었습니다.');
  };

  return (
    <main>
      <Heading>로그인</Heading>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(handleLogin)}
        className="mx-auto my-20 flex w-full max-w-500 flex-col items-center justify-center gap-12"
      >
        <input
          type="text"
          placeholder="아이디"
          {...register('identifier')}
          className="w-full rounded-[4px] border border-grey-100 p-12"
        />
        <input
          type="password"
          placeholder="비밀번호"
          {...register('password')}
          className="w-full rounded-[4px] border border-grey-100 p-12"
        />
        <button className="h-40 w-full rounded-[4px] bg-blue-500 text-white">
          로그인
        </button>
        <button
          type="button"
          className="text-14 font-500 text-grey-700 underline underline-offset-2"
          onClick={() => handleLogout()}
        >
          로그아웃
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
