'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { usePutEvent } from '@/services/event.service';
interface Props {
  eventId: string;
  dailyEventId: string;
  openChatUrl?: string;
}

const EditDailyEventOpenChatUrl = ({
  eventId,
  dailyEventId,
  openChatUrl,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<{ openChatUrl: string }>({
    defaultValues: {
      openChatUrl: '',
    },
  });

  const { mutateAsync: mutateEvent } = usePutEvent();

  const onSubmit = async (data: { openChatUrl: string }) => {
    if (!confirm('공지방 링크를 수정하시겠습니까?')) return;

    try {
      await mutateEvent({
        eventId: eventId,
        body: {
          dailyEvents: [
            {
              dailyEventId,
              metadata: {
                openChatUrl: data.openChatUrl,
              },
            },
          ],
        },
      });

      alert('공지방 링크가 수정되었습니다.');

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('공지방 링크 수정에 실패했습니다.');
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="text-14 text-basic-blue-400 underline underline-offset-[3px]"
        onClick={() => setIsOpen(true)}
      >
        공지방 링크 추가/수정하기
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 flex w-screen items-center justify-center bg-basic-black/30 p-4 transition duration-75 ease-out data-[closed]:opacity-0"
      >
        <DialogPanel className="max-w-lg space-y-8 rounded-16 bg-basic-white p-24">
          <DialogTitle className="text-26 font-700">
            공지방 링크 추가/수정하기
          </DialogTitle>
          {openChatUrl && (
            <p className="text-14 text-basic-grey-700">
              반영된 공지방 링크: {openChatUrl}
            </p>
          )}
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name={`openChatUrl`}
              rules={{
                required: '공지방 링크를 입력해주세요.',
                pattern: {
                  value: /^https:\/\/open\.kakao\.com\/o\/[A-Za-z0-9]+$/,
                  message: '올바른 공지방 링크를 입력해주세요.',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <input
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-8 border border-basic-grey-100 bg-basic-white p-8"
                    placeholder={`${openChatUrl || '공지방 링크를 입력해주세요.'}`}
                  />
                  {errors.openChatUrl && (
                    <p className="text-12 font-600 text-basic-red-500">
                      {errors.openChatUrl.message}
                    </p>
                  )}
                </>
              )}
            />
            <div className="flex justify-end gap-4 text-basic-white [&>button]:rounded-8 [&>button]:px-16 [&>button]:py-4">
              <button
                type="button"
                className="bg-basic-grey-400 transition-all hover:scale-95 active:scale-90"
                onClick={() => setIsOpen(false)}
              >
                이 창 닫기
              </button>
              <button
                className={`bg-basic-blue-400 transition-all ${
                  isSubmitting ? '' : 'hover:scale-95 active:scale-90'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                disabled={isSubmitting}
              >
                수정
              </button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default EditDailyEventOpenChatUrl;
