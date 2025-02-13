import { useCallback, useState } from 'react';
import Input from '../input/Input';
import CustomModal from './CustomModal';
import { usePostArtist } from '@/services/shuttleOperation.service';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { queryClient } from '../Provider';
import { CustomError } from '@/services/custom-error';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NewArtistsModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClosed={() => setIsOpen(false)}
      styles="flex h-[auto] w-[432px] flex-col items-center rounded-lg border-[1px] border-grey-200 bg-white p-28"
    >
      <NewArtistsModalContent setIsOpen={setIsOpen} />
    </CustomModal>
  );
};
export default NewArtistsModal;

const NewArtistsModalContent = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>('');

  const validateName = (value: string) => {
    if (!value) {
      setError('필수 입력');
      return false;
    }
    if (/^\s*$/.test(value)) {
      setError('공백으로만 이루어진 입력은 허용되지 않습니다.');
      return false;
    }
    setError('');
    return true;
  };

  const linkToast = (
    <div className="bg-primary-800">
      <p className="text-14 font-400 leading-[22.4px]">추가되었습니다.</p>
      <Link
        href={'/artists'}
        target="_blank"
        rel="noreferrer"
        className="text-12 font-400 leading-[19.2px] underline"
      >
        아티스트 관리
      </Link>
    </div>
  );

  const { mutate: postArtist } = usePostArtist({
    onSuccess: () => {
      toast.success(linkToast);
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      setIsOpen(false);
    },
    onError: (error) => {
      const stack =
        error instanceof CustomError ? error.stack : 'Unknown Error';
      console.error(stack);
      alert('아티스트 추가에 실패하였습니다.');
      setIsOpen(false);
    },
  });

  const onSubmit = useCallback(() => {
    if (!validateName(name)) return;

    if (confirm(`"${name}" 아티스트를 추가하시겠습니까?`)) {
      postArtist({ name });
    }
  }, [name]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      onSubmit();
    }
  };

  return (
    <>
      <h2 className="self-start pb-[20px] text-18 font-600 leading-[25.2px]">
        아티스트
      </h2>
      <div className="gap-6 flex w-full flex-col pb-32">
        <h3 className="text-14 font-400 leading-[22.4px]">아티스트 이름</h3>
        <div>
          <Input
            value={name}
            setValue={(value) => {
              setName(value);
              validateName(value);
            }}
            placeholder="아티스트 이름을 입력해주세요."
            onKeyDown={handleKeyDown}
            autoFocus={true}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      <div className="flex w-full gap-12">
        <button
          type="button"
          onClick={handleClose}
          className="h-[46px] w-[210px] rounded-lg border-[1px] border-grey-200 bg-white px-[18px] py-[10px] text-16 font-600 leading-[22.4px]"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="h-[46px] w-[210px] rounded-lg bg-blue-500 px-[18px] py-[10px] text-16 font-600 leading-[22.4px] text-white"
        >
          추가하기
        </button>
      </div>
    </>
  );
};
