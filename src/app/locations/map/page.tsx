'use client';

import HubsMap from './components/hubsMap';
import Heading from '@/components/text/Heading';
import { MapGuides } from '../components/MapGuides';

const Page = () => {
  return (
    <div>
      <Heading.h1>지도 보기</Heading.h1>
      <MapGuides />
      <HubsMap />
    </div>
  );
};

export default Page;
