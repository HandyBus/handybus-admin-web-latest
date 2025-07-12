'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon } from 'lucide-react';
import KakaoMapScript from '@/components/script/KakaoMapScript';
import { ClusteredRouteResult } from '../types/optimizer.type';

const MAP_CONSTANTS = {
  INITIAL_ZOOM_LEVEL: 9,
  DEFAULT_LAT: 37.574187,
  DEFAULT_LNG: 126.976882,
};

interface Props {
  clusteredData?: ClusteredRouteResult[];
}

const HandyPartyMap = ({ clusteredData }: Props) => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const createClusteredMarker = useCallback(
    (map: kakao.maps.Map, cluster: ClusteredRouteResult) => {
      const position = new kakao.maps.LatLng(
        cluster.latitude,
        cluster.longitude,
      );

      const markerContent = `
        <div style="
          background: #0066cc; 
          color: white;
          padding: 4px 8px;
          border-radius: 50%; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          font-size: ${cluster.isCluster ? '10px' : '12px'};
          font-weight: bold;
          text-align: center;
          min-width: ${cluster.isCluster ? '35px' : '25px'};
          min-height: ${cluster.isCluster ? '35px' : '25px'};
          max-width: 60px;
          word-break: keep-all;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.2s ease;
        ">${cluster.displayText}</div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: markerContent,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: 1,
      });

      customOverlay.setMap(map);
    },
    [],
  );

  const displayHubs = useCallback(() => {
    if (!kakaoMapRef.current) {
      return;
    }

    if (clusteredData && clusteredData.length > 0) {
      clusteredData.forEach((cluster) => {
        createClusteredMarker(kakaoMapRef.current!, cluster);
      });
    }
  }, [createClusteredMarker, clusteredData]);

  const initializeMap = useCallback(() => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(
            MAP_CONSTANTS.DEFAULT_LAT,
            MAP_CONSTANTS.DEFAULT_LNG,
          ),
          level: MAP_CONSTANTS.INITIAL_ZOOM_LEVEL,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        kakaoMapRef.current = map;

        displayHubs();
      }
    } catch (error) {
      setError(true);
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [displayHubs]);

  useEffect(() => {
    if (isScriptReady) {
      window.kakao.maps.load(initializeMap);
    }
  }, [isScriptReady, clusteredData, initializeMap]);

  return (
    <>
      <KakaoMapScript
        onReady={() => setIsScriptReady(true)}
        libraries={['services']}
      />
      <article className="relative h-[68vh] w-full p-16 [&_div]:cursor-pointer">
        <div className="relative h-full rounded-[12px] transition-opacity">
          <div
            ref={mapRef}
            className={twJoin(
              'z-0 size-512 h-full w-full rounded-t-[12px] transition-opacity',
              error && 'opacity-50',
            )}
          />

          <div
            className={
              error
                ? 'absolute left-0 top-0 z-10 flex size-full touch-none items-center justify-center bg-white bg-opacity-75 text-red-500'
                : 'hidden'
            }
          >
            <BanIcon />
            오류가 발생하여 데이터 정합성을 위해 작동을 중지합니다. 새로고침
            해주세요.
          </div>
        </div>
      </article>
    </>
  );
};

export default HandyPartyMap;
