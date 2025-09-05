import ClockIcon from '@/assets/map/mapCouponWatchIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponSheetIcon.svg?react';

interface CouponHeaderProps {
  title: string;
  count: number;
  icon?: 'clock' | 'coupon';
}

const CouponHeader = ({ title, count, icon = 'coupon' }: CouponHeaderProps) => {
  const IconComponent = icon === 'clock' ? ClockIcon : MapCouponIcon;

  return (
    <div className="flex items-center gap-x-2 mb-3">
      <IconComponent className={`shrink-0 ${icon === 'clock' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">{title}</span>
      <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px] mb-[2px]">
        <span className="text-s font-semibold text-pink-700 mt-[3px]">{count}개</span>
      </div>
    </div>
  );
};

export default CouponHeader;
