import { REGION_TO_ID } from '@/constants/regions';

export const toAddress = async (latitude: number, longitude: number) =>
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

export const standardizeRegionName = (regionName: string): string => {
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

export const findRegionId = (
  bigRegion: string,
  smallRegion: string,
): string | null => {
  if (!bigRegion || !smallRegion) return null;
  const regionId = REGION_TO_ID[bigRegion][smallRegion];
  if (regionId) return regionId;
  return null;
};
