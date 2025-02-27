'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { BanIcon, Loader2Icon } from 'lucide-react';
import KakaoMapScript from '../script/KakaoMapScript';

interface Props {
  coord: Coord;
  setCoord: (coord: Coord) => void;
}

const CoordInput = ({ coord, setCoord }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);

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

  const initializeMap = useCallback(() => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new window.kakao.maps.LatLng(
            coord.latitude || 37.574187,
            coord.longitude || 126.976882,
          ),
          level: 4,
        };

        const map = new window.kakao.maps.Map(mapRef.current, options);
        kakaoMapRef.current = map;
        const marker = new kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);
        markerRef.current = marker;

        window.kakao.maps.event.addListener(
          map,
          'click',
          function (mouseEvent: kakao.maps.event.MouseEvent) {
            setCoordWithAddress(mouseEvent.latLng);
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
  }, []);

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
    const callback = function (
      result: Array<{
        address: kakao.maps.services.Address;
        road_address: kakao.maps.services.RoadAaddress | null;
      }>,
      status: kakao.maps.services.Status,
    ) {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        resolve(address);
      } else {
        reject('Geocoder failed');
      }
    };

    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  });
