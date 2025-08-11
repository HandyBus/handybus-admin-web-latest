'use client';

import useTable from '@/hooks/useTable';
import { useGetFeedbacks } from '@/services/feedback.service';
import { useMemo } from 'react';
import { cancelReasonColumns } from './table.type';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';

const Page = () => {
  const { data } = useGetFeedbacks();
  const cancelReasons = useMemo(() => {
    return (
      data
        ?.filter((feedback) => feedback.subject.includes('취소 사유'))
        .toReversed() ?? []
    );
  }, [data]);

  const cancelReasonTable = useTable({
    columns: cancelReasonColumns,
    data: cancelReasons,
  });

  return (
    <main>
      <Heading>예약 취소 사유</Heading>
      <div className="flex flex-col">
        <BaseTable table={cancelReasonTable} />
      </div>
    </main>
  );
};

export default Page;
