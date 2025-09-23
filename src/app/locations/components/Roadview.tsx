'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  placeName: string;
  latitude: number;
  longitude: number;
  isKakaoReady?: boolean;
  roadViewPan: number | null;
  onViewpointChange: (roadviewPan: number) => void;
}

const Roadview = ({
  placeName,
  latitude,
  longitude,
  isKakaoReady,
  roadViewPan,
  onViewpointChange,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const roadviewRef = useRef<kakao.maps.Roadview | null>(null);
  const roadviewClientRef = useRef<kakao.maps.RoadviewClient | null>(null);
  const isInitialized = useRef(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const initializeRoadview = () => {
    try {
      if (!mapRef.current || !window.kakao?.maps) return;

      const instance = new window.kakao.maps.Roadview(mapRef.current);
      const client = new window.kakao.maps.RoadviewClient();
      roadviewRef.current = instance;
      roadviewClientRef.current = client;

      const position = new window.kakao.maps.LatLng(latitude, longitude);
      client.getNearestPanoId(position, 50, (panoId) => {
        if (!panoId) {
          setIsAvailable(false);
          return;
        }
        instance.setPanoId(panoId, position);

        // 로드뷰 초기화 완료 이벤트 대기
        kakao.maps.event.addListener(instance, 'init', () => {
          instance.setViewpoint({
            pan: roadViewPan ?? 0,
            tilt: 0,
            zoom: 1,
          });
        });

        // 시점 변경 이벤트 리스너 추가 - 마우스로 조작할 때
        kakao.maps.event.addListener(instance, 'viewpoint_changed', () => {
          const viewpoint = instance.getViewpoint();
          onViewpointChange(viewpoint.pan);
        });
        setIsAvailable(true);
      });
    } catch (error) {
      setIsAvailable(false);
      console.error(error);
    }
  };

  // Initialize after Kakao SDK is ready
  useEffect(() => {
    if (
      !mapRef.current ||
      isInitialized.current ||
      !isKakaoReady ||
      !window.kakao?.maps
    )
      return;
    isInitialized.current = true;
    initializeRoadview();
  }, [isKakaoReady]);

  // 핀의 위치를 조정하면 로드뷰의 위치도 조정
  useEffect(() => {
    if (
      !isInitialized.current ||
      !roadviewRef.current ||
      !roadviewClientRef.current ||
      !window.kakao?.maps
    )
      return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);
    roadviewClientRef.current.getNearestPanoId(position, 50, (panoId) => {
      if (!panoId) {
        setIsAvailable(false);
        return;
      }
      roadviewRef.current?.setPanoId(panoId, position);
      setIsAvailable(true);
    });
  }, [latitude, longitude]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        aria-label={placeName + ' 로드뷰'}
        className="h-full w-full rounded-b-[12px]"
      />
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-basic-grey-50 text-12 font-500 text-basic-grey-600">
          로드뷰를 지원하지 않는 위치입니다.
        </div>
      )}
    </div>
  );
};

export default Roadview;

// kakaomap docs 로드뷰생성하기 : https://apis.map.kakao.com/web/sample/basicRoadview/
