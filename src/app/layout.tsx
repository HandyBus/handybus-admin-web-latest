import type { Metadata } from 'next';
import './globals.css';
import '@/app/fonts/pretendard/font.css';
import Provider from '@/components/Provider';
import { ReactNode } from 'react';
import ToastContainer from '@/components/toast-container/ToastContainer';
import TopLevelLayout from '@/components/layout/TopLevelLayout';

export const metadata: Metadata = {
  title: '어드민 | 핸디버스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Provider>
          <TopLevelLayout>{children}</TopLevelLayout>
          <div id="bottom-sheet" />
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
