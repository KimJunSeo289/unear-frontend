import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/common/backIcon.svg?react';

interface HeaderProps {
  title: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  onBack?: () => void;
}

const Header = ({
  title,
  bgColor = 'bg-white',
  textColor = 'text-black',
  iconColor = 'fill-black',
  onBack,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // 뒤로가기
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 w-full max-w-[600px] h-[40px] mx-auto z-50 ${bgColor}`}
    >
      <div
        className="w-full max-w-[600px] mx-auto px-4 h-full flex items-center"
        style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)' }}
      >
        <button
          onClick={handleBack}
          className={`mr-2 ${iconColor}`}
          aria-label="뒤로가기"
          type="button"
        >
          <BackIcon />
        </button>
        <h1 className={`${textColor} font-semibold text-lm leading-[40px] mt-1`}>{title}</h1>
      </div>
    </header>
  );
};

export default Header;
