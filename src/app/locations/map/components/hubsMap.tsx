'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon, Loader2Icon } from 'lucide-react';
import { useGetRegionHubs } from '@/services/hub.service';
import { toAddress } from '@/utils/region.uitl';
import KakaoMapScript from '@/components/script/KakaoMapScript';

interface HubData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  regionId: string;
}

const INITIAL_ZOOM_LEVEL = 4;

const HubsMap = () => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [coord, setCoord] = useState<Coord>({
    latitude: 37.574187,
    longitude: 126.976882,
    address: '',
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const {
    data: regionHubs,
    error: regionHubsError,
    isLoading: regionHubsLoading,
  } = useGetRegionHubs({});

  const regionHubsData = useMemo(
    () =>
      regionHubs.pages
        .flatMap((page) => page.regionHubs)
        .map((regionHub) => ({
          id: regionHub.regionHubId,
          name: regionHub.name,
          latitude: regionHub.latitude,
          longitude: regionHub.longitude,
          regionId: regionHub.regionId,
        })),
    [regionHubs],
  );

  const setCoordWithAddress = useCallback(
    (latLng: kakao.maps.LatLng) => {
      const latitude = latLng.getLat();
      const longitude = latLng.getLng();

      setLoading(true);
      toAddress(latitude, longitude)
        .then((address) => {
          setLoading(false);
          setCoord({ latitude, longitude, address });
        })
        .catch(() => {
          setLoading(false);
          setCoord({ latitude, longitude, address: 'unknown address' });
          setError(true);
        });
    },
    [setCoord],
  );

  const setMarker = useCallback((latLng: kakao.maps.LatLng) => {
    if (markerRef.current === null) setError(true);
    else markerRef.current.setPosition(latLng);
  }, []);

  useEffect(() => {
    if (window.kakao?.maps) {
      setMarker(new window.kakao.maps.LatLng(coord.latitude, coord.longitude));
    }
  }, [coord, setMarker]);

  const setBoundOnSearch = (
    data: kakao.maps.services.PlacesSearchResult,
    status: kakao.maps.services.Status,
  ) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new window.kakao.maps.LatLngBounds();

      data.forEach((item) =>
        bounds.extend(
          new window.kakao.maps.LatLng(Number(item.y), Number(item.x)),
        ),
      );

      kakaoMapRef.current?.setBounds(bounds);
    }
  };

  const createHubsMarkerImage = () => {
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    return new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35), {
      offset: new kakao.maps.Point(12, 35),
    });
  };

  // 여러 마커 표시 함수
  const displayHubs = (hubList: HubData[]) => {
    if (!kakaoMapRef.current) return;

    hubList.forEach((hub) => {
      const position = new kakao.maps.LatLng(hub.latitude, hub.longitude);
      const marker = new kakao.maps.Marker({
        map: kakaoMapRef.current ?? undefined,
        position: position,
        title: hub.name,
        image: createHubsMarkerImage(),
      });

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: `
            <div style="
              background: white; 
              padding: 8px 12px;
              border-radius: 8px; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              font-size: 13px;
              font-weight: bold;
              text-align: center;
              position: relative;
              bottom: 95px;
              white-space: nowrap;
            ">${hub.name}<br/>(클릭시 수정페이지로 이동)</div>
          `,
        xAnchor: 0.5,
        yAnchor: 0,
      });

      // 마우스오버시 정류장 이름표시
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        customOverlay.setMap(kakaoMapRef.current);
      });

      // 마커 직접 클릭 시 상세 페이지로 이동
      kakao.maps.event.addListener(marker, 'click', () => {
        window.open(
          `/locations/${hub.regionId}/hubs/${hub.id}/edit`,
          '_blank',
          'noopener',
        );
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        customOverlay.setMap(null);
      });
    });
  };

  // 지도 초기화 시 정류장 데이터도 함께 불러오기
  const initializeMap = useCallback(() => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(
            coord.latitude || 37.574187,
            coord.longitude || 126.976882,
          ),
          level: INITIAL_ZOOM_LEVEL,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        kakaoMapRef.current = map;
        setMapInitialized(true);

        // 개별 클릭 위치 표시용 마커
        const marker = new kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);
        markerRef.current = marker;

        const clickMarkerOverlay = new kakao.maps.CustomOverlay({
          position: marker.getPosition(),
          content: `
            <div style="
              background: white; 
              padding: 8px 12px;
              border-radius: 8px; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              font-size: 13px;
              font-weight: bold;
              text-align: center;
              position: relative;
              bottom: 95px;
              white-space: nowrap;
            ">이 위치로 정류장 생성하기 (핀 클릭)</div>
          `,
          xAnchor: 0.5,
          yAnchor: 0,
        });

        kakao.maps.event.addListener(marker, 'mouseover', () => {
          clickMarkerOverlay.setMap(map);
        });

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          clickMarkerOverlay.setMap(null);
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          const position = marker.getPosition();
          const latitude = position.getLat();
          const longitude = position.getLng();
          const address = toAddress(latitude, longitude);
          window.open(
            `/locations/new?latitude=${latitude}&longitude=${longitude}&address=${address}`,
            '_blank',
            'noopener',
          );
        });

        window.kakao.maps.event.addListener(
          map,
          'click',
          (mouseEvent: kakao.maps.event.MouseEvent) => {
            setCoordWithAddress(mouseEvent.latLng);
            clickMarkerOverlay.setPosition(mouseEvent.latLng);

            const currentLevel = map.getLevel();
            if (currentLevel >= 6) {
              map.setCenter(mouseEvent.latLng);
              map.setLevel(currentLevel - 1);
            }
          },
        );

        const ps = new window.kakao.maps.services.Places();

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key !== 'Enter') {
              return;
            }
            event.preventDefault();
            const target = event.target as HTMLInputElement;
            ps.keywordSearch(target.value, setBoundOnSearch);
          });
        }
      }
    } catch (error) {
      setError(true);
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [coord.latitude, coord.longitude, setCoordWithAddress]);

  useEffect(() => {
    if (regionHubsData && mapInitialized) {
      displayHubs(regionHubsData);
    }
  }, [regionHubsData, mapInitialized]);

  if (regionHubsError || regionHubsLoading) return null;
  return (
    <>
      <KakaoMapScript
        onReady={() => window.kakao.maps.load(initializeMap)}
        libraries={['services']}
      />
      <article className="relative h-[68vh] p-16 [&_div]:cursor-pointer">
        <div className="relative h-full rounded-[12px] transition-opacity">
          <div
            ref={mapRef}
            className={twJoin(
              'z-0 size-512 h-full w-full rounded-t-[12px] transition-opacity',
              (error || loading) && 'opacity-50',
            )}
          />
          <div className="absolute left-20 top-20 z-10 h-40 w-240 overflow-hidden rounded-[8px] border border-grey-200">
            <input
              id="search-input"
              type="text"
              placeholder="키워드로 지도 검색"
              className="h-full w-full p-12 outline-none"
            />
          </div>
          <div
            className={
              loading
                ? 'absolute left-0 top-0 z-10 flex size-full touch-none items-center justify-center bg-none'
                : 'hidden'
            }
          >
            <Loader2Icon className="animate-spin" />
          </div>

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

export default HubsMap;

interface Coord {
  latitude: number;
  longitude: number;
  address: string;
}
