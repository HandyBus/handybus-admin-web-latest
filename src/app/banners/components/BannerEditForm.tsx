import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import { AdminHandleBannerRequestBanners } from '@/types/banner.type';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Form from '@/components/form/Form';
import Input from '@/components/input/Input';
import { ArrowDownIcon, TrashIcon } from 'lucide-react';
import { ArrowUpIcon } from 'lucide-react';
import BannerImageFileInput from './BannerImageFileInput';

const EDIT_GUIDE = `배너 추가/삭제/수정 및 순서를 변경할 수 있습니다.`;

interface BannerEditFormProps {
  banners: AdminHandleBannerRequestBanners[];
  setIsUpdating: (isUpdating: boolean) => void;
  isPending: boolean;
  updateBanner: (banners: AdminHandleBannerRequestBanners[]) => void;
}

const BannerEditForm = ({
  banners,
  setIsUpdating,
  isPending,
  updateBanner,
}: BannerEditFormProps) => {
  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    banners: AdminHandleBannerRequestBanners[];
  }>({
    defaultValues: {
      banners: banners?.sort((a, b) => a.sequence - b.sequence) || [],
    },
  });

  const {
    fields: bannerFields,
    append: appendBanner,
    remove: removeBanner,
    swap: swapBanner,
  } = useFieldArray<{ banners: AdminHandleBannerRequestBanners[] }>({
    control,
    name: 'banners',
  });

  const handleOnSwap = (index: number, direction: 'up' | 'down') => {
    const newIndex = index + (direction === 'up' ? -1 : 1);
    const currentBanners = getValues('banners');
    const currentSequence = currentBanners[index].sequence;
    const targetSequence = currentBanners[newIndex].sequence;
    swapBanner(index, newIndex);
    setValue(`banners.${index}.sequence`, targetSequence);
    setValue(`banners.${newIndex}.sequence`, currentSequence);
  };

  const handleOnCancel = () => {
    setIsUpdating(false);
    reset();
  };

  const handleOnUpdate = async () => {
    const bannersToUpdate = getValues('banners').map((banner, index) => ({
      ...banner,
      sequence: index + 1,
    }));
    updateBanner(bannersToUpdate);
    setIsUpdating(false);
  };

  return (
    <main>
      <Heading className="flex items-baseline gap-20">배너 수정하기</Heading>
      <Form onSubmit={handleSubmit(handleOnUpdate)}>
        <Callout>{EDIT_GUIDE}</Callout>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="w-[100px] rounded-3xl bg-grey-100 p-12"
            onClick={handleOnCancel}
          >
            취소
          </button>
          <button
            type="submit"
            className="w-[100px] rounded-3xl bg-primary-700 p-12 text-white"
            disabled={isPending}
          >
            {isPending ? '처리중...' : '확인'}
          </button>
        </div>
        {bannerFields.map(
          (item: AdminHandleBannerRequestBanners, index: number) => (
            <Form.section
              key={item.id}
              className="flex flex-row items-center justify-between gap-12"
            >
              <div className="flex w-full gap-16">
                <div className="flex flex-col gap-8">
                  <Form.label>배너 이미지</Form.label>
                  <Controller
                    control={control}
                    name={`banners.${index}.imageUrl`}
                    render={({ field: { onChange, value } }) => (
                      <BannerImageFileInput
                        type="concerts"
                        value={value}
                        setValue={(url) => onChange(url || null)}
                        id={item.id || ''}
                      />
                    )}
                  />
                </div>
                <div className="flex w-full flex-col justify-center gap-8">
                  <Form.label>배너 설명</Form.label>
                  <Controller
                    control={control}
                    name={`banners.${index}.title`}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className="w-full"
                        placeholder="배너 설명을 입력해주세요."
                      />
                    )}
                    rules={{
                      required: '배너 설명을 입력해주세요.',
                    }}
                  />
                  {errors.banners?.[index]?.title && (
                    <p className="text-red-500">
                      {errors.banners?.[index]?.title?.message}
                    </p>
                  )}
                  <Form.label>관련 링크</Form.label>
                  <Controller
                    control={control}
                    name={`banners.${index}.linkUrl`}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className="w-full"
                        placeholder="https://www.example.com"
                      />
                    )}
                    rules={{
                      required: '관련 링크를 입력해주세요.',
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: '올바른 URL 형식이 아닙니다.',
                      },
                    }}
                  />
                  {errors.banners?.[index]?.linkUrl && (
                    <p className="text-red-500">
                      {errors.banners?.[index]?.linkUrl?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-20">
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-grey-100 p-12 hover:text-grey-700  disabled:opacity-30"
                  onClick={() => handleOnSwap(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUpIcon />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-grey-100 p-12 hover:text-grey-700  disabled:opacity-30"
                  onClick={() => handleOnSwap(index, 'down')}
                  disabled={index === bannerFields.length - 1}
                >
                  <ArrowDownIcon />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-grey-100 p-12 hover:text-grey-700  disabled:opacity-30"
                  onClick={() => removeBanner(index)}
                >
                  <TrashIcon />
                </button>
              </div>
            </Form.section>
          ),
        )}
        <button
          type="button"
          className="w-[150px] self-center rounded-full bg-primary-700 p-12 text-white"
          onClick={() => {
            appendBanner({
              title: '',
              imageUrl: '',
              linkUrl: '',
              sequence: bannerFields.length + 1,
            });
          }}
        >
          배너 추가
        </button>
      </Form>
    </main>
  );
};

export default BannerEditForm;
