import { AddressData, SingleSideTripType } from '../types/optimizer.type';

interface Props {
  text: string;
  tripType: SingleSideTripType;
}

export const parseInputData = ({ text, tripType }: Props): AddressData[] => {
  const lines = text
    .trim()
    .split('\n')
    .filter((line) => line.trim());
  const results: AddressData[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    try {
      if (line.includes('\t')) {
        const parts = line.split('\t');
        if (parts.length >= 3) {
          const address = parts[0].trim();
          const coord1 = Number(parts[1].trim());
          const coord2 = Number(parts[2].trim());

          if (!isNaN(coord1) && !isNaN(coord2) && address) {
            // 좌표 범위로 위도/경도 자동 감지
            // 위도는 일반적으로 -90~90, 경도는 -180~180
            // 한국의 경우 위도는 33~43, 경도는 124~132 범위
            let latitude, longitude;
            if (
              coord1 >= 33 &&
              coord1 <= 43 &&
              coord2 >= 124 &&
              coord2 <= 132
            ) {
              // coord1이 위도, coord2가 경도인 경우 (주소, 위도, 경도)
              latitude = coord1;
              longitude = coord2;
            } else if (
              coord2 >= 33 &&
              coord2 <= 43 &&
              coord1 >= 124 &&
              coord1 <= 132
            ) {
              // coord1이 경도, coord2가 위도인 경우 (주소, 경도, 위도)
              latitude = coord2;
              longitude = coord1;
            } else {
              // 범위 밖이면 기본적으로 첫 번째가 위도, 두 번째가 경도로 처리
              latitude = coord1;
              longitude = coord2;
            }

            results.push({
              address,
              longitude,
              latitude,
              tripType,
            });
            continue;
          }
        }
      }

      throw new Error(`올바르지 않은 형식입니다.`);
    } catch (error) {
      throw new Error(
        `라인 ${i + 1}: ${error instanceof Error ? error.message : '파싱 오류'}`,
      );
    }
  }

  return results;
};
