import type React from 'react';
import { useState } from 'react';
import LocationButton from './LocationButton';
import CallButton from './CallButton';
import CopyIcon from '@/assets/my/copy.svg?react';
import type { BookmarkStore } from '@/types/bookmark';
import { getOperatingStatus } from '@/utils/operatingHours';
import { showErrorToast } from '@/utils/toast';

interface StorePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: BookmarkStore;
}

const StorePhoneModal: React.FC<StorePhoneModalProps> = ({ isOpen, onClose, store }) => {
  const [isCopied, setIsCopied] = useState(false);
  const phoneNumber = store.phoneNumber || '전화번호 없음';

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyPhoneNumber = async () => {
    if (phoneNumber === '전화번호 없음') {
      return; // 전화번호가 없으면 복사 불가
    }
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showErrorToast('전화번호 복사 실패:');
    }
  };

  const handlePhoneCall = () => {
    if (phoneNumber === '전화번호 없음') {
      return; // 전화번호가 없으면 전화 걸기 불가
    }
    window.location.href = `tel:${phoneNumber}`;
  };
  const handleLocationView = () => {};
  // 실시간 영업 상태 계산
  const operatingStatus = getOperatingStatus(store.hours);

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* 배경: 서비스 영역 내에서만 어둡게 처리 */}
      <div className="w-full max-w-[600px] mx-auto flex flex-col items-center h-screen relative">
        <div
          className="absolute inset-0 bottom-[65px] bg-black bg-opacity-50 px-5 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* 모달 박스 */}
          <div
            className="relative z-10 bg-white w-full max-h-[80vh] rounded-[16px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 영역 */}
            <div className="px-6 pt-[24px] pb-5 relative">
              {/* 닫기 버튼 */}
              <button className="absolute top-4 right-4" onClick={onClose} aria-label="모달 닫기">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#333]"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* 매장명 */}
              <div className="mb-3">
                <h2 className="text-lm font-semibold text-black leading-tight pr-10">
                  {store.name}
                </h2>
              </div>

              {/* 주소 */}
              <div className="mb-4">
                <p className="text-sm font-light text-gray-500">{store.address}</p>
              </div>

              {/* 매장 전화번호 정보 박스 */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
                <p className="text-lm font-bold text-gray-600 mb-2">매장 전화번호</p>
                <p className="text-xl font-semibold text-black mb-3">{phoneNumber}</p>
                <p className={`text-sm font-regular ${operatingStatus.statusColor}`}>
                  {operatingStatus.statusText} ({store.hours})
                </p>
              </div>

              {/* 안내 텍스트 */}
              <div className="mb-4">
                <p className="text-sm font-regular text-gray-400">
                  매장에 직접 전화를 걸거나 번호를 복사할 수 있어요
                </p>
              </div>

              {/* 전화번호 복사 박스 */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-black">{phoneNumber}</span>
                  {phoneNumber !== '전화번호 없음' && (
                    <button
                      onClick={handleCopyPhoneNumber}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      aria-label="전화번호 복사"
                    >
                      <CopyIcon width={18} height={18} className="stroke-current fill-none" />
                    </button>
                  )}
                </div>
                {isCopied && phoneNumber !== '전화번호 없음' && (
                  <p className="text-xs text-green-500 mt-1 text-center">
                    전화번호가 복사되었습니다!
                  </p>
                )}
              </div>

              {/* 하단 버튼들 */}
              <div className="flex gap-5">
                <div className="flex-1">
                  <LocationButton onClick={handleLocationView} width="w-full" />
                </div>
                <div className="flex-1">
                  <CallButton onClick={handlePhoneCall} width="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePhoneModal;

/*
- 사용법
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  <StorePhoneModal
    isOpen={isPhoneModalOpen}
    onClose={() => setIsPhoneModalOpen(false)}
    store={bookmarkStore} // phoneNumber는 store에서 가져옴
  />
*/
