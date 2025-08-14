'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlusIcon } from 'lucide-react';
import Input from '@/components/input/Input';
import { usePostArtist } from '@/services/artist.service';
import Heading from '@/components/text/Heading';
import Form from '@/components/form/Form';

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

  const { mutate: postArtist } = usePostArtist({
    onSuccess: () => {
      alert('아티스트가 추가되었습니다.');
      router.push('/artists');
    },
    onError: (error) => {
      const stack = error instanceof Error ? error.stack : 'Unknown Error';
      alert(`아티스트 추가에 실패했습니다. 스택: ${stack}`);
    },
  });

  const onSubmit = useCallback(
    ({ name }: { name: string }) => {
      if (confirm(`"${name}" 아티스트를 추가하시겠습니까?`)) {
        postArtist({ name });
      }
    },
    [router],
  );

  return (
    <main className="flex h-full w-full flex-col gap-16 bg-basic-white">
      <Heading>아티스트 추가</Heading>
      <Form onSubmit={handleSubmit(onSubmit)} method="post">
        <Form.section>
          <Form.label required>아티스트 이름</Form.label>
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
                  <p className="text-basic-red-500">{errors.name.message}</p>
                )}
              </>
            )}
          />
        </Form.section>
        <Form.submitButton>
          추가하기 <PlusIcon />
        </Form.submitButton>
      </Form>
    </main>
  );
};

export default NewArtistPage;
