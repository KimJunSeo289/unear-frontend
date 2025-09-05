// src/pages/auth/GoogleRedirectHandler.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { showErrorToast } from '@/utils/toast';
import axiosInstance from '@/apis/axiosInstance';

const GoogleRedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // 중복 실행 방지
  const [loadingMessage, setLoadingMessage] = useState('구글 로그인 처리 중...');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 이미 처리했으면 무시
    if (hasProcessed.current) {
      return;
    }

    const handleGoogleLogin = async (): Promise<void> => {
      // 처리 시작 플래그 설정
      hasProcessed.current = true;

      try {
        setLoadingMessage('구글 로그인 토큰 확인 중...');

        // 1. URL에서 백엔드가 보내준 토큰을 추출합니다.
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken'); // 혹시 있다면

        if (!accessToken) {
          throw new Error('로그인에 실패했습니다. 토큰이 제공되지 않았습니다.');
        }

        // 2. AuthProvider의 login 함수를 사용하여 토큰을 저장하고 사용자 정보를 자동 로드
        setLoadingMessage('사용자 정보를 불러오는 중...');
        await login(accessToken, refreshToken || undefined);

        // 3. 인증 상태 확인 (네트워크 에러 시 간단한 대기 후 진행)
        setLoadingMessage('인증 상태 확인 중...');

        // 짧은 대기 시간으로 AuthProvider 상태 업데이트 보장
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초로 증가

        // 프로필 완료 상태를 직접 API로 확인 (AuthProvider 상태 대신)
        setLoadingMessage('프로필 상태 확인 중...');

        try {
          const userResponse = await axiosInstance.get('/users/me');
          const userData = userResponse.data.data;

          // OAuth 리다이렉트 진행 중 플래그 설정 (CompleteProfilePage에서 깜빡임 방지용)
          sessionStorage.setItem('oauth_redirect_in_progress', 'true');

          // 프로필 완성 여부에 따라 즉시 분기 (중복 확인 없이 단순 분기)
          if (userData.isProfileComplete === true) {
            setLoadingMessage('메인 페이지로 이동 중...');
            navigate('/', { replace: true });
          } else {
            setLoadingMessage('추가 정보 입력 페이지로 이동 중...');
            // CompleteProfilePage는 미완성 사용자만 온다고 가정하므로 재확인 불필요
            navigate('/complete-profile', { replace: true });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (apiError) {
          // API 실패 시 기본적으로 완성 페이지로 이동
          sessionStorage.setItem('oauth_redirect_in_progress', 'true');
          navigate('/complete-profile', { replace: true });
        }
      } catch (error: unknown) {
        setHasError(true);
        setLoadingMessage('로그인 처리 중 오류가 발생했습니다.');

        const axiosError = error as {
          response?: {
            status?: number;
            data?: {
              message?: string;
            };
          };
          request?: unknown;
          message?: string;
        };

        let errorMessage = '구글 로그인 처리 중 오류가 발생했습니다.';

        if (axiosError.response) {
          if (axiosError.response.status === 401) {
            errorMessage = '인증에 실패했습니다. 토큰이 유효하지 않습니다.';
          } else if (axiosError.response.status === 404) {
            errorMessage = '사용자 정보를 찾을 수 없습니다.';
          } else if (axiosError.response.status && axiosError.response.status >= 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = `서버 오류 (${axiosError.response.status}): ${axiosError.response.data?.message || '알 수 없는 오류'}`;
          }
        } else if (axiosError.request) {
          // 네트워크 에러
          errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
        } else {
          // 기타 에러
          errorMessage = axiosError.message || '알 수 없는 오류가 발생했습니다.';
        }

        // 에러 메시지 표시 및 로그인 페이지로 이동
        showErrorToast(errorMessage);
        setLoadingMessage(errorMessage);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000); // 3초 후 로그인 페이지로 이동
      }
    };

    handleGoogleLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 구글 로그인 처리 중 로딩 화면 표시
  return (
    <>
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p
            className="mt-4 text-sm font-regular text-gray-600"
            style={{ color: hasError ? '#6B7280' : '#6B7280' }}
          >
            {loadingMessage}
          </p>
        </div>
      </div>
    </>
  );
};

export default GoogleRedirectHandler;
