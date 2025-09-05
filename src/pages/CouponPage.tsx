import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import CouponModal from '@/components/common/CouponModal';
import { CouponList } from '@/components/my/coupon';
import useCouponData from '@/hooks/my/coupon/useCouponData';
import useCouponHandlers from '@/hooks/my/coupon/useCouponHandlers';

const CouponPage = () => {
  const { couponData, isLoading } = useCouponData();
  const { onBack, onCouponClick, selectedCoupon, selectedBrand, isModalOpen, handleCloseModal } =
    useCouponHandlers();

  if (isLoading) {
    return (
      <>
        <Header title="쿠폰" onBack={onBack} />
        <div className="bg-background">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm font-regular text-gray-600">쿠폰 정보를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  const hasAnyCoupons = couponData.totalCount > 0;

  return (
    <>
      <Header title="쿠폰" onBack={onBack} />

      <div className="bg-background min-h-[calc(100vh-105px)]">
        {!hasAnyCoupons ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-105px)]">
            <EmptyState message="보유한 쿠폰이 없습니다" />
          </div>
        ) : (
          <div className="px-5 py-4">
            {/* 곧 만료 예정 쿠폰 */}
            {couponData.expiringSoonCoupons.length > 0 && (
              <CouponList
                coupons={couponData.expiringSoonCoupons}
                title="곧 만료 예정"
                icon="clock"
                onCouponClick={onCouponClick}
              />
            )}

            {/* 전체 쿠폰 */}
            <CouponList
              coupons={couponData.allCoupons}
              title="전체 쿠폰"
              icon="coupon"
              onCouponClick={onCouponClick}
            />
          </div>
        )}
      </div>

      {/* 쿠폰 상세 모달 */}
      {selectedCoupon && isModalOpen && (
        <CouponModal
          brand={selectedBrand}
          title={selectedCoupon.couponName}
          discountRate={
            selectedCoupon.discountCode === 'COUPON_PERCENT'
              ? `${selectedCoupon.discountPercent}%`
              : selectedCoupon.fixedDiscount
                ? `${selectedCoupon.fixedDiscount.toLocaleString()}원`
                : null
          }
          expireDate={selectedCoupon.couponEnd}
          barcodeValue={selectedCoupon.barcodeNumber}
          usageCondition={
            selectedCoupon.discountCode === 'COUPON_FIXED'
              ? selectedCoupon.minPurchaseAmount
                ? `최소 ${selectedCoupon.minPurchaseAmount.toLocaleString()}원 이상 구매 시`
                : '최소 구매 금액 제한 없음'
              : selectedCoupon.maxDiscountAmount
                ? `최대 ${selectedCoupon.maxDiscountAmount.toLocaleString()}원 할인`
                : '최대 할인 금액 제한 없음'
          }
          usageGuide={[
            '매장에서 결제 전 바코드 제시',
            '직원에게 쿠폰 사용 의사 전달',
            '할인 적용 후 결제',
          ]}
          caution={[
            '다른 할인 쿠폰과 중복 사용 불가',
            '사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ]}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CouponPage;
