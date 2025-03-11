'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon, Loader2Icon, RotateCwIcon } from 'lucide-react';
import KakaoMapScript from '../script/KakaoMapScript';
import { useGetRegionHubsWithoutPagination } from '@/services/hub.service';
import { REGION_TO_ID } from 'src/constants/regions';

interface Props {
  coord: Coord;
  setCoord: (coord: Coord) => void;
}

interface HubData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const INITIAL_ZOOM_LEVEL = 4;

const CoordInput = ({ coord, setCoord }: Props) => {
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
      const addressParts = address.split(' ');

      if (addressParts.length >= 2) {
        const bigRegion = standardizeRegionName(addressParts[0]);
        const smallRegion = addressParts[1];
        const region = `${bigRegion} ${smallRegion}`;
        const regionId = findRegionId(bigRegion, smallRegion);
        setCurrentRegion(region);
        setCurrentRegionId(typeof regionId === 'string' ? regionId : null);
        return regionId;
      }
      return null;
    } catch (error) {
      console.error('지역 정보를 가져오는 데 실패했습니다.', error);
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

        // 개별 클릭 위치 표시용 마커
        const marker = new kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);
        markerRef.current = marker;

        window.kakao.maps.event.addListener(
          map,
          'click',
          (mouseEvent: kakao.maps.event.MouseEvent) => {
            setCoordWithAddress(mouseEvent.latLng);
          },
        );

        window.kakao.maps.event.addListener(map, 'dragend', async () => {
          if (map) {
            const center = map.getCenter();
            try {
              const address = await toAddress(center.getLat(), center.getLng());
              const addressParts = address.split(' ');
              if (addressParts.length >= 2) {
                getCurrentRegion();
              }
            } catch (error) {
              console.error('지역 정보를 가져오는 데 실패했습니다.', error);
            }
          }
        });

        window.kakao.maps.event.addListener(map, 'zoom_changed', async () => {
          if (map) {
            const center = map.getCenter();
            try {
              const address = await toAddress(center.getLat(), center.getLng());
              const addressParts = address.split(' ');
              if (addressParts.length >= 2) {
                getCurrentRegion();
              }
            } catch (error) {
              console.error('지역 정보를 가져오는 데 실패했습니다.', error);
            }
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

  return (
    <>
      <KakaoMapScript
        onReady={() => window.kakao.maps.load(initializeMap)}
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
          <div className="absolute left-20 top-20 z-10 h-40 w-240 overflow-hidden rounded-[8px] border border-grey-200">
            <input
              id="search-input"
              type="text"
              placeholder="키워드로 검색"
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
          {showSearchButton && (
            <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 transform">
              <button
                type="button"
                onClick={searchCurrentRegion}
                className="flex items-center gap-8 rounded-full bg-blue-400 px-16 py-8 text-white shadow-lg hover:bg-blue-300"
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

const toAddress = async (latitude: number, longitude: number) =>
  new Promise<string>((resolve, reject) => {
    if (!window.kakao?.maps?.services) reject('Geocoder is not available');

    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(latitude, longitude);
    const callback = (
      result: Array<{
        address: kakao.maps.services.Address;
        road_address: kakao.maps.services.RoadAaddress | null;
      }>,
      status: kakao.maps.services.Status,
    ) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        resolve(address);
      } else {
        reject('Geocoder failed');
      }
    };

    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  });

const standardizeRegionName = (regionName: string): string => {
  if (regionName === '서울') return '서울특별시';

  if (
    ['부산', '울산', '광주', '대전', '대구', '인천', '세종'].includes(
      regionName,
    )
  ) {
    if (regionName === '세종') return '세종특별자치시';
    return `${regionName}광역시`;
  }

  if (['경기', '강원', '전북', '제주'].includes(regionName)) {
    if (regionName === '제주') return '제주특별자치도';
    if (regionName === '전북') return '전북특별자치도';
    return `${regionName}도`;
  }

  if (regionName === '충북') return '충청북도';
  if (regionName === '충남') return '충청남도';
  if (regionName === '경북') return '경상북도';
  if (regionName === '경남') return '경상남도';
  if (regionName === '전남') return '전라남도';

  return regionName;
};

const findRegionId = (
  bigRegion: string,
  smallRegion: string,
): string | null => {
  if (!bigRegion || !smallRegion) return null;
  const regionId = REGION_TO_ID[bigRegion][smallRegion];
  if (regionId) return regionId;
  return null;
};
