'use client';

import Heading from '@/components/text/Heading';
import useKakaoMap from '@/hooks/useKakaoMap';
import { useCallback, useRef } from 'react';

const Page = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);

  const initializeMap = useCallback(
    () =>
      window.kakao.maps.load(() => {
        try {
          if (window.kakao && mapRef.current) {
            const options = {
              center: new window.kakao.maps.LatLng(37.574187, 126.976882),
              level: 4,
            };

            const newMap = new window.kakao.maps.Map(mapRef.current, options);
            map.current = newMap;
          }
        } catch (error) {
          alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
        }
      }),
    [],
  );

  const { KakaoScript } = useKakaoMap({
    onReady: initializeMap,
  });

  return (
    <>
      <KakaoScript />
      <main className="flex grow flex-col">
        <Heading>수요조사 대시보드</Heading>
        <div className="flex grow flex-col" ref={mapRef} />
      </main>
    </>
  );
};

export default Page;
