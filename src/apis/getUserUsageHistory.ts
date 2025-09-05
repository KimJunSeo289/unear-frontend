import axiosInstance from './axiosInstance';
import { showErrorToast } from '@/utils/toast';

// API 응답 구조에 맞춘 인터페이스
export interface UsageHistoryItem {
  placeName: string;
  usedAt: string; // "2025-07-29T00:00:00" 형태
  originalAmount: number;
  totalDiscountAmount: number;
  totalPaymentAmount: number;
  isCouponUsed: boolean;
  isMembershipUsed: boolean;
  discountCode: string;
  membershipCode: string;
  placeCategory: string;
}

export interface UsageHistoryPageResponse {
  content: UsageHistoryItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

interface ApiResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: UsageHistoryPageResponse;
}

// Axios 에러 타입 정의
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
 * 사용자 이용 내역을 페이지네이션으로 조회합니다
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 * @returns 이용 내역 페이지 데이터 또는 null
 */
export const getUserUsageHistory = async (
  page: number = 0,
  size: number = 3
): Promise<UsageHistoryPageResponse | null> => {
  try {
    const response = await axiosInstance.get<ApiResponse>('/users/me/usage-history', {
      params: { page, size },
      timeout: 10000, // 10초 타임아웃
    });

    if (response.data.resultCode === 200 && response.data.data) {
      const historyData = response.data.data;

      // 0원 결제 내역 필터링 적용
      const filteredContent = historyData.content.filter(
        (item) => item.originalAmount > 0 && item.totalDiscountAmount > 0
      );

      // 필터링된 content로 새 객체 반환
      return {
        ...historyData,
        content: filteredContent,
      };
    } else {
      throw new Error('이용 내역 정보를 가져올 수 없습니다.');
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 401:
          // 인증 오류는 AuthProvider에서 처리됨
          console.warn('⚠️ 인증 오류 - 토큰 갱신 시도');
          break;
        case 404:
          showErrorToast('이용 내역 정보를 찾을 수 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '이용 내역 조회에 실패했습니다.');
          }
      }
    }

    return null;
  }
};

/**
 * 최근 이용 내역 3개를 조회합니다 (마이페이지용)
 * @returns 최근 이용 내역 3개 또는 null
 */
export const getRecentUsageHistory = async (): Promise<UsageHistoryItem[]> => {
  // 0원 필터링 후 더 많이 가져와서 필터링 후 3개만 잘라서 리턴
  const response = await getUserUsageHistory(0, 10);
  const filtered =
    response?.content.filter((item) => item.originalAmount > 0 && item.totalDiscountAmount > 0) ||
    [];

  return filtered.slice(0, 3);
};
