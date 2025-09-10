'use client';

import Heading from '@/components/text/Heading';
import ToolTip from '@/components/tool-tip/ToolTip';
import { BIG_REGIONS_TO_COORDINATES } from '@/constants/regions';
import {
  useGetDemandBasedRouteTree,
  useGetDemandsStats,
} from '@/services/demand.service';
import {
  DemandBasedRouteResponse,
  RegionHubClusterNode,
} from '@/types/demand.type';
import { useCallback, useEffect, useRef, useState } from 'react';
import { customTwMerge } from 'tailwind.config';
import {
  createHubMarker,
  createRegionMarker,
  panToBounds,
  panToXY,
} from '../map.util';
import {
  DEFAULT_CLUSTER_MIN_COUNT,
  DEFAULT_MAX_DISTANCE,
  DEFAULT_MAX_NODES,
  DEFAULT_MIN_COUNT,
} from '@/constants/common';
import KakaoMapScript from '@/components/script/KakaoMapScript';

const ZOOM_LEVEL_LIMIT = 9;

interface Props {
  eventId: string;
  dailyEventId: string;
}

const Map = ({ eventId, dailyEventId }: Props) => {
  const { data: demandsStats, isLoading: isDemandsStatsLoading } =
    useGetDemandsStats({
      groupBy: 'PROVINCE',
      eventId,
      dailyEventId,
    });
  const { data: routeTree, isLoading: isRouteTreeLoading } =
    useGetDemandBasedRouteTree({
      eventId,
      dailyEventId,
    });

  const isInitialized = useRef(false);
  const [isScriptReady, setIsScriptReady] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<kakao.maps.Map | null>(null);
  const regionClusters = useRef<kakao.maps.CustomOverlay[]>([]);
  const hubMarkers = useRef<kakao.maps.CustomOverlay[]>([]);
  const [clustersInRegion, setClustersInRegion] = useState<
    Record<string, RegionHubClusterNode[]>
  >({});
  const routeLine = useRef<kakao.maps.Polyline | null>(null);

  const [viewingRegion, setViewingRegion] = useState<string | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
    null,
  );

  // 지도 초기화
  const initializeMap = useCallback(async () => {
    try {
      if (window.kakao && mapRef.current) {
        const options = {
          center: new kakao.maps.LatLng(36.5, 128),
          level: 12,
        };

        const newMap = new kakao.maps.Map(mapRef.current, options);
        map.current = newMap;

        initializeRegionCluster();
        initializeHubMarker();

        const newClustersInRegion = await getClustersInRegion();
        setClustersInRegion(newClustersInRegion);

        // 줌에 따른 마커 종류 표시 핸들링
        kakao.maps.event.addListener(newMap, 'zoom_changed', () => {
          const level = newMap.getLevel();
          if (!level) {
            return;
          }
          if (level >= ZOOM_LEVEL_LIMIT) {
            handleZoomOutLevel();
          } else {
            handleZoomInLevel();
          }
        });

        // 현재 지도에 표시되는 지역 조회
        kakao.maps.event.addListener(newMap, 'idle', () => {
          const level = newMap.getLevel();
          if (level >= ZOOM_LEVEL_LIMIT) {
            setViewingRegion(null);
            return;
          }
          const center = newMap.getCenter();
          if (!center) {
            return;
          }
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2RegionCode(
            center.getLng(),
            center.getLat(),
            (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                setViewingRegion(result[0].region_1depth_name);
              }
            },
          );
        });
      }
    } catch (error) {
      alert('지도를 불러오는 중 오류가 발생했습니다. \n' + error);
    }
  }, [demandsStats, routeTree]);

  useEffect(() => {
    if (
      isInitialized.current ||
      !isScriptReady ||
      isDemandsStatsLoading ||
      isRouteTreeLoading
    ) {
      return;
    }
    isInitialized.current = true;
    kakao.maps.load(initializeMap);
  }, [
    initializeMap,
    isScriptReady,
    isInitialized,
    isDemandsStatsLoading,
    isRouteTreeLoading,
  ]);

  // 지역 클러스터 초기화
  const initializeRegionCluster = useCallback(() => {
    if (!map.current || !demandsStats) {
      return;
    }
    Object.entries(BIG_REGIONS_TO_COORDINATES).forEach(
      ([region, coordinates]) => {
        const demand = demandsStats.find(
          (demand) => demand.provinceFullName === region,
        );
        if (!demand || demand.totalCount === 0) {
          return;
        }

        const position = new kakao.maps.LatLng(
          coordinates.latitude,
          coordinates.longitude,
        );
        const regionMarker = createRegionMarker(region, demand);
        const customOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: regionMarker,
          clickable: true,
        });

        regionMarker.addEventListener('click', () => {
          // @ts-expect-error 카카오 지도 타입 패키지 미업데이트로 인한 오류
          map.current?.jump(position, ZOOM_LEVEL_LIMIT - 1, { animate: true });
        });
        regionMarker.addEventListener('mouseenter', () => {
          customOverlay.setZIndex(100);
        });
        regionMarker.addEventListener('mouseleave', () => {
          customOverlay.setZIndex(1);
        });

        customOverlay.setMap(map.current);
        regionClusters.current.push(customOverlay);
      },
    );
  }, [demandsStats]);

  // 군집 마커 초기화
  const initializeHubMarker = useCallback(() => {
    if (!map.current || !routeTree) {
      return;
    }
    routeTree.clusters.forEach((cluster) => {
      const hubMarker = createHubMarker(cluster);

      const position = new kakao.maps.LatLng(
        cluster.latitude,
        cluster.longitude,
      );

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: hubMarker,
        clickable: true,
        zIndex: 1,
      });

      hubMarker.addEventListener('mouseenter', () => {
        customOverlay.setZIndex(100);
      });
      hubMarker.addEventListener('mouseleave', () => {
        customOverlay.setZIndex(1);
      });

      customOverlay.setMap(map.current);
      customOverlay.setVisible(false);
      hubMarkers.current.push(customOverlay);
    });
  }, [routeTree]);

  // 지역 클러스터 보이기 & 군집 마커 숨기기
  const handleZoomOutLevel = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(true);
    });
    hubMarkers.current.forEach((marker) => {
      marker.setVisible(false);
    });
    if (routeLine.current) {
      routeLine.current.setMap(null);
      routeLine.current = null;
      setSelectedRouteIndex(null);
    }
  }, [regionClusters]);

  // 지역 클러스터 숨기기 & 군집 마커 보이기
  const handleZoomInLevel = useCallback(() => {
    regionClusters.current.forEach((cluster) => {
      cluster.setVisible(false);
    });
    hubMarkers.current.forEach((marker) => {
      marker.setVisible(true);
    });
  }, [regionClusters]);

  // 군집들의 지역 정보 조회
  const getClustersInRegion = useCallback(async () => {
    if (!routeTree?.clusters || routeTree.clusters.length === 0) {
      return {};
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const chunkSize = 15;
    const clustersWithRegion: {
      region: string;
      cluster: RegionHubClusterNode;
    }[] = [];

    // NOTE: 카카오의 단기간 동시호출 방지로 인해 15개씩 나누어 처리
    for (let i = 0; i < routeTree.clusters.length; i += chunkSize) {
      const chunk = routeTree.clusters.slice(i, i + chunkSize);
      const chunkPromises = chunk.map((cluster) => {
        return new Promise<void>((resolve) => {
          geocoder.coord2RegionCode(
            cluster.longitude,
            cluster.latitude,
            (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                clustersWithRegion.push({
                  region: result[0].region_1depth_name,
                  cluster: cluster,
                });
              }
              resolve();
            },
          );
        });
      });
      await Promise.all(chunkPromises);
    }

    const clustersInRegion = clustersWithRegion.reduce<
      Record<string, RegionHubClusterNode[]>
    >((acc, { region, cluster }) => {
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(cluster);
      return acc;
    }, {});

    return clustersInRegion;
  }, [routeTree]);

  // 노선을 지도에 표시
  const displayRoute = useCallback(
    (coords: kakao.maps.LatLng[], index: number) => {
      if (!map.current) {
        return;
      }
      if (routeLine.current) {
        routeLine.current.setMap(null);
        routeLine.current = null;
        if (index === selectedRouteIndex) {
          setSelectedRouteIndex(null);
          return;
        }
        setSelectedRouteIndex(null);
      }

      if (coords.length < 2) {
        return;
      }

      const polyline = new kakao.maps.Polyline({
        path: coords,
        strokeWeight: 5,
        strokeColor: '#5988C9',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });

      setSelectedRouteIndex(() => index);
      routeLine.current = polyline;
      polyline.setMap(map.current);
    },
    [map, selectedRouteIndex],
  );

  // 군집 클릭 핸들러
  const handleHubClick = (cluster: RegionHubClusterNode) => {
    panToXY(cluster.latitude, cluster.longitude, map.current);
  };

  // 노선 클릭 핸들러
  const handleRouteClick = (route: DemandBasedRouteResponse, index: number) => {
    const clusters = routeTree?.clusters.filter((cluster) =>
      route.nodes.includes(cluster.clusterId),
    );
    if (!clusters) {
      return;
    }
    const coords = clusters.map(
      (cluster) => new kakao.maps.LatLng(cluster.latitude, cluster.longitude),
    );
    panToBounds(coords, map.current);
    displayRoute(coords, index);
  };

  return (
    <>
      <KakaoMapScript
        onReady={() => setIsScriptReady(true)}
        libraries={['services']}
      />
      <div className="flex grow gap-12">
        <div className="relative flex grow flex-col" ref={mapRef}>
          {viewingRegion && (
            <section className="absolute bottom-0 left-0 top-0 z-50 w-240 bg-basic-black/55 p-12 text-basic-white">
              <h5 className="text-18 font-600">{viewingRegion}</h5>
              <article className="flex flex-col p-4 text-12 text-basic-grey-100">
                {(() => {
                  const demand = demandsStats?.find(
                    (demand) => demand.provinceFullName === viewingRegion,
                  );
                  if (!demand) {
                    return null;
                  }
                  return (
                    <>
                      <p>총 수요: {demand.totalCount}개</p>
                      <p>왕복 수요: {demand.roundTripCount}개</p>
                      <p>행사장행 수요: {demand.toDestinationCount}개</p>
                      <p>귀가행 수요: {demand.fromDestinationCount}개</p>
                    </>
                  );
                })()}
              </article>
              <article className="flex flex-col gap-4 text-basic-grey-50">
                <h6 className="flex items-center gap-4 pt-8 text-14 font-600">
                  {viewingRegion} 내 군집들
                  <ToolTip iconClassName="text-basic-grey-300 hover:text-basic-grey-100">
                    기타 수요조사는 지도 및 군집에 표시되지 않습니다.
                  </ToolTip>
                </h6>
                <ul className="flex flex-col gap-[1px] overflow-y-auto">
                  {clustersInRegion?.[viewingRegion]?.map((cluster) => {
                    return (
                      <button
                        key={cluster.clusterId}
                        className="flex items-center justify-between p-4 text-14 hover:bg-basic-grey-100/50"
                        onClick={() => handleHubClick(cluster)}
                      >
                        <span>{cluster.nodes[0].data.regionHubName}</span>
                        <span className="text-12 text-basic-grey-200">
                          {cluster.totalCount}개
                        </span>
                      </button>
                    );
                  })}
                </ul>
              </article>
            </section>
          )}
        </div>
        <section className="flex w-320 flex-col gap-4 bg-basic-white p-12 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.18)]">
          <Heading.h5 className="flex items-center gap-8 bg-basic-grey-100">
            추천 노선
            <ToolTip textClassName="top-20 bottom-auto right-0 z-[100]">
              <div className="flex flex-col gap-4">
                <p>
                  노선 최대 길이: <b>{DEFAULT_MAX_DISTANCE}km</b>
                </p>
                <p>
                  노선 최대 경유 가능 정류장 수: <b>{DEFAULT_MAX_NODES}개</b>
                </p>
                <p>
                  군집 반지름: <b>1km</b>
                </p>
                <p>
                  노선이 개설되는데 필요한 최소 인원 수:{' '}
                  <b>{DEFAULT_MIN_COUNT}명</b>
                </p>
                <p>
                  각 경유 정류장에 필요한 최소 인원 수:{' '}
                  <b>{DEFAULT_CLUSTER_MIN_COUNT}명</b>
                </p>
              </div>
            </ToolTip>
          </Heading.h5>
          <ul className="flex grow flex-col gap-12 overflow-y-auto">
            {routeTree?.routes.map((route, index) => (
              <button
                key={index}
                className={customTwMerge(
                  'flex items-center gap-8 overflow-x-auto px-4 py-8 hover:bg-basic-grey-100/50',
                  selectedRouteIndex === index && 'bg-basic-grey-100/50',
                )}
                onClick={() => handleRouteClick(route, index)}
              >
                {route.nodes.map((node, index) => {
                  const cluster = routeTree?.clusters.find(
                    (cluster) => cluster.clusterId === node,
                  );
                  if (!cluster) {
                    return null;
                  }
                  return (
                    <>
                      <span className="h-full whitespace-nowrap break-keep">
                        {cluster.nodes[0].data.regionHubName}
                      </span>
                      {index !== route.nodes.length - 1 && (
                        <span className="text-basic-grey-500">-</span>
                      )}
                    </>
                  );
                })}
              </button>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Map;
