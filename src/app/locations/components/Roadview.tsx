'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  placeName: string;
  latitude: number;
  longitude: number;
  roadViewPan: number | null;
  roadViewTilt: number | null;
  onViewpointChange: (roadviewPan: number, roadviewTilt: number) => void;
}

const Roadview = ({
  placeName,
  latitude,
  longitude,
  roadViewPan,
  roadViewTilt,
  onViewpointChange,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const roadviewRef = useRef<kakao.maps.Roadview | null>(null);
  const roadviewClientRef = useRef<kakao.maps.RoadviewClient | null>(null);
  const customOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
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

        // 초기 오버레이 생성
        const customOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: CUSTOM_OVERLAY,
        });
        customOverlay.setMap(instance);
        customOverlayRef.current = customOverlay;

        // 로드뷰 초기화 완료 이벤트 대기
        kakao.maps.event.addListener(instance, 'init', () => {
          instance.setViewpoint({
            pan: roadViewPan ?? 0,
            tilt: roadViewTilt ?? 0,
            zoom: -3,
          });
        });

        // 시점 변경 이벤트 리스너 추가 - 마우스로 조작할 때
        kakao.maps.event.addListener(instance, 'viewpoint_changed', () => {
          const viewpoint = instance.getViewpoint();
          onViewpointChange(viewpoint.pan, viewpoint.tilt);
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
    if (!mapRef.current || isInitialized.current || !window.kakao?.maps) return;
    isInitialized.current = true;
    initializeRoadview();
  }, []);

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

      // 기존 오버레이 제거
      if (customOverlayRef.current) {
        customOverlayRef.current.setMap(null);
      }

      // 새로운 오버레이 생성 및 추가
      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: CUSTOM_OVERLAY,
      });
      customOverlay.setMap(roadviewRef.current);
      customOverlayRef.current = customOverlay;

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

const CUSTOM_OVERLAY = `<div style="
                 background: #00C896;
                 color: #fff;
                 padding: 8px 12px;
                 font-size: 14px;
                 font-weight: 600;
                 border-radius: 6px;
                 box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                 position: relative;
                 white-space: nowrap;
                 text-align: center;
               ">
                 핸디버스 탑승장소
                 <div style="
                   content: '';
                   position: absolute;
                   margin-left: -11px;
                   left: 50%;
                   bottom: -12px;
                   width: 22px;
                   height: 12px;
                   background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDEyTDAgMEgyMkwxMSAxMloiIGZpbGw9IiMwMEM4OTYiLz4KPC9zdmc+') no-repeat 0 bottom;
                 "></div>
               </div>`;
