import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkCard from '@/components/common/BookmarkCard';
import type { BookmarkStore } from '@/types/bookmark';

const meta: Meta<typeof BookmarkCard> = {
  title: 'Common/BookmarkCard',
  component: BookmarkCard,
  tags: ['autodocs'],
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: '다크 모드 설정',
    },
  },
};

export default meta;

type Story = StoryObj<typeof BookmarkCard>;

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
    isDarkMode: false,
    onBookmarkToggle: (storeId: string) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}`),
  },
};

export const 다크모드: Story = {
  args: {
    store: sampleStore,
    isDarkMode: true,
    onBookmarkToggle: (storeId: string) =>
      console.log(`[storybook] 다크모드 - ${storeId}`),
  },
};

export const 즐겨찾기됨: Story = {
  args: {
    store: {
      ...sampleStore,
      isBookmarked: true,
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId: string) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}`),
  },
};
