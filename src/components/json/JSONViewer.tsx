'use client';

import { useCallback } from 'react';
import BlueButton from '../link/BlueButton';
import BlueLink from '../link/BlueLink';
interface Props {
  children: string;
}

const JSONViewer = ({ children }: Props) => {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [children]);

  return (
    <div className="relative">
      <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
        <BlueLink href="./">formatted</BlueLink>
        <BlueButton onClick={handleCopy}>클립보드에 복사</BlueButton>
      </div>
      <pre className="bg-grey-50 p-8 rounded-lg">{children}</pre>
    </div>
  );
};

export default JSONViewer;
