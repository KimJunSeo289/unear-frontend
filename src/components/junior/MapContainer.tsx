import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import ReactDOM, { type Root } from 'react-dom/client';
import type { KakaoMap, KakaoCustomOverlay, KakaoCircle } from '@/types/kakao';
import type { Place } from '@/types/map';
import { getPlaces } from '@/apis/getPlaces';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import { showErrorToast } from '@/utils/toast';

// MapActions 타입 정의 및 export
export interface MapActions {
  focusLocation: (lat: number, lng: number) => void;
  resetView: () => void;
  refreshPlaces: () => void;
  getMapBounds: () => { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } } | null;
}

const MapContainer = forwardRef<MapActions>((_props, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const [map, setMap] = useState<KakaoMap | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  const circleRef = useRef<KakaoCircle | null>(null);
  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const markerRootsRef = useRef<Root[]>([]);

  // 장소 데이터를 가져오는 함수 분리
  const fetchPlaces = async (mapInstance: KakaoMap) => {
    const bounds = mapInstance.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    try {
      const fetchedPlaces = await getPlaces({
        swLat: sw.getLat(),
        swLng: sw.getLng(),
        neLat: ne.getLat(),
        neLng: ne.getLng(),
      });
      const eventPlaces = fetchedPlaces.filter((p) => p.eventCode !== 'NONE');
      setPlaces(eventPlaces);
    } catch (error) {
      showErrorToast('지도 영역 내 장소 가져오기 실패');
    }
  };

  // useImperativeHandle을 사용하여 부모 컴포넌트에서 호출할 수 있는 메서드들 정의
  useImperativeHandle(
    ref,
    () => ({
      focusLocation: (lat: number, lng: number) => {
        if (map) {
          const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
          map.setCenter(moveLatLng);
        }
      },
      resetView: () => {
        if (map && circleRef.current) {
          const bounds = circleRef.current.getBounds();
          map.setBounds(bounds);
        }
      },
      refreshPlaces: () => {
        if (map) {
          fetchPlaces(map);
        }
      },
      getMapBounds: () => {
        if (!map) return null;
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        return {
          sw: { lat: sw.getLat(), lng: sw.getLng() },
          ne: { lat: ne.getLat(), lng: ne.getLng() },
        };
      },
    }),
    [map]
  );

  // 1. 지도 초기화 Hook
  useEffect(() => {
    if (!kakaoMapKey) {
      return;
    }
    const initializeMap = () => {
      const container = mapRef.current;
      if (!container) return;

      const mapInstance = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        level: 6,
        draggable: false, // 드래그 비활성화
        scrollwheel: false, // 마우스 휠 확대/축소 비활성화
        disableDoubleClickZoom: true, // 더블클릭 확대 비활성화
      });

      circleRef.current = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        radius: 800,
        strokeWeight: 5,
        strokeColor: '#DFA2A2',
        strokeOpacity: 1,
        strokeStyle: 'shortdash',
        fillColor: '#F316B0',
        fillOpacity: 0.08,
      });

      circleRef.current.setMap(mapInstance);
      const bounds = circleRef.current.getBounds();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstance as any).setBounds(bounds);
      setMap(mapInstance);
    };
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => window.kakao.maps.load(initializeMap);
    }
  }, [kakaoMapKey]);

  // 화면 리사이즈 시 지도 경계를 다시 설정하는 Hook
  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      if (circleRef.current && map) {
        const bounds = circleRef.current.getBounds();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (map as any).setBounds(bounds);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // 2. 지도 초기화 후 장소 데이터 한 번만 불러오는 Hook
  useEffect(() => {
    if (!map) return;
    fetchPlaces(map);
  }, [map]);

  // 3. 장소 데이터에 따라 마커를 렌더링하는 Hook
  useEffect(() => {
    if (!map) return;
    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerRootsRef.current.forEach((root) => {
      setTimeout(() => root.unmount(), 0);
    });
    markerOverlaysRef.current = [];
    markerRootsRef.current = [];
    places.forEach((place) => {
      const contentNode = document.createElement('div');
      // 마우스 포인터 및 클릭 이벤트 비활성화를 위한 스타일 적용
      contentNode.style.cursor = 'default';
      contentNode.style.pointerEvents = 'none';

      const root = ReactDOM.createRoot(contentNode);
      root.render(
        <MapMarkerIcon
          category={place.categoryCode}
          storeClass={place.markerCode}
          event={place.eventCode}
          isSelected={false}
        />
      );
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
        content: contentNode,
        yAnchor: 1,
        clickable: false, // 마커 클릭 비활성화
      });
      customOverlay.setMap(map);
      markerOverlaysRef.current.push(customOverlay);
      markerRootsRef.current.push(root);
    });
  }, [map, places]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;
