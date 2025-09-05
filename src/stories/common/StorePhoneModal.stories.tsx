import type { Meta, StoryObj } from '@storybook/react-vite';
import StorePhoneModal from '@/components/common/StorePhoneModal';
import type { BookmarkStore } from '@/types/bookmark';

const meta: Meta<typeof StorePhoneModal> = {
  title: 'Common/StorePhoneModal',
  component: StorePhoneModal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StorePhoneModal>;

const sampleStore: BookmarkStore = {
  id: 'store1',
  placeId: 1,
  name: '스타벅스 강남점',
  address: '서울 강남구 테헤란로 152',
  distance: '0.2km',
  hours: '06:00 - 22:00',
  category: 'CAFE',
  storeClass: 'FRANCHISE',
  event: 'NONE',
  isBookmarked: false,
  phoneNumber: '1544-1122',
  latitude: 37.5665,
  longitude: 126.9780,
};

export const 기본: Story = {
  args: {
    store: sampleStore,
    isOpen: true,
    onClose: () => console.log('[storybook] 모달 닫기'),
  },
};

export const 전화번호없음: Story = {
  args: {
    store: {
      ...sampleStore,
      phoneNumber: undefined,
    },
    isOpen: true,
    onClose: () => console.log('[storybook] 모달 닫기'),
  },
};
