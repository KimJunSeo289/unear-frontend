import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import axiosInstance from '@/apis/axiosInstance';

// 환경변수에서 API 도메인 가져오기
const API_DOMAIN = import.meta.env.VITE_API_BASE_URL || 'https://dev.unear.site';

// API 응답 타입 정의
interface KakaoLoginResponse {
  codeName?: string;
  resultCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

// 에러 타입 정의
interface LoginError {
  message?: string;
}

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState('카카오 로그인 처리 중...');
  const [hasError, setHasError] = useState(false);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했으면 무시
    if (hasProcessed.current) {
      return;
    }

    const handleKakaoLogin = async (): Promise<void> => {
      // 처리 시작 플래그 설정
      hasProcessed.current = true;

      try {
        setLoadingMessage('카카오 인가 코드 확인 중...');

        // URL에서 'code' 파라미터(인가 코드)를 추출합니다.
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('로그인에 실패했습니다. (인가 코드 없음)');
        }

        setLoadingMessage('카카오 서버와 연동 중...');

        // 환경변수를 사용한 API URL
        const apiUrl = `${API_DOMAIN}/login/oauth2/code/kakao`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = (await response.json()) as KakaoLoginResponse;

        if (response.ok && (data.codeName === 'SUCCESS' || data.resultCode === 200)) {
          if (data.data?.accessToken) {
            setLoadingMessage('사용자 정보를 불러오는 중...');

            // AuthProvider의 login 함수 사용
            await login(data.data.accessToken, data.data.refreshToken);

            // 인증 상태 확인 (네트워크 에러 시 간단한 대기 후 진행)
            setLoadingMessage('인증 상태 확인 중...');

            // 짧은 대기 시간으로 AuthProvider 상태 업데이트 보장
            await new Promise((resolve) => setTimeout(resolve, 1000));

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
          } else {
            throw new Error('백엔드에서 accessToken을 받지 못했습니다.');
          }
        } else {
          throw new Error(data.message || '카카오 로그인에 실패했습니다.');
        }
      } catch (error: unknown) {
        setHasError(true);

        const loginError = error as LoginError;
        const errorMessage = loginError.message || '카카오 로그인 처리 중 오류가 발생했습니다.';

        setLoadingMessage(errorMessage);

        // 에러 발생 시 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleKakaoLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 카카오 로그인 처리 중 로딩 화면 표시
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

export default KakaoRedirectHandler;
