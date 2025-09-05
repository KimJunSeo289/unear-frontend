import type { Meta, StoryObj } from '@storybook/react-vite';
import BarcodeDisplay from '@/components/common/BarcodeDisplay';

const meta: Meta<typeof BarcodeDisplay> = {
  title: 'Common/BarcodeDisplay',
  component: BarcodeDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 바코드 표시 컴포넌트입니다. react-barcode를 사용하여 실제 바코드를 생성하며, 다양한 바코드 형식을 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: '바코드로 표시할 코드 값',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'required' },
      },
    },
    format: {
      control: 'select',
      options: ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14'],
      description: '바코드 형식',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"CODE128"' },
      },
    },
    height: {
      control: { type: 'range', min: 50, max: 150, step: 10 },
      description: '바코드 높이',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '80' },
      },
    },
    width: {
      control: { type: 'range', min: 1, max: 5, step: 0.5 },
      description: '바코드 선 두께',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2' },
      },
    },
    displayValue: {
      control: 'boolean',
      description: '코드 값 표시 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    fontSize: {
      control: { type: 'range', min: 8, max: 24, step: 2 },
      description: '폰트 크기',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '14' },
      },
    },
    background: {
      control: 'color',
      description: '배경색',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"#ffffff"' },
      },
    },
    lineColor: {
      control: 'color',
      description: '바코드 선 색상',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"#000000"' },
      },
    },
    margin: {
      control: { type: 'range', min: 0, max: 20, step: 2 },
      description: '여백',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
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
    onError: {
      action: 'error',
      description: '에러 처리 콜백',
      table: {
        type: { summary: '(error: Error) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarcodeDisplay>;

export const Default: Story = {
  args: {
    code: '344BA876Y89',
  },
};

export const Code128: Story = {
  args: {
    code: '123456789012',
    format: 'CODE128',
  },
};

export const Code39: Story = {
  args: {
    code: 'HELLO123',
    format: 'CODE39',
  },
};

export const LargeSize: Story = {
  args: {
    code: 'LARGE123',
    height: 120,
    width: 3,
    fontSize: 18,
  },
};

export const SmallSize: Story = {
  args: {
    code: 'SMALL123',
    height: 60,
    width: 1.5,
    fontSize: 10,
  },
};

export const CustomColor: Story = {
  args: {
    code: 'CUSTOM123',
    lineColor: '#E6007E',
    background: '#F6F7FB',
  },
};

export const NoDisplayValue: Story = {
  args: {
    code: 'NODISPLAY',
    displayValue: false,
  },
};

export const WithError: Story = {
  args: {
    code: 'invalid@code!',
    onError: (error) => console.error('바코드 오류:', error),
  },
};
