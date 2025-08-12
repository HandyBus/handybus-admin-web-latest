import { createColumnHelper } from '@tanstack/react-table';
import { formatDateString } from '@/utils/date.util';
import { ReviewsViewEntity } from '@/types/reviews.type';
import Image from 'next/image';

const columnHelper = createColumnHelper<ReviewsViewEntity>();

export const columns = [
  columnHelper.accessor('createdAt', {
    header: '작성 일시',
    cell: (info) => formatDateString(info.getValue(), 'datetime'),
  }),
  columnHelper.display({
    id: 'shuttleRoute',
    header: () => '행사',
    cell: (props) => {
      const { eventName, eventLocationName, eventArtists } = props.row.original;
      return (
        <p>
          <span className="text-16 font-500">{eventName}</span>
          <br />
          <span className="text-14 font-400 text-basic-grey-600">
            {eventArtists?.map((artist) => artist.artistName).join(', ')}
          </span>
          <br />
          <span className="text-14 font-500 text-basic-grey-700">
            {eventLocationName}
          </span>
        </p>
      );
    },
  }),
  columnHelper.accessor('rating', {
    header: '평점',
    cell: (info) => info.getValue() + '점',
  }),
  columnHelper.accessor('content', {
    header: '내용',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'images',
    header: () => '이미지',
    cell: (props) => {
      const images = props.row.original.reviewImages;
      return (
        <div className="flex gap-4">
          {images && images.length > 0 ? (
            images.map((image) => (
              <Image
                key={image.imageUrl}
                src={image.imageUrl}
                alt="리뷰 이미지"
                width={80}
                height={80}
                className="overflow-hidden object-contain"
              />
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      );
    },
  }),
];
