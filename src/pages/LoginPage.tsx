import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ActionButton from '../components/common/ActionButton';
import { useAuth } from '@/providers/AuthProvider';

// 타입 정의
interface LocationState {
  from?: {
    pathname: string;
  };
}

interface LoginResponse {
  codeName?: string;
  resultCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

interface LoginError {
  name?: string;
  message?: string;
}

// 환경변수를 사용한 URL 설정
const KAKAO_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
const NAVER_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      const locationState = location.state as LocationState | null;
      const from = locationState?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const isLoginActive = email.trim() !== '' && password.trim() !== '' && !isLoading;

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleActionClick = async (): Promise<void> => {
    if (!isLoginActive) return;

    setIsLoading(true);
    setErrorMessage(null);

    // 환경변수를 사용한 API URL
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok) {
        handleErrorResponse(data, response.status);
        return;
      }

      // 성공 응답 처리
      if (data.codeName === 'SUCCESS' || data.resultCode === 200) {
        if (data.data?.accessToken) {
          // AuthProvider의 login 함수 사용 (JWT 토큰 저장)
          await login(data.data.accessToken, data.data.refreshToken);

          // 이전 페이지가 있으면 그곳으로, 없으면 메인 페이지로
          const locationState = location.state as LocationState | null;
          const from = locationState?.from?.pathname || '/';

          setTimeout(() => {
            try {
              navigate(from, { replace: true });
            } catch (error) {
              window.location.href = from;
            }
          }, 100);
        } else {
          throw new Error('서버에서 토큰을 받지 못했습니다.');
        }
      } else {
        handleErrorResponse(data, response.status);
      }
    } catch (error: unknown) {
      const loginError = error as LoginError;

      if (loginError.name === 'TypeError' && loginError.message?.includes('fetch')) {
        setErrorMessage('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        setErrorMessage(
          loginError.message || '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorResponse = (data: LoginResponse, statusCode: number): void => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    // 서버에서 보낸 에러 메시지 우선 처리
    if (data.codeName) {
      switch (data.codeName) {
        case 'INVALID_PASSWORD':
          errorMessage = '비밀번호가 올바르지 않습니다.';
          break;
        case 'USER_NOT_FOUND':
        case 'U404':
          errorMessage = '등록되지 않은 이메일입니다.';
          break;
        case 'ACCOUNT_LOCKED':
          errorMessage = '계정이 잠겨있습니다. 관리자에게 문의하세요.';
          break;
        case 'INVALID_CREDENTIALS':
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        default:
          errorMessage = data.message || '로그인에 실패했습니다.';
      }
    } else if (data.message) {
      errorMessage = data.message;
    } else {
      // HTTP 상태 코드별 처리
      switch (statusCode) {
        case 400:
          errorMessage = '입력한 정보를 다시 확인해주세요.';
          break;
        case 401:
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        case 429:
          errorMessage = '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 503:
          errorMessage = '서비스가 일시적으로 이용할 수 없습니다.';
          break;
        default:
          errorMessage = '로그인에 실패했습니다.';
      }
    }

    setErrorMessage(errorMessage);
  };

  const handleSignUp = (): void => {
    navigate('/signup');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && isLoginActive) {
      handleActionClick();
    }
  };

  return (
    <div className="w-full max-w-[600px] min-h-screen mx-auto flex flex-col bg-white">
      {/* 전체 컴테이너 - 화면 중앙 정렬 */}
      <div className="flex-1 flex flex-col justify-center px-5 py-8">
        {/* 타이틀 영역 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <span className="text-primary">U:NEAR</span>
            <span className="text-black"> 로그인</span>
          </motion.h1>
          <motion.p
            className="text-m text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            로그인하고 유니어의 서비스를 경험해보세요!
          </motion.p>
        </motion.div>

        {/* 오류 메시지 */}
        {errorMessage && (
          <div className="mb-6">
            <p className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {errorMessage}
            </p>
          </div>
        )}

        {/* 입력 필들 영역 */}
        <motion.div
          className="space-y-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        >
          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-primary bg-transparent font-regular text-m disabled:opacity-50 transition-colors"
            />
          </div>

          {/* 비밀번호 입력 + 눈 아이콘 */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none focus:border-primary pr-10 bg-transparent font-regular text-m disabled:opacity-50 transition-colors"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
              className="absolute right-0 top-[14px] disabled:opacity-50 hover:opacity-70 transition-opacity"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="#9CA3AF"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="#9CA3AF"
                  />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {/* 로그인 버튼 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        >
          <ActionButton
            text={isLoading ? '로그인 중...' : '로그인'}
            onClick={handleActionClick}
            isActive={isLoginActive}
            isLoading={isLoading}
          />
        </motion.div>

        {/* 회원가입 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
        >
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            회원가입
          </button>
        </motion.div>

        {/* 간편 로그인 텍스트 */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
        >
          <p className="text-sm font-light text-zinc-400">간편 로그인</p>
        </motion.div>

        {/* 소셜 로그인 버튼들 */}
        <motion.div
          className="flex justify-center gap-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        >
          <a href={NAVER_AUTH_URL} aria-label="네이버 로그인">
            <img
              src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Naver.png"
              className="w-12 h-12 object-cover rounded-full hover:scale-110 transition-transform"
              alt="네이버 로그인"
            />
          </a>
          <a href={KAKAO_AUTH_URL} aria-label="카카오 로그인">
            <img
              src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Kakao.png"
              className="w-12 h-12 object-cover rounded-full hover:scale-110 transition-transform"
              alt="카카오 로그인"
            />
          </a>
          <a href={GOOGLE_AUTH_URL} aria-label="구글 로그인">
            <img
              src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Google.png"
              className="w-12 h-12 object-cover rounded-full hover:scale-110 transition-transform"
              alt="구글 로그인"
            />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
