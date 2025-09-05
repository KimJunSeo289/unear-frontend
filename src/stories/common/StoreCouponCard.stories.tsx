import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreCouponCard from '@/components/common/StoreCouponCard';

const meta: Meta<typeof StoreCouponCard> = {
  title: 'Common/StoreCouponCard',
  component: StoreCouponCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StoreCouponCard>;

const sampleStore = {
  id: 'store1',
  name: '스타벅스 강남점',
  address: '서울 강남구 테헤란로 152', 
  distance: '0.2km',
  hours: '06:00 - 22:00',
  category: 'CAFE' as const,
  status: '영업중' as const,
  isBookmarked: false,
  latitude: 37.5665,
  longitude: 126.9780,
  coupons: [
    {
      id: 'coupon1',
      title: '아메리카노 10% 할인 쿠폰',
      expiryDate: '2025. 08. 16까지',
      downloaded: false,
      userCouponId: null,
      discountCode: 'COUPON_PERCENT' as const,
      membershipCode: 'GOLD',
      discountInfo: '10% 할인',
    },
    {
      id: 'coupon2', 
      title: '라떼 15% 할인 쿠폰',
      expiryDate: '2025. 08. 16까지',
      downloaded: false,
      userCouponId: null,
      discountCode: 'COUPON_PERCENT' as const,
      membershipCode: 'SILVER',
      discountInfo: '15% 할인',
    },
  ],
};

export const 기본: Story = {
  args: {
    store: sampleStore,
    onBookmarkToggle: (storeId: string) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}`),
  },
};

export const 즐겨찾기됨: Story = {
  args: {
    store: {
      ...sampleStore,
      isBookmarked: true,
    },
    onBookmarkToggle: (storeId: string) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}`),
  },
};
