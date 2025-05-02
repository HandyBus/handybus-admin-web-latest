'use client';

import Heading from '@/components/text/Heading';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import Form from '@/components/form/Form';
import { Control, Controller, UseFormHandleSubmit } from 'react-hook-form';
import Input from '@/components/input/Input';
import { useForm } from 'react-hook-form';
import {
  useGetAnnouncement,
  useUpdateAnnouncement,
} from '@/services/core.service';
import { useRouter } from 'next/navigation';

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
      <EditForm
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </main>
  );
};

const EditForm = ({
  control,
  handleSubmit,
  onSubmit,
}: {
  control: Control<CreateNoticeFormData>;
  handleSubmit: UseFormHandleSubmit<CreateNoticeFormData>;
  onSubmit: (data: CreateNoticeFormData) => void;
}) => {
  const plugins = ['font-bold', 'link'];
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.section>
        <Form.label>제목</Form.label>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input type="text" value={value} setValue={onChange} />
          )}
        />
      </Form.section>
      <Form.section className="w-full">
        <Form.label>내용</Form.label>
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <MdEditor
              value={value}
              className="min-h-400 min-w-full"
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={({ text }) => onChange(text)}
              plugins={plugins}
            />
          )}
        />
      </Form.section>
      <Form.submitButton>작성하기</Form.submitButton>
    </Form>
  );
};

export default EditPage;
