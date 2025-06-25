'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

interface RouteConfig {
  path: string;
  name: string;
  parent?: string;
}

const ROUTES: RouteConfig[] = [
  // 유저 관리
  { path: '/users', name: '유저 대시보드' },
  { path: '/users/:id', name: '유저 상세 페이지', parent: '/users' },
  // 행사 관리
  { path: '/events', name: '행사 대시보드' },
  { path: '/events/new', name: '행사 추가하기', parent: '/events' },
  { path: '/events/:id/edit', name: '행사 수정하기', parent: '/events' },
  {
    path: '/events/:id/dates/:id',
    name: '일자별 행사 상세 정보',
    parent: '/events',
  },
  {
    path: '/events/:id/dates/:id/demands',
    name: '수요조사 대시보드',
    parent: '/events',
  },
  {
    path: '/events/:id/dates/:id/routes/:id',
    name: '노선 정보',
    parent: '/events/:id/dates/:id',
  },
  {
    path: '/events/:id/dates/:id/routes/:id/reservations',
    name: '노선별 예약 관리',
    parent: '/events/:id/dates/:id',
  },
  {
    path: '/events/:id/dates/:id/routes/new',
    name: '노선 추가하기',
    parent: '/events/:id/dates/:id',
  },
  {
    path: '/events/:id/dates/:id/routes/:id/edit',
    name: '노선 수정하기',
    parent: '/events/:id/dates/:id/routes/:id',
  },
  // 예약 관리
  { path: '/reservations', name: '예약 대시보드' },
  {
    path: '/reservations/:id',
    name: '예약 상세 정보',
    parent: '/reservations',
  },
  // 장소 관리
  { path: '/locations', name: '장소 대시보드' },
  { path: '/locations/new', name: '장소 추가하기', parent: '/locations' },
  {
    path: '/locations/:id/hubs/:id/edit',
    name: '장소 수정하기',
    parent: '/locations',
  },
  // 쿠폰 관리
  { path: '/coupons', name: '쿠폰 대시보드' },
  { path: '/coupons/new', name: '쿠폰 추가하기', parent: '/coupons' },
  // 아티스트 관리
  { path: '/artists', name: '아티스트 대시보드' },
  { path: '/artists/new', name: '아티스트 추가하기', parent: '/artists' },
  // 공지사항 관리
  { path: '/announcements', name: '공지사항 대시보드' },
  {
    path: '/announcements/new',
    name: '공지사항 추가하기',
    parent: '/announcements',
  },
  {
    path: '/announcements/:id',
    name: '공지사항 상세 정보',
    parent: '/announcements',
  },
  // 피드백 관리
  { path: '/feedbacks', name: '피드백 대시보드' },
];

const Breadcrumbs = () => {
  const pathname = usePathname();

  // 현재 경로를 정규화
  const normalizePath = (path: string) => {
    return path
      .split('/')
      .map((segment) =>
        /^\d+$/.test(segment) ? ':' + segment.replace(/\d+/, 'id') : segment,
      )
      .join('/');
  };

  // 브레드크럼 경로 생성
  const getBreadcrumbs = (currentPath: string): RouteConfig[] => {
    const normalizedPath = normalizePath(currentPath);

    const currentRoute = ROUTES.find(
      (route) => normalizePath(route.path) === normalizedPath,
    );

    if (!currentRoute) {
      return [];
    }

    const breadcrumbs: RouteConfig[] = [currentRoute];
    let parent = currentRoute.parent;

    while (parent) {
      const parentRoute = ROUTES.find((route) => route.path === parent);
      if (parentRoute) {
        breadcrumbs.unshift(parentRoute);
        parent = parentRoute.parent;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  // 정규화 된 경로를 실제 경로로 변환
  const generateActualPath = (normalizedPath: string) => {
    const pathSegments = pathname.split('/');
    return normalizedPath
      .split('/')
      .map((segment, index) =>
        segment.startsWith(':') ? pathSegments[index] : segment,
      )
      .join('/');
  };

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex shrink-0 items-center gap-4 text-12 text-grey-600">
      {breadcrumbs.map((route, index) => (
        <Fragment key={index}>
          <span>
            <Link
              href={generateActualPath(route.path)}
              className="underline underline-offset-2"
            >
              {route.name}
            </Link>
          </span>
          {index !== breadcrumbs.length - 1 && (
            <span className="text-grey-600">&gt;</span>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
