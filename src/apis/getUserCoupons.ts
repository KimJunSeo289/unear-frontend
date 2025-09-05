import axiosInstance from './axiosInstance';
import { showErrorToast, showToast } from '@/utils/toast';
import type { UserCoupon } from '@/types/coupon';

// API 응답 타입
interface UserCouponListResponse {
  resultCode: number;
  message: string;
  data: {
    count: number;
    coupons: UserCoupon[];
  };
}

// Axios 에러 타입
interface AxiosError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
  message?: string;
}

/**
 * 유저 쿠폰 리스트 API
 * @returns UserCouponListResponse
 */
export const getUserCoupons = async (): Promise<{
  count: number;
  coupons: UserCoupon[];
}> => {
  try {
    const response = await axiosInstance.get('/coupons/me', {
      timeout: 10000, // 10초 타임아웃
    });

    const responseData = response.data as UserCouponListResponse;

    if (responseData.resultCode === 200 && responseData.data) {
      return responseData.data;
    } else {
      throw new Error('쿠폰 목록을 가져올 수 없습니다.');
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 401:
          break;
        case 403:
          showErrorToast('쿠폰 목록에 접근할 권한이 없습니다.');
          break;
        case 404:
          showToast('ℹ️ 보유한 쿠폰이 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '쿠폰 목록을 불러올 수 없습니다.');
          }
      }
    } else {
      showErrorToast('쿠폰 목록을 불러올 수 없습니다.');
    }

    return { count: 0, coupons: [] };
  }
};
