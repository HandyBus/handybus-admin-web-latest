'use client';

import Callout from '@/components/text/Callout';
import Heading from '@/components/text/Heading';
import List from '@/components/text/List';
import { useGetContact } from '@/services/contact.service';
import { formatDateString } from '@/utils/date.util';
import { LoaderCircleIcon } from 'lucide-react';

interface Props {
  params: {
    contactId: string;
  };
}

const Page = ({ params: { contactId } }: Props) => {
  const { data: contact, isPending, isError, error } = useGetContact(contactId);

  if (isPending) {
    return (
      <main>
        <Heading>협업문의 상세 정보</Heading>
        <LoaderCircleIcon className="animate-spin" />
      </main>
    );
  }

  if (isError) {
    return (
      <main>
        <Heading>협업 문의 상세 정보</Heading>
        <p>에러 : {error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
      </main>
    );
  }

  if (!contact) {
    return (
      <main>
        <Heading>협업 문의 상세 정보</Heading>
        <p>데이터를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main>
      <Heading>협업 문의 상세 정보</Heading>
      <Callout>
        <List>
          <List.item title="이름">
            <span>{contact.name}</span>
          </List.item>
          <List.item title="회사">
            <span>{contact.company}</span>
          </List.item>
          <List.item title="전화번호">
            <span>{contact.phoneNumber}</span>
          </List.item>
          <List.item title="이메일">
            <span>{contact.email}</span>
          </List.item>
          <List.item title="제목">
            <span>{contact.title}</span>
          </List.item>
          <List.item title="생성일">
            <span>{formatDateString(contact.createdAt, 'datetime')}</span>
          </List.item>
        </List>
      </Callout>
      <Heading.h2>내용</Heading.h2>
      <section className="prose w-dvw max-w-full whitespace-pre-wrap break-words rounded-8 border border-basic-grey-100 bg-basic-grey-50 p-20">
        {contact.content}
      </section>
    </main>
  );
};

export default Page;
