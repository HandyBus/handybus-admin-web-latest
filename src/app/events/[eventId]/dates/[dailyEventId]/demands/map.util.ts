import {
  RegionHubClusterNode,
  ShuttleDemandStatisticsReadModel,
} from '@/types/demand.type';

// 특정 좌표로 패닝
export const panToXY = (x: number, y: number, map: kakao.maps.Map | null) => {
  if (!map) {
    return;
  }
  map.panTo(new kakao.maps.LatLng(x, y));
};

// 좌표 배열을 받아 해당 좌표들을 포함하는 영역으로 패닝
export const panToBounds = (
  coords: kakao.maps.LatLng[],
  map: kakao.maps.Map | null,
) => {
  if (!map) {
    return;
  }
  const bounds = new kakao.maps.LatLngBounds();
  coords.forEach((coord) => {
    bounds.extend(coord);
  });
  map.panTo(bounds);
};

// 지역 마커 생성
export const createRegionMarker = (
  region: string,
  demand: ShuttleDemandStatisticsReadModel,
) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative group';

  const content = document.createElement('div');
  content.className =
    'w-84 h-84 bg-basic-black/60 rounded-full flex justify-center items-center flex-col';
  content.innerHTML = `<div style="height: 4px"></div><p style="color: white; font-size: 12px;">${region}</p><p style="color: white;font-size: 14px; font-weight: 600;">${demand.totalCount}개</p>`;

  const tooltip = document.createElement('div');
  tooltip.className =
    'hidden group-hover:block absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-basic-black/80 text-basic-white p-8 rounded-6 min-w-200 z-50 max-h-400 overflow-y-auto';
  tooltip.innerHTML = `
          <h6 class="text-14 font-500">${region}</h6>
          <p class="text-14 text-basic-grey-200">총 수요: ${demand.totalCount}개</p>
          <p class="text-14 text-basic-grey-200">왕복 수요: ${demand.roundTripCount}개</p>
          <p class="text-14 text-basic-grey-200">가는 편 수요: ${demand.toDestinationCount}개</p>
          <p class="text-14 text-basic-grey-200">오는 편 수요: ${demand.fromDestinationCount}개</p>
        `;

  wrapper.appendChild(content);
  wrapper.appendChild(tooltip);

  return wrapper;
};

// 군집 마커 생성
export const createHubMarker = (cluster: RegionHubClusterNode) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative group';

  const content = document.createElement('div');
  const name = cluster.nodes[0].data.regionHubName + ' 부근';
  const count = cluster.totalCount;
  content.className =
    'w-80 h-80 bg-basic-blue-700/70 rounded-full flex justify-center items-center flex-col relative';
  content.innerHTML = `<div style="height: 4px"></div><p style="color: white; font-size: 12px; width: 64px; height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</p><p style="color: white;font-size: 14px; font-weight: 600;">${count}개</p>`;

  const tooltip = document.createElement('div');
  tooltip.className =
    'hidden group-hover:block absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-basic-black/80 text-basic-white p-8 rounded-6 min-w-200 z-50 max-h-400 overflow-y-auto';
  tooltip.innerHTML = `
    <h6 class="text-14 font-500">${name}</h6>
    <p class="text-14 text-basic-grey-200 pb-4">총 수요: ${count}개</p>
    ${cluster.nodes
      .sort((a, b) => b.data.count - a.data.count)
      .map((node) => {
        return `<p class="text-12 text-basic-grey-50 pb-[2px]">${node.data.regionHubName}: ${node.data.count}개</p>`;
      })
      .join('')}
  `;

  wrapper.appendChild(content);
  wrapper.appendChild(tooltip);

  return wrapper;
};
