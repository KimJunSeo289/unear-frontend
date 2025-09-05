import React, { useState } from 'react';

type PhoneButtonProps = {
  onClick?: () => void;
};

const PhoneButton: React.FC<PhoneButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`w-full h-[31.6px] p-0 m-0 bg-storecard border rounded flex items-center justify-center ${
        isHovered ? 'border-gray-500 bg-gray-100' : 'border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Phone Button"
    >
      {/* 전화 아이콘만 중앙에 고정 크기로 */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
      >
        <path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          className={`${isHovered ? 'fill-gray-300' : 'fill-gray-200'}`}
        />
      </svg>
    </button>
  );
};

export default PhoneButton;
