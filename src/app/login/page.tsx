'use client';

import Heading from '@/components/text/Heading';
import { postLogin } from '@/services/auth.service';
import {
  getIsLoggedIn,
  logout,
  setIsLoggedIn,
  setToken,
} from '@/utils/handleToken.util';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await postLogin({ identifier, password });
      setToken(res);
      setIsLoggedIn();
      router.push('/');
      toast.success('로그인 되었습니다.');
    } catch {
      toast.error('아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleLogout = () => {
    const isLoggedIn = getIsLoggedIn();
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
        onSubmit={handleSubmit}
        className="mx-auto my-20 flex w-full max-w-500 flex-col items-center justify-center gap-12"
      >
        <input
          type="text"
          placeholder="아이디"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full rounded-[4px] border border-grey-100 p-12"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
