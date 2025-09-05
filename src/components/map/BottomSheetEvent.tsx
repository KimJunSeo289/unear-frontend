import BottomSheet from '@/components/common/BottomSheet';
import CoffeeIcon from '@/assets/map/IconExampleCoffee.svg?react';
import BigCloud from '@/assets/map/bigCloud.svg?react';
import SmallCloud from '@/assets/map/smallCloud.svg?react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomSheetEventProps {
  isOpen: boolean;
  onClose: () => void;
  onMoveToJuniorLocation?: () => void;
}

const BottomSheetEvent = ({ isOpen, onClose, onMoveToJuniorLocation }: BottomSheetEventProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} disablePadding={true}>
      <div className="relative w-full h-[531px] bg-white rounded-t-[20px] overflow-hidden">
        {/* 구름 */}
        <motion.div
          className="absolute left-[7.63%] top-[6.97%] w-[127px] h-[72px]"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
            rotate: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            x: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <BigCloud className="w-full h-full" />
        </motion.div>

        <motion.div
          className="absolute left-[70.99%] top-[26.93%] w-[82px] h-[46px]"
          animate={{
            y: [0, 8, 0],
            x: [0, -3, 0],
            rotate: [0, -0.5, 0, 0.5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            x: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <SmallCloud className="w-full h-full" />
        </motion.div>

        {/* 메인 타이틀 */}
        <h1 className="absolute left-1/2 -translate-x-1/2 top-[40px] font-bold text-[40px] leading-[54px] text-[#333333] text-center w-[148px] z-10">
          동네탐험
        </h1>
        <h2 className="absolute left-1/2 -translate-x-1/2 top-[86px] font-bold text-[48px] leading-[64px] text-primary text-center w-[133px] z-10">
          성수편
        </h2>

        {/* 서브 타이틀 */}
        <p className="absolute left-1/2 -translate-x-1/2 top-[159px] font-semibold text-[18px] leading-[18px] text-[#333333] text-center w-[210px] z-10">
          혜택을 통해 성수에서 즐기는
        </p>
        <p className="absolute left-1/2 -translate-x-1/2 top-[183px] font-semibold text-[24px] leading-[32px] text-[#333333] text-center w-[143px] z-10">
          특별한 이번주!
        </p>

        {/* 이번주니어 설명 */}
        <p className="absolute left-1/2 -translate-x-1/2 top-[232px] font-semibold text-[16px] leading-[21px] text-[#333333] text-center w-[342px] z-10">
          LG 유플러스 멤버십 고객이라면
          <br />
          성수동 인기 제휴처에서 카페, 식사, 팝업 행사 할인 등<br />
          다양한 혜택 받고 스탬프도 찍어보세요!
        </p>

        {/* 원 모양 배경 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[322px] w-[500px] h-[500px] bg-[#E4E4E7] rounded-full z-0" />

        {/* 아이콘들과 제목들 - 반응형 중앙 정렬 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[369px] z-10">
          <div className="flex justify-center items-start gap-[25px]">
            {/* 프랜차이즈 매장 */}
            <div className="flex flex-col items-center">
              <div className="w-[34px] h-[34px] rounded-full bg-[#FF860D] flex items-center justify-center mb-[11px]">
                <CoffeeIcon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-[12px] leading-[16px] text-[#333333] text-center w-[56px]">
                프랜차이즈
                <br />
                매장
              </p>
            </div>

            {/* 소상공인 매장 */}
            <div className="flex flex-col items-center">
              <div className="w-[34px] h-[34px] rounded-full bg-[#3B82F6] flex items-center justify-center mb-[11px]">
                <CoffeeIcon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-[12px] leading-[16px] text-[#333333] text-center w-[45px]">
                소상공인
                <br />
                매장
              </p>
            </div>

            {/* 이번주니어 매장 */}
            <div className="flex flex-col items-center">
              <div className="w-[34px] h-[34px] rounded-full bg-primary flex items-center justify-center mb-[11px]">
                <CoffeeIcon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-[12px] leading-[16px] text-[#333333] text-center w-[56px]">
                이번주니어
                <br />
                매장
              </p>
            </div>

            {/* 이번주니어 필수매장 */}
            <div className="flex flex-col items-center">
              <div className="w-[35px] h-[35px] rounded-full bg-[#F472B6] flex items-center justify-center mb-[11px]">
                <CoffeeIcon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-[12px] leading-[16px] text-[#333333] text-center w-[56px]">
                이번주니어
                <br />
                필수매장
              </p>
            </div>
          </div>
        </div>

        {/* 이번주니어 이동 링크 영역 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[486px] flex z-10">
          <Link
            to="/junior"
            className="font-semibold text-[16px] leading-[21px] text-[#333333] underline w-[165px] text-center"
          >
            이번주니어 매장 확인
          </Link>
          <button
            onClick={() => {
              onMoveToJuniorLocation?.();
              onClose();
            }}
            className="font-semibold text-[16px] leading-[21px] text-[#333333] underline w-[165px] text-center"
          >
            이번주니어 위치 확인
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default BottomSheetEvent;
