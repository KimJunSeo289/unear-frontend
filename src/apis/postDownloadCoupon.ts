import axiosInstance from './axiosInstance';

interface DownloadCouponResponse {
  userCouponId: number;
  couponName: string;
  barcodeNumber: string;
  couponStatusCode: 'UNUSED';
  createdAt: string;
}

/**
 * 쿠폰 다운로드 API
 * @param couponTemplateId
 */
export const postDownloadCoupon = async (
  couponTemplateId: number
): Promise<DownloadCouponResponse> => {
  const response = await axiosInstance.post(`/coupons/${couponTemplateId}/download`);
  return response.data.data;
};
