import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { authApi } from '@/apis/auth';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

interface UseManualLogoutReturn {
  isLoggingOut: boolean;
  handleManualLogout: () => Promise<void>;
}

/**
 * 사용자가 직접 로그아웃 버튼을 클릭했을 때 사용하는 훅
 * 마이페이지의 로그아웃 버튼에서만 사용
 */
export const useManualLogout = (): UseManualLogoutReturn => {
  const navigate = useNavigate();
  const { performManualLogout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleManualLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 1. 백엔드에 로그아웃 요청 (리프레시 토큰 무효화)
      await authApi.logout();

      // 2. 프론트엔드 상태 및 모든 토큰 삭제
      performManualLogout();

      // 3. 성공 메시지 및 로그인 페이지 이동
      showSuccessToast('로그아웃되었습니다.');
      navigate('/login', { replace: true });
    } catch (error) {
      // 백엔드 로그아웃 실패해도 프론트엔드는 로그아웃 처리
      performManualLogout();
      showErrorToast('로그아웃 중 오류가 발생했지만 로그아웃 처리되었습니다.');
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    handleManualLogout,
  };
};
