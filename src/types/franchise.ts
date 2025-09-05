export type GradeType = 'VVIP' | 'VIP' | '우수';

export interface FranchiseBenefitItem {
  franchiseId: number;
  franchiseName: string;
  franchiseImageUrl: string;
  categoryCode: string;
  description: string;
  hasVvip: boolean;
  hasVip: boolean;
  hasBasic: boolean;
}

export interface FranchiseBenefitResponse {
  content: FranchiseBenefitItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}
