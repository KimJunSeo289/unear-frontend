import axiosInstance from './axiosInstance';
import type { BenefitDetailResponse } from '@/types/benefitDetail';

export const getBenefitDetail = async (franchiseId: number): Promise<BenefitDetailResponse> => {
  const res = await axiosInstance.get(`/benefits/franchise/${franchiseId}`);
  return res.data.data;
};
