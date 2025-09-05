import type { CalculatedMonthSummary } from '@/hooks/my/statistics';
import MoneyIcon from '@/assets/my/money.svg?react';
import DiscountIcon from '@/assets/my/discount.svg?react';

interface UsageDiscountSummaryProps {
  calculatedSummary: CalculatedMonthSummary;
  totalDiscountAmount: number;
  formatCurrency: (amount: number) => string;
  formatGrowth: (growth: number) => string;
}

const UsageDiscountSummary = ({
  calculatedSummary,
  totalDiscountAmount,
  formatCurrency,
  formatGrowth,
}: UsageDiscountSummaryProps) => {
  // 할인 금액이 0원인지 확인
  const isZeroDiscount = totalDiscountAmount === 0;
  const isZeroUsage = calculatedSummary.usageAmount === 0;

  return (
    <div className="bg-white mt-3">
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          {/* 사용금액 */}
          <div className="bg-gray-100 rounded-lg h-[150px] flex flex-col items-center justify-center px-4 py-6">
            <div
              className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center shadow-sm mb-2 flex-shrink-0"
              style={{ borderRadius: '50%', minWidth: '50px', minHeight: '50px' }}
            >
              <MoneyIcon className="w-6 h-6 ml-[1px]" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-s text-gray-500 text-center">사용금액</p>
              <p
                className={`text-lm font-semibold text-center ${
                  isZeroUsage ? 'text-gray-500' : 'text-black'
                }`}
              >
                {formatCurrency(calculatedSummary.usageAmount)}
              </p>
              <p className="text-s text-gray-500 text-center">
                {formatGrowth(calculatedSummary.usageGrowth)}
              </p>
            </div>
          </div>

          {/* 할인금액 */}
          <div className="bg-gray-100 rounded-lg h-[150px] flex flex-col items-center justify-center px-4 py-6">
            <div
              className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center shadow-sm mb-2 flex-shrink-0"
              style={{ borderRadius: '50%', minWidth: '50px', minHeight: '50px' }}
            >
              <DiscountIcon
                className="w-6 h-6"
                style={{
                  stroke: '#6B7280',
                  fill: 'none',
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-s text-gray-500 text-center">할인금액</p>
              <p
                className={`text-lm font-semibold text-center ${
                  isZeroDiscount ? 'text-gray-500' : 'text-black'
                }`}
              >
                {formatCurrency(totalDiscountAmount)}
              </p>
              <p className="text-s text-gray-500 text-center">
                {formatGrowth(calculatedSummary.discountGrowth)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageDiscountSummary;
