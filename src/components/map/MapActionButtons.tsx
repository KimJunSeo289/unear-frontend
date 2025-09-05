import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventIcon from '@/assets/map/eventIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponIcon.svg?react';
import BarcodeIcon from '@/assets/map/barcodeIcon.svg?react';
import MapUpArrowIcon from '@/assets/map/mapUpArrowIcon.svg?react';
import MapDownArrowIcon from '@/assets/map/mapDownArrowIcon.svg?react';

interface Props {
  onEventClick: () => void;
  onBarcodeClick: () => void;
  onCouponClick: () => void;
}

const MapActionButtons = ({ onEventClick, onBarcodeClick, onCouponClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // 이벤트 버튼 클릭 기록 확인
  useEffect(() => {
    const hasClickedEvent = localStorage.getItem('eventButtonClicked');
    if (!hasClickedEvent) {
      setShowTooltip(true);
    }
  }, []);

  const handleEventClick = () => {
    localStorage.setItem('eventButtonClicked', 'true');
    setShowTooltip(false);
    onEventClick();
  };

  return (
    <div className="absolute bottom-[24px] left-[10px] z-20 w-[45px] flex flex-col items-center">
      {/* 버튼 그룹 */}
      <div
        className={`flex flex-col gap-[10px] items-center transition-all duration-500 ease-in-out ${
          isExpanded
            ? 'translate-y-0 opacity-100 max-h-[300px]'
            : 'translate-y-10 opacity-0 max-h-0'
        }`}
      >
        {/* 이벤트 버튼 */}
        <div className="relative w-[45px] h-[45px]">
          {/* 말풍선 */}
          {showTooltip && (
            <motion.div
              className="absolute bottom-[55px] pointer-events-none"
              style={{
                zIndex: 9999,
                left: '0px',
                transform: 'translateX(-50%)',
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="relative bg-blue-500 border-2 border-blue-500 rounded-xl px-2 py-2 shadow-2xl"
                style={{
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'fit-content',
                  maxWidth: '150px',
                }}
              >
                <div
                  className="text-xs text-white font-semibold text-center"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    lineHeight: '1.3',
                    writingMode: 'horizontal-tb',
                    textOrientation: 'mixed',
                  }}
                >
                  이번주니어{'\n'}이벤트 정보를{'\n'}확인해보세요!
                </div>
                {/* 말풍선 꼬리 */}
                <div
                  className="absolute top-full w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-blue-500"
                  style={{
                    left: '21px',
                    transform: 'translateX(-50%)',
                    marginLeft: '0px',
                  }}
                ></div>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleEventClick}
            className="relative w-[45px] h-[45px] transition-transform duration-300"
          >
            <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
            <EventIcon className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[21px] h-[21px]" />
            <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
              이벤트
            </span>
          </button>
        </div>

        {/* 쿠폰 버튼 */}
        <button
          onClick={onCouponClick}
          className="relative w-[45px] h-[45px] transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
          <MapCouponIcon className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[22.5px] h-[22.5px]" />
          <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
            쿠폰
          </span>
        </button>

        {/* 바코드 버튼 */}
        <button
          onClick={onBarcodeClick}
          className="relative w-[45px] h-[45px] transition-transform"
        >
          <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
          <BarcodeIcon className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[25px] h-[25px]" />
          <span className="absolute bottom-[6px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
            바코드
          </span>
        </button>
      </div>

      {/* 화살표 토글 버튼 */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="relative w-[45px] h-[45px] mt-[10px] transition-transform"
      >
        <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
        {isExpanded ? (
          <MapDownArrowIcon className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25px] h-[33px]" />
        ) : (
          <MapUpArrowIcon className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25px] h-[33px]" />
        )}
      </button>
    </div>
  );
};

export default MapActionButtons;
