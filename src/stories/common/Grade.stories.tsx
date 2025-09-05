import type { Meta, StoryObj } from '@storybook/react-vite';
import Grade from '@/components/common/Grade';

type GradeType = 'VIP' | 'VVIP' | '우수';

const meta: Meta<typeof Grade> = {
  title: 'Common/Grade',
  component: Grade,
  tags: ['autodocs'],
  argTypes: {
    grade: {
      control: { type: 'select' },
      options: ['VIP', 'VVIP', '우수'] as GradeType[],
      description: '등급을 선택합니다. (VIP, VVIP, 우수)',
      defaultValue: 'VIP',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Grade** 컴포넌트는 'VIP', 'VVIP', '우수' 등급을 표시하는 버튼 스타일 컴포넌트입니다.
각 등급에 따라 배경색과 텍스트 색상이 다르게 적용됩니다.
둥근 모서리와 가운데 정렬된 텍스트로 디자인되어 있습니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Grade>;

export const 기본_등급_표시: Story = {
  args: {
    grade: 'VIP',
  },
};
