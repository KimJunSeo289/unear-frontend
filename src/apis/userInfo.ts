import axiosInstance from './axiosInstance';
import { useAuthStore } from '@/store/auth';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// 실제 API 응답 구조에 맞춘 인터페이스
interface UserInfoApiResponse {
  data: {
    userId: number;
    email: string;
    username: string;
    membershipCode: 'BASIC' | 'VIP' | 'VVIP';
    gender?: 'M' | 'F';
    birthdate?: string;
    tel?: string;
    barcodeNumber?: string;
    provider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
    isProfileComplete?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  message: string;
  resultCode: number;
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

// 사용자 정보 업데이트 요청 인터페이스
interface UpdateUserInfoRequest {
  username?: string;
  tel?: string;
  birthdate?: string;
  gender?: 'M' | 'F';
}

/**
 * 현재 로그인된 사용자의 정보를 조회합니다 (/users/me API 사용)
 * @returns 사용자 정보
 */
export const getUserInfo = async (): Promise<UserInfoApiResponse['data'] | null> => {
  try {
    const response = await axiosInstance.get('/users/me', {
      timeout: 10000, // 10초 타임아웃
    });

    if (response.data.resultCode === 200 && response.data.data) {
      const userInfo = response.data.data;

      // Zustand 스토어에 사용자 정보 저장
      const { setUserInfo } = useAuthStore.getState();
      setUserInfo({
        providerId: userInfo.provider,
        userId: userInfo.userId,
        email: userInfo.email,
        username: userInfo.username,
        membershipCode: userInfo.membershipCode,
        gender: userInfo.gender,
        birthdate: userInfo.birthdate,
        tel: userInfo.tel,
        barcodeNumber: userInfo.barcodeNumber,
        provider: userInfo.provider,
        isProfileComplete: userInfo.isProfileComplete,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      });

      return userInfo;
    } else {
      throw new Error('사용자 정보를 가져올 수 없습니다.');
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
          showErrorToast('로그인이 필요합니다.');
          break;
        case 404:
          showErrorToast('사용자 정보를 찾을 수 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '사용자 정보 조회에 실패했습니다.');
          }
      }
    }

    return null;
  }
};

/**
 * 사용자 정보를 업데이트합니다
 * @param updateData 업데이트할 사용자 정보
 * @returns 업데이트된 사용자 정보
 */
export const updateUserInfo = async (
  updateData: UpdateUserInfoRequest
): Promise<UserInfoApiResponse['data'] | null> => {
  try {
    const response = await axiosInstance.put('/users/me', updateData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.resultCode === 200 && response.data.data) {
      const updatedUserInfo = response.data.data;

      // Zustand 스토어의 사용자 정보 업데이트
      const { updateUserInfo: updateStoreUserInfo } = useAuthStore.getState();
      updateStoreUserInfo({
        username: updatedUserInfo.username,
        tel: updatedUserInfo.tel,
        birthdate: updatedUserInfo.birthdate,
        gender: updatedUserInfo.gender,
      });

      showSuccessToast('사용자 정보가 업데이트되었습니다.');
      return updatedUserInfo;
    } else {
      throw new Error('사용자 정보 업데이트에 실패했습니다.');
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 400:
          showErrorToast(message || '잘못된 요청입니다.');
          break;
        case 401:
          showErrorToast('로그인이 필요합니다.');
          break;
        case 409:
          showErrorToast('이미 사용 중인 정보입니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '사용자 정보 업데이트에 실패했습니다.');
          }
      }
    }

    return null;
  }
};

/**
 * 로그인 후 사용자 정보를 자동으로 조회하고 스토어에 저장합니다
 * AuthProvider나 로그인 성공 후 호출하세요
 */
export const initializeUserInfo = async (): Promise<boolean> => {
  try {
    const userInfo = await getUserInfo();

    if (userInfo) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
