import type { UsageHistoryStatsData } from '@/types/usageHistory';
import { formatPrice } from '@/utils/usageHistory';

interface UsageHistoryStatsProps {
  stats: UsageHistoryStatsData;
  className?: string;
}

const UsageHistoryStats = ({ stats, className = '' }: UsageHistoryStatsProps) => {
  return (
    <div className={`bg-white px-5 pt-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="text-lg font-semibold text-black">{formatPrice(stats.totalSavings)}</div>
        <div className="text-lg font-semibold text-black">{stats.totalTransactions}건</div>
      </div>
      <div className="flex justify-between items-center text-m text-gray-500 font-semibold">
        <span>총 절약 금액</span>
        <span>거래 건수</span>
      </div>
    </div>
  );
};

export default UsageHistoryStats;
