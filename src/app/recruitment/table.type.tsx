'use client';

import { createColumnHelper } from '@tanstack/react-table';
import BlueLink from '@/components/link/BlueLink';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { AdminJobPostingsViewEntity } from '@/types/recruitment.type';

const columnHelper = createColumnHelper<AdminJobPostingsViewEntity>();

export const columns = [
  columnHelper.accessor('title', {
    header: () => '제목',
    cell: (info) => <span className="text-16 font-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('jobCategory', {
    header: () => '직무',
    cell: (info) => Stringifier.jobCategory(info.getValue()),
  }),
  columnHelper.accessor('careerType', {
    header: () => '경력 유형',
    cell: (info) => Stringifier.careerType(info.getValue()),
  }),
  columnHelper.display({
    id: 'careerYears',
    header: () => '경력 기간',
    cell: (info) => {
      const minCareerYears = info.row.original.minCareerYears;
      const maxCareerYears = info.row.original.maxCareerYears;

      if (minCareerYears === null && maxCareerYears === null) {
        return '-';
      }

      if (minCareerYears !== null && maxCareerYears !== null) {
        return `${minCareerYears}년 ~ ${maxCareerYears}년`;
      }

      if (minCareerYears !== null) {
        return `${minCareerYears}년 이상`;
      }

      if (maxCareerYears !== null) {
        return `${maxCareerYears}년 이하`;
      }

      return '-';
    },
  }),
  columnHelper.accessor('isOpen', {
    header: () => '모집 상태',
    cell: (info) => {
      const isOpen = info.getValue();
      return (
        <b
          className={isOpen ? 'text-brand-primary-400' : 'text-basic-grey-500'}
        >
          {isOpen ? '모집 중' : '모집 마감'}
        </b>
      );
    },
  }),
  columnHelper.accessor('closeAt', {
    header: () => '마감일',
    cell: (info) => {
      const closeAt = info.getValue();
      return closeAt ? formatDateString(closeAt, 'date') : '-';
    },
  }),
  columnHelper.accessor('jobApplicationCount', {
    header: () => '지원자 수',
    cell: (info) => `${info.getValue()}명`,
  }),
  columnHelper.accessor('createdAt', {
    header: () => '생성일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'actions',
    header: '액션',
    cell: (props) => (
      <div className="flex flex-col items-center gap-8">
        <BlueLink href={`/recruitment/${props.row.original.jobPostingId}`}>
          지원자 목록
        </BlueLink>
        <BlueLink href={`/recruitment/${props.row.original.jobPostingId}/edit`}>
          수정하기
        </BlueLink>
      </div>
    ),
  }),
];
