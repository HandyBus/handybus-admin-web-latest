'use client';

import { createColumnHelper } from '@tanstack/react-table';
import Stringifier from '@/utils/stringifier.util';
import { formatDateString } from '@/utils/date.util';
import { JobApplicationResponseModel } from '@/types/recruitment.type';
import EditJobApplicationStatusDialog from './components/EditJobApplicationStatusDialog';

const columnHelper = createColumnHelper<JobApplicationResponseModel>();

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
  columnHelper.accessor('applicantCareerYears', {
    header: () => '경력',
    cell: (info) => {
      const careerYears = info.getValue();
      return careerYears !== null ? `${careerYears}년` : '-';
    },
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
    header: () => '지원일',
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
