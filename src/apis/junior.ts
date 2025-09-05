import axiosInstance from './axiosInstance';
import type { BookmarkStore } from '@/types/bookmark';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import type { CategoryType, EventType, StoreClassType } from '@/components/common/StoreTypeIcon';

// 서버에서 내려주는 주니어 매장 데이터의 타입 (예시)
interface JuniorStoreResponse {
  storeId: string;
  storeName: string;
  fullAddress: string;
  operatingHours: string;
  categoryCode: CategoryType;
  storeType: StoreClassType;
  eventCode: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
}

// 주니어 매장 목록을 가져오는 전용 API
export const getJuniorStores = async (): Promise<BookmarkStore[]> => {
  try {
    // 1. 전국 단위의 주니어 매장 목록을 반환하는 API를 호출합니다.
    const response = await axiosInstance.get('/stores/junior');
    const data: JuniorStoreResponse[] | undefined = response.data?.data;

    if (!data) {
      return [];
    }

    // 2. 서버 데이터를 프론트엔드 BookmarkStore 타입으로 변환합니다.
    const transformedData = data.map(
      (store): BookmarkStore => ({
        id: store.storeId,
        placeId: Number(store.storeId),
        name: store.storeName,
        address: store.fullAddress,
        hours: store.operatingHours,
        category: store.categoryCode,
        storeClass: store.storeType,
        event: store.eventCode,
        isBookmarked: store.isBookmarked,
        // 'distance'는 BookmarkStore 타입의 필수 속성이지만 API 응답에 포함되어 있지 않으므로,
        // 타입 오류를 방지하기 위해 빈 문자열을 기본값으로 할당합니다.
        distance: '',
      })
    );

    return transformedData;
  } catch (error) {
    throw error;
  }
};
