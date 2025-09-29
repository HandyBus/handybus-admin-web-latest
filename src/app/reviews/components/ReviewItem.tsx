import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import ImageModal from './ImageModal';
import { ReviewsViewEntityProduct } from '@/types/reviews.type';
import UserProfile from './UserProfile';
import Rating from './Rating';
import ReviewProperty from './ReviewProperty';
import { formatDateString } from '@/utils/date.util';
import Link from 'next/link';

interface Props {
  review: ReviewsViewEntityProduct;
}

const ReviewItem = ({ review }: Props) => {
  const [openImageUrl, setOpenImageUrl] = useState<string | null>(null);
  const [clamped, setClamped] = useState(false);
  const [useClamp, setUseClamp] = useState(true);

  const prevWidth = useRef(0);

  const ref = useCallback(
    (node: HTMLParagraphElement | null) => {
      if (node !== null) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.target.clientWidth === prevWidth.current) continue;
            if (!useClamp) continue;
            prevWidth.current = entry.target.clientWidth;
            setClamped(entry.target.scrollHeight > entry.target.clientHeight);
          }
        });
        resizeObserver.observe(node);

        return () => {
          resizeObserver.unobserve(node);
        };
      }
    },
    [useClamp],
  );

  const getDisplayName = () => {
    if (review.userName) {
      return review.userName;
    }
    if (review.userNickname) {
      return review.userNickname;
    }
    return '핸디버스 탑승객';
  };

  const displayName = getDisplayName();

  return (
    <>
      <article>
        <div key={review.reviewId} className={`flex flex-col rounded-8 p-12`}>
          <div className="flex flex-col items-start gap-[2px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <UserProfile
                  name={review.userName || review.userNickname}
                  profileImage={review.userProfileImage}
                />
                <Link
                  className="text-12 font-500 leading-[160%] text-basic-black hover:text-basic-blue-400 hover:underline hover:underline-offset-[3px]"
                  href={`/users/${review.userId}`}
                >
                  {displayName}
                </Link>
              </div>
              <Rating size="medium" value={review.rating} />
            </div>
            <ReviewProperty review={review} />
            {review.reviewImages && review.reviewImages.length > 0 && (
              <figure className="flex gap-4 py-4">
                {review.reviewImages?.map((image, index) => {
                  return (
                    <button
                      type="button"
                      className="relative h-60 w-60"
                      key={index}
                      onClick={() => {
                        setOpenImageUrl(image.imageUrl);
                      }}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={`${review.eventName} 후기 이미지 ${index + 1}`}
                        fill
                        className="rounded-8 object-cover"
                      />
                    </button>
                  );
                })}
              </figure>
            )}
            <p
              ref={ref}
              className={`overflow-hidden text-14 font-500 leading-[160%] text-basic-grey-600 ${
                useClamp ? 'line-clamp-2' : ''
              }`}
            >
              {review.content}
            </p>
            {clamped && (
              <button
                className="text-14 font-500 leading-[160%] text-basic-grey-500"
                onClick={() => setUseClamp((prev) => !prev)}
              >
                {useClamp ? '더보기' : '접기'}
              </button>
            )}
          </div>
          <div className="mt-4 flex w-full items-center justify-between gap-4">
            <p className="line-clamp-1 text-12 font-500 leading-[160%] text-basic-grey-400">
              {review.eventName}
            </p>
            <p className="text-12 font-500 leading-[160%] text-basic-grey-500">
              {formatDateString(review.createdAt, 'date')}
            </p>
          </div>
        </div>
      </article>
      {openImageUrl && (
        <ImageModal
          imageUrl={openImageUrl}
          onClose={() => setOpenImageUrl(null)}
        />
      )}
    </>
  );
};

export default ReviewItem;
