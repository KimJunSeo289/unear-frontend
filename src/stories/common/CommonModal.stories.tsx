import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import CommonModal from '@/components/common/CommonModal';

const meta: Meta<typeof CommonModal> = {
  title: 'Common/CommonModal',
  component: CommonModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 공통 모달 컴포넌트입니다. ' +
          '다양한 컨텐츠를 담을 수 있는 범용적인 모달창으로, ' +
          '헤더와 컨텐츠 영역으로 구성되어 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: 'text',
      description: '모달 헤더 제목',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: '모달 컨텐츠 영역에 들어갈 내용',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 함수',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    isOpen: true,
    title: '기본 모달',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          모달 열기
        </button>
        <CommonModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-8">
            <p className="text-sm text-black">기본 모달 컨텐츠입니다.</p>
          </div>
        </CommonModal>
      </div>
    );
  },
};

// 빈 모달
export const Empty: Story = {
  args: {
    isOpen: true,
    title: '빈 모달',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          빈 모달 열기
        </button>
        <CommonModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {/* 컨텐츠 없음 */}
        </CommonModal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '컨텐츠가 없는 빈 모달입니다. 헤더만 표시됩니다.',
      },
    },
  },
};

// 이번주니어 안내 모달 (컨텐츠 없이)
export const WeeklyJuniorGuideModal: Story = {
  args: {
    isOpen: true,
    title: '이번주니어 안내',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          이번주니어 안내 모달 열기
        </button>
        <CommonModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-8">
            <p className="text-sm text-black">이번주니어 안내 컨텐츠가 들어갈 영역입니다.</p>
            <p className="text-xs text-gray-600 mt-4">
              실제 컨텐츠가 개발되면 이 영역에 표시됩니다.
            </p>
          </div>
        </CommonModal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '이번주니어 안내 컨텐츠를 담기 위한 모달입니다. ' +
          '실제 컨텐츠가 개발되면 이 모달에 표시됩니다.',
      },
    },
  },
};

// 커스텀 스타일 모달
export const CustomStyled: Story = {
  args: {
    isOpen: true,
    title: '커스텀 스타일 모달',
    className: 'shadow-2xl border-2 border-primary',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          커스텀 스타일 모달 열기
        </button>
        <CommonModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="text-center py-8">
            <p className="text-sm text-black">커스텀 스타일이 적용된 모달입니다.</p>
            <p className="text-xs text-gray-600 mt-2">테두리와 그림자가 추가되었습니다.</p>
          </div>
        </CommonModal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'className prop을 사용하여 커스텀 스타일을 적용한 모달입니다.',
      },
    },
  },
};

// 스크롤 테스트
export const ScrollTest: Story = {
  args: {
    isOpen: true,
    title: '스크롤 테스트 모달',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          스크롤 테스트 모달 열기
        </button>
        <CommonModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-black mb-2">섹션 {i + 1}</h4>
                <p className="text-xs text-gray-600">
                  이것은 스크롤 테스트를 위한 긴 컨텐츠입니다. 모달이 화면 높이를 초과할 때 스크롤이
                  정상적으로 동작하는지 확인할 수 있습니다.
                </p>
              </div>
            ))}
          </div>
        </CommonModal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '긴 컨텐츠가 있을 때 스크롤 동작을 확인할 수 있습니다.',
      },
    },
  },
};

// 다양한 컨텐츠 예시
export const VariousContent: Story = {
  render: () => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);

    const modalContents = {
      text: {
        title: '텍스트 모달',
        content: (
          <div className="space-y-4">
            <p className="text-sm text-black">일반적인 텍스트 컨텐츠입니다.</p>
            <p className="text-xs text-gray-600">모달은 다양한 종류의 컨텐츠를 담을 수 있습니다.</p>
          </div>
        ),
      },
      form: {
        title: '폼 모달',
        content: (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">이름</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">메시지</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg h-20"
                placeholder="메시지를 입력하세요"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">취소</button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg">확인</button>
            </div>
          </div>
        ),
      },
      list: {
        title: '리스트 모달',
        content: (
          <div className="space-y-2">
            {['항목 1', '항목 2', '항목 3', '항목 4', '항목 5'].map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <p className="text-sm text-black">{item}</p>
              </div>
            ))}
          </div>
        ),
      },
    };

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(modalContents).map(([key, modal]) => (
            <button
              key={key}
              onClick={() => setCurrentModal(key)}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              {modal.title} 열기
            </button>
          ))}
        </div>

        {Object.entries(modalContents).map(([key, modal]) => (
          <CommonModal
            key={key}
            isOpen={currentModal === key}
            onClose={() => setCurrentModal(null)}
            title={modal.title}
          >
            {modal.content}
          </CommonModal>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 종류의 컨텐츠를 담은 모달들을 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 시나리오 (스토리북에서 간단히)
export const RealWorldUsage: Story = {
  render: () => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);

    return (
      <div style={{ height: '100vh', padding: '20px' }}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">실제 U:NEAR 앱에서의 사용 예시</h3>

          <div className="bg-background rounded-lg p-5 max-w-md">
            <h4 className="text-lg font-semibold text-black mb-4">매장 정보</h4>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentModal('info')}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">📍 매장 위치 안내</span>
                  <span className="text-xs text-gray-500">ℹ️</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentModal('event')}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">🎉 이벤트 바로 알아보기</span>
                  <span className="text-xs text-gray-500">📋</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentModal('guide')}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-left hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">📚 이용 안내</span>
                  <span className="text-xs text-gray-500">❓</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 매장 위치 안내 모달 */}
        <CommonModal
          isOpen={currentModal === 'info'}
          onClose={() => setCurrentModal(null)}
          title="매장 위치 안내"
        >
          <div className="space-y-4">
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">지도 영역</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-black mb-2">매장 정보</h4>
              <p className="text-xs text-gray-600 mb-1">📍 서울시 강남구 테헤란로 123</p>
              <p className="text-xs text-gray-600 mb-1">📞 02-1234-5678</p>
              <p className="text-xs text-gray-600">🕒 평일 09:00 - 18:00</p>
            </div>
          </div>
        </CommonModal>

        {/* 이벤트 모달 */}
        <CommonModal
          isOpen={currentModal === 'event'}
          onClose={() => setCurrentModal(null)}
          title="이벤트 바로 알아보기"
        >
          <div className="space-y-4">
            <div className="bg-primary bg-opacity-10 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-primary mb-2">🎉 7월 특별 이벤트</h4>
              <p className="text-xs text-gray-600">매장 방문 시 특별 혜택을 받으세요!</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary text-white px-2 py-1 rounded">NEW</span>
                <span className="text-xs text-black">신규 가입 시 10% 할인</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">HOT</span>
                <span className="text-xs text-black">리뷰 작성 시 포인트 적립</span>
              </div>
            </div>
          </div>
        </CommonModal>

        {/* 이용 안내 모달 */}
        <CommonModal
          isOpen={currentModal === 'guide'}
          onClose={() => setCurrentModal(null)}
          title="이용 안내"
        >
          <div className="text-center py-8">
            <p className="text-sm text-black">이용 안내 컨텐츠가 들어갈 영역입니다.</p>
            <p className="text-xs text-gray-600 mt-4">
              실제 이용 안내 컨텐츠가 개발되면 이 영역에 표시됩니다.
            </p>
          </div>
        </CommonModal>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 U:NEAR 앱에서 사용될 수 있는 다양한 모달 사용 시나리오입니다.',
      },
    },
  },
};
