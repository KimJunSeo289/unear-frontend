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
  name: '스타벅스 강남점',
  address: '서울 강남구 테헤란로 152',
  distance: '0.2km',
  hours: '06:00 - 22:00',
  category: 'CAFE',
  storeClass: 'FRANCHISE',
  event: 'NONE',
  isBookmarked: false,
  phoneNumber: '1544-1122',
};

export const 기본: Story = {
  args: {
    store: sampleStore,
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}: ${isBookmarked}`),
  },
};

export const 다크모드: Story = {
  args: {
    store: sampleStore,
    isDarkMode: true,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 다크모드 - ${storeId}: ${isBookmarked}`),
  },
};

export const 즐겨찾기됨: Story = {
  args: {
    store: {
      ...sampleStore,
      isBookmarked: true,
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}: ${isBookmarked}`),
  },
};

export const 소상공인매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '동네 카페',
      storeClass: 'LOCAL',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 소상공인 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 이벤트매장_일반: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'GENERAL',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 일반 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 이벤트매장_필수: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'REQUIRE',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 필수 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 다크모드_이벤트매장: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'GENERAL',
      isBookmarked: true,
    },
    isDarkMode: true,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 다크모드 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};

// 전화번호 없는 매장 테스트
export const 전화번호없음: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '동네 마트',
      phoneNumber: undefined, // 전화번호 없음
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 전화번호 없는 매장 - ${storeId}: ${isBookmarked}`),
  },
};

// 실시간 영업시간 테스트 스토리들
export const 이십사시간매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: 'GS25 테헤란점',
      hours: '24시간',
      category: 'LIFE',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 24시간 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 심야매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '맥도날드 역삼점',
      hours: '22:00 - 02:00', // 자정 넘어가는 시간
      category: 'FOOD',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 심야 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 현재시간테스트: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '현재시간 테스트 매장',
      hours: '08:00 - 20:00',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 현재시간 테스트 - ${storeId}: ${isBookmarked}`),
  },
};

// 다른 카테고리 테스트
export const 뷰티매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '올리브영 강남점',
      category: 'BEAUTY',
      hours: '10:00 - 22:00',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 뷰티 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 문화매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: 'CGV 강남점',
      category: 'CULTURE',
      hours: '10:00 - 24:00',
      event: 'REQUIRE',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 문화 매장 - ${storeId}: ${isBookmarked}`),
  },
};
