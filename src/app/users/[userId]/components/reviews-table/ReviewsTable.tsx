'use client';

import useTable from '@/hooks/useTable';
import { columns } from './table.type';
import Heading from '@/components/text/Heading';
import BaseTable from '@/components/table/BaseTable';
import { ReviewsViewEntity } from '@/types/reviews.type';

interface Props {
  reviews: ReviewsViewEntity[];
}

const ReviewsTable = ({ reviews }: Props) => {
  const table = useTable({
    data: reviews,
    columns,
  });

  return (
    <section className="flex w-full flex-col">
      <Heading.h2>작성한 리뷰</Heading.h2>
      <BaseTable table={table} />
    </section>
  );
};

export default ReviewsTable;
