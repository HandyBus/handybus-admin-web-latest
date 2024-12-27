'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addArtist } from '@/app/actions/artists.action';
import { PlusIcon } from 'lucide-react';
import Input from '@/components/input/Input';

const NewArtistPage = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = useCallback(
    ({ name }: { name: string }) => {
      if (confirm(`"${name}" 아티스트를 추가하시겠습니까?`)) {
        addArtist(name)
          .then(() => {
            alert('아티스트가 추가되었습니다.');
          })
          .catch((error) => {
            const stack =
              error instanceof Error ? error.stack : 'Unknown Error';
            alert(`아티스트 추가에 실패했습니다. 스택: ${stack}`);
          })
          .finally(() => router.push('/artists'));
      }
    },
    [router],
  );

  return (
    <main className="h-full w-full bg-white flex flex-col gap-16">
      <h2 className="text-24 font-500">아티스트 정보</h2>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        method="post"
      >
        <Controller
          control={control}
          name="name"
          rules={{
            required: '필수 입력',
            pattern: {
              value: /^(?!\s*$).+/,
              message: '공백으로만 이루어진 입력은 허용되지 않습니다.',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                value={value}
                setValue={onChange}
                placeholder="아티스트 이름을 입력해주세요."
              />
              {errors?.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </>
          )}
        />

        <button type="submit" className="rounded-lg bg-blue-500 p-8 text-white">
          <PlusIcon />
        </button>
      </form>
    </main>
  );
};

export default NewArtistPage;
