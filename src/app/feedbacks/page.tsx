'use client';

import useTable from '@/hooks/useTable';
import { useGetFeedbacks } from '@/services/feedback.service';
import { useMemo } from 'react';
import { feedbackColumns } from './table.type';
import BaseTable from '@/components/table/BaseTable';
import Heading from '@/components/text/Heading';

const Page = () => {
  const { data } = useGetFeedbacks();
  const baseArray = useMemo(() => [], []);
  const feedbacks = useMemo(
    () => (data ? data.toReversed() : baseArray),
    [data],
  );

  const feedbackTable = useTable({
    columns: feedbackColumns,
    data: feedbacks,
  });

  return (
    <main>
      <Heading>피드백</Heading>
      <div className="flex flex-col">
        <BaseTable table={feedbackTable} />
      </div>
    </main>
  );
};

export default Page;
