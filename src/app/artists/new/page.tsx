'use client';

import { useRouter } from 'next/navigation';
import { useCallback, type FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { addArtist } from '@/app/actions/artists.action';
import TextInput from '@/components/text-input/TextInput';

const NewArtistPage = () => {
  const router = useRouter();
  const { trigger, setValue, control, getValues } = useForm<{ name: string }>({
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const { name } = getValues();
      if (confirm(`"${name}" 아티스트를 추가하시겠습니까?`)) {
        (async () => {
          const isStepValid = await trigger(['name']);
          if (!isStepValid) {
            return;
          }
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
        })();
      }
    },
    [getValues, router, trigger],
  );

  return (
    <main className="h-full w-full bg-white flex flex-col gap-16">
      <h2 className="text-24 font-500">아티스트 정보</h2>
      <form onSubmit={handleSubmit} method="post">
        <TextInput
          name="name"
          control={control}
          setValue={setValue}
          placeholder="아티스트 이름을 입력해주세요."
          rules={{
            required: '필수 입력',
            pattern: {
              value: /^(?!\s*$).+/,
              message: '공백으로만 이루어진 입력은 허용되지 않습니다.',
            },
          }}
        >
          이름
        </TextInput>
        <button type="submit" className="rounded-lg bg-blue-500 p-8 text-white">
          추가
        </button>
      </form>
    </main>
  );
};

export default NewArtistPage;
