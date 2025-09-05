import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';

const meta: Meta<typeof MapMarkerIcon> = {
  title: 'Common/MapMarkerIcon',
  component: MapMarkerIcon,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 지도 마커 아이콘 컴포넌트입니다. 백엔드 API 스펙에 맞춰 설계되었으며, 매장 구분과 이벤트에 따른 색상과 크기 차이를 지원합니다.',
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
    isSelected: {
      control: 'boolean',
      description: '선택 상태 (크기와 아이콘 색상에 영향)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    isSelected: false,
  },
};

// 매장 구분별 색상 (이벤트 없는 상태)
export const StoreClassColors: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">
          프랜차이즈 (FRANCHISE) - 주황색
        </h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="CAFE" storeClass="FRANCHISE" event="NONE" />
          <MapMarkerIcon category="FOOD" storeClass="FRANCHISE" event="NONE" />
          <MapMarkerIcon category="SHOPPING" storeClass="FRANCHISE" event="NONE" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">
          기본 (BASIC) - 주황색 (프랜차이즈와 동일)
        </h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="CAFE" storeClass="BASIC" event="NONE" />
          <MapMarkerIcon category="FOOD" storeClass="BASIC" event="NONE" />
          <MapMarkerIcon category="SHOPPING" storeClass="BASIC" event="NONE" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-500">소상공인 (LOCAL) - 파란색</h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="CAFE" storeClass="LOCAL" event="NONE" />
          <MapMarkerIcon category="FOOD" storeClass="LOCAL" event="NONE" />
          <MapMarkerIcon category="SHOPPING" storeClass="LOCAL" event="NONE" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">
          팝업스토어 카테고리 - Store 아이콘
        </h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="POPUP" storeClass="FRANCHISE" event="NONE" />
          <MapMarkerIcon category="POPUP" storeClass="BASIC" event="NONE" />
          <MapMarkerIcon category="POPUP" storeClass="LOCAL" event="NONE" />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          팝업스토어는 카테고리로 분류되어 Store 아이콘 사용
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '이벤트가 없는 상태에서 매장 구분(storeClass)에 따른 색상을 보여주는 예시입니다.',
      },
    },
  },
};

// 모든 카테고리 보기
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">모든 카테고리 마커 (팝업 포함)</h3>
      <div className="grid grid-cols-5 gap-6">
        <div className="text-center">
          <MapMarkerIcon category="CAFE" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">CAFE</p>
          <p className="text-xs text-gray-500">카페</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="FOOD" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">FOOD</p>
          <p className="text-xs text-gray-500">푸드</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="SHOPPING" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">SHOPPING</p>
          <p className="text-xs text-gray-500">쇼핑</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="EDUCATION" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">EDUCATION</p>
          <p className="text-xs text-gray-500">교육</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="CULTURE" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">CULTURE</p>
          <p className="text-xs text-gray-500">문화/여가</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="BAKERY" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">BAKERY</p>
          <p className="text-xs text-gray-500">베이커리</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="BEAUTY" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">BEAUTY</p>
          <p className="text-xs text-gray-500">뷰티/건강</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="LIFE" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">LIFE</p>
          <p className="text-xs text-gray-500">생활/편의</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="ACTIVITY" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">ACTIVITY</p>
          <p className="text-xs text-gray-500">액티비티</p>
        </div>
        <div className="text-center">
          <MapMarkerIcon category="POPUP" storeClass="FRANCHISE" />
          <p className="text-sm mt-2 font-medium">POPUP</p>
          <p className="text-xs text-gray-500">팝업스토어</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '백엔드 API에서 제공하는 모든 카테고리의 마커를 미리보기할 수 있습니다.',
      },
    },
  },
};

// 인터랙티브 예제
export const InteractiveExample: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleClick = (id: string) => {
      setSelectedId(selectedId === id ? null : id);
    };

    const markers = [
      {
        id: 'marker1',
        category: 'CAFE',
        storeClass: 'FRANCHISE',
        event: 'NONE',
        label: '프랜차이즈 카페',
      },
      {
        id: 'marker2',
        category: 'FOOD',
        storeClass: 'BASIC',
        event: 'NONE',
        label: '기본 음식점',
      },
      {
        id: 'marker3',
        category: 'SHOPPING',
        storeClass: 'LOCAL',
        event: 'NONE',
        label: '소상공인 쇼핑',
      },
      {
        id: 'marker4',
        category: 'POPUP',
        storeClass: 'BASIC',
        event: 'NONE',
        label: '팝업스토어',
      },
      {
        id: 'marker5',
        category: 'BEAUTY',
        storeClass: 'FRANCHISE',
        event: 'GENERAL',
        label: '일반 이벤트',
      },
      {
        id: 'require1',
        category: 'BEAUTY',
        storeClass: 'LOCAL',
        event: 'REQUIRE',
        label: '필수 이벤트',
      },
    ] as const;

    return (
      <div className="space-y-6 p-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">인터랙티브 마커 선택</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            {markers.map((marker) => (
              <div key={marker.id} className="text-center">
                <MapMarkerIcon
                  category={marker.category}
                  storeClass={marker.storeClass}
                  event={marker.event}
                  isSelected={selectedId === marker.id}
                  onClick={() => handleClick(marker.id)}
                />
                <p className="text-sm mt-2">{marker.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              현재 선택된 마커:{' '}
              {selectedId ? markers.find((m) => m.id === selectedId)?.label : '없음'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              💡 마커를 클릭해보세요. 하나만 선택 가능합니다.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '실제 사용 시나리오를 시뮬레이션합니다. 하나의 마커만 선택 가능하며, 클릭 시 크기와 색상이 변경됩니다.',
      },
    },
  },
};

// 실제 사용 시나리오
export const RealWorldUsage: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">실제 사용 예시</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="CAFE" storeClass="FRANCHISE" event="NONE" />
            <span className="text-sm">프랜차이즈 카페</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="FOOD" storeClass="BASIC" event="NONE" />
            <span className="text-sm">기본 음식점</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="SHOPPING" storeClass="LOCAL" event="NONE" />
            <span className="text-sm">소상공인 쇼핑</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="POPUP" storeClass="BASIC" event="NONE" />
            <span className="text-sm">팝업스토어</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="BEAUTY" storeClass="FRANCHISE" event="GENERAL" />
            <span className="text-sm">일반 이벤트 매장</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="ACTIVITY" storeClass="LOCAL" event="REQUIRE" />
            <span className="text-sm">필수 이벤트 매장</span>
          </div>
          <div className="flex items-center gap-3">
            <MapMarkerIcon category="CAFE" storeClass="LOCAL" event="NONE" isSelected={true} />
            <span className="text-sm">선택된 매장</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 애플리케이션에서 다양한 매장 마커들이 어떻게 사용될지 보여주는 예시입니다.',
      },
    },
  },
};
