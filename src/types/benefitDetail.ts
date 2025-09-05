export interface MembershipPolicy {
  membershipCode: 'BASIC' | 'VIP' | 'VVIP';
  discountCode: string;
  unitBaseAmount: number | null;
  fixedDiscount: number | null;
  discountPercent: number | null;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
}

export interface BenefitDetailResponse {
  img: string | null;
  franchiseId: number;
  franchiseName: string;
  imageUrl: string;
  categoryCode: string;
  membershipPolicies: MembershipPolicy[];
}
