'use client';

import Heading from '@/components/text/Heading';
import { useForm } from 'react-hook-form';
import { useCreateAnnouncement } from '@/services/core.service';
import { useRouter } from 'next/navigation';
import NoticeForm from '@/components/notice/NoticeForm';

type CreateNoticeFormData = {
  title: string;
  content: string;
};

const NewPage = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<CreateNoticeFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { mutateAsync: createAnnouncement } = useCreateAnnouncement();

  const onSubmit = async (data: CreateNoticeFormData) => {
    if (confirm('작성하시겠습니까?')) {
      try {
        console.log('작성', data);
        await createAnnouncement({
          title: data.title,
          content: data.content,
        });
        alert('작성되었습니다.');
        router.push('/notices');
      } catch (error) {
        alert('작성에 실패했습니다. \n' + error);
      }
    }
  };

  return (
    <main>
      <Heading>공지사항 작성</Heading>
      <NoticeForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitButtonText="작성하기"
      />
    </main>
  );
};

export default NewPage;
