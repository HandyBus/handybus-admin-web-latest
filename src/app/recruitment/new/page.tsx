'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';
import Input from '@/components/input/Input';
import NumberInput from '@/components/input/NumberInput';
import { usePostJobPosting } from '@/services/recruitment.service';
import Form from '@/components/form/Form';
import {
  AdminCreateJobPostingRequest,
  JobCategory,
  JobCategoryEnum,
  CareerType,
  CareerTypeEnum,
} from '@/types/recruitment.type';
import dayjs from 'dayjs';
import Button from '@/components/button/Button';
import Stringifier from '@/utils/stringifier.util';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import { getImageUrl } from '@/services/core.service';

interface FormValues {
  title: string;
  jobCategory: JobCategory;
  careerType: CareerType;
  minCareerYears: number;
  maxCareerYears?: number;
  description: string;
  closeAt: string;
}

const defaultValues: Partial<FormValues> = {
  title: undefined,
  jobCategory: undefined,
  careerType: undefined,
  minCareerYears: 0,
  maxCareerYears: undefined,
  description: undefined,
  closeAt: undefined,
};

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  const { mutateAsync: postJobPosting } = usePostJobPosting();

  const plugins = ['font-bold', 'link', 'image'];

  const handleImageUpload = useCallback(
    async (file: File, callback: (url: string) => void) => {
      try {
        const imageUrl = await getImageUrl({
          key: 'job-postings',
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

  const onSubmit = async (data: FormValues) => {
    if (!confirm('채용 공고를 추가하시겠습니까?')) {
      return;
    }
    setIsSubmitting(true);

    try {
      const body: AdminCreateJobPostingRequest = {
        title: data.title,
        jobCategory: data.jobCategory,
        careerType: data.careerType,
        minCareerYears: data.minCareerYears,
        maxCareerYears: data.maxCareerYears,
        description: data.description,
        closeAt: dayjs(data.closeAt).toISOString(),
      };

      await postJobPosting(body);

      alert('채용 공고가 등록되었습니다.');
      router.push('/recruitment');
    } catch (error) {
      console.error('Error creating job posting:', error);
      alert(
        '채용 공고 등록에 실패했습니다, ' +
          (error instanceof Error && error.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.section>
        <Form.label required>제목</Form.label>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              type="text"
              value={value}
              placeholder="채용 공고 제목을 입력해주세요"
              setValue={onChange}
            />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>직무 카테고리</Form.label>
        <Controller
          control={control}
          name="jobCategory"
          render={({ field: { onChange, value } }) => (
            <div className="flex flex-wrap gap-8">
              {JobCategoryEnum.options.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="large"
                  variant={value === category ? 'primary' : 'tertiary'}
                  onClick={() => onChange(category)}
                >
                  {Stringifier.jobCategory(category)}
                </Button>
              ))}
            </div>
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>경력 유형</Form.label>
        <Controller
          control={control}
          name="careerType"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-8">
              {CareerTypeEnum.options.map((type) => (
                <Button
                  key={type}
                  type="button"
                  size="large"
                  variant={value === type ? 'primary' : 'tertiary'}
                  onClick={() => onChange(type)}
                >
                  {Stringifier.careerType(type)}
                </Button>
              ))}
            </div>
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label required>최소 경력 연수</Form.label>
        <Controller
          control={control}
          name="minCareerYears"
          render={({ field: { onChange, value } }) => (
            <NumberInput
              value={value}
              setValue={onChange}
              placeholder="최소 경력 연수를 입력해주세요"
            />
          )}
        />
      </Form.section>
      <Form.section>
        <Form.label>최대 경력 연수</Form.label>
        <Controller
          control={control}
          name="maxCareerYears"
          render={({ field: { onChange, value } }) => (
            <NumberInput
              value={value ?? 0}
              setValue={(val) => onChange(val > 0 ? val : undefined)}
              placeholder="최대 경력 연수를 입력해주세요 (선택사항)"
            />
          )}
        />
      </Form.section>
      <Form.section className="w-full">
        <Form.label required>설명</Form.label>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <MdEditor
              value={value || ''}
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
      <Form.section>
        <Form.label required>마감일시</Form.label>
        <Controller
          control={control}
          name="closeAt"
          render={({ field: { onChange, value } }) => {
            const dateValue = value
              ? dayjs(value).format('YYYY-MM-DDTHH:mm')
              : '';
            return (
              <Input
                type="datetime-local"
                value={dateValue}
                setValue={(str) => {
                  if (!str) {
                    return;
                  }
                  try {
                    const newDate = dayjs(str).toISOString();
                    onChange(newDate);
                  } catch (error) {
                    console.error('Invalid date format:', error);
                  }
                }}
              />
            );
          }}
        />
      </Form.section>
      <Form.submitButton disabled={isSubmitting}>
        {isSubmitting ? '등록 중...' : '채용 공고 등록하기'}
      </Form.submitButton>
    </Form>
  );
};

export default Page;
