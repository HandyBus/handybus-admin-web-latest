'use client';

import { CheckIcon, ImagePlusIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

interface Props {
  type: 'concerts' | 'users/profiles' | 'reviews';
  value: string | undefined;
  setValue: (value: string | undefined) => void;
}

const ImageFileInput = ({ type, value, setValue }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = file !== null;
  const isPending = value === null || value === undefined || value === '';

  useEffect(() => {
    if (file) {
      addImageFile(type, file).then((newUrl) => {
        setFile(null);
        setValue(newUrl);
      });
    }
  }, [file, setValue, type]);

  return (
    <div className="size-full flex flex-row justify-between items-center bg-white border border-grey-300 p-8 rounded-lg">
      <div className="w-[80px] h-[110px] overflow-hidden rounded-lg bg-grey-200">
        {!isPending && (
          <Image
            src={value}
            alt="새로 등록할 포스터 이미지"
            width={80}
            height={110}
          />
        )}
      </div>
      {isLoading && <Loader2Icon className="animate-spin" />}

      {!isLoading && (
        <label
          htmlFor="image_upload"
          className={twJoin(
            `flex items-center text-white gap-2 p-4 cursor-pointer rounded-lg`,
            isPending ? 'bg-blue-400' : 'bg-grey-600',
            'active:scale-90 transition-transform',
          )}
        >
          {isPending ? <ImagePlusIcon /> : <CheckIcon />}
          {isPending ? ' 이미지 업로드' : ' 이미지 업로드됨, 새로 업로드하기…'}
          <input
            ref={inputRef}
            disabled={file !== null}
            id="image_upload"
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

import Image from 'next/image';
import { getPresignedUrl } from '@/services/api/common.services';

const addImageFile = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  image: File,
) => {
  // check if the content type is image
  if (!image.type.startsWith(`image`)) {
    throw new Error(`Invalid file type : ${image.type}`);
  }

  const extension =
    image.type === 'image/svg+xml' ? 'svg' : image.type.split('/').at(1) || '';

  const presigned = await getPresignedUrl(key, extension);
  const presignedUrl = presigned.presignedUrl;
  const cdnUrl = presigned.cdnUrl;

  const buffer = await image.arrayBuffer();

  // check if the content type is image
  if (!image.type.startsWith(`image`)) {
    throw new Error(`Invalid file type : ${image.type}`);
  }

  // base url을 사용해선 안되므로 fetch 사용
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': image.type,
      'Content-Length': buffer.byteLength.toString(),
    },
    body: buffer,
  });

  return cdnUrl;
};
