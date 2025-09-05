import axiosInstance from './axiosInstance';
import type { FranchiseBenefitResponse } from '@/types/franchise';

export const getFranchiseBenefits = async (params: {
  page: number;
  size: number;
  franchiseName?: string;
}): Promise<FranchiseBenefitResponse> => {
  const res = await axiosInstance.get('/benefits/franchise', { params });
  return res.data.data; // data 내부에 실제 응답 객체가 있다고 가정
};
