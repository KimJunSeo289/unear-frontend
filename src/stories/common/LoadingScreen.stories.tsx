import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingScreen from '@/components/common/LoadingScreen';

const meta: Meta<typeof LoadingScreen> = {
  title: 'Common/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '전체 화면 또는 컨테이너 영역에서 사용하는 로딩 화면 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: '로딩 중에 표시할 메시지를 설정합니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '로딩 중...' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '스피너의 크기를 설정합니다.',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    color: {
      control: 'select',
      options: ['primary', 'white', 'gray'],
      description: '스피너의 색상을 설정합니다.',
      table: {
        type: { summary: 'primary | white | gray' },
        defaultValue: { summary: 'primary' },
      },
    },
    fullHeight: {
      control: 'boolean',
      description: '전체 화면 높이를 사용할지 설정합니다.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스를 적용합니다.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {},
  parameters: {
    layout: 'centered',
  },
};

// 커스텀 메시지
export const WithCustomMessage: Story = {
  args: {
    message: '데이터를 불러오는 중입니다...',
  },
  parameters: {
    layout: 'centered',
  },
};

// 메시지 없음
export const WithoutMessage: Story = {
  args: {
    message: '',
  },
  parameters: {
    layout: 'centered',
  },
};

// 색상별 스토리
export const PrimaryColor: Story = {
  args: {
    color: 'primary',
    message: '핑크색 스피너',
    fullHeight: false,
  },
  render: (args) => (
    <div className="w-96 h-64 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const GrayColor: Story = {
  args: {
    color: 'gray',
    message: '회색 스피너',
    fullHeight: false,
  },
  render: (args) => (
    <div className="w-96 h-64 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const WhiteColor: Story = {
  args: {
    color: 'white',
    message: '흰색 스피너 (어두운 배경)',
    fullHeight: false,
  },
  render: (args) => (
    <div className="w-96 h-64 bg-gray-800 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

// 작은 영역에서 사용
export const InContainer: Story = {
  args: {
    fullHeight: false,
    message: '처리 중...',
  },
  render: (args) => (
    <div className="w-96 h-64 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          '컨테이너 내에서 사용하는 경우입니다. fullHeight={false}로 설정하여 컨테이너에 맞춤.',
      },
    },
  },
};

// 크기별 스토리
export const SmallSize: Story = {
  args: {
    size: 'sm',
    message: '잠시만 기다려주세요...',
    fullHeight: false,
  },
  render: (args) => (
    <div className="w-64 h-32 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    message: '대용량 파일을 처리하는 중...',
    fullHeight: false,
  },
  render: (args) => (
    <div className="w-96 h-64 border border-gray-200 rounded-lg">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

// 전체 화면 로딩
export const FullScreen: Story = {
  args: {
    message: '페이지를 로딩하는 중...',
    fullHeight: true,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: '전체 화면에서 사용하는 로딩 화면입니다. 실제 페이지 로딩 시 사용됩니다.',
      },
    },
  },
};

// 다양한 사용 사례
export const UseCases: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">1. 카드 로딩</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg">
            <LoadingScreen fullHeight={false} message="카드 데이터 로딩 중..." size="sm" />
          </div>
          <div className="border border-gray-200 rounded-lg">
            <LoadingScreen fullHeight={false} message="이미지 업로드 중..." size="md" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">2. 모달 로딩</h3>
        <div className="w-80 h-48 border border-gray-200 rounded-lg shadow-lg bg-white">
          <LoadingScreen fullHeight={false} message="정보를 저장하는 중..." className="bg-white" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">3. 리스트 로딩</h3>
        <div className="w-full h-32 border border-gray-200 rounded-lg">
          <LoadingScreen fullHeight={false} message="목록을 불러오는 중..." size="sm" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 UI 요소에서 LoadingScreen을 사용하는 예시들입니다.',
      },
    },
  },
};

// 스피너 크기 및 색상 비교
export const SpinnerVariations: Story = {
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">크기별 비교</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center">
              <LoadingScreen size="sm" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center">
              <LoadingScreen size="md" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center">
              <LoadingScreen size="lg" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">Large</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">색상별 비교</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center bg-white">
              <LoadingScreen color="primary" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-800">
              <LoadingScreen color="white" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">White</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 border border-gray-200 rounded-lg flex items-center justify-center bg-white">
              <LoadingScreen color="gray" message="" fullHeight={false} />
            </div>
            <span className="text-xs text-gray-500">Gray</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 크기와 색상의 스피너를 비교해볼 수 있습니다.',
      },
    },
  },
};

// 커스텀 스타일링
export const CustomStyling: Story = {
  args: {
    message: '커스텀 스타일링된 로딩 화면',
    fullHeight: false,
    className:
      'bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg border border-purple-200',
  },
  render: (args) => (
    <div className="w-96 h-64">
      <LoadingScreen {...args} />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'className을 사용하여 커스텀 스타일링을 적용한 예시입니다.',
      },
    },
  },
};
