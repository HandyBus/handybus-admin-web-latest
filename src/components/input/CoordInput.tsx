'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon, Loader2Icon, RotateCwIcon } from 'lucide-react';
import KakaoMapScript from '../script/KakaoMapScript';
import { useGetRegionHubsWithoutPagination } from '@/services/hub.service';
import { findRegionId, toAddress } from '@/utils/region.util';
import { standardizeRegionName } from '@/utils/region.util';
import Roadview from '@/app/locations/components/Roadview';

const MAP_CONSTANTS = {
  INITIAL_ZOOM_LEVEL: 4,
  DEFAULT_LAT: 37.574187,
  DEFAULT_LNG: 126.976882,
  MARKER_IMAGES: {
    DEFAULT: '/icons/default-marker.svg',
    SHUTTLE_HUB: '/icons/bus-stop-marker.svg',
    EVENT_LOCATION: '/icons/event-venue-marker.svg',
    EVENT_PARKING_LOT: '/icons/parking-lot-marker.svg',
  },
};

interface Props {
  coord: Coord;
  setCoord: (coord: Coord) => void;
}

interface HubData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  eventLocation: boolean;
  eventParkingLot: boolean;
  shuttleHub: boolean;
}

const INITIAL_ZOOM_LEVEL = 4;

const CoordInput = ({ coord, setCoord }: Props) => {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [hasRequestedSearch, setHasRequestedSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [currentRegion, setCurrentRegion] = useState<string>('');
  const [currentRegionId, setCurrentRegionId] = useState<string | null>(null);
  const [showSearchButton, setShowSearchButton] = useState<boolean>(true);
  const [lastSearchedRegionId, setLastSearchedRegionId] = useState<
    string | null
  >(null);

  const { data: regionHubs, refetch } = useGetRegionHubsWithoutPagination({
    regionId: currentRegionId ?? '',
    enabled: !!currentRegionId && hasRequestedSearch,
  });

  const regionHubsData = useMemo(
    () =>
      regionHubs?.map((regionHub) => ({
        id: regionHub.regionHubId,
        name: regionHub.name,
        latitude: regionHub.latitude,
        longitude: regionHub.longitude,
        eventLocation: regionHub.eventLocation,
        eventParkingLot: regionHub.eventParkingLot,
        shuttleHub: regionHub.shuttleHub,
      })),
    [regionHubs],
  );

  const setCoordWithAddress = useCallback(
    async (latLng: kakao.maps.LatLng) => {
      const latitude = latLng.getLat();
      const longitude = latLng.getLng();

      setLoading(true);
      try {
        const address = await toAddress(latitude, longitude);
        setLoading(false);
        setCoord({ latitude, longitude, address: address.address_name });
      } catch {
        setLoading(false);
        setCoord({ latitude, longitude, address: 'unknown address' });
        setError(true);
      }
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

  const createHubsMarkerImage = useCallback(
    ({
      eventLocation,
      eventParkingLot,
      shuttleHub,
    }: {
      eventLocation: boolean;
      eventParkingLot: boolean;
      shuttleHub: boolean;
    }) => {
      const imageSrc = shuttleHub
        ? MAP_CONSTANTS.MARKER_IMAGES.SHUTTLE_HUB
        : eventLocation
          ? MAP_CONSTANTS.MARKER_IMAGES.EVENT_LOCATION
          : eventParkingLot
            ? MAP_CONSTANTS.MARKER_IMAGES.EVENT_PARKING_LOT
            : MAP_CONSTANTS.MARKER_IMAGES.DEFAULT;
      return new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(40, 40), {
        offset: new kakao.maps.Point(20, 40),
      });
    },
    [],
  );

  // 여러 마커 표시 함수
  const displayHubs = (hubList: HubData[]) => {
    if (!kakaoMapRef.current) return;

    hubList.forEach((hub) => {
      const position = new kakao.maps.LatLng(hub.latitude, hub.longitude);
      const marker = new kakao.maps.Marker({
        map: kakaoMapRef.current ?? undefined,
        position: position,
        title: hub.name,
        image: createHubsMarkerImage({
          eventLocation: hub.eventLocation,
          eventParkingLot: hub.eventParkingLot,
          shuttleHub: hub.shuttleHub,
        }),
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
              bottom: 80px;
              white-space: nowrap;
            ">${hub.name}</div>
          `,
        xAnchor: 0.5,
        yAnchor: 0,
      });

      // 마우스오버시 정류장 이름표시
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        customOverlay.setMap(kakaoMapRef.current);
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        customOverlay.setMap(null);
      });
    });
  };

  const getCurrentRegion = async () => {
    if (!kakaoMapRef.current) return null;
    const center = kakaoMapRef.current.getCenter();

    try {
      const address = await toAddress(center.getLat(), center.getLng());
      const bigRegion = standardizeRegionName(address.region_1depth_name);
      const smallRegion = address.region_2depth_name.split(' ')[0];
      const region = `${bigRegion} ${smallRegion}`;
      const regionId = findRegionId(bigRegion, smallRegion);
      setCurrentRegion(region);
      setCurrentRegionId(typeof regionId === 'string' ? regionId : null);
      return regionId;
    } catch (error) {
      console.error('지역 정보를 가져오는 데 실패했습니다.', error);
      setError(true);
      return null;
    }
  };

  // 지역 재검색 버튼 클릭 함수
  const searchCurrentRegion = useCallback(async () => {
    try {
      if (!currentRegionId) {
        alert('지역 정보를 찾을 수 없거나 지원되지 않는 지역입니다.');
        return;
      }

      setHasRequestedSearch(true);
      refetch();
      setShowSearchButton(false);
      setLastSearchedRegionId(currentRegionId);
    } catch (error) {
      console.error('정류장 데이터를 불러오는 데 실패했습니다.', error);
      setError(true);
    }
  }, [currentRegionId]);

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

        window.kakao.maps.event.addListener(
          map,
          'rightclick',
          (mouseEvent: kakao.maps.event.MouseEvent) => {
            setCoordWithAddress(mouseEvent.latLng);
          },
        );

        window.kakao.maps.event.addListener(map, 'dragend', async () => {
          if (map) {
            getCurrentRegion();
          }
        });

        window.kakao.maps.event.addListener(map, 'zoom_changed', async () => {
          if (map) {
            getCurrentRegion();
          }
        });

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

        getCurrentRegion();
      }
    } catch (error) {
      setError(true);
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [coord.latitude, coord.longitude, setCoordWithAddress]);

  useEffect(() => {
    if (currentRegionId !== lastSearchedRegionId) {
      setShowSearchButton(true);
    }
  }, [currentRegionId, lastSearchedRegionId]);

  useEffect(() => {
    if (regionHubsData) {
      displayHubs(regionHubsData);
    }
  }, [regionHubsData]);

  // 지도보기에서 핀을 클릭해서 새 정류장 만들기로 넘어온 경우 핀 위치 좌표 가져오기
  useEffect(() => {
    if (coord.latitude && coord.longitude && mapInitialized) {
      setCoordWithAddress(
        new window.kakao.maps.LatLng(coord.latitude, coord.longitude),
      );
    }
  }, [mapInitialized, setCoordWithAddress]);

  return (
    <>
      <KakaoMapScript
        onReady={() =>
          window.kakao.maps.load(() => {
            setIsKakaoReady(true);
            initializeMap();
          })
        }
        libraries={['services']}
      />
      <article className="relative h-auto p-16 [&_div]:cursor-pointer">
        <div className="relative rounded-[12px] transition-opacity">
          <div
            ref={mapRef}
            className={twJoin(
              'z-0 size-512 w-full rounded-t-[12px] transition-opacity',
              (error || loading) && 'opacity-50',
            )}
          />
          <div className="absolute left-20 top-20 z-10 h-40 w-240 overflow-hidden rounded-[8px] border border-basic-grey-200">
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
                ? 'absolute left-0 top-0 z-10 flex size-full touch-none items-center justify-center bg-basic-white bg-opacity-75 text-basic-red-500'
                : 'hidden'
            }
          >
            <BanIcon />
            오류가 발생하여 데이터 정합성을 위해 작동을 중지합니다. 새로고침
            해주세요.
          </div>
          {showSearchButton && (
            <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 transform">
              <button
                type="button"
                onClick={searchCurrentRegion}
                className="flex items-center gap-8 rounded-full bg-basic-blue-400 px-16 py-8 text-basic-white shadow-lg hover:bg-basic-blue-300"
              >
                <RotateCwIcon />이 지역 재검색하기{' '}
                {currentRegion ? `(${currentRegion})` : ''}
              </button>
            </div>
          )}
        </div>
        <div>
          좌표: {coord.latitude}, {coord.longitude}
          <br />
          주소: {coord.address}
        </div>
        <div className="h-320 rounded-[12px]">
          <Roadview
            placeName={coord.address}
            latitude={coord.latitude}
            longitude={coord.longitude}
            isKakaoReady={isKakaoReady}
          />
        </div>
      </article>
    </>
  );
};

export default CoordInput;

interface Coord {
  latitude: number;
  longitude: number;
  address: string;
}
