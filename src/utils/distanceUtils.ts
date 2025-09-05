/**
 * 두 좌표 간의 거리를 계산하는 유틸리티 함수들
 */

/**
 * Haversine 공식을 사용하여 두 좌표 간의 거리를 계산
 * @param lat1 시작점 위도
 * @param lng1 시작점 경도
 * @param lat2 종료점 위도
 * @param lng2 종료점 경도
 * @returns 거리 (km)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * 도를 라디안으로 변환
 */
const toRadians = (degree: number): number => {
  return degree * (Math.PI / 180);
};

/**
 * 거리를 사용자에게 표시할 형태로 포맷팅
 * @param distanceKm 거리 (km)
 * @returns 포맷된 거리 문자열
 */
export const formatDistance = (distanceKm: number | null): string => {
  if (distanceKm === null || distanceKm === undefined) {
    return '거리 정보 없음';
  }

  if (distanceKm < 1) {
    // 1km 미만이면 미터로 표시
    const distanceM = Math.round(distanceKm * 1000);
    return `${distanceM}m`;
  } else {
    // 1km 이상이면 km로 표시 (소수점 1자리)
    return `${distanceKm.toFixed(1)}km`;
  }
};

/**
 * 현재 위치를 가져오는 유틸리티 함수
 * @returns Promise<{lat: number, lng: number} | null>
 */
export const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (_error) => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분간 캐시
      }
    );
  });
};
