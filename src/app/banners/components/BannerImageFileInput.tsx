'use client';

import { CheckIcon, ImagePlusIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import Image from 'next/image';
import { ImageKey, getImageUrl } from '@/services/core.service';

interface Props {
  type: ImageKey;
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  id: string;
}

const BannerImageFileInput = ({ type, value, setValue, id }: Props) => {
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
    <div className="flex size-full flex-col items-center justify-between gap-16 rounded-8 border border-basic-grey-300 bg-basic-white p-8">
      <div className="h-[160px] w-[375px] overflow-hidden rounded-8 bg-basic-grey-200">
        {!isPending && value && (
          <Image
            src={value}
            alt="새로 등록할 포스터 이미지"
            width={375}
            height={160}
          />
        )}
      </div>
      {isLoading && <Loader2Icon className="animate-spin" />}

      {!isLoading && (
        <label
          htmlFor={`image_upload_${id}`}
          className={twJoin(
            `gap-2 flex cursor-pointer items-center rounded-8 p-4 text-basic-white`,
            isPending ? 'bg-basic-blue-400' : 'bg-basic-grey-600',
            'transition-transform active:scale-90',
          )}
        >
          {isPending ? <ImagePlusIcon /> : <CheckIcon />}
          {isPending ? ' 이미지 업로드' : ' 이미지 업로드됨, 새로 업로드하기…'}
          <input
            ref={inputRef}
            disabled={file !== null}
            id={`image_upload_${id}`}
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

export default BannerImageFileInput;
