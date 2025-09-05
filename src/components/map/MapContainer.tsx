import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import { showToast } from '@/utils/toast';
import type {
  KakaoMap,
  KakaoCustomOverlay,
  KakaoMarkerClusterer,
  KakaoMarker,
  KakaoLatLng,
  KakaoRoadview,
  KakaoRoadviewClient,
} from '@/types/kakao';
import CurrentLocationMarker from '@/components/map/CurrentLocationMarker';
import MapMarkerIcon from '../common/MapMarkerIcon';
import PlaceNameLabel from './PlaceNameLabel';
import EventAreaCircle from './EventAreaCircle';
import { getPlaces } from '@/apis/getPlaces';

export interface MapContainerRef {
  showCurrentLocation: () => void;
  setCenter: (lat: number, lng: number) => void;
  setLevel: (level: number) => void;
  fetchPlaces: () => void;
  getBounds: () => ReturnType<typeof window.kakao.maps.Map.prototype.getBounds> | null;
  deselectMarker?: () => void;
  selectMarker?: (placeId: number) => void;
  setSelectedMarker: (placeId: number) => void;
  getCenter: () => { lat: number; lng: number } | null;
  toggleLoadview: (isActive: boolean) => void;
}

interface MapContainerProps {
  isBookmarkOnly: boolean;
  categoryCodes: string[];
  benefitCategories: string[];
  shouldRestoreLocation: boolean;
  onMarkerClick: (placeId: number, latitude: string, longitude: string) => void;
  onMarkerDeselect?: () => void;
  onLoadviewStateChange?: (isActive: boolean) => void;
  onRoadviewStateChange?: (isOpen: boolean) => void;
}

const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  (
    {
      isBookmarkOnly,
      categoryCodes,
      benefitCategories,
      shouldRestoreLocation,
      onMarkerClick,
      onMarkerDeselect,
      onLoadviewStateChange,
      onRoadviewStateChange,
    },
    ref
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    const mapInstanceRef = useRef<KakaoMap | null>(null);
    const overlayRef = useRef<KakaoCustomOverlay | null>(null);
    const currentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
    const [isLocationShown, setIsLocationShown] = useState(false);
    const fetchPlacesInViewportRef = useRef<() => void>(() => {});
    const [mapInstance, setMapInstance] = useState<KakaoMap | null>(null);
    const selectedPlaceIdRef = useRef<number | null>(null);
    const isSettingCenterRef = useRef(false);
    const clustererRef = useRef<KakaoMarkerClusterer | null>(null);
    const markerInstancesRef = useRef<KakaoMarker[]>([]);
    const [isLoadviewActive, setIsLoadviewActive] = useState(false);
    const isLoadviewActiveRef = useRef(false);
    const loadviewOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
    const roadviewRef = useRef<KakaoRoadview | null>(null);
    const roadviewClientRef = useRef<KakaoRoadviewClient | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    // isLoadviewActive 상태가 변경될 때마다 로드뷰 도로 표시 상태 업데이트
    useEffect(() => {
      if (isLoadviewActive) {
        showLoadviewRoads();
      } else {
        clearLoadviewRoads();
      }
    }, [isLoadviewActive]);

    const clearSelectedMarker = () => {
      selectedPlaceIdRef.current = null;
      onMarkerDeselect?.();
    };

    const toggleLoadview = (isActive: boolean) => {
      setIsLoadviewActive(isActive);
      isLoadviewActiveRef.current = isActive;
      onLoadviewStateChange?.(isActive);
    };

    const showLoadviewRoads = () => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // 기존 로드뷰 오버레이 제거
      clearLoadviewRoads();

      // 로드뷰 도로 오버레이 활성화
      try {
        map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
      } catch (error) {}

      showToast('지도에서 로드뷰 도로를 클릭하세요.');
    };

    const openLoadview = (lat: number, lng: number) => {
      if (!roadviewRef.current || !roadviewClientRef.current) {
        initializeRoadview();
      }

      const position = new window.kakao.maps.LatLng(lat, lng);

      // 로드뷰 컨테이너 표시
      const roadviewContainer = document.getElementById('roadview-container');
      if (roadviewContainer) {
        // 맵 컨테이너 내에서 절대 위치로 설정
        roadviewContainer.style.position = 'absolute';
        roadviewContainer.style.top = '0';
        roadviewContainer.style.left = '0';
        roadviewContainer.style.width = '100%';
        roadviewContainer.style.height = '100%';
        roadviewContainer.style.zIndex = '1000';
        roadviewContainer.style.display = 'block';
        roadviewContainer.style.overflow = 'hidden';

        // 로드뷰 화면 상태 설정
        onRoadviewStateChange?.(true);
      } else {
        return;
      }

      // 가장 가까운 로드뷰 파노ID 찾기
      if (roadviewClientRef.current) {
        roadviewClientRef.current.getNearestPanoId(position, 50, (panoId: string | null) => {
          if (panoId === null) {
            showToast('이 위치에서는 로드뷰를 사용할 수 없습니다.');
            if (roadviewContainer) {
              roadviewContainer.style.display = 'none';
            }
            // 로드뷰 화면 상태를 비활성화 (UI가 사라지지 않도록)
            onRoadviewStateChange?.(false);
          } else {
            // 로드뷰 실행
            if (roadviewRef.current) {
              roadviewRef.current.setPanoId(panoId, position);

              // 약간의 지연 후 relayout 호출
              setTimeout(() => {
                if (roadviewRef.current) {
                  roadviewRef.current.relayout();
                }
                // 로드뷰가 성공적으로 로드된 후 닫기 버튼 표시
                if (closeButtonRef.current) {
                  closeButtonRef.current.style.display = 'flex';
                }
              }, 100);
            }
          }
        });
      }
    };

    const clearLoadviewRoads = () => {
      loadviewOverlaysRef.current.forEach((overlay) => {
        if (overlay && overlay.setMap) {
          overlay.setMap(null);
        }
      });
      loadviewOverlaysRef.current = [];

      // 로드뷰 도로 오버레이 제거
      const map = mapInstanceRef.current;
      if (map) {
        try {
          map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
        } catch (error) {}
      }
    };

    const initializeRoadview = () => {
      if (!window.kakao || !window.kakao.maps) {
        return;
      }

      // 기존 로드뷰 컨테이너가 있다면 제거
      const existingContainer = document.getElementById('roadview-container');
      if (existingContainer) {
        existingContainer.remove();
      }

      // 로드뷰 컨테이너 생성
      const roadviewContainer = document.createElement('div');
      roadviewContainer.id = 'roadview-container';
      roadviewContainer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          background: white;
          display: none;
          overflow: hidden;
        `;

      // 닫기 버튼 생성
      const closeButton = document.createElement('button');
      closeButtonRef.current = closeButton;
      closeButton.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        `;
      closeButton.style.cssText = `
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
        `;

      // 로드뷰 컨테이너를 맵 컨테이너에 추가
      const mapContainer = mapRef.current;
      if (mapContainer) {
        mapContainer.appendChild(roadviewContainer);
        mapContainer.appendChild(closeButton); // 닫기 버튼을 맵 컨테이너에 직접 추가

        // 클릭 이벤트 리스너 추가
        closeButton.addEventListener('click', () => {
          roadviewContainer.style.display = 'none';
          closeButton.style.display = 'none'; // 닫기 버튼도 숨김
          // 로드뷰 화면 상태를 비활성화
          onRoadviewStateChange?.(false);
        });
      }

      // 로드뷰 객체 생성
      try {
        roadviewRef.current = new window.kakao.maps.Roadview(roadviewContainer);
        roadviewClientRef.current = new window.kakao.maps.RoadviewClient();

        // 로드뷰가 로드되었는지 확인하는 이벤트 리스너 추가
        window.kakao.maps.event.addListener(roadviewRef.current, 'init', () => {});

        window.kakao.maps.event.addListener(roadviewRef.current, 'panorama_changed', () => {});
      } catch (error) {}
    };

    const renderCurrentLocation = useCallback((lat: number, lng: number) => {
      const currentLatLng = new window.kakao.maps.LatLng(lat, lng);
      const map = mapInstanceRef.current;
      if (!map) return;

      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }

      const markerHTML = ReactDOMServer.renderToString(<CurrentLocationMarker />);
      const el = document.createElement('div');
      el.innerHTML = markerHTML;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: currentLatLng,
        content: el.firstElementChild as Node,
        yAnchor: 0.5,
        zIndex: 2,
      });

      overlay.setMap(map);
      overlayRef.current = overlay;
    }, []);

    const showCurrentLocation = () => {
      if (!navigator.geolocation) {
        alert('이 브라우저는 위치 정보 사용을 지원하지 않습니다.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          currentLocationRef.current = { lat: latitude, lng: longitude };
          renderCurrentLocation(latitude, longitude);
          mapInstanceRef.current?.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
          setIsLocationShown(true);
        },
        (_error) => {}
      );
    };

    useImperativeHandle(ref, () => ({
      showCurrentLocation,
      deselectMarker: () => {
        clearSelectedMarker();
      },
      setSelectedMarker: (placeId) => {
        selectedPlaceIdRef.current = placeId;
      },
      setCenter: (lat, lng) => {
        const map = mapInstanceRef.current;
        if (map) {
          isSettingCenterRef.current = true;
          map.setCenter(new window.kakao.maps.LatLng(lat, lng));
          setTimeout(() => {
            isSettingCenterRef.current = false;
            renderMarkers();
          }, 500);
        }
      },
      setLevel: (level) => {
        const map = mapInstanceRef.current;
        if (map) {
          isSettingCenterRef.current = true;
          map.setLevel(level);
          setTimeout(() => {
            isSettingCenterRef.current = false;
            renderMarkers();
          }, 500);
        }
      },
      fetchPlaces: () => {
        if (mapInstanceRef.current) {
          renderMarkers();
        } else {
        }
      },
      getBounds: () => {
        return mapInstanceRef.current?.getBounds() || null;
      },
      selectMarker: (placeId: number) => {
        selectedPlaceIdRef.current = placeId;
      },
      getCenter: () => {
        const map = mapInstanceRef.current;
        if (!map) return null;
        const center = map.getCenter();
        return {
          lat: center.getLat(),
          lng: center.getLng(),
        };
      },
      toggleLoadview,
    }));

    const renderMarkers = useCallback(async () => {
      const map = mapInstanceRef.current;
      const clusterer = clustererRef.current;
      if (!map) return;

      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const currentLevel = map.getLevel();

      const storedIsBookmarkOnly = localStorage.getItem('isBookmarkOnly');
      const storedCategoryCodes = localStorage.getItem('categoryCodes');
      const storedBenefitCategories = localStorage.getItem('benefitCategories');

      const currentIsBookmarkOnly = storedIsBookmarkOnly ? JSON.parse(storedIsBookmarkOnly) : false;
      const currentCategoryCodes = storedCategoryCodes ? JSON.parse(storedCategoryCodes) : [];
      const currentBenefitCategories = storedBenefitCategories
        ? JSON.parse(storedBenefitCategories)
        : [];

      try {
        const places = await getPlaces({
          swLat: sw.getLat(),
          swLng: sw.getLng(),
          neLat: ne.getLat(),
          neLng: ne.getLng(),
          isFavorite: currentIsBookmarkOnly,
          categoryCodes: currentCategoryCodes,
          benefitCategories: currentBenefitCategories,
        });

        // 기존 마커들을 완전히 제거
        if (markerInstancesRef.current.length > 0) {
          markerInstancesRef.current.forEach((m) => {
            if (m && m.setMap) {
              m.setMap(null);
            }
          });
          if (clusterer) {
            try {
              clusterer.removeMarkers(markerInstancesRef.current);
              clusterer.clear();
            } catch (error) {}
          }
          markerInstancesRef.current = [];
        }

        if (places.length === 0) {
          if (!isLocationShown && currentLocationRef.current) {
            renderCurrentLocation(currentLocationRef.current.lat, currentLocationRef.current.lng);
          }
          // 지도를 다시 그리기
          const center = map.getCenter();
          map.setCenter(center);
          return;
        }

        const newMarkers: KakaoMarker[] = places.map((place) => {
          const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);

          // 마커와 텍스트를 포함하는 컨테이너 생성
          const containerElement = document.createElement('div');
          containerElement.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          `;

          // 마커 렌더링
          const markerHTML = ReactDOMServer.renderToString(
            <MapMarkerIcon
              category={place.categoryCode}
              storeClass={place.markerCode}
              event={place.eventCode}
              isSelected={selectedPlaceIdRef.current === place.placeId}
            />
          );

          const markerEl = document.createElement('div');
          markerEl.innerHTML = markerHTML;
          const markerElement = markerEl.firstElementChild as HTMLElement;

          if (markerElement) {
            markerElement.addEventListener('click', () => {
              selectedPlaceIdRef.current = place.placeId;
              onMarkerClick(place.placeId, String(place.latitude), String(place.longitude));
            });
          }

          // 마커를 컨테이너에 추가
          containerElement.appendChild(markerElement);

          // 지도 레벨 4 이하에서 장소명 텍스트 추가
          if (currentLevel <= 4) {
            const textHTML = ReactDOMServer.renderToString(
              <PlaceNameLabel
                placeName={place.placeName}
                onClick={() => {
                  selectedPlaceIdRef.current = place.placeId;
                  onMarkerClick(place.placeId, String(place.latitude), String(place.longitude));
                }}
              />
            );

            const textEl = document.createElement('div');
            textEl.innerHTML = textHTML;
            const textElement = textEl.firstElementChild as HTMLElement;

            if (textElement) {
              textElement.addEventListener('click', () => {
                selectedPlaceIdRef.current = place.placeId;
                onMarkerClick(place.placeId, String(place.latitude), String(place.longitude));
              });

              containerElement.appendChild(textElement);
            }
          }

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position,
            content: containerElement,
            yAnchor: 0.5,
            zIndex: 1,
          });

          const marker = new window.kakao.maps.Marker({ position });
          marker.setOpacity(0);

          const originalSetMap = marker.setMap;
          marker.setMap = function (mapInstance) {
            originalSetMap.call(this, mapInstance);
            customOverlay.setMap(mapInstance);
          };

          return marker;
        });

        markerInstancesRef.current = newMarkers;
        const currentZoom = mapInstanceRef.current?.getLevel?.();

        // 마커를 지도에 추가
        try {
          if (places.length <= 3) {
            newMarkers.forEach((marker) => {
              if (marker && marker.setMap) {
                marker.setMap(map);
              }
            });
          } else if (currentZoom !== undefined && currentZoom <= 6) {
            newMarkers.forEach((marker) => {
              if (marker && marker.setMap) {
                marker.setMap(map);
              }
            });
          } else if (clusterer && clusterer.addMarkers) {
            // clusterer가 null이 아니고 addMarkers 메서드가 있을 때만 사용
            try {
              clusterer.addMarkers(newMarkers);
            } catch (error) {
              newMarkers.forEach((marker) => {
                if (marker && marker.setMap) {
                  marker.setMap(map);
                }
              });
            }
          } else {
            // 클러스터러가 없거나 실패한 경우 개별 마커로 표시
            newMarkers.forEach((marker) => {
              if (marker && marker.setMap) {
                marker.setMap(map);
              }
            });
          }
        } catch (error) {
          // 에러 발생 시 개별 마커로 fallback
          newMarkers.forEach((marker) => {
            if (marker && marker.setMap) {
              marker.setMap(map);
            }
          });
        }

        if (!isLocationShown && currentLocationRef.current) {
          renderCurrentLocation(currentLocationRef.current.lat, currentLocationRef.current.lng);
        }

        // 마커 업데이트 후 지도 다시 그리기
        const center = map.getCenter();
        map.setCenter(center);
      } catch (error) {}
    }, [isLocationShown, onMarkerClick]);

    // 필터링 상태가 변경될 때마다 마커를 다시 렌더링
    useEffect(() => {
      if (mapInstanceRef.current) {
        const storedIsBookmarkOnly = localStorage.getItem('isBookmarkOnly');
        const storedCategoryCodes = localStorage.getItem('categoryCodes');
        const storedBenefitCategories = localStorage.getItem('benefitCategories');

        const _currentIsBookmarkOnly = storedIsBookmarkOnly
          ? JSON.parse(storedIsBookmarkOnly)
          : false;
        const _currentCategoryCodes = storedCategoryCodes ? JSON.parse(storedCategoryCodes) : [];
        const _currentBenefitCategories = storedBenefitCategories
          ? JSON.parse(storedBenefitCategories)
          : [];

        renderMarkers();
      }
    }, [isBookmarkOnly, categoryCodes, benefitCategories, renderMarkers]);

    useEffect(() => {
      fetchPlacesInViewportRef.current = renderMarkers;
    }, [renderMarkers]);

    // selectedPlaceId가 변경될 때는 renderMarkers를 호출하지 않음
    // 마커 선택 상태는 renderMarkers 내에서 처리됨

    useEffect(() => {
      if (!kakaoMapKey) {
        return;
      }

      // 기존 스크립트가 있다면 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=clusterer`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        // 카카오맵 API가 완전히 로드되었는지 확인
        if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === 'function') {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;

            const map = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(37.555, 126.822),
              level: 4,
            });

            mapInstanceRef.current = map;

            // MarkerClusterer 초기화를 안전하게 처리
            const initializeClusterer = (retryCount = 0) => {
              try {
                // 지도가 완전히 로드되었는지 확인
                if (!map || typeof map.getLevel !== 'function') {
                  if (retryCount < 10) {
                    setTimeout(() => initializeClusterer(retryCount + 1), 500);
                    return;
                  } else {
                    console.warn('지도 로딩 실패: 최대 재시도 횟수 초과');
                    clustererRef.current = null;
                    return;
                  }
                }

                // MarkerClusterer가 사용 가능한지 확인
                if (!window.kakao.maps.MarkerClusterer) {
                  if (retryCount < 10) {
                    setTimeout(() => initializeClusterer(retryCount + 1), 500);
                    return;
                  } else {
                    console.warn('MarkerClusterer가 아직 로드되지 않았습니다. 재시도 중...');
                    clustererRef.current = null;
                    return;
                  }
                }

                // MarkerClusterer 생성자 확인
                if (typeof window.kakao.maps.MarkerClusterer !== 'function') {
                  clustererRef.current = null;
                  return;
                }

                // 지도 객체가 실제로 작동하는지 테스트
                try {
                  const testLevel = map.getLevel();
                  const testCenter = map.getCenter();
                  if (testLevel === undefined || !testCenter) {
                    throw new Error('지도 객체가 아직 완전히 초기화되지 않았습니다.');
                  }
                } catch (error) {
                  if (retryCount < 10) {
                    setTimeout(() => initializeClusterer(retryCount + 1), 500);
                    return;
                  } else {
                    console.warn('지도 초기화 실패: 최대 재시도 횟수 초과');
                    clustererRef.current = null;
                    return;
                  }
                }
                const clusterer = new window.kakao.maps.MarkerClusterer({
                  map,
                  averageCenter: true,
                  minLevel: 4,
                  disableClickZoom: true,
                  minClusterSize: 3,
                  gridSize: 60,
                  calculator: [10, 30, 50, 100, 200],
                  styles: [
                    {
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      lineHeight: '40px',
                      boxShadow: '0 2px 6px rgba(255, 105, 180, 0.3)',
                      opacity: '0.9',
                    },
                    {
                      width: '50px',
                      height: '50px',
                      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      lineHeight: '50px',
                      boxShadow: '0 3px 8px rgba(255, 105, 180, 0.4)',
                      opacity: '0.9',
                    },
                    {
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      lineHeight: '60px',
                      boxShadow: '0 4px 10px rgba(255, 105, 180, 0.5)',
                      opacity: '0.9',
                    },
                    {
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      lineHeight: '70px',
                      boxShadow: '0 5px 12px rgba(255, 105, 180, 0.6)',
                      opacity: '0.9',
                    },
                    {
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                      borderRadius: '50%',
                      color: '#fff',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '22px',
                      lineHeight: '80px',
                      boxShadow: '0 6px 14px rgba(255, 105, 180, 0.7)',
                      opacity: '0.9',
                    },
                  ],
                });
                clustererRef.current = clusterer;

                // 클러스터 클릭 이벤트 리스너 추가
                window.kakao.maps.event.addListener(
                  clusterer,
                  'clusterclick',
                  (cluster: KakaoMarkerClusterer) => {
                    const currentLevel = map.getLevel();
                    const newLevel = Math.max(1, currentLevel - 2);

                    // 클러스터 중심으로 이동
                    const center = cluster.getCenter();
                    map.setCenter(center);
                    map.setLevel(newLevel);
                  }
                );
              } catch (error) {
                if (retryCount < 10) {
                  setTimeout(() => initializeClusterer(retryCount + 1), 500);
                } else {
                  console.warn(
                    'MarkerClusterer 초기화 실패: 최대 재시도 횟수 초과\n대안: 개별 마커 모드로 전환'
                  );
                  clustererRef.current = null;
                }
              }
            };

            // 지도 로드 완료 이벤트를 기다린 후 MarkerClusterer 초기화
            const waitForMapLoad = () => {
              // 지도가 완전히 로드되었는지 확인하는 함수
              const isMapReady = () => {
                try {
                  if (!map || typeof map.getLevel !== 'function') return false;
                  const level = map.getLevel();
                  const center = map.getCenter();
                  return level !== undefined && center !== null;
                } catch (error) {
                  return false;
                }
              };

              // 지도가 준비될 때까지 대기
              const checkMapReady = (attempts = 0) => {
                if (isMapReady()) {
                  // 지도가 준비되면 클러스터러 초기화
                  initializeClusterer();
                } else if (attempts < 20) {
                  // 최대 20번까지 시도 (10초)
                  setTimeout(() => checkMapReady(attempts + 1), 500);
                } else {
                  console.warn('지도 로딩 시간 초과: 개별 마커 모드로 전환');
                  clustererRef.current = null;
                }
              };

              checkMapReady();
            };

            // 지도 로드 완료 대기 시작
            waitForMapLoad();

            setMapInstance(map);

            showCurrentLocation();

            // 로드뷰 초기화
            initializeRoadview();

            // 지도 로드 완료 이벤트 리스너 추가
            window.kakao.maps.event.addListener(map, 'tilesloaded', () => {
              // 지도 타일이 로드되면 클러스터러 초기화 시도
              if (!clustererRef.current) {
                initializeClusterer();
              }
            });

            window.kakao.maps.event.addListener(map, 'idle', () => {
              if (!isSettingCenterRef.current) {
                renderMarkers();
              }
            });

            // 지도 레벨 변경 이벤트 리스너 추가
            window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
              renderMarkers();
            });

            // 로드뷰 모드일 때 지도 클릭 이벤트 추가
            window.kakao.maps.event.addListener(
              map,
              'click',
              (mouseEvent?: { latLng?: KakaoLatLng }) => {
                if (isLoadviewActiveRef.current && mouseEvent?.latLng) {
                  const position = mouseEvent.latLng;
                  openLoadview(position.getLat(), position.getLng());
                }
              }
            );

            renderMarkers();
          });
        }
      };

      script.onerror = () => {};

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (clustererRef.current && markerInstancesRef.current.length > 0) {
          clustererRef.current.removeMarkers(markerInstancesRef.current);
        }
        if (overlayRef.current) {
          overlayRef.current.setMap(null);
        }
      };
    }, [kakaoMapKey]);

    useEffect(() => {
      if (mapInstanceRef.current) {
        renderMarkers();
      }
    }, [isBookmarkOnly, categoryCodes, benefitCategories, renderMarkers]);

    useEffect(() => {
      if (shouldRestoreLocation && mapInstanceRef.current && currentLocationRef.current) {
        const { lat, lng } = currentLocationRef.current;
        mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
      }
    }, [shouldRestoreLocation]);

    // 로컬스토리지 변경 감지
    useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
        if (
          e.key === 'isBookmarkOnly' ||
          e.key === 'categoryCodes' ||
          e.key === 'benefitCategories'
        ) {
          if (mapInstanceRef.current) {
            renderMarkers();
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [renderMarkers]);

    return (
      <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0">
        {mapInstance && (
          <EventAreaCircle
            center={{ lat: 37.544581, lng: 127.055961 }}
            radius={800}
            map={mapInstance}
          />
        )}
      </div>
    );
  }
);

export default MapContainer;
