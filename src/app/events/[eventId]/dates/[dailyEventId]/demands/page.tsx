'use client';

import Heading from '@/components/text/Heading';
import { BIG_REGIONS_TO_COORDINATES } from '@/constants/regions';
import useKakaoMap from '@/hooks/useKakaoMap';
import {
  useGetDemandBasedRouteTree,
  useGetDemandsStats,
} from '@/services/shuttleOperation.service';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  params: {
    eventId: string;
    dailyEventId: string;
  };
}

const Page = ({ params }: Props) => {
  const { eventId, dailyEventId } = params;
  const { data: demandsStats, isLoading: isDemandsStatsLoading } =
    useGetDemandsStats({
      groupBy: 'PROVINCE',
      eventId,
      dailyEventId,
    });
  const { data: routeTree, isLoading: isRouteTreeLoading } =
    useGetDemandBasedRouteTree({
      eventId,
      dailyEventId,
    });

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);
  const regionClusters = useRef<kakao.maps.CustomOverlay[]>([]);
  const hubMarkers = useRef<kakao.maps.CustomOverlay[]>([]);
  const isInitialized = useRef(false);
  const [isScriptReady, setIsScriptReady] = useState(false);

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
        initializeHubMarker();

        kakao.maps.event.addListener(newMap, 'zoom_changed', () => {
          const level = map.current?.getLevel();
          if (!level) {
            return;
          }
          if (level >= 8) {
            handleZoomOutLevel();
          } else {
            handleZoomInLevel();
          }
        });
      }
    } catch (error) {
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [demandsStats, routeTree]);

  const { KakaoScript } = useKakaoMap({
    onReady: () => setIsScriptReady(true),
  });

  useEffect(() => {
    if (
      isInitialized.current ||
      !isScriptReady ||
      isDemandsStatsLoading ||
      isRouteTreeLoading
    ) {
      return;
    }
    isInitialized.current = true;
    kakao.maps.load(initializeMap);
  }, [
    initializeMap,
    isScriptReady,
    isInitialized,
    isDemandsStatsLoading,
    isRouteTreeLoading,
  ]);

  // 지역 클러스터 초기화
  const initializeRegionCluster = useCallback(() => {
    if (!map.current || !demandsStats) {
      return;
    }
    Object.entries(BIG_REGIONS_TO_COORDINATES).forEach(
      ([region, coordinates]) => {
        const demand = demandsStats.find(
          (demand) => demand.provinceFullName === region,
        );
        if (!demand || demand.totalCount === 0) {
          return;
        }

        const content = document.createElement('div');
        content.className =
          'w-84 h-84 bg-black/60 rounded-full flex justify-center items-center flex-col';
        content.innerHTML = `<div style="height: 4px"></div><p style="color: white; font-size: 12px;">${region}</p><p style="color: white;font-size: 14px; font-weight: 600;">${demand.totalCount}개</p>`;

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
  }, [demandsStats]);

  // 군집 마커 초기화
  const initializeHubMarker = useCallback(() => {
    if (!map.current || !routeTree) {
      return;
    }
    routeTree.clusters.forEach((cluster) => {
      const content = document.createElement('div');
      const name = cluster.nodes[0].data.regionHubName + ' 부근';
      const count = cluster.totalCount;
      content.className =
        'w-80 h-80 bg-blue-700/70 rounded-full flex justify-center items-center flex-col';
      content.innerHTML = `<div style="height: 4px"></div><p style="color: white; font-size: 12px; width: 64px; height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</p><p style="color: white;font-size: 14px; font-weight: 600;">${count}개</p>`;

      const position = new kakao.maps.LatLng(
        cluster.latitude,
        cluster.longitude,
      );

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        clickable: true,
      });
      customOverlay.setMap(map.current);
      customOverlay.setVisible(false);

      hubMarkers.current.push(customOverlay);
    });
  }, [routeTree]);

  // 지역 클러스터 보이기 & 군집 마커 숨기기
  const handleZoomOutLevel = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(true);
    });
    hubMarkers.current.forEach((marker) => {
      marker.setVisible(false);
    });
  }, [regionClusters]);

  // 지역 클러스터 숨기기 & 군집 마커 보이기
  const handleZoomInLevel = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(false);
    });
    hubMarkers.current.forEach((marker) => {
      marker.setVisible(true);
    });
  }, [regionClusters]);

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
