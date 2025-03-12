'use client';

import Link from 'next/link';
import NavItem from './NavItem';
import LogoIcon from 'public/icons/logo.svg';
import { ListIcon } from 'lucide-react';
import { useState } from 'react';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 flex h-64 shrink-0 items-center gap-28 border-b border-grey-200 bg-grey-800 px-28 max-[500px]:hidden">
        <Link href="/">
          <LogoIcon width={40} height={40} viewBox="0 0 145 144" />
        </Link>
        <NavItems />
        <Link
          href="/login"
          className="ml-auto text-14 font-500 text-grey-200 underline underline-offset-2"
        >
          로그인
        </Link>
      </nav>
      <nav className="sticky top-0 hidden h-40 shrink-0 items-center justify-between border-b border-grey-200 bg-grey-800 px-8 max-[500px]:flex ">
        <Link href="/">
          <LogoIcon width={24} height={24} viewBox="0 0 145 144" />
        </Link>
        <ListIcon
          color="white"
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        />
      </nav>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-end bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`flex h-full w-100 flex-col gap-28 bg-grey-800 p-24 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <NavItems />
          <Link
            href="/login"
            className="text-14 font-500 text-grey-200 underline underline-offset-2"
          >
            로그인
          </Link>
        </div>
      </div>
    </>
  );
};

export default Nav;

const NavItems = () => {
  return (
    <>
      <NavItem href="/">홈</NavItem>
      <NavItem href="/users">유저</NavItem>
      <NavItem href="/events">행사</NavItem>
      <NavItem href="/reservations">예약</NavItem>
      <NavItem href="/locations">장소</NavItem>
      <NavItem href="/coupons">쿠폰</NavItem>
      <NavItem href="/banners">배너</NavItem>
    </>
  );
};
