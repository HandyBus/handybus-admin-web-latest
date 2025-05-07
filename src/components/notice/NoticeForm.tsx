import { Control, UseFormHandleSubmit, Controller } from 'react-hook-form';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import { FC } from 'react';

export type NoticeFormData = {
  title: string;
  content: string;
};

interface NoticeFormProps {
  control: Control<NoticeFormData>;
  handleSubmit: UseFormHandleSubmit<NoticeFormData>;
  onSubmit: (data: NoticeFormData) => void;
  submitButtonText: string;
}

const NoticeForm: FC<NoticeFormProps> = ({
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

export default NoticeForm;
