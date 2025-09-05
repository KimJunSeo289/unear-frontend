import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import SearchBar from '@/components/common/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Common/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 검색창 컴포넌트입니다. 반응형 디자인을 지원하며, 제어/비제어 컴포넌트 모두 사용 가능합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '입력 필드 플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"검색어를 입력하세요"' },
      },
    },
    value: {
      control: 'text',
      description: '제어 컴포넌트로 사용할 때의 값',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
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
    placeholder: '검색어를 입력하세요',
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <SearchBar {...args} onSearch={(value) => alert(`검색: ${value}`)} />
    </div>
  ),
};

// 커스텀 플레이스홀더
export const CustomPlaceholder: Story = {
  args: {
    placeholder: '매장명을 검색하세요',
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <SearchBar {...args} onSearch={(value) => alert(`매장 검색: ${value}`)} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '커스텀 플레이스홀더 텍스트를 사용한 검색창입니다.',
      },
    },
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    placeholder: '검색 기능이 비활성화되었습니다',
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <SearchBar {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태의 검색창입니다. 입력이 불가능하고 스타일이 변경됩니다.',
      },
    },
  },
};

// 제어 컴포넌트 예제
export const ControlledComponent: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const handleSearch = (value: string) => {
      setSearchHistory((prev) => [value, ...prev.slice(0, 4)]);
      setSearchValue('');
    };

    return (
      <div className="space-y-6 p-4" style={{ width: '400px' }}>
        <div>
          <h3 className="text-lg font-semibold mb-4">제어 컴포넌트 검색창</h3>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            placeholder="검색어를 입력하세요"
          />
          <p className="text-sm text-gray-600 mt-2">현재 입력값: "{searchValue}"</p>
        </div>

        {searchHistory.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">최근 검색어</h4>
            <div className="space-y-1">
              {searchHistory.map((term, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => setSearchValue(term)}
                >
                  {term}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '제어 컴포넌트로 사용하는 예제입니다. 검색 기록을 관리하고 값을 외부에서 제어할 수 있습니다.',
      },
    },
  },
};

// 비제어 컴포넌트 예제
export const UncontrolledComponent: Story = {
  render: () => {
    const [lastSearch, setLastSearch] = useState<string>('');

    return (
      <div className="space-y-6 p-4" style={{ width: '400px' }}>
        <div>
          <h3 className="text-lg font-semibold mb-4">비제어 컴포넌트 검색창</h3>
          <SearchBar placeholder="자유롭게 입력하세요" onSearch={setLastSearch} />
          {lastSearch && (
            <p className="text-sm text-gray-600 mt-2">마지막 검색어: "{lastSearch}"</p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '비제어 컴포넌트로 사용하는 예제입니다. 컴포넌트 내부에서 상태를 관리합니다.',
      },
    },
  },
};

// 반응형 테스트
export const ResponsiveTest: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">반응형 테스트</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">작은 컨테이너 (300px)</h4>
            <div style={{ width: '300px' }} className="border border-gray-300 p-4">
              <SearchBar placeholder="300px 너비" onSearch={(v) => console.log(v)} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">중간 컨테이너 (500px)</h4>
            <div style={{ width: '500px' }} className="border border-gray-300 p-4">
              <SearchBar placeholder="500px 너비" onSearch={(v) => console.log(v)} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">큰 컨테이너 (700px)</h4>
            <div style={{ width: '700px' }} className="border border-gray-300 p-4">
              <SearchBar placeholder="700px 너비" onSearch={(v) => console.log(v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 컨테이너 크기에서의 반응형 동작을 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 시나리오
export const RealWorldUsage: Story = {
  render: () => {
    return (
      <div className="space-y-6 p-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">실제 앱에서의 사용 예시</h3>

          <div
            className="bg-background rounded-lg p-5"
            style={{ width: '393px', minHeight: '200px' }}
          >
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-black">매장 찾기</h4>
              <SearchBar
                placeholder="매장명이나 카테고리를 검색하세요"
                onSearch={(value) => alert(`"${value}" 검색 결과를 불러옵니다`)}
              />

              <div className="mt-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">인기 검색어</h5>
                <div className="flex flex-wrap gap-2">
                  {['카페', '음식점', '뷰티', '쇼핑'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 U:NEAR 앱에서 사용될 수 있는 검색 화면의 예시입니다.',
      },
    },
  },
};
