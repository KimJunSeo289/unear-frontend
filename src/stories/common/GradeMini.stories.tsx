import type { Meta, StoryObj } from '@storybook/react-vite';
import GradeMini from '@/components/common/GradeMini';

type GradeType = 'VIP' | 'VVIP' | '우수';

const meta: Meta<typeof GradeMini> = {
  title: 'Common/GradeMini',
  component: GradeMini,
  tags: ['autodocs'],
  argTypes: {
    grade: {
      control: { type: 'select' },
      options: ['VIP', 'VVIP', '우수'] as GradeType[],
      description: '표시할 등급을 선택합니다.',
      defaultValue: 'VIP',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**GradeMini** 컴포넌트는 'VIP', 'VVIP', '우수' 등급을 작은 크기로 표시합니다.
각 등급별로 배경색과 텍스트 색상이 다르게 적용되며, 글자가 배경 가운데 정렬됩니다.
둥근 모서리와 깔끔한 디자인으로 UI 내 등급 표시용으로 사용하기 적합합니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof GradeMini>;

export const 기본_등급_표시: Story = {
  args: {
    grade: 'VIP',
  },
};
