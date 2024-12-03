'use client';
import { logout } from '@/app/actions/logout.action';

const LogoutButton = () => {
  return (
    <form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        logout();
      }}
    >
      <button type="submit">로그아웃</button>
    </form>
  );
};

export default LogoutButton;
