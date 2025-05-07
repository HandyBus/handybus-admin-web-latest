import { Control, UseFormHandleSubmit, Controller } from 'react-hook-form';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import { FC } from 'react';

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
      <Form.submitButton>{submitButtonText}</Form.submitButton>
    </Form>
  );
};

export default AnnouncementForm;
