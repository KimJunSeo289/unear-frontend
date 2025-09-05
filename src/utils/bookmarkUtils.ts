import type { FavoritePlace, BookmarkStore } from '@/types/bookmark';
import type { CategoryType, StoreClassType } from '@/types/myPage';
import type { EventType } from '@/components/common/StoreTypeIcon';
import { formatDistance } from '@/utils/distanceUtils';

/**
 * CategoryType 유효성 검증
 * @param code - 검증할 카테고리 코드
 * @returns 유효한 CategoryType인지 여부
 */
const isValidCategoryType = (code: string): code is CategoryType => {
  // CategoryType의 유효한 값들을 체크 (StoreTypeIcon과 일치)
  const validCategoryTypes = [
    'FOOD',
    'ACTIVITY',
    'EDUCATION',
    'CULTURE',
    'BAKERY',
    'LIFE',
    'SHOPPING',
    'CAFE',
    'BEAUTY',
    'POPUP',
  ];
  return validCategoryTypes.includes(code);
};

/**
 * StoreClassType 유효성 검증
 * @param code - 검증할 스토어 클래스 코드
 * @returns 유효한 StoreClassType인지 여부
 */
const isValidStoreClassType = (code: string): code is StoreClassType => {
  // StoreClassType의 유효한 값들을 체크 (StoreTypeIcon과 일치)
  const validStoreClassTypes = ['LOCAL', 'FRANCHISE', 'BASIC'];
  return validStoreClassTypes.includes(code);
};

/**
 * 시간을 24시간 형식에서 12시간 형식 문자열로 변환
 * @param startTime - 시작 시간 (0-23)
 * @param endTime - 종료 시간 (0-23)
 * @returns 운영시간 문자열
 */
const formatOperatingHours = (startTime: number, endTime: number): string => {
  // 24시간 운영인 경우
  if (startTime === 0 && endTime === 0) {
    return '24시간';
  }

  // 정상적인 운영시간인 경우
  const formatTime = (time: number): string => {
    if (time === 0) return '00:00';
    return `${time.toString().padStart(2, '0')}:00`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * 백엔드 eventCode를 프론트엔드 EventType으로 변환
 * @param eventCode - 백엔드 이벤트 코드
 * @returns EventType
 */
const mapEventCode = (eventCode: string): EventType => {
  switch (eventCode) {
    case 'GENERAL':
      return 'GENERAL';
    case 'REQUIRE':
      return 'REQUIRE';
    case 'NONE':
    default:
      return 'NONE';
  }
};

/**
 * 백엔드 FavoritePlace를 프론트엔드 BookmarkStore로 변환
 * @param favoritePlace - 백엔드 즐겨찾기 데이터
 * @returns BookmarkStore
 */
export const convertFavoritePlaceToBookmarkStore = (
  favoritePlace: FavoritePlace
): BookmarkStore => {
  // 타입 유효성 검증
  if (!isValidCategoryType(favoritePlace.categoryCode)) {
  }
  if (!isValidStoreClassType(favoritePlace.markerCode)) {
  }

  return {
    id: favoritePlace.placeId.toString(),
    placeId: favoritePlace.placeId,
    name: favoritePlace.placeName,
    address: favoritePlace.address,
    distance: formatDistance(favoritePlace.distanceKm),
    hours: formatOperatingHours(favoritePlace.startTime, favoritePlace.endTime),
    category: isValidCategoryType(favoritePlace.categoryCode)
      ? favoritePlace.categoryCode
      : ('FOOD' as CategoryType), // 기본값 설정
    storeClass: isValidStoreClassType(favoritePlace.markerCode)
      ? favoritePlace.markerCode
      : ('FRANCHISE' as StoreClassType), // 기본값 설정
    event: mapEventCode(favoritePlace.eventCode),
    isBookmarked: favoritePlace.favorite,
    phoneNumber: favoritePlace.tel,
    latitude: favoritePlace.latitude,
    longitude: favoritePlace.longitude,
  };
};

/**
 * 백엔드 FavoritePlace 배열을 BookmarkStore 배열로 변환
 * @param favoritePlaces - 백엔드 즐겨찾기 데이터 배열
 * @returns BookmarkStore 배열
 */
export const convertFavoritePlacesToBookmarkStores = (
  favoritePlaces: FavoritePlace[]
): BookmarkStore[] => {
  return favoritePlaces.map(convertFavoritePlaceToBookmarkStore);
};
