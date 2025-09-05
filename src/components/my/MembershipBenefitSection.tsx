import GrowUpIcon from '@/assets/my/growup.svg?react';
import BookmarkButton from '@/components/common/BookmarkButton';
import CouponButton from '@/components/common/CouponButton';
import type { MembershipBenefit } from '@/types/myPage';

interface MembershipBenefitSectionProps extends MembershipBenefit {
  onCouponClick?: () => void;
  onBookmarkClick?: () => void;
}

const MembershipBenefitSection = ({
  currentMonthSavings,
  couponCount,
  onCouponClick,
  onBookmarkClick,
}: MembershipBenefitSectionProps) => {
  const handleCouponClick = () => {
    if (onCouponClick) {
      onCouponClick();
    }
  };

  const handleBookmarkClick = () => {
    if (onBookmarkClick) {
      onBookmarkClick();
    }
  };

  // 절약 금액이 0원인지 확인
  const isZeroSavings = currentMonthSavings === '0원';

  return (
    <div className="w-full bg-white">
      {/* 멤버십 혜택 영역 */}
      <div className="mx-5 bg-gray-100 rounded-xl">
        <div className="px-5 py-4">
          {isZeroSavings ? (
            // 0원일 때: 아이콘과 "멤버십 혜택으로" 텍스트 숨김
            <div>
              <span className="text-lm font-semibold text-gray-600">아직 절약 내역이 없어요</span>
            </div>
          ) : (
            // 0원이 아닐 때: 기존 스타일 유지
            <>
              {/* 멤버십 혜택 헤더 */}
              <div className="flex items-center gap-2 mb-1">
                <GrowUpIcon className="w-6 h-6" />
                <span className="text-m font-regular text-gray-700">멤버십혜택으로</span>
              </div>

              {/* 절약 내역 */}
              <div>
                <span className="text-lm font-semibold text-black">이번달 </span>
                <span className="text-lg font-semibold text-primary">{currentMonthSavings}</span>
                <span className="text-lm font-semibold text-black">을 절약했어요!</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 쿠폰/즐겨찾기 버튼 영역 */}
      <div className="px-5 py-4">
        <div className="flex gap-5">
          {/* 쿠폰 버튼 */}
          <div className="flex-1">
            <CouponButton label={`쿠폰 ${couponCount}개`} onClick={handleCouponClick} />
          </div>

          {/* 즐겨찾기 버튼 */}
          <div className="flex-1">
            <BookmarkButton label="즐겨찾기" onClick={handleBookmarkClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipBenefitSection;
