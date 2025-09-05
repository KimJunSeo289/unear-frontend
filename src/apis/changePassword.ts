import axiosInstance from './axiosInstance';
import { useAuthStore } from '@/store/auth';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  const token = useAuthStore.getState().getStoredAccessToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  try {
    const response = await axiosInstance.put('/auth/password', data);

    // 추가 검증: 응답 데이터에서 resultCode 확인
    if (response.data && response.data.resultCode && response.data.resultCode !== 200) {
      const error = new Error(response.data.message || 'Server error') as Error & {
        response: { data: typeof response.data };
      };
      error.response = { data: response.data };
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
