import { Control, UseFormHandleSubmit, Controller } from 'react-hook-form';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import { FC, useCallback } from 'react';
import { getImageUrl } from '@/services/core.service';

export type AnnouncementFormData = {
  title: string;
  content: string;
};

interface AnnouncementFormProps {
  control: Control<AnnouncementFormData>;
  handleSubmit: UseFormHandleSubmit<AnnouncementFormData>;
  onSubmit: (data: AnnouncementFormData) => void;
  submitButtonText: string;
}

const AnnouncementForm: FC<AnnouncementFormProps> = ({
  control,
  handleSubmit,
  onSubmit,
  submitButtonText,
}) => {
  const plugins = ['font-bold', 'link', 'image'];

  const handleImageUpload = useCallback(
    async (file: File, callback: (url: string) => void) => {
      try {
        const imageUrl = await getImageUrl({
          key: 'concerts', // 임시로 concerts 키를 사용
          file: file,
        });

        if (imageUrl) {
          callback(imageUrl);
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    },
    [],
  );

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
              onImageUpload={handleImageUpload}
              config={{
                image: {
                  uploadCallback: handleImageUpload,
                  accept: 'image/*',
                  maxSize: 5 * 1024 * 1024, // 5MB 제한
                },
              }}
            />
          )}
        />
      </Form.section>
      <Form.submitButton>{submitButtonText}</Form.submitButton>
    </Form>
  );
};

export default AnnouncementForm;
