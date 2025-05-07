'use client';

import Heading from '@/components/text/Heading';
import { useForm } from 'react-hook-form';
import {
  useGetAnnouncement,
  useUpdateAnnouncement,
} from '@/services/core.service';
import { useRouter } from 'next/navigation';
import NoticeForm from '@/components/notice/NoticeForm';

type CreateNoticeFormData = {
  title: string;
  content: string;
};

interface Props {
  params: { noticeId: string };
}

const EditPage = ({ params: { noticeId } }: Props) => {
  const router = useRouter();
  const { data: announcement } = useGetAnnouncement(noticeId);
  const { mutateAsync: updateAnnouncement } = useUpdateAnnouncement();
  const { control, handleSubmit } = useForm<CreateNoticeFormData>({
    defaultValues: {
      title: announcement?.title ?? '',
      content: announcement?.content ?? '',
    },
  });

  const onSubmit = async (data: CreateNoticeFormData) => {
    if (confirm('수정하시겠습니까?')) {
      try {
        await updateAnnouncement({
          announcementId: noticeId,
          body: {
            ...data,
            isDeleted: false,
          },
        });
        alert('수정되었습니다.');
        router.push(`/notices/${noticeId}`);
      } catch (error) {
        console.error(error);
        alert('수정에 실패했습니다.\n' + error);
      }
    }
  };

  return (
    <main>
      <Heading>공지사항 수정</Heading>
      <NoticeForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitButtonText="수정하기"
      />
    </main>
  );
};

export default EditPage;
