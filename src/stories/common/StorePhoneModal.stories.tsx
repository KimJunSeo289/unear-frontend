import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import StorePhoneModal from '@/components/common/StorePhoneModal';
import type { BookmarkStore } from '@/types/bookmark';

const meta: Meta<typeof StorePhoneModal> = {
  title: 'Common/StorePhoneModal',
  component: StorePhoneModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // 전체 화면 레이아웃
    viewport: {
      defaultViewport: 'mobile', // 커스텀 모바일 뷰포트
    },
    docs: {
      description: {
        component: `
          **StorePhoneModal** 컴포넌트는 매장의 전화번호 정보를 보여주는 모달입니다.
          매장의 이름, 주소, 전화번호, 영업시간 등을 표시하고,
          전화걸기와 전화번호 복사 기능을 제공합니다.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '393px', height: '852px', margin: '0 auto', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StorePhoneModal>;

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

// 스토리북에서 모달 상태를 관리하기 위한 래퍼 컴포넌트
interface ModalWrapperProps {
  store: BookmarkStore;
}

const ModalWrapper = ({ store }: ModalWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ height: '100%', backgroundColor: '#F6F7FB', position: 'relative' }}>
      {/* 배경 컨테츠 */}
      <div style={{ padding: '20px', height: '100%' }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>모달 테스트</h3>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          아래 버튼을 클릭하여 모달을 열어보세요.
        </p>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#E6007E',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {store.name} 전화번호 보기
        </button>

        <div style={{ marginTop: '16px', fontSize: '14px', color: '#999' }}>
          매장명: {store.name}
          <br />
          전화번호: {store.phoneNumber || '없음'}
          <br />
          주소: {store.address}
        </div>
      </div>

      {/* 모달 */}
      <StorePhoneModal store={store} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const 기본: Story = {
  render: () => <ModalWrapper store={sampleStore} />,
};

export const 전화번호없음: Story = {
  render: () => (
    <ModalWrapper
      store={{
        ...sampleStore,
        name: '동네 마트',
      }}
    />
  ),
};

export const 영업종료매장: Story = {
  render: () => (
    <ModalWrapper
      store={{
        ...sampleStore,
        name: '맥도날드 역삼점',
        hours: '06:00 - 24:00', // 현재 시간에 따라 영업종료일 수 있음
        phoneNumber: '02-1234-5678',
      }}
    />
  ),
};

export const 이벤트매장: Story = {
  render: () => (
    <ModalWrapper
      store={{
        ...sampleStore,
        name: '투레쥬르 강남점',
        event: 'GENERAL',
        category: 'BAKERY',
        phoneNumber: '070-1234-5678',
      }}
    />
  ),
};

export const 필수매장: Story = {
  render: () => (
    <ModalWrapper
      store={{
        ...sampleStore,
        name: 'CGV 강남점',
        event: 'REQUIRE',
        category: 'CULTURE',
        hours: '10:00 - 24:00',
        phoneNumber: '1588-1234',
      }}
    />
  ),
};

export const 소상공인매장: Story = {
  render: () => (
    <ModalWrapper
      store={{
        ...sampleStore,
        name: '동네 카페',
        storeClass: 'LOCAL',
        address: '서울 강남구 테헤란로 164',
        phoneNumber: '02-987-6543',
      }}
    />
  ),
};
