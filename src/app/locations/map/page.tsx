'use client';

import Callout from '@/components/text/Callout';
import HubsMap from './components/hubsMap';
import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <div>
      <Heading.h1>지도 보기</Heading.h1>
      <Callout>
        <p>도움말</p>
        <ul>
          <li>
            1. 줌 레벨이 높을때 지도를 클릭하면 해당 위치를 중심으로 지도가
            이동합니다.
          </li>
          <li>
            2. 노란색 핀에 마우스를 올리면 해당 정류장의 이름이 표시됩니다.
          </li>
          <li>3. 핀을 클릭하면 해당 정류장의 수정 페이지로 이동합니다.</li>
        </ul>
      </Callout>
      <HubsMap />;
    </div>
  );
};

export default Page;
