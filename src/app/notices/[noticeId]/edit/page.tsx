'use client';

import Heading from '@/components/text/Heading';
import MdEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import Form from '@/components/form/Form';
import { Controller } from 'react-hook-form';
import Input from '@/components/input/Input';
import { useForm } from 'react-hook-form';

type CreateNoticeFormData = {
  title: string;
  content: string;
};

const EditPage = () => {
  const { control, handleSubmit } = useForm<CreateNoticeFormData>({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = (data: CreateNoticeFormData) => {
    if (confirm('수정하시겠습니까?')) {
      console.log('수정', data);
    }
  };

  const plugins = ['font-bold', 'link'];

  return (
    <main>
      <Heading>공지사항 수정</Heading>
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
    </main>
  );
};

export default EditPage;
