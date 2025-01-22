import Link from 'next/link';
import NavItem from './NavItem';
import LogoIcon from 'public/icons/logo.svg';

const Nav = () => {
  return (
    <nav className="flex bg-grey-800 gap-28 h-64 border-b border-grey-200 items-center px-28">
      <Link href="/">
        <LogoIcon width={40} height={40} viewBox="0 0 145 144" />
      </Link>
      <NavItem href="/">홈</NavItem>
      <NavItem href="/events">행사</NavItem>
      <NavItem href="/demands">수요조사</NavItem>
      <NavItem href="/reservations">예약</NavItem>
      <NavItem href="/hubs">거점지</NavItem>
      <NavItem href="/artists">아티스트</NavItem>
      <NavItem href="/coupons">쿠폰</NavItem>
    </nav>
  );
};

export default Nav;
