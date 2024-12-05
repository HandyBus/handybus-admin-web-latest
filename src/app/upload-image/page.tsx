'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import URLView from './components/URLView';

type FormValues = {
  key: 'concerts' | 'users/profiles' | 'reviews';
  image: FileList;
};

const UploadImagePage = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const imageFile = data.image[0];
    if (!imageFile) return;

    const extension =
      imageFile.type === 'image/svg+xml'
        ? 'svg'
        : imageFile.type.split('/').at(1) || '';

    try {
      const cdnUrl = await addImageFile(data.key, extension, imageFile);
      setUploadedUrl((prev) => [...prev, cdnUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Guide>prefix는 이미지를 분류하기 위한 키입니다.</Guide>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-16 rounded-lg bg-grey-50 gap-16 flex flex-col"
      >
        <label>
          Prefix
          <select {...register('key')} defaultValue="concerts">
            <option value="concerts">Concerts</option>
            <option value="users/profiles">User Profiles</option>
            <option value="reviews">Reviews</option>
          </select>
        </label>
        <label>
          이미지
          <input type="file" {...register('image')} accept="image/*" />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="p-8 bg-blue-500 rounded-lg text-white disabled:bg-gray-300"
        >
          {isSubmitting ? '업로드 중...' : '업로드'}
        </button>
      </form>

      {uploadedUrl.map((url) => (
        <URLView key={url} url={url} />
      ))}
    </div>
  );
};

export default UploadImagePage;

import { clientInstance } from '@/services/client';
import Guide from '@/components/guide/Guide';

const addImageFile = async (
  key: 'concerts' | 'users/profiles' | 'reviews',
  extension: string,
  image: File,
) => {
  const presigned = await clientInstance.get('/common/image/presigned-url', {
    params: { key, extension },
  });

  const presignedUrl = presigned.data.presignedUrl;
  const cdnUrl = presigned.data.cdnUrl;

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
