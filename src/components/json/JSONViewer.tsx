'use client';

import { useCallback, useMemo, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import BlueButton from '../link/BlueButton';

interface Props {
  value: unknown;
}

const JSONViewer = ({ value }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const json = useMemo(() => JSON.stringify(value, null, 2), [value]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [json]);

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>RAW (JSON)</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="flex max-h-full max-w-full flex-col space-y-8 rounded-16 bg-basic-white p-24">
          <div className="flex flex-row flex-wrap gap-4 rounded-8 border border-basic-grey-100 p-8 text-14">
            <BlueButton onClick={handleCopy}>클립보드에 복사</BlueButton>
            <BlueButton onClick={() => setIsOpen(false)}>닫기</BlueButton>
          </div>
          <div className="relative flex h-auto flex-col overflow-auto">
            <pre className="rounded-8 bg-basic-grey-50 p-8 ">{json}</pre>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default JSONViewer;
