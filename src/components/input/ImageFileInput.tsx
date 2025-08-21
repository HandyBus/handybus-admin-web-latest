'use client';

import { Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { customTwMerge } from 'tailwind.config';
import Image from 'next/image';
import { ImageKey, getImageUrl } from '@/services/core.service';

interface Props {
  type: ImageKey;
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  htmlFor?: string;
}

const ImageFileInput = ({ type, value, setValue, htmlFor }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = file !== null;
  const isPending = value === null || value === undefined || value === '';

  useEffect(() => {
    if (file) {
      getImageUrl({ key: type, file }).then((newUrl) => {
        setFile(null);
        setValue(newUrl);
      });
    }
  }, [file, setValue, type]);

  return (
    <div className="flex flex-col items-center">
      {!isPending && (
        <div className="relative mb-24 h-[166px] w-[117px] bg-basic-grey-200">
          <Image
            src={value}
            alt="새로 등록할 포스터 이미지"
            fill
            className="object-contain"
          />
        </div>
      )}
      {isLoading && <Loader2Icon className="animate-spin" />}

      {!isLoading && (
        <label
          htmlFor={htmlFor || 'image_upload'}
          className={customTwMerge(
            `flex h-[50px] w-full cursor-pointer items-center justify-center gap-4 rounded-[8px] font-600`,
            isPending
              ? 'bg-brand-primary-50 text-brand-primary-400 active:[&:not([disabled])]:bg-brand-primary-100'
              : 'bg-basic-grey-100 text-basic-grey-700 active:[&:not([disabled])]:bg-basic-grey-200',
          )}
        >
          {isPending ? ' 이미지 업로드' : ' 이미지 변경'}
          <input
            ref={inputRef}
            disabled={file !== null}
            id={htmlFor || 'image_upload'}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setFile(file);
            }}
          />
        </label>
      )}

      <div />
    </div>
  );
};

export default ImageFileInput;
