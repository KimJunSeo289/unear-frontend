import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';

import CouponIcon from '@/assets/common/couponIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';

type Coupon = {
  id: number;
  title: string;
  isDownloaded: boolean;
  isSoldOut: boolean;
};

const TodayCouponSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isExpanded] = useState(true);
  const navigate = useNavigate();

  const checkCouponStatus = async (couponTemplateId: number) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('temp_access_token');
      const couponTitle = '(필수 매장) 20% 할인 쿠폰 (100명 한정)';

      // 비로그인 시 쿠폰 상태를 다운로드되지 않음으로 간주
      if (!token) {
        setCoupons([
          {
            id: couponTemplateId,
            title: couponTitle,
            isDownloaded: false,
            isSoldOut: false,
          },
        ]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://dev.unear.site/api/app/coupons/${couponTemplateId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setCoupons([
          {
            id: couponTemplateId,
            title: couponTitle,
            // 서버 응답만으로 다운로드 및 매진 상태 결정
            isDownloaded: result.data?.isDownloaded || false,
            isSoldOut: result.data?.isSoldOut || false,
          },
        ]);
      } else {
        throw new Error(result.message || '쿠폰 상태 확인에 실패했습니다.');
      }
    } catch (error) {
      setCoupons([
        {
          id: 326,
          title: '(필수 매장) 20% 할인 쿠폰 (100명 한정)',
          isDownloaded: false,
          isSoldOut: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const couponId = 326;
    checkCouponStatus(couponId);
  }, []);

  const handleCouponDownload = async (couponId: number) => {
    // 현재 쿠폰 상태 확인
    const currentCoupon = coupons.find((c) => c.id === couponId);

    // 이미 다운로드된 쿠폰이면 함수 즉시 종료
    if (currentCoupon?.isDownloaded) {
      setMessage('이미 다운로드한 쿠폰입니다.');
      return;
    }

    // 매진된 쿠폰이면 함수 즉시 종료
    if (currentCoupon?.isSoldOut) {
      setMessage('매진된 쿠폰입니다.');
      return;
    }

    // 현재 다운로드 진행 중이면 함수 즉시 종료
    if (downloadingCoupons.has(couponId)) {
      return;
    }

    setDownloadingCoupons((prev) => new Set(prev).add(couponId));
    setMessage('');

    try {
      const token = sessionStorage.getItem('temp_access_token');
      if (!token) {
        setMessage('쿠폰을 받으려면 로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://dev.unear.site/api/app/coupons/${couponId}/fcfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || '쿠폰이 성공적으로 다운로드되었습니다.');
        // 다운로드 성공 시 상태 업데이트
        setCoupons((prevCoupons) =>
          prevCoupons.map((c) => (c.id === couponId ? { ...c, isDownloaded: true } : c))
        );
      } else {
        // 서버에서 이미 다운로드되었다고 응답하는 경우 처리
        if (result.message?.includes('이미') || result.message?.includes('already')) {
          setMessage('이미 다운로드한 쿠폰입니다.');
          setCoupons((prevCoupons) =>
            prevCoupons.map((c) => (c.id === couponId ? { ...c, isDownloaded: true } : c))
          );
        } else if (result.message === '매진되었습니다.' || result.message?.includes('sold out')) {
          setMessage('매진된 쿠폰입니다.');
          setCoupons((prevCoupons) =>
            prevCoupons.map((c) => (c.id === couponId ? { ...c, isSoldOut: true } : c))
          );
        } else {
          setMessage(result.message || `에러: ${response.statusText}`);
        }
      }
    } catch (error) {
      setMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[153px] flex justify-center items-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-5 bg-white">
      <div className="mb-3">
        <p className="text-lm font-bold text-black">오늘의 선착순 쿠폰! (12시 초기화)</p>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center"></div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative bg-white border border-gray-200 rounded-[5px] p-3 w-full h-[65px] flex items-center"
            >
              <div className="flex-shrink-0">
                <CouponIcon />
              </div>
              <div className="ml-4 flex-grow">
                <h4 className="font-bold text-base text-black">{coupon.title}</h4>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
                {coupon.isSoldOut ? (
                  <p className="text-gray-500 font-bold text-sm">마감</p>
                ) : coupon.isDownloaded ? (
                  <div className="flex items-center justify-center cursor-not-allowed">
                    <CheckCircle2 className="w-6 h-6 text-pink-500" />
                  </div>
                ) : (
                  <button
                    onClick={() => handleCouponDownload(coupon.id)}
                    disabled={
                      downloadingCoupons.has(coupon.id) || coupon.isDownloaded || coupon.isSoldOut
                    }
                    className={`w-full h-full flex items-center justify-center ${
                      downloadingCoupons.has(coupon.id) || coupon.isDownloaded || coupon.isSoldOut
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-gray-50 rounded-full'
                    }`}
                  >
                    {downloadingCoupons.has(coupon.id) ? (
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                    ) : (
                      <DownloadIcon className="w-5 h-5 text-black" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-sm text-center ${
            message.includes('성공') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default TodayCouponSection;
