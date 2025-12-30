'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { JobApplicationResponseModel } from '@/types/recruitment.type';
import EditJobApplicationStatusDialog from '../components/EditJobApplicationStatusDialog';
import { useState } from 'react';

const columnHelper = createColumnHelper<JobApplicationResponseModel>();

const ExpandableMessage = ({ message }: { message: string | null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 50;

  if (!message) {
    return <span>-</span>;
  }

  const shouldTruncate = message.length > MAX_LENGTH;

  if (!shouldTruncate) {
    return <span>{message}</span>;
  }

  return (
    <div className="flex flex-col gap-4">
      <span className={isExpanded ? '' : 'line-clamp-2'}>{message}</span>
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-fit text-14 text-brand-primary-400 underline"
      >
        {isExpanded ? '접기' : '더보기'}
      </button>
    </div>
  );
};

export const columns = [
  columnHelper.accessor('applicantName', {
    header: () => '지원자 이름',
    cell: (info) => <span className="text-16 font-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('applicantEmail', {
    header: () => '이메일',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('applicantPhoneNumber', {
    header: () => '전화번호',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'customJobTitle',
    header: () => '희망 직무',
    cell: (info) => {
      const customJobTitle = info.row.original.customJobTitle;
      return customJobTitle || '-';
    },
  }),
  columnHelper.accessor('wantsCoffeeChat', {
    header: () => '커피챗 희망 여부',
    cell: (info) => (info.getValue() ? '예' : '아니오'),
  }),
  columnHelper.display({
    id: 'messageToTeam',
    header: () => '팀에게 전하는 메시지',
    cell: (info) => (
      <ExpandableMessage message={info.row.original.messageToTeam} />
    ),
  }),
  columnHelper.accessor('status', {
    header: () => '상태',
    cell: (info) => {
      const status = info.getValue();
      const statusText = Stringifier.jobApplicationStatus(status);
      const style = {
        SUBMITTED: 'text-basic-grey-500',
        REVIEWING: 'text-brand-primary-400',
        PASSED: 'text-basic-green-500',
        REJECTED: 'text-basic-red-500',
      };
      return <b className={style[status]}>{statusText}</b>;
    },
  }),
  columnHelper.display({
    id: 'files',
    header: () => '파일',
    cell: (info) => {
      const resumeFile = info.row.original.resumeFile;
      const portfolioFile = info.row.original.portfolioFile;

      return (
        <div className="gap-2 flex flex-col">
          {resumeFile && (
            <a
              href={resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-14 text-brand-primary-400 underline"
            >
              이력서
            </a>
          )}
          {portfolioFile && (
            <a
              href={portfolioFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-14 text-brand-primary-400 underline"
            >
              포트폴리오
            </a>
          )}
          {!resumeFile && !portfolioFile && <span>-</span>}
        </div>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => '등록일',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '액션',
    cell: (info) => (
      <EditJobApplicationStatusDialog jobApplication={info.row.original} />
    ),
  }),
];
