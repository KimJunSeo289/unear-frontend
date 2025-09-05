import { useState, useEffect } from 'react';
import { getUserCoupons } from '@/apis/getUserCoupons';
import { isExpiringSoon } from '@/utils/isExpiringSoon';
import type { UserCoupon } from '@/types/coupon';

interface CouponDataState {
  expiringSoonCoupons: UserCoupon[];
  allCoupons: UserCoupon[];
  totalCount: number;
}

const useCouponData = () => {
  const [couponData, setCouponData] = useState<CouponDataState>({
    expiringSoonCoupons: [],
    allCoupons: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCouponData = async () => {
      setIsLoading(true);

      try {
        const { coupons } = await getUserCoupons();

        // 곧 만료 예정 쿠폰 필터링
        const expiringSoonCoupons = coupons.filter(isExpiringSoon);

        const data: CouponDataState = {
          expiringSoonCoupons,
          allCoupons: coupons,
          totalCount: coupons.length,
        };

        setCouponData(data);
      } catch (error) {
        // 에러 발생 시 빈 데이터로 설정
        setCouponData({
          expiringSoonCoupons: [],
          allCoupons: [],
          totalCount: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponData();
  }, []);

  return { couponData, isLoading };
};

export default useCouponData;
