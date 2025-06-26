'use client';

import Heading from '@/components/text/Heading';
import { useForm } from 'react-hook-form';
import { usePostAnnouncement } from '@/services/core.service';
import { useRouter } from 'next/navigation';
import AnnouncementForm from '@/components/announcement/AnnouncementForm';

type CreateAnnouncementFormData = {
  title: string;
  content: string;
};

const NewPage = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<CreateAnnouncementFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { mutateAsync: postAnnouncement } = usePostAnnouncement();

  const onSubmit = async (data: CreateAnnouncementFormData) => {
    if (confirm('작성하시겠습니까?')) {
      try {
        await postAnnouncement({
          title: data.title,
          content: data.content,
        });
        alert('작성되었습니다.');
        router.push('/announcements');
      } catch (error) {
        alert('작성에 실패했습니다. \n' + error);
      }
    }
  };

  return (
    <main>
      <Heading>공지사항 작성</Heading>
      <AnnouncementForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitButtonText="작성하기"
      />
    </main>
  );
};

export default NewPage;
