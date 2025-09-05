export interface NearbyCoupon {
  couponTemplateId: number;
  couponName: string;
  discountCode: 'COUPON_FIXED' | 'COUPON_PERCENT';
  membershipCode: string;
  discountInfo: string | null;
  couponStart: string;
  couponEnd: string;
  userCouponId: number | null;
  downloaded: boolean;
}

export interface NearbyStore {
  placeId: number;
  name: string;
  address: string;
  categoryCode: string;
  distanceKm: number | null;
  latitude: number;
  longitude: number;
  startTime: number;
  endTime: number;
  favorite: boolean;
  markerCode: string;
  eventTypeCode: string;
  tel: string;
  discountPolicyDetailId: number | null;
  franchiseId: number | null;
  benefitDesc: string | null;
  coupons: NearbyCoupon[];
}
