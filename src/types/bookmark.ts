import type { CategoryType, StoreClassType } from './myPage';
import type { EventType } from '../components/common/StoreTypeIcon';

// 백엔드 API 응답용 타입 (기존 getFavoritePlaces.ts와 통합)
export interface FavoritePlace {
  placeId: number;
  placeName: string;
  placeDesc: string;
  address: string;
  latitude: number;
  longitude: number;
  benefitCategory: string;
  startTime: number;
  endTime: number;
  categoryCode: string;
  markerCode: string;
  eventCode: string;
  franchiseName: string | null;
  tel: string; // 전화번호 필드 추가
  favorite: boolean;
  distanceKm: number | null;
}

// 기존 BookmarkStore 타입 (UI용)
export interface BookmarkStore {
  id: string;
  placeId: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  isBookmarked: boolean;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
}

export interface BookmarkPageState {
  bookmarks: BookmarkStore[];
  displayedBookmarks: BookmarkStore[];
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
}

export interface BookmarkHandlers {
  onBookmarkToggle: (storeId: string) => void;
  onLoadMore: () => void;
}

export type { CategoryType, StoreClassType };
