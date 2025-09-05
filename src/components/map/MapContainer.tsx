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

      // localStorage 처리 로직 (임시 비활성화)
      renderMarkers();
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
