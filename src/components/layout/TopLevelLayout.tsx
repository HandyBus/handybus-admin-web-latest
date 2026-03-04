'use client';

import Breadcrumbs from './Breadcrumbs';
import Nav from './Nav';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

dayjs.locale('ko');

const TopLevelLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <Nav />
      <div className="flex grow flex-col overflow-scroll bg-[#FAFAFA] p-32">
        <Breadcrumbs />
        {children}
      </div>
    </div>
  );
};

export default TopLevelLayout;
