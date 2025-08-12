import { ShuttleDemandStatisticsReadModel } from '@/types/demand.type';

interface Area {
  name: string;
  path: kakao.maps.LatLng[];
  totalCount: number;
  roundTripCount: number;
  toDestinationCount: number;
  fromDestinationCount: number;
}

interface MapData {
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][][];
    };
    properties: {
      SIG_KOR_NM: string;
    };
  }[];
}

const ZOOM_LEVEL_LIMIT = 12;

export const displayAreas = ({
  map,
  data,
  stats,
  type,
}: {
  map: kakao.maps.Map;
  data: MapData;
  stats: ShuttleDemandStatisticsReadModel[];
  type: 'sido' | 'gungu';
}) => {
  let maxCount = 0;
  const areas = data.features.map((feature) => {
    const path = feature.geometry.coordinates[0].map((coordinate) => {
      return new kakao.maps.LatLng(coordinate[1], coordinate[0]);
    });
    const demandsStat = stats.find(
      (stat) =>
        (type === 'sido' ? stat.provinceFullName : stat.cityFullName) ===
        feature.properties.SIG_KOR_NM,
    );
    maxCount = Math.max(maxCount, demandsStat?.totalCount ?? 0);

    return {
      name: feature.properties.SIG_KOR_NM,
      path,
      totalCount: demandsStat?.totalCount ?? 0,
      roundTripCount: demandsStat?.roundTripCount ?? 0,
      toDestinationCount: demandsStat?.toDestinationCount ?? 0,
      fromDestinationCount: demandsStat?.fromDestinationCount ?? 0,
    };
  });

  areas.forEach((area) => {
    displayArea({
      map,
      type,
      area,
      maxCount,
    });
  });
};

const displayArea = ({
  map,
  type,
  area,
  maxCount,
}: {
  map: kakao.maps.Map;
  area: Area;
  maxCount: number;
  type: 'sido' | 'gungu';
}) => {
  const getColorByCount = (count: number) => {
    const intensity = Math.min(count / maxCount, 1);

    const red = 255;
    const brandPrimary = Math.round(255 * (1 - intensity));
    const blue = Math.round(255 * (1 - intensity));
    return `rgb(${red},${brandPrimary},${blue})`;
  };

  // 지역 폴리곤 생성
  const polygon = new kakao.maps.Polygon({
    map,
    path: area.path,
    strokeWeight: 2,
    strokeColor: '#004c80',
    strokeOpacity: 0.8,
    fillColor: getColorByCount(area.totalCount),
    fillOpacity: 0.6,
  });
  polygon.setMap(type === 'sido' ? map : null);

  // 지역 오버레이 생성
  const content = document.createElement('div');
  content.className =
    'absolute left-full ml-16 mb-16 top-1/2 -translate-y-1/2 bg-basic-black/80 text-basic-white p-12 rounded-6 min-w-100 z-50 text-center';
  content.innerHTML = `
      <h6 class="text-14 font-500">${area.name}</h6>
      <p class="text-14 text-basic-grey-200">총 수요: ${area.totalCount}개</p>
      <p class="text-14 text-basic-grey-200">왕복 수요: ${area.roundTripCount}개</p>
      <p class="text-14 text-basic-grey-200">가는 편 수요: ${area.toDestinationCount}개</p>
      <p class="text-14 text-basic-grey-200">오는 편 수요: ${area.fromDestinationCount}개</p>
    `;

  const customOverlay = new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(
      area.path[0].getLat(),
      area.path[0].getLng(),
    ),
    content: content,
  });

  customOverlay.setMap(map);
  customOverlay.setVisible(false);

  kakao.maps.event.addListener(map, 'zoom_changed', () => {
    const level = map.getLevel();
    if (!level) {
      return;
    }
    if (type === 'sido') {
      if (level >= ZOOM_LEVEL_LIMIT) {
        polygon.setMap(map);
      } else {
        polygon.setMap(null);
        customOverlay.setVisible(false);
      }
    } else {
      if (level < ZOOM_LEVEL_LIMIT) {
        polygon.setMap(map);
      } else {
        polygon.setMap(null);
        customOverlay.setVisible(false);
      }
    }
  });

  kakao.maps.event.addListener(
    polygon,
    'mouseover',
    (mouseEvent: kakao.maps.event.MouseEvent) => {
      polygon.setOptions({ fillOpacity: 0.8 });
      customOverlay.setVisible(true);
      customOverlay.setPosition(mouseEvent.latLng);
    },
  );

  kakao.maps.event.addListener(
    polygon,
    'mousemove',
    (mouseEvent: kakao.maps.event.MouseEvent) => {
      customOverlay.setPosition(mouseEvent.latLng);
    },
  );

  kakao.maps.event.addListener(polygon, 'mouseout', () => {
    polygon.setOptions({ fillOpacity: 0.6 });
    customOverlay.setVisible(false);
  });
};
