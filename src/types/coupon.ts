// 쿠폰 관련 타입 정의
export interface CouponItem {
  id: string;
  brand: string;
  title: string;
  discountRate: string;
  validUntil: string;
  category: CategoryType;
  storeClass: StoreClassType;
  barcodeValue: string;
  usageCondition: string;
  usageGuide: string[];
  caution: string[];
  isExpiringSoon?: boolean;
}

export interface CouponData {
  expiringSoonCoupons: CouponItem[];
  allCoupons: CouponItem[];
  totalCount: number;
}

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

export type StoreClassType = 'LOCAL' | 'FRANCHISE' | 'BASIC';

export interface CouponPageHandlers {
  onCouponClick: (coupon: CouponItem) => void;
  onBack: () => void;
}

export interface UserCoupon {
  userCouponId: number;
  couponName: string;
  couponEnd: string;
  barcodeNumber: string;
  name: string; // 브랜드명
  categoryCode: CategoryType;
  markerCode: StoreClassType;
  couponStatusCode: 'UNUSED' | 'USED' | 'EXPIRED';
  createdAt: string;
}

export interface UserCouponDetail {
  userCouponId: number;
  couponName: string;
  couponEnd: string;
  barcodeNumber: string;
  brandName: string;
  discountCode: 'COUPON_PERCENT' | 'COUPON_FIXED';
  discountPercent?: number;
  fixedDiscount?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  couponStatusCode: 'UNUSED' | 'USED' | 'EXPIRED';
  createdAt: string;
}
