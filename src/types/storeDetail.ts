// 매장 운영 상태
export type StoreStatusType = '영업중' | '영업종료' | '필수 매장' | '이벤트 매장';

// 이벤트 타입 코드
export type EventTypeCode = 'NONE' | 'GENERAL' | 'REQUIRE';

// 쿠폰 정보
export interface Coupon {
  couponTemplateId: number;
  couponName: string;
  discountCode: 'COUPON_PERCENT' | 'COUPON_FIXED';
  membershipCode: string;
  discountInfo: string | null;
  couponStart: string;
  couponEnd: string;
  userCouponId: number | null;
  downloaded: boolean;
}

// 장소 상세 정보
export interface StoreData {
  placeId: number;
  name: string;
  address: string;
  category: string;
  distance: string;
  latitude: number;
  longitude: number;
  tel: string;
  isBookmarked: boolean;
  benefitDesc?: string;
  eventTypeCode: EventTypeCode;
  status: StoreStatusType;
  hours: string;
  coupons: Coupon[];
}
