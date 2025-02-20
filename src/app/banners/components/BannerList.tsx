import { AdminHandleBannerRequestBanners } from '@/types/banner.type';
import Callout from '@/components/text/Callout';
import Input from '@/components/input/Input';
import Image from 'next/image';
import Form from '@/components/form/Form';
import Heading from '@/components/text/Heading';
import BlueButton from '@/components/link/BlueButton';
const VIEW_GUIDE =
  '배너 목록을 조회합니다. 편집하기 버튼을 눌러서 배너를 편집할 수 있습니다.';

interface BannerListProps {
  setIsUpdating: (isUpdating: boolean) => void;
  isUpdating: boolean;
  banners: AdminHandleBannerRequestBanners[];
}

const BannerList = ({
  setIsUpdating,
  isUpdating,
  banners,
}: BannerListProps) => {
  return (
    <main className="flex flex-col gap-20">
      <Heading className="flex items-baseline gap-20">배너 조회하기</Heading>
      <Callout>{VIEW_GUIDE}</Callout>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="w-[150px] rounded-3xl bg-primary-700 p-12 text-white"
          onClick={() => {
            setIsUpdating(!isUpdating);
          }}
        >
          {banners.length === 0 ? '배너 추가하기' : '배너 편집하기'}
        </button>
      </div>
      {banners
        .sort((a, b) => a.sequence - b.sequence)
        .map((item: AdminHandleBannerRequestBanners) => (
          <Form.section
            key={item.id}
            className="flex flex-row items-center justify-between gap-12"
          >
            <div className="flex w-full gap-16">
              <div className="flex flex-col gap-8">
                <Form.label>배너 이미지</Form.label>
                <div className="relative h-[160px] w-[375px]">
                  <Image
                    src={item.imageUrl || '/default-event.png'}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col justify-center gap-8">
                <Form.label>배너 설명</Form.label>
                <Input
                  value={item.title}
                  disabled={true}
                  className="w-full"
                  placeholder="배너 설명을 입력해주세요."
                />
                <Form.label>
                  관련 링크{'  '}
                  <BlueButton
                    onClick={() => {
                      window.open(item.linkUrl, '_blank', 'noreferrer');
                    }}
                    className="text-[14px] font-400"
                  >
                    바로가기
                  </BlueButton>
                </Form.label>
                <Input
                  value={item.linkUrl}
                  disabled={true}
                  className="w-full"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </Form.section>
        ))}
    </main>
  );
};

export default BannerList;
