'use client';

import Heading from '@/components/text/Heading';
import { BIG_REGIONS_TO_COORDINATES } from '@/constants/regions';
import useKakaoMap from '@/hooks/useKakaoMap';
import { useCallback, useRef } from 'react';

const Page = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);
  const regionClusters = useRef<kakao.maps.CustomOverlay[]>([]);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new kakao.maps.LatLng(36.5, 128),
          level: 12,
        };

        const newMap = new kakao.maps.Map(mapRef.current, options);
        map.current = newMap;

        initializeRegionCluster();

        kakao.maps.event.addListener(newMap, 'zoom_changed', () => {
          const level = map.current?.getLevel();
          if (!level) {
            return;
          }
          if (level >= 8) {
            showRegionClusters();
          } else {
            hideRegionClusters();
          }
        });
      }
    } catch (error) {
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, []);

  const { KakaoScript } = useKakaoMap({
    onReady: () => kakao.maps.load(initializeMap),
  });

  // 지역 클러스터 초기화
  const initializeRegionCluster = useCallback(() => {
    if (!map.current) {
      return;
    }
    Object.entries(BIG_REGIONS_TO_COORDINATES).forEach(
      ([region, coordinates]) => {
        const content = document.createElement('div');
        content.className =
          'w-80 h-80 bg-black/60 rounded-full flex justify-center items-center';
        content.innerHTML = `<span style="color: white; font-size: 12px;">${region}</span>`;

        const position = new kakao.maps.LatLng(
          coordinates.latitude,
          coordinates.longitude,
        );

        content.addEventListener('click', () => {
          // @ts-expect-error 카카오 지도 타입 패키지 미업데이트로 인한 오류
          map.current?.jump(position, 7, { animate: true });
        });

        const customOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: content,
          clickable: true,
        });
        customOverlay.setMap(map.current);

        regionClusters.current.push(customOverlay);
      },
    );
  }, []);

  // 지역 클러스터 보이기
  const showRegionClusters = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(true);
    });
  }, []);

  // 지역 클러스터 숨기기
  const hideRegionClusters = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(false);
    });
  }, []);

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
