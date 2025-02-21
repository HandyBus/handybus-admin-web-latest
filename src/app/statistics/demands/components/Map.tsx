'use client';

import KakaoMapScript from '@/components/script/KakaoMapScript';
import { useCallback, useEffect, useRef, useState } from 'react';
import sido from '@/data/sido.json';
import gungu from '@/data/gungu.json';
import { displayAreas } from '../map.util';
import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';

interface Props {
  sidoStats: ShuttleDemandStatisticsReadModel[] | undefined;
  gunguStats: ShuttleDemandStatisticsReadModel[] | undefined;
  isSidoStatsLoading: boolean;
  isGunguStatsLoading: boolean;
}

const Map = ({
  sidoStats,
  gunguStats,
  isSidoStatsLoading,
  isGunguStatsLoading,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);

  const [isScriptReady, setIsScriptReady] = useState(false);

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
      <section className="grow">
        <div className="relative h-full w-full" ref={mapRef} />
      </section>
    </>
  );
};

export default Map;
