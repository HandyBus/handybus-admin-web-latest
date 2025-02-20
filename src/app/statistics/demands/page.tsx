'use client';

import KakaoMapScript from '@/components/script/KakaoMapScript';
import Heading from '@/components/text/Heading';
import { useCallback, useEffect, useRef, useState } from 'react';
import sido from '@/data/sido.json';
import gungu from '@/data/gungu.json';
import { useGetDemandsStats } from '@/services/shuttleOperation.service';
import { displayAreas } from './map.util';

const Page = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);

  const [isScriptReady, setIsScriptReady] = useState(false);

  const { data: sidoStats, isLoading: isSidoStatsLoading } = useGetDemandsStats(
    {
      groupBy: 'PROVINCE',
    },
  );
  const { data: gunguStats, isLoading: isGunguStatsLoading } =
    useGetDemandsStats({
      groupBy: 'CITY',
    });

  useEffect(() => {
    if (isScriptReady && !isSidoStatsLoading && !isGunguStatsLoading) {
      kakao.maps.load(initializeMap);
    }
  }, [isScriptReady, isSidoStatsLoading, isGunguStatsLoading]);

  const initializeMap = useCallback(async () => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new kakao.maps.LatLng(36.5, 128),
          level: 13,
        };

        const newMap = new kakao.maps.Map(mapRef.current, options);
        map.current = newMap;

        displayAreas({
          map: newMap,
          type: 'sido',
          data: sido,
          stats: sidoStats ?? [],
        });
        displayAreas({
          map: newMap,
          type: 'gungu',
          data: gungu,
          stats: gunguStats ?? [],
        });
      }
    } catch (error) {
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [sidoStats, gunguStats]);

  return (
    <>
      <KakaoMapScript
        onReady={() => setIsScriptReady(true)}
        libraries={['services']}
      />
      <main className="flex grow flex-col">
        <Heading>
          수요조사 통계
          <span className="ml-12 text-12 text-grey-500">
            지도 내의 시군구 영역은 정확하지 않을 수 있습니다.
          </span>
        </Heading>
        <div className="grid grow grid-cols-2 gap-4">
          <section>
            <div className="relative h-full w-full" ref={mapRef} />
          </section>
          <section></section>
        </div>
      </main>
    </>
  );
};

export default Page;
