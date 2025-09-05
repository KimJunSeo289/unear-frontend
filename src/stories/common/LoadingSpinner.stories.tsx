import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Common/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '다양한 크기와 색상을 지원하는 로딩 스피너 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
};

// 크기별 스토리
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// 색상별 스토리
export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const White: Story = {
  args: {
    color: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Gray: Story = {
  args: {
    color: 'gray',
  },
};

// 크기 비교 스토리
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-xs text-gray-500">Small (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="md" />
        <span className="text-xs text-gray-500">Medium (32px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <span className="text-xs text-gray-500">Large (48px)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 스피너를 비교해볼 수 있습니다.',
      },
    },
  },
};

// 색상 비교 스토리
export const ColorComparison: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner color="primary" />
        <span className="text-xs text-gray-500">Primary</span>
      </div>
      <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded">
        <LoadingSpinner color="white" />
        <span className="text-xs text-white">White</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner color="gray" />
        <span className="text-xs text-gray-500">Gray</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 색상의 스피너를 비교해볼 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시
export const InButton: Story = {
  render: () => (
    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
      <LoadingSpinner size="sm" color="white" />
      로딩 중...
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼 내에서 로딩 스피너를 사용하는 예시입니다.',
      },
    },
  },
};

export const InCard: Story = {
  render: () => (
    <div className="w-64 h-32 border border-gray-200 rounded-lg flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '카드나 컨테이너 내에서 로딩 스피너를 사용하는 예시입니다.',
      },
    },
  },
};
