import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreTypeIcon from '@/components/common/StoreTypeIcon';

const meta: Meta<typeof StoreTypeIcon> = {
  title: 'Common/StoreTypeIcon',
  component: StoreTypeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 매장 타입별 아이콘 컴포넌트입니다. 백엔드 API 스펙에 맞춰 설계되었으며, 매장 모드와 통계 모드를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [
        'FOOD',
        'ACTIVITY',
        'EDUCATION',
        'CULTURE',
        'BAKERY',
        'LIFE',
        'SHOPPING',
        'CAFE',
        'BEAUTY',
        'POPUP',
      ],
      description: '매장 카테고리 타입 (백엔드 PLACE_CATEGORY)',
      table: {
        type: { summary: 'CategoryType' },
        defaultValue: { summary: 'CAFE' },
      },
    },
    storeClass: {
      control: 'select',
      options: ['LOCAL', 'FRANCHISE', 'BASIC'],
      description: '매장 구분 타입 (백엔드 PLACE_TYPE)',
      table: {
        type: { summary: 'StoreClassType' },
        defaultValue: { summary: 'FRANCHISE' },
      },
    },
    event: {
      control: 'select',
      options: ['NONE', 'GENERAL', 'REQUIRE'],
      description: '이벤트 타입 (백엔드 EVENT_TYPE)',
      table: {
        type: { summary: 'EventType' },
        defaultValue: { summary: 'NONE' },
      },
    },
    size: {
      control: { type: 'range', min: 30, max: 100, step: 10 },
      description: '아이콘 컴테이너 크기 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '50' },
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
    mode: {
      control: 'select',
      options: ['store', 'statistics'],
      description: '색상 모드 선택',
      table: {
        type: { summary: 'ModeType' },
        defaultValue: { summary: 'store' },
      },
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
      description: '아이콘 모양 선택',
      table: {
        type: { summary: 'ShapeType' },
        defaultValue: { summary: 'square' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    category: 'CAFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    size: 50,
    mode: 'store',
    shape: 'square',
  },
};

// 매장 구분별 색상 예시
export const StoreClassColors: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">
          프랜차이즈 (FRANCHISE) - 주황색
        </h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="CAFE" storeClass="FRANCHISE" event="NONE" size={50} />
          <StoreTypeIcon category="FOOD" storeClass="FRANCHISE" event="NONE" size={50} />
          <StoreTypeIcon category="SHOPPING" storeClass="FRANCHISE" event="NONE" size={50} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">기본 (BASIC) - 주황색</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="CAFE" storeClass="BASIC" event="NONE" size={50} />
          <StoreTypeIcon category="FOOD" storeClass="BASIC" event="NONE" size={50} />
          <StoreTypeIcon category="SHOPPING" storeClass="BASIC" event="NONE" size={50} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-500">소상공인 (LOCAL) - 파란색</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="CAFE" storeClass="LOCAL" event="NONE" size={50} />
          <StoreTypeIcon category="FOOD" storeClass="LOCAL" event="NONE" size={50} />
          <StoreTypeIcon category="SHOPPING" storeClass="LOCAL" event="NONE" size={50} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">
          팝업스토어 카테고리 - Store 아이콘
        </h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="POPUP" storeClass="FRANCHISE" event="NONE" size={50} />
          <StoreTypeIcon category="POPUP" storeClass="BASIC" event="NONE" size={50} />
          <StoreTypeIcon category="POPUP" storeClass="LOCAL" event="NONE" size={50} />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          팝업스토어는 카테고리로 분류되어 Store 아이콘 사용
        </p>
      </div>
    </div>
  ),
};

// 전체 카테고리 아이콘 미리보기
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">전체 카테고리 아이콘 (팝업 포함)</h3>
      <div className="grid grid-cols-5 gap-6">
        <div className="text-center">
          <StoreTypeIcon category="CAFE" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">CAFE</p>
          <p className="text-xs text-gray-500">카페</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="FOOD" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">FOOD</p>
          <p className="text-xs text-gray-500">푸드</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="SHOPPING" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">SHOPPING</p>
          <p className="text-xs text-gray-500">쇼핑</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="EDUCATION" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">EDUCATION</p>
          <p className="text-xs text-gray-500">교육</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="CULTURE" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">CULTURE</p>
          <p className="text-xs text-gray-500">문화/여가</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="BAKERY" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">BAKERY</p>
          <p className="text-xs text-gray-500">베이커리</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="BEAUTY" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">BEAUTY</p>
          <p className="text-xs text-gray-500">뷰티/건강</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="LIFE" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">LIFE</p>
          <p className="text-xs text-gray-500">생활/편의</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="ACTIVITY" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">ACTIVITY</p>
          <p className="text-xs text-gray-500">액티비티</p>
        </div>
        <div className="text-center">
          <StoreTypeIcon category="POPUP" storeClass="FRANCHISE" size={60} />
          <p className="text-sm mt-2 font-medium">POPUP</p>
          <p className="text-xs text-gray-500">팝업스토어</p>
        </div>
      </div>
    </div>
  ),
};

// 통계 모드 - 카테고리별 색상
export const StatisticsMode: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">통계 모드 - 카테고리별 색상</h3>
      <div className="grid grid-cols-5 gap-4">
        {(
          [
            'CAFE',
            'FOOD',
            'SHOPPING',
            'EDUCATION',
            'CULTURE',
            'BAKERY',
            'BEAUTY',
            'LIFE',
            'ACTIVITY',
            'POPUP',
          ] as const
        ).map((category) => (
          <div key={category} className="text-center">
            <StoreTypeIcon category={category} storeClass="FRANCHISE" size={50} mode="statistics" />
            <p className="text-sm mt-2">{category}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        통계 모드에서는 이벤트나 매장 구분과 관계없이 카테고리별 고유 색상을 사용합니다.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '통계 모드에서 각 카테고리별로 지정된 색상을 보여주는 예시입니다.',
      },
    },
  },
};

// 모양 비교 - 네모 vs 원형
export const ShapeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">네모 모양 (Square)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="CAFE" storeClass="FRANCHISE" size={50} shape="square" />
          <StoreTypeIcon category="FOOD" storeClass="LOCAL" size={50} shape="square" />
          <StoreTypeIcon category="POPUP" storeClass="BASIC" size={50} shape="square" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">원형 모양 (Circle)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="CAFE" storeClass="FRANCHISE" size={50} shape="circle" />
          <StoreTypeIcon category="FOOD" storeClass="LOCAL" size={50} shape="circle" />
          <StoreTypeIcon category="POPUP" storeClass="BASIC" size={50} shape="circle" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '네모 모양(square)과 원형 모양(circle)의 차이를 보여주는 예시입니다.',
      },
    },
  },
};
