import Link from 'next/link';
import NavItem from './NavItem';
import LogoIcon from 'public/icons/logo.svg';

const Nav = () => {
  return (
    <nav className="sticky top-0 flex h-64 shrink-0 items-center gap-28 border-b border-grey-200 bg-grey-800 px-28">
      <Link href="/">
        <LogoIcon width={40} height={40} viewBox="0 0 145 144" />
      </Link>
      <NavItem href="/">홈</NavItem>
      <NavItem href="/users">유저 관리</NavItem>
      <NavItem href="/events">행사 관리</NavItem>
      <NavItem href="/reservations">예약 관리</NavItem>
      <NavItem href="/locations">장소</NavItem>
      <NavItem href="/coupons">쿠폰</NavItem>
      <Link
        href="/login"
        className="ml-auto block text-14 font-500 text-grey-200 underline underline-offset-2"
      >
        로그인
      </Link>
    </nav>
  );
};

export default Nav;
