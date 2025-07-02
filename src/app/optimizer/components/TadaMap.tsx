'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon } from 'lucide-react';
import KakaoMapScript from '@/components/script/KakaoMapScript';
import {
  AddressData,
  RouteResult,
  ClusteredRouteResult,
} from '../utils/optimalPathCalculator.util';

interface HubData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  regionId?: string;
  order: number;
}

const MAP_CONSTANTS = {
  INITIAL_ZOOM_LEVEL: 8,
  DEFAULT_LAT: 37.574187,
  DEFAULT_LNG: 126.976882,
  MARKER_IMAGES: {
    SHUTTLE_HUB: '/icons/bus-stop-marker.svg',
  },
};

interface Props {
  addressData: AddressData[];
  routeResult: RouteResult[];
  clusteredData?: ClusteredRouteResult[];
}

const TadaMap = ({ addressData, routeResult, clusteredData }: Props) => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(false);
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  // const markerRef = useRef<kakao.maps.Marker | null>(null);
  const hubList = useMemo(() => {
    return routeResult.map((result, index) => {
      // addressData에서 해당 주소와 일치하는 데이터를 찾아서 위도/경도 정보를 가져옴
      const matchingAddressData = addressData.find(
        (data) => data.address === result.address,
      );

      return {
        id: index.toString(),
        name: result.address,
        latitude: matchingAddressData?.latitude || 0,
        longitude: matchingAddressData?.longitude || 0,
        order: result.order,
      };
    });
  }, [routeResult, addressData]);

  const createHubMarker = useCallback((map: kakao.maps.Map, hub: HubData) => {
    const position = new kakao.maps.LatLng(hub.latitude, hub.longitude);

    // 커스텀 마커 콘텐츠 생성 (순서 번호 포함)
    const markerContent = `
        <div style="
          background: #0066cc; 
          color: white;
          padding: 4px 8px;
          border-radius: 50%; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          min-width: 25px;
          min-height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          cursor: pointer;
          transition: all 0.2s ease;
        ">${hub.order}</div>
      `;

    const customOverlay = new kakao.maps.CustomOverlay({
      position: position,
      content: markerContent,
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 1,
    });

    customOverlay.setMap(map);
  }, []);

  const createClusteredMarker = useCallback(
    (map: kakao.maps.Map, cluster: ClusteredRouteResult) => {
      const position = new kakao.maps.LatLng(
        cluster.latitude,
        cluster.longitude,
      );
      // 커스텀 마커 콘텐츠 생성 (순서 번호 포함)
      const markerContent = `
        <div style="
          background: ${cluster.isCluster ? '#dc2626' : '#0066cc'}; 
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

  const displayHubs = useCallback(
    (hubList: HubData[]) => {
      if (!kakaoMapRef.current) {
        return;
      }

      // 클러스터링 데이터가 있으면 클러스터링된 마커 사용, 없으면 기존 마커 사용
      if (clusteredData && clusteredData.length > 0) {
        clusteredData.forEach((cluster) => {
          createClusteredMarker(kakaoMapRef.current!, cluster);
        });
      } else {
        hubList.forEach((hub) => {
          createHubMarker(kakaoMapRef.current!, hub);
        });
      }
    },
    [createHubMarker, createClusteredMarker, clusteredData],
  );

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

        // const marker = new kakao.maps.Marker({
        //   position: map.getCenter(),
        // });
        // marker.setMap(map);
        // markerRef.current = marker;

        displayHubs(hubList);
      }
    } catch (error) {
      setError(true);
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [displayHubs, hubList]);

  useEffect(() => {
    if (isScriptReady && hubList.length > 0) {
      window.kakao.maps.load(initializeMap);
    }
  }, [hubList, isScriptReady, initializeMap]);

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

export default TadaMap;
