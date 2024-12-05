'use client';
import { useCallback, useState } from 'react';

interface Props {
  url: string;
}

const URLView = ({ url }: Props) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  }, [url]);

  return (
    <div className="flex items-center gap-4">
      <div>{url}</div>
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {copyFeedback ? '복사됨!' : '복사'}
      </button>
    </div>
  );
};

export default URLView;
