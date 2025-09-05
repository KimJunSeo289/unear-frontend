import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import { showErrorToast } from '@/utils/toast';
import type { UserCoupon, UserCouponDetail } from '@/types/coupon';

interface CouponPageHandlers {
  onBack: () => void;
  onCouponClick: (coupon: UserCoupon) => void;
}

const useCouponHandlers = (): CouponPageHandlers & {
  selectedCoupon: UserCouponDetail | null;
  selectedBrand: string;
  isModalOpen: boolean;
  isLoading: boolean;
  handleCloseModal: () => void;
} => {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onBack = () => {
    navigate(-1);
  };

  const onCouponClick = async (coupon: UserCoupon) => {
    setIsLoading(true);
    try {
      const detail = await getUserCouponDetail(coupon.userCouponId);
      if (detail) {
        setSelectedBrand(coupon.name);
        setSelectedCoupon(detail);
        setIsModalOpen(true);
      }
    } catch (error) {
      showErrorToast('쿠폰 상세 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
    setSelectedBrand('');
  };

  return {
    onBack,
    onCouponClick,
    selectedCoupon,
    selectedBrand,
    isModalOpen,
    isLoading,
    handleCloseModal,
  };
};

export default useCouponHandlers;
