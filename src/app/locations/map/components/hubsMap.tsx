'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon, Loader2Icon } from 'lucide-react';
import { useGetRegionHubs } from '@/services/hub.service';
import { toAddress } from '@/utils/region.util';
import KakaoMapScript from '@/components/script/KakaoMapScript';
import { createOverlayHTML } from '../createOverlayHTML.util';
interface HubData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  regionId: string;
  shuttleHub: boolean;
  eventDestination: boolean;
}

interface Coord {
  latitude: number;
  longitude: number;
  address: string;
}

const MAP_CONSTANTS = {
  INITIAL_ZOOM_LEVEL: 4,
  DEFAULT_LAT: 37.574187,
  DEFAULT_LNG: 126.976882,
  MARKER_IMAGES: {
    DEFAULT: '/icons/default-marker.svg',
    BUS_STOP: '/icons/bus-stop-marker.svg',
    EVENT_VENUE: '/icons/event-venue-marker.svg',
  },
};

const HubsMap = () => {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [coord, setCoord] = useState<Coord>({
    latitude: MAP_CONSTANTS.DEFAULT_LAT,
    longitude: MAP_CONSTANTS.DEFAULT_LNG,
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
          shuttleHub: regionHub.shuttleHub,
          eventDestination: regionHub.eventDestination,
        })),
    [regionHubs],
  );

  const createHubsMarkerImage = useCallback(
    ({
      shuttleHub,
      eventDestination,
    }: {
      shuttleHub: boolean;
      eventDestination: boolean;
    }) => {
      const imageSrc = shuttleHub
        ? MAP_CONSTANTS.MARKER_IMAGES.BUS_STOP
        : eventDestination
          ? MAP_CONSTANTS.MARKER_IMAGES.EVENT_VENUE
          : MAP_CONSTANTS.MARKER_IMAGES.DEFAULT;
      return new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(40, 40), {
        offset: new kakao.maps.Point(20, 40),
      });
    },
    [],
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
    if (window.kakao?.maps && markerRef.current) {
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

  const createHubMarkerWithOverlay = useCallback(
    (map: kakao.maps.Map, hub: HubData) => {
      const position = new kakao.maps.LatLng(hub.latitude, hub.longitude);
      const marker = new kakao.maps.Marker({
        map: map,
        position: position,
        title: hub.name,
        image: createHubsMarkerImage({
          shuttleHub: hub.shuttleHub,
          eventDestination: hub.eventDestination,
        }),
      });

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: createOverlayHTML(hub.name, '클릭시 수정페이지로 이동'),
        xAnchor: 0.5,
        yAnchor: 0,
      });

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        customOverlay.setMap(map);
      });

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
    },
    [createHubsMarkerImage],
  );

  const displayHubs = useCallback(
    (hubList: HubData[]) => {
      if (!kakaoMapRef.current) return;

      hubList.forEach((hub) => {
        createHubMarkerWithOverlay(kakaoMapRef.current!, hub);
      });
    },
    [createHubMarkerWithOverlay],
  );

  const setupClickMarker = useCallback(
    (map: kakao.maps.Map, marker: kakao.maps.Marker) => {
      const clickMarkerOverlay = new kakao.maps.CustomOverlay({
        position: marker.getPosition(),
        content: createOverlayHTML('이 위치로 정류장 생성하기', '핀 클릭'),
        xAnchor: 0.5,
        yAnchor: 0,
      });

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        clickMarkerOverlay.setMap(map);
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        clickMarkerOverlay.setMap(null);
      });

      kakao.maps.event.addListener(marker, 'click', async () => {
        const position = marker.getPosition();
        const latitude = position.getLat();
        const longitude = position.getLng();
        const address = await toAddress(latitude, longitude);
        window.open(
          `/locations/new?latitude=${latitude}&longitude=${longitude}&address=${address.address_name}`,
          '_blank',
          'noopener',
        );
      });

      return clickMarkerOverlay;
    },
    [],
  );

  const setupSearch = useCallback(() => {
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
  }, [setBoundOnSearch]);

  const initializeMap = useCallback(() => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(
            coord.latitude || MAP_CONSTANTS.DEFAULT_LAT,
            coord.longitude || MAP_CONSTANTS.DEFAULT_LNG,
          ),
          level: MAP_CONSTANTS.INITIAL_ZOOM_LEVEL,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        kakaoMapRef.current = map;

        const marker = new kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);
        markerRef.current = marker;

        const clickMarkerOverlay = setupClickMarker(map, marker);

        window.kakao.maps.event.addListener(
          map,
          'rightclick',
          (mouseEvent: kakao.maps.event.MouseEvent) => {
            setCoordWithAddress(mouseEvent.latLng);
            clickMarkerOverlay.setPosition(mouseEvent.latLng);
          },
        );

        setupSearch();

        displayHubs(regionHubsData);
      }
    } catch (error) {
      setError(true);
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [
    coord.latitude,
    coord.longitude,
    setupClickMarker,
    setupSearch,
    regionHubsData,
  ]);

  useEffect(() => {
    if (isScriptReady && regionHubsData) {
      window.kakao.maps.load(initializeMap);
    }
  }, [regionHubsData, isScriptReady]);

  if (regionHubsError || regionHubsLoading) return null;
  return (
    <>
      <KakaoMapScript
        onReady={() => setIsScriptReady(true)}
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
