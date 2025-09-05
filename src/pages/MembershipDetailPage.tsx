import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import { getBenefitDetail } from '@/apis/getBenefitDetail';
import type { MembershipPolicy, BenefitDetailResponse } from '@/types/benefitDetail';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function MembershipDetailPage() {
  const { franchiseId: paramFranchiseId } = useParams<{ franchiseId: string }>();
  const location = useLocation();

  const franchiseId =
    location.state?.franchiseId ?? (paramFranchiseId ? Number(paramFranchiseId) : null);

  const [benefitData, setBenefitData] = useState<BenefitDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const formatBenefitContent = (policy: MembershipPolicy): string => {
    let discountText = '';

    if (policy.discountCode === 'COUPON_FIXED') {
      discountText += '쿠폰 할인: ';
    } else if (policy.discountCode === 'MEMBERSHIP_UNIT') {
      discountText += '멤버십 할인: ';
    }

    if (policy.unitBaseAmount) {
      discountText += `1000원당 ${policy.unitBaseAmount}원 할인`;
    } else if (policy.fixedDiscount) {
      discountText += `${policy.fixedDiscount.toLocaleString()}원 할인`;
    } else if (policy.discountPercent) {
      discountText += `${policy.discountPercent}% 할인`;
    }

    const parts: string[] = [];

    if (discountText) {
      parts.push(discountText);
    }

    if (policy.minPurchaseAmount) {
      parts.push(`최소 결제 금액: ${policy.minPurchaseAmount.toLocaleString()}원`);
    }

    if (policy.maxDiscountAmount) {
      parts.push(`최대 할인 가능 금액: ${policy.maxDiscountAmount.toLocaleString()}원`);
    }

    return parts.join('\n');
  };

  const convertToTableRows = (policies: MembershipPolicy[]) => {
    return policies.map((policy) => ({
      grade: policy.membershipCode,
      benefit: formatBenefitContent(policy),
    }));
  };

  useEffect(() => {
    if (!franchiseId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getBenefitDetail(franchiseId);
        setBenefitData(res);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [franchiseId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-[600px] bg-background mx-auto">
        <LoadingScreen message="혜택 정보를 불러오는 중..." />
      </div>
    );
  }

  if (isError || !benefitData) {
    return (
      <div className="w-full max-w-[600px] bg-background mx-auto">
        <Header title="혜택 상세" />
        <div className="text-center mt-10 text-m text-red-500 px-5">
          데이터를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const hasPolicies =
    Array.isArray(benefitData.membershipPolicies) && benefitData.membershipPolicies.length > 0;

  const tableRows = hasPolicies ? convertToTableRows(benefitData.membershipPolicies) : [];

  return (
    <div className="w-full max-w-[600px] bg-background mx-auto">
      <Header title="혜택 상세" />

      <div className="bg-white px-5 pt-6">
        {/* 프랜차이즈 로고 */}
        <div className="flex justify-center mb-4">
          <div className="relative w-[64px] h-[64px] flex items-center justify-center">
            {/* SVG 배경 원형 + 테두리 */}
            <svg
              width={64}
              height={64}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-0 top-0"
              preserveAspectRatio="none"
            >
              <circle
                cx="32"
                cy="32"
                r="31.5"
                className="fill-white stroke-gray-300"
                strokeWidth="0.5"
              />
            </svg>

            {/* 실제 이미지 */}
            <img
              src={`https://unear-uploads.s3.ap-southeast-2.amazonaws.com/${benefitData.imageUrl}`}
              alt={benefitData.franchiseName}
              className="w-[37px] h-[37px] object-contain relative z-10 mx-auto"
            />
          </div>
        </div>

        {/* 프랜차이즈명 */}
        <h2 className="text-center text-lg font-semibold text-black mb-4">
          {benefitData.franchiseName}
        </h2>

        {/* 혜택 안내 */}
        {hasPolicies && (
          <div className="mb-8">
            <h3 className="text-lm font-bold text-black mb-4">혜택 안내</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[3fr_7fr] bg-gray-100">
                <div className="py-3 px-4 text-center font-semibold text-sm text-black border-r border-gray-300">
                  등급
                </div>
                <div className="py-3 px-4 text-center text-sm font-semibold text-black">혜택</div>
              </div>
              {tableRows.map((row, index) => (
                <div key={index} className="grid grid-cols-[3fr_7fr] border-t border-gray-300">
                  <div className="py-3 px-4 text-center text-black text-sm border-r border-gray-300 flex items-center justify-center">
                    <span className="text-sm">{row.grade === 'BASIC' ? '우수' : row.grade}</span>
                  </div>
                  <div className="py-3 px-4 text-left text-black text-sm leading-relaxed">
                    {row.benefit.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx !== row.benefit.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이용 방법 및 유의사항 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-lm text-black mb-3">이용 방법 및 유의사항</h3>

          {/* 사용 방법 */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-semibold text-black">사용 방법</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• 멤버십 할인 적용시 바코드를 포스기로 찍고 결제해 주세요</li>
              <li>• 쿠폰 사용의 경우 바코드 제시와 쿠폰 바코드 제시까지 같이 해주세요</li>
            </ul>
          </div>

          {/* 주의사항 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="font-semibold text-black">주의사항</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 pb-3">
              <li>• 최소 결제 금액을 못채울 경우 할인이 적용되지 않습니다</li>
              <li>• 멤버십, 쿠폰 간 중복 할인이 불가능합니다</li>
              <li>• 다른 할인 혜택과 중복 사용할 수 없습니다</li>
              <li>• 일부 상품은 할인 대상에서 제외될 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
