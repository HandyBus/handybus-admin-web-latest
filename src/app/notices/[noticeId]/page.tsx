'use client';

import BlueLink from '@/components/link/BlueLink';
import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import ReactMarkdown from 'react-markdown';

const NoticeDetailPage = ({
  params: { noticeId },
}: {
  params: { noticeId: string };
}) => {
  return (
    <main>
      <div className="flex items-baseline gap-20">
        <Heading>공지사항 상세 정보</Heading>
        <BlueLink href={`/notices/${noticeId}/edit`} className="text-14">
          수정하기
        </BlueLink>
      </div>
      <Callout>
        <List>
          <List.item title="제목">
            <span>공지사항 제목</span>
          </List.item>
          <List.item title="작성일">
            <span>2024-01-01</span>
          </List.item>
          <List.item title="수정일">
            <span>2024-01-01</span>
          </List.item>
        </List>
      </Callout>
      <Heading.h2>내용</Heading.h2>
      <section className="prose w-dvw max-w-full bg-notion-grey p-20">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </section>
    </main>
  );
};

export default NoticeDetailPage;

const markdownContent = `
# 공지사항 제목 공지사항 제목

- 항목 1
- 항목 2

**굵은 글씨**

[링크](https://www.google.com)

![이미지](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

> 인용문


`;
