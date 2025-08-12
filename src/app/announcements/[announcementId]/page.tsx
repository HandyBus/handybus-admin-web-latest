'use client';

import BlueLink from '@/components/link/BlueLink';
import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import ReactMarkdown from 'react-markdown';
import {
  useGetAnnouncement,
  usePutAnnouncement,
} from '@/services/core.service';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const AnnouncementDetailPage = ({
  params: { announcementId },
}: {
  params: { announcementId: string };
}) => {
  const { data: announcement } = useGetAnnouncement(announcementId);
  const { mutateAsync: deleteAnnouncement } = usePutAnnouncement();
  const router = useRouter();

  const onDelete = async () => {
    if (confirm('삭제하시겠습니까?')) {
      try {
        await deleteAnnouncement({
          announcementId: announcementId,
          body: { isDeleted: true },
        });
        alert('삭제되었습니다.');
        router.push('/announcements');
      } catch (error) {
        console.error(error);
        alert('삭제에 실패했습니다.\n' + error);
      }
    }
  };

  return (
    <main>
      <div className="flex items-baseline gap-20">
        <Heading>공지사항 상세 정보</Heading>
        <BlueLink
          href={`/announcements/${announcementId}/edit`}
          className="text-14"
        >
          수정하기
        </BlueLink>
        <button
          onClick={onDelete}
          type="button"
          className="whitespace-nowrap break-keep text-14 text-basic-blue-400 underline underline-offset-[3px]"
        >
          삭제하기
        </button>
      </div>
      <Callout>
        <List>
          <List.item title="제목">
            <span>{announcement?.title}</span>
          </List.item>
          <List.item title="작성일">
            <span>
              {announcement?.createdAt &&
                dayjs(announcement?.createdAt).format('YYYY-MM-DD HH:mm')}
            </span>
          </List.item>
          <List.item title="수정일">
            <span>
              {announcement?.updatedAt &&
                dayjs(announcement?.updatedAt).format('YYYY-MM-DD HH:mm')}
            </span>
          </List.item>
        </List>
      </Callout>
      <Heading.h2>내용</Heading.h2>
      <section className="bg-notion-basic-grey prose w-dvw max-w-full p-20">
        <ReactMarkdown>{announcement?.content}</ReactMarkdown>
      </section>
    </main>
  );
};

export default AnnouncementDetailPage;
