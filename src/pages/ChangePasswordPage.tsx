import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { changePassword } from '@/apis/changePassword';
import { AxiosError } from 'axios';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// API 에러 응답 타입 정의
interface ApiErrorResponse {
  response?: {
    data?: {
      codeName?: string;
      message?: string;
    };
  };
}

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [samePasswordError, setSamePasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return '비밀번호는 8자리 이상이어야 합니다.';
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return '영문, 숫자, 특수문자를 모두 포함해야 합니다.';
    }

    return '';
  };

  // 모든 필드가 입력되고 비밀번호가 일치하며 유효할 때만 버튼 활성화
  const isFormValid =
    form.currentPassword.trim() !== '' &&
    form.newPassword.trim() !== '' &&
    form.confirmNewPassword.trim() !== '' &&
    !passwordMismatch &&
    !newPasswordError &&
    !samePasswordError;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [field]: value };

      // 새 비밀번호 유효성 검사
      if (field === 'newPassword') {
        const errorMessage = validatePassword(value);
        setNewPasswordError(errorMessage);

        // 현재 비밀번호와 새 비밀번호 비교
        if (value && newForm.currentPassword && value === newForm.currentPassword) {
          setSamePasswordError(true);
        } else {
          setSamePasswordError(false);
        }
      }

      // 현재 비밀번호 변경 시에도 비교
      if (field === 'currentPassword') {
        if (value && newForm.newPassword && value === newForm.newPassword) {
          setSamePasswordError(true);
        } else {
          setSamePasswordError(false);
        }
      }

      // 새 비밀번호와 확인 비밀번호 일치 검사
      if (field === 'newPassword' || field === 'confirmNewPassword') {
        if (newForm.newPassword && newForm.confirmNewPassword) {
          setPasswordMismatch(newForm.newPassword !== newForm.confirmNewPassword);
        } else {
          setPasswordMismatch(false);
        }
      }

      // 현재 비밀번호 에러 초기화
      if (field === 'currentPassword') {
        setCurrentPasswordError(false);
      }

      return newForm;
    });
  };

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword((prev) => !prev);
        break;
      case 'new':
        setShowNewPassword((prev) => !prev);
        break;
      case 'confirm':
        setShowConfirmNewPassword((prev) => !prev);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setCurrentPasswordError(false);

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      showSuccessToast('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/my');
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseData = error.response?.data;
        const codeName = responseData?.codeName;
        const message = responseData?.message;

        if (codeName === 'INVALID_PASSWORD') {
          setCurrentPasswordError(true);
        } else {
          showErrorToast(message || '비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        const errorResponse = error as ApiErrorResponse;
        if (errorResponse.response?.data) {
          if (errorResponse.response.data.codeName === 'INVALID_PASSWORD') {
            setCurrentPasswordError(true);
          } else {
            showErrorToast(errorResponse.response.data.message || '비밀번호 변경에 실패했습니다.');
          }
        } else {
          showErrorToast('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header title="비밀번호 변경" onBack={handleBack} />
      <div>
        <div className="bg-white px-5 flex flex-col gap-6 py-6">
          {/* 현재 비밀번호 */}
          <div>
            <label className="text-lm font-bold text-black">현재 비밀번호</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="현재 비밀번호 입력"
                value={form.currentPassword}
                onChange={handleChange('currentPassword')}
                onKeyDown={handleKeyDown}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-0 top-1"
                aria-label={showCurrentPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showCurrentPassword ? (
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
            {currentPasswordError && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 정확하지 않습니다.</p>
            )}
          </div>

          {/* 새로운 비밀번호 */}
          <div>
            <label className="text-lm font-bold text-black">새로운 비밀번호</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="8자리 이상, 영문/숫자/특수문자 조합"
                value={form.newPassword}
                onChange={handleChange('newPassword')}
                onKeyDown={handleKeyDown}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-0 top-1"
                aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showNewPassword ? (
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
            {newPasswordError && <p className="text-xs text-red-500 mt-1">{newPasswordError}</p>}
            {samePasswordError && (
              <p className="text-xs text-red-500 mt-1">똑같은 비밀번호는 사용이 불가능합니다.</p>
            )}
          </div>

          {/* 새로운 비밀번호 확인 */}
          <div>
            <label className="text-lm font-bold text-black">새로운 비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                placeholder="새로운 비밀번호 확인"
                value={form.confirmNewPassword}
                onChange={handleChange('confirmNewPassword')}
                onKeyDown={handleKeyDown}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-0 top-1"
                aria-label={showConfirmNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showConfirmNewPassword ? (
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
              <p className="text-xs text-red-500 mt-1">새로운 비밀번호와 일치하지 않습니다.</p>
            )}

            {/* 비밀번호 변경 버튼 */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                className={`w-[560px] h-[50px] rounded-xl font-semibold text-white transition-colors ${
                  isFormValid && !isLoading
                    ? 'bg-[#e6007e] hover:bg-[#d1006b]'
                    : 'bg-zinc-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? '처리중...' : '비밀번호 변경'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
