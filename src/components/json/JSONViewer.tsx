'use client';

import { useCallback, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import BlueButton from '../link/BlueButton';

interface Props {
  children: string;
}

const JSONViewer = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [children]);

  return (
    <>
      <BlueButton onClick={() => setIsOpen(true)}>RAW (JSON)</BlueButton>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-4xl space-y-8 bg-white p-24 rounded-xl">
          <div className="relative">
            <div className="flex flex-row flex-wrap gap-4 rounded-lg border border-grey-100 p-8 text-14">
              <BlueButton onClick={handleCopy}>클립보드에 복사</BlueButton>
            </div>
            <pre className="bg-grey-50 p-8 rounded-lg overflow-scroll">
              {children}
            </pre>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default JSONViewer;
