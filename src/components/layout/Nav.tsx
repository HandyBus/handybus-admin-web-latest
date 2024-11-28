import NavItem from './NavItem';

const Nav = () => {
  return (
    <nav className="flex flex-col">
      <ul className="gap-16 rounded-lg border border-primary-main bg-white p-20 text-18 text-black">
        <NavItem href="/">홈</NavItem>
        <NavItem href="/shuttles">셔틀</NavItem>
        <NavItem href="/revervations">예약</NavItem>
        <NavItem href="/hubs">거점지</NavItem>
        <NavItem href="/artists">아티스트</NavItem>
        <NavItem href="/coupons">쿠폰</NavItem>
      </ul>
    </nav>
  );
};

export default Nav;
