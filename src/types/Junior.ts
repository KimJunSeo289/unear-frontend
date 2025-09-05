// src/types/Junior.ts

export type CategoryType =
  | 'FOOD'
  | 'ACTIVITY'
  | 'EDUCATION'
  | 'CULTURE'
  | 'BAKERY'
  | 'LIFE'
  | 'SHOPPING'
  | 'CAFE'
  | 'BEAUTY'
  | 'POPUP';
export type StoreStatusType = '영업중' | '휴무';
export type EventType = 'REQUIRE' | 'GENERAL' | null;
export type StoreClassType = 'BRAND' | 'LOCAL';

export interface Coupon {
  id: string;
  title: string;
  expiryDate: string;
}

// Map과 List에서 필요한 모든 정보를 포함하는 통합 Store 타입
export interface StoreType {
  id: string;
  name: string;
  address: string;

  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
  coupons: Coupon[];
  event: EventType;
  storeClass: StoreClassType;
  lat: number;
  lng: number;
}
