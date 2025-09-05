import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ToggleButton from '../components/common/ToggleButton';
import ConfirmButton from '../components/common/ConfirmButton';
import { authApi } from '../apis/auth';
import { showErrorToast, showSuccessToast } from '../utils/toast';

interface FormData {
  name: string;
  gender: string;
  birth: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API 에러 응답 타입
interface ApiErrorResponse {
  response?: {
    status?: number;
    data?:
      | string
      | {
          codeName?: string;
          message?: string;
          data?: {
            fieldErrors?: Record<string, string>;
          };
        };
  };
}

const SignUpPage = () => {
  const navigate = useNavigate();

  // 폼 데이터 상태
  const [form, setForm] = useState<FormData>({
    name: '',
    gender: '남자',
    birth: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 인증 관련 상태
  const [emailVerificationTimer, setEmailVerificationTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false);

  const timerIntervalRef = useRef<number | null>(null);

  // 회원가입 버튼 활성화 조건
  const isSignUpActive =
    form.name.trim() !== '' &&
    form.gender.trim() !== '' &&
    form.birth.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim() !== '' &&
    form.confirmPassword.trim() !== '' &&
    !passwordMismatch &&
    isEmailVerified;

  // 비밀번호 토글 함수들
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // 폼 입력 핸들러
  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [field]: value };

      // 비밀번호 일치 확인
      if (field === 'password' || field === 'confirmPassword') {
        if (newForm.password && newForm.confirmPassword) {
          setPasswordMismatch(newForm.password !== newForm.confirmPassword);
        } else {
          setPasswordMismatch(false);
        }
      }

      // 이메일 변경 시 인증 상태 초기화
      if (field === 'email') {
        setEmailExistsError(false);
        setIsEmailVerified(false);
        setShowEmailVerification(false);
        setVerificationCode('');
        setVerificationCodeError(false);
        // 타이머 정리
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setIsTimerRunning(false);
        setEmailVerificationTimer(0);
      }

      return newForm;
    });
  };

  // 인증번호 입력 핸들러
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setVerificationCodeError(false);
  };

  // 이메일 인증번호 요청
  const handleEmailVerificationRequest = async () => {
    if (!form.email.trim()) {
      showErrorToast('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.sendVerificationCode(form.email);

      setEmailExistsError(false);
      setShowEmailVerification(true);
      setEmailVerificationTimer(240); // 4분
      setIsTimerRunning(true);
      setIsEmailVerified(false);
      setVerificationCode('');
      setVerificationCodeError(false);

      showSuccessToast('인증번호가 전송되었습니다.');
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;

      // 상태 코드가 400이고 응답에 "이미 가입된 이메일"이 포함된 경우
      if (apiError.response?.status === 400) {
        const responseData = apiError.response.data;
        const errorMessage =
          typeof responseData === 'string' ? responseData : responseData?.message || '';

        if (errorMessage.includes('이미 가입된 이메일')) {
          setEmailExistsError(true);
          showErrorToast('이미 가입된 이메일입니다.');
        } else {
          showErrorToast(errorMessage || '인증번호 전송에 실패했습니다.');
        }
      } else {
        showErrorToast('인증번호 전송에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showErrorToast('인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.verifyCode(form.email, verificationCode);

      setVerificationCodeError(false);
      setIsTimerRunning(false);
      setIsEmailVerified(true);

      // 타이머 정리
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      showSuccessToast('이메일 인증이 완료되었습니다!');
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      setVerificationCodeError(true);
      showErrorToast(apiError.response?.data?.message || '인증번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머 관리
  useEffect(() => {
    if (isTimerRunning && emailVerificationTimer > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setEmailVerificationTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (emailVerificationTimer === 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsTimerRunning(false);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, emailVerificationTimer]);

  // 타이머 포맷팅
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds.toString().padStart(2, '0')}초`;
  };

  // 생년월일 포맷팅
  const formatBirthdate = (birthString: string) => {
    if (birthString.length === 8) {
      const year = birthString.substring(0, 4);
      const month = birthString.substring(4, 6);
      const day = birthString.substring(6, 8);
      return `${year}-${month}-${day}T00:00:00`;
    }
    return birthString;
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setPasswordMismatch(true);
      showErrorToast('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isEmailVerified) {
      showErrorToast('이메일 인증을 완료해주세요.');
      return;
    }

    setPasswordMismatch(false);
    setIsLoading(true);

    try {
      const signupData = {
        email: form.email,
        password: form.password,
        username: form.name,
        tel: form.phone,
        birthdate: formatBirthdate(form.birth),
        gender: form.gender === '남자' ? ('M' as const) : ('F' as const),
      };

      const result = await authApi.signup(signupData);

      if (result.resultCode === 200) {
        showSuccessToast(`회원가입이 완료되었습니다! 환영합니다, ${result.data.username}님!`);
        navigate('/login');
      } else {
        showErrorToast(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;

      if (
        apiError.response?.data?.codeName === 'INVALID_INPUT_VALUE' &&
        apiError.response.data?.data?.fieldErrors
      ) {
        const fieldErrors = apiError.response.data.data.fieldErrors;
        let errorMessage = '입력값을 확인해주세요:\n';
        Object.entries(fieldErrors).forEach(([, message]) => {
          errorMessage += `- ${message}\n`;
        });
        showErrorToast(errorMessage);
      } else if (apiError.response?.data?.codeName === 'DUPLICATED_EMAIL') {
        setEmailExistsError(true);
        showErrorToast('이미 가입된 이메일입니다.');
      } else {
        showErrorToast(apiError.response?.data?.message || '회원가입에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 페이지로 이동
  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Header title="회원가입" />
      <div className="mt-[25px]">
        <div className="px-5 flex flex-col gap-6">
          {/* 이름 */}
          <div>
            <label className="text-lm font-bold text-black">이름</label>
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none bg-transparent font-regular text-m"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="text-lm font-bold text-black">성별</label>
            <div className="flex gap-4 mt-2">
              {['남자', '여자'].map((g) => (
                <ToggleButton
                  key={g}
                  text={g}
                  isActive={form.gender === g}
                  onClick={() => {
                    setForm({ ...form, gender: form.gender === g ? '' : g });
                  }}
                />
              ))}
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="text-lm font-bold text-black">생년월일</label>
            <input
              type="text"
              placeholder="예: 19940508"
              value={form.birth}
              onChange={handleChange('birth')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-lm font-bold text-black">전화번호</label>
            <input
              type="text"
              placeholder="'-' 포함 입력 (예: 010-1234-5678)"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="text-lm font-bold text-black">이메일</label>
            <div className="flex justify-between items-center border-b border-zinc-300">
              <input
                type="email"
                placeholder="예: unear@google.com"
                value={form.email}
                onChange={handleChange('email')}
                className="flex-1 text-zinc-700 placeholder-zinc-400 focus:outline-none py-1 bg-transparent"
              />
              <ConfirmButton
                text={isTimerRunning ? '재전송' : '이메일인증'}
                onClick={handleEmailVerificationRequest}
                disabled={(isTimerRunning && emailVerificationTimer > 0) || isLoading}
              />
            </div>
            {emailExistsError && (
              <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>
            )}
            {isEmailVerified && (
              <p className="text-xs text-green-500 mt-1">이메일 인증이 완료되었습니다.</p>
            )}
          </div>

          {/* 이메일 인증번호 입력 */}
          {showEmailVerification && !isEmailVerified && (
            <div>
              <p className="text-lm font-bold text-black">이메일 인증번호</p>
              <div className="flex justify-between items-center border-b border-zinc-300">
                <input
                  type="text"
                  placeholder="인증번호 4자리 입력"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  className="flex-1 text-zinc-700 placeholder-zinc-400 focus:outline-none py-1 bg-transparent"
                />
                {isTimerRunning && emailVerificationTimer > 0 && (
                  <p className="text-xs font-semibold text-red-600 mr-2">
                    {formatTime(emailVerificationTimer)}
                  </p>
                )}
                <ConfirmButton
                  text="인증확인"
                  onClick={handleVerifyCode}
                  disabled={isLoading || !verificationCode.trim()}
                />
              </div>
              {verificationCodeError && (
                <p className="text-xs text-red-500 mt-1">인증번호가 틀렸습니다.</p>
              )}
            </div>
          )}

          {/* 비밀번호 */}
          <div>
            <label className="text-lm font-bold text-black">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="8자리 이상, 영문/숫자/특수문자 조합"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-0 top-1"
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
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-lm font-bold text-black">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-0 top-1"
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showConfirmPassword ? (
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
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="mt-6 px-5">
          <button
            onClick={handleSubmit}
            disabled={!isSignUpActive || isLoading}
            className={`w-full h-[50px] rounded-xl font-semibold text-white transition-colors ${
              isSignUpActive && !isLoading
                ? 'bg-primary hover:bg-[#d1006b]'
                : 'bg-zinc-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? '처리중...' : '회원가입'}
          </button>
        </div>

        {/* 로그인 안내 */}
        <div className="mt-4 text-center px-5">
          <p className="text-sm text-[#666]">이미 계정이 있으신가요?</p>
          <p
            className="text-sm font-semibold text-primary cursor-pointer"
            onClick={handleNavigateToLogin}
          >
            로그인
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
