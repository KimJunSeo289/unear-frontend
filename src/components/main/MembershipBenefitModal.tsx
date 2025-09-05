import CommonModal from '@/components/common/CommonModal';
import TrophyIcon from '@/assets/main/trophy.svg?react';
import GiftboxIcon from '@/assets/main/giftbox.svg?react';
import CheckIcon from '@/assets/main/check.svg?react';
import WarningIcon from '@/assets/main/warning.svg?react';

interface MembershipBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MembershipBenefitModal = ({ isOpen, onClose }: MembershipBenefitModalProps) => {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="멤버십 혜택 안내">
      <div className="space-y-3">
        {/* 등급 기준 섹션 */}
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 fill-none stroke-primary" style={{ fill: 'none' }} />
          <h3 className="text-m pt-0.5 font-semibold text-black">등급 기준</h3>
        </div>

        {/* VVIP 등급 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-3">
          <h4 className="font-semibold text-black mb-2">VVIP</h4>
          <ul className="space-y-1 font-regular text-sm text-black">
            <li> - 월별 요금제 95,000원 이상</li>
            <li> - 또는 연간 납부액 200만원 이상</li>
          </ul>
        </div>

        {/* VIP 등급 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-black mb-2">VIP</h4>
          <ul className="space-y-1 font-regular text-sm text-black">
            <li>- 월별 요금제 74,800원 이상</li>
            <li>- 또는 연간 납부액 100만원 이상</li>
          </ul>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* 주요 혜택 섹션 */}
        <div className="flex items-center gap-2 mb-4">
          <GiftboxIcon className="w-5 h-5 text-primary" />
          <h3 className="text-m pt-0.5 font-semibold text-black">주요 혜택</h3>
        </div>

        {/* 혜택 목록 */}
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-black">나만의 콕(VIP콕) 월 1회 무료 이용</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-black">네이버 플러스 멤버십 1개월 무료</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-black">
                CGV 영화 무료예매 (연 3회) + 1+1 혜택 (연 9회)
              </span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-black">120개 이상 제휴사 기본 할인 혜택</span>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* 주의사항 섹션 */}
        <div className="flex items-center gap-2 mb-4">
          <WarningIcon className="w-5 h-5 text-red-500" />
          <h3 className="text-m pt-0.5 font-semibold text-black">주의사항</h3>
        </div>

        {/* 주의사항 목록 */}
        <div className="space-y-2">
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-sm text-black">
              <span className="font-regular">등급 산정:</span> 전전년도 11월 1일 ~ 전년도 10월 31일
              납부액 기준
            </span>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-sm text-black">
              <span className="font-regular">등급 변경:</span> 매년 1월 1일 자동 반영
            </span>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-sm text-black">
              <span className="font-regular">VIP콕 변경:</span> 분기별 1회만 가능
            </span>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="font-regular text-sm text-black">
              월 1회 혜택 이용 시 다른 VIP콕 혜택 이용 불가
            </span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default MembershipBenefitModal;
