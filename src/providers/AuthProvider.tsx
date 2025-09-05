import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import axiosInstance from '@/apis/axiosInstance';
import { getUserInfo } from '@/apis/userInfo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { showToast, showSuccessToast } from '@/utils/toast';

interface UserInfo {
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
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  refreshUserInfo: () => Promise<void>;
  userInfo: UserInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    userInfo,
    setAccessToken,
    setAuthenticated,
    isAuthenticated,
    performManualLogout,
    getStoredAccessToken,
    setStoredTokens,
    setAuthInitialized,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 리프레시 토큰으로 액세스 토큰 갱신
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/auth/refresh');

      if (
        response.status === 200 &&
        response.data.resultCode === 200 &&
        response.data.data?.newAccessToken
      ) {
        const newAccessToken = response.data.data.newAccessToken;

        setAccessToken(newAccessToken);
        setStoredTokens(newAccessToken, 'httponly-cookie');
        setAuthenticated(true);

        return true;
      } else {
        throw new Error(response.data?.message || 'Invalid refresh response');
      }
    } catch (error) {
      const axiosError = error as { response?: { status?: number }; code?: string };
      const status = axiosError.response?.status;

      // 리프레시 토큰 만료
      if (status === 401 || status === 403) {
        showToast?.('세션이 만료되었습니다. 다시 로그인해주세요.');
        performManualLogout(); // 직접 호출하여 추가 API 호출 방지
      } else if (status && status >= 500) {
        showToast?.('서버 오류가 발생했습니다.');
        performManualLogout();
      } else if (axiosError.code === 'NETWORK_ERROR') {
      } else {
        performManualLogout();
      }

      return false;
    }
  };

  // 인증 상태 확인
  const checkAuthStatus = async (): Promise<boolean> => {
    const token = getStoredAccessToken();

    if (!token) {
      // 액세스 토큰이 없으면 리프레시 시도
      const canRefresh = await refreshAccessToken();
      if (canRefresh) {
        await loadUserInfo();
        return true;
      } else {
        setAuthenticated(false);
        return false;
      }
    }

    try {
      // 사용자 정보로 토큰 유효성 검증
      const userInfo = await getUserInfo();

      if (userInfo) {
        setAccessToken(token);
        setAuthenticated(true);
        return true;
      } else {
        // getUserInfo가 실패했지만 네트워크 에러가 아닌 경우에만 리프레시 시도
        return await refreshAccessToken();
      }
    } catch (error) {
      const axiosError = error as { response?: { status?: number }; code?: string };
      const status = axiosError.response?.status;

      if (status === 401) {
        // 401 에러면 리프레시 시도
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          await loadUserInfo();
        }
        return refreshSuccess;
      } else if (axiosError.code === 'NETWORK_ERROR') {
        // 네트워크 에러인 경우 현재 토큰이 있으면 인증된 것으로 간주
        setAccessToken(token);
        setAuthenticated(true);
        return true;
      }

      // 다른 에러의 경우에만 로그아웃
      performManualLogout(); // 직접 호출하여 추가 API 호출 방지
      return false;
    }
  };

  // 사용자 정보 로드
  const loadUserInfo = async (): Promise<void> => {
    try {
      await getUserInfo();
    } catch (error) {}
  };

  // 사용자 정보 강제 새로고침 (외부에서 호출 가능)
  const refreshUserInfo = async (): Promise<void> => {
    try {
      await getUserInfo();
    } catch (error) {
      throw error;
    }
  };

  // 로그인
  const login = async (accessToken: string, refreshToken?: string): Promise<void> => {
    const { setRefreshToken } = useAuthStore.getState();
    setAccessToken(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    setAuthenticated(true);

    setStoredTokens(accessToken, refreshToken || null);

    // 기존 토큰 정리
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-storage');
    } catch (error) {}

    await loadUserInfo();

    // 사용자 정보 로드 후 환영 메시지 표시
    const { getUserDisplayName } = useAuthStore.getState();
    const userName = getUserDisplayName();
    showSuccessToast(`${userName}님 환영합니다!`);
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      // 서버에 로그아웃 요청 (HttpOnly 쿠키 삭제)
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      const axiosError = error as { code?: string };
      // 네트워크 에러가 아닌 경우에만 경고 출력
      if (axiosError.code !== 'NETWORK_ERROR') {
      }
    }

    // 클라이언트 상태 정리
    performManualLogout();
  };

  // 초기화
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setIsLoading(true);

      try {
        // 기존 토큰 마이그레이션
        const oldToken = localStorage.getItem('accessToken');
        const oldAuthStorage = localStorage.getItem('auth-storage');

        if (oldToken && !getStoredAccessToken()) {
          setAccessToken(oldToken);
          setStoredTokens(oldToken, null);
          localStorage.removeItem('accessToken');
        }

        if (oldAuthStorage && !getStoredAccessToken()) {
          try {
            const parsed = JSON.parse(oldAuthStorage) as {
              state?: { accessToken?: string; refreshToken?: string };
            };
            if (parsed.state?.accessToken) {
              setAccessToken(parsed.state.accessToken);
              setStoredTokens(parsed.state.accessToken, parsed.state.refreshToken || null);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {}
          localStorage.removeItem('auth-storage');
        }

        // OAuth 리다이렉트 페이지인 경우 초기 인증 상태 확인을 건너뜀
        const currentPath = window.location.pathname;
        const isOAuthRedirect = currentPath.includes('/login/oauth2/code/');

        if (isOAuthRedirect) {
          setAuthenticated(false); // 기본값으로 설정
        } else {
          // 일반 페이지 접근 시에만 인증 상태 확인
          await checkAuthStatus();
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-[600px] min-h-screen mx-auto flex flex-col relative bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm font-regular text-gray-600">U:NEAR에 연결하는 중...</p>
        </div>
      </div>
    );
  }

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    refreshAccessToken,
    refreshUserInfo,
    userInfo,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
