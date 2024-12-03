'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="size-full bg-white p-32">
      <h2>예상하지 못한 오류가 발생했습니다.</h2>
      <h3>오류 메시지</h3>
      <code className="block rounded-lg bg-grey-800 p-32 text-white">
        {error.message}
      </code>
      <h3>스택</h3>
      <code className="block rounded-lg bg-grey-800 p-32 text-white">
        {error.stack}
      </code>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        새로고침
      </button>
    </div>
  );
}
