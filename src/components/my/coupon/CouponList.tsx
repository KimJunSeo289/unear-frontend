import CouponCard from '@/components/common/CouponCard';
import CouponHeader from './CouponHeader';
import type { UserCoupon } from '@/types/coupon';

interface CouponListProps {
  coupons: UserCoupon[];
  title: string;
  icon?: 'clock' | 'coupon';
  onCouponClick: (coupon: UserCoupon) => void;
}

const CouponList = ({ coupons, title, icon = 'coupon', onCouponClick }: CouponListProps) => {
  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <CouponHeader title={title} count={coupons.length} icon={icon} />

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.userCouponId}
            brand={coupon.name}
            title={coupon.couponName}
            validUntil={coupon.couponEnd}
            category={coupon.categoryCode}
            storeClass={coupon.markerCode}
            onClick={() => onCouponClick(coupon)}
          />
        ))}
      </div>
    </div>
  );
};

export default CouponList;
