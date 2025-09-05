interface AccountManagementSectionProps {
  onChangePassword?: () => void;
  provider?: string | null; // null 허용으로 변경
}

const AccountManagementSection = ({
  onChangePassword,
  provider,
}: AccountManagementSectionProps) => {
  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    }
  };

  // OAuth 로그인 사용자는 비밀번호가 없으므로 비밀번호 변경 옵션을 숨김
  const shouldShowPasswordChange = provider === 'EMAIL';

  // OAuth 사용자이거나 provider가 null/undefined인 경우 아무것도 렌더링하지 않음
  if (!shouldShowPasswordChange) {
    return null;
  }

  return (
    <div className="w-full mt-3 mb-3 px-5">
      <div className="flex justify-center items-center">
        <button
          type="button"
          onClick={handleChangePassword}
          className="text-m font-regular text-gray-500 underline decoration-gray-500 underline-offset-2"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default AccountManagementSection;
