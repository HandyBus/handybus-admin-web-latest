'use client';

import Heading from '@/components/text/Heading';
import { useForm } from 'react-hook-form';
import {
  useGetAnnouncement,
  usePutAnnouncement,
} from '@/services/core.service';
import { useRouter } from 'next/navigation';
import AnnouncementForm from '@/components/announcement/AnnouncementForm';

type PutAnnouncementFormData = {
  title: string;
  content: string;
};

interface Props {
  params: { announcementId: string };
}

const EditPage = ({ params: { announcementId } }: Props) => {
  const router = useRouter();
  const { data: announcement } = useGetAnnouncement(announcementId);
  const { mutateAsync: putAnnouncement } = usePutAnnouncement();
  const { control, handleSubmit } = useForm<PutAnnouncementFormData>({
    defaultValues: {
      title: announcement?.title ?? '',
      content: announcement?.content ?? '',
    },
  });

  const onSubmit = async (data: PutAnnouncementFormData) => {
    if (confirm('수정하시겠습니까?')) {
      try {
        await putAnnouncement({
          announcementId: announcementId,
          body: {
            ...data,
            isDeleted: false,
          },
        });
        alert('수정되었습니다.');
        router.push(`/announcements/${announcementId}`);
      } catch (error) {
        console.error(error);
        alert('수정에 실패했습니다.\n' + error);
      }
    }
  };

  return (
    <main>
      <Heading>공지사항 수정</Heading>
      <AnnouncementForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitButtonText="수정하기"
      />
    </main>
  );
};

export default EditPage;
