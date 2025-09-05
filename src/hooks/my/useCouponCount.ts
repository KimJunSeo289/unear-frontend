import { useState, useEffect } from 'react';
import { getUserCoupons } from '@/apis/getUserCoupons';

const useCouponCount = () => {
  const [couponCount, setCouponCount] = useState(0);

  useEffect(() => {
    const fetchCouponCount = async () => {
      try {
        const { count } = await getUserCoupons();
        setCouponCount(count);
      } catch (error) {
        setCouponCount(0);
      }
    };

    fetchCouponCount();
  }, []);

  return couponCount;
};

export default useCouponCount;
