import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleButton from '@/components/common/ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Common/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼 안에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '토글 버튼 클릭 시 실행되는 함수입니다.',
      table: {
        // disable: true,  <-- 제거! onClick이 실제로 있음
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**ToggleButton** 컴포넌트는 텍스트가 가운데 정렬된 토글 버튼입니다.

- 기본적으로 회색 테두리와 글자 색상(\`border-zinc-400\`, \`text-zinc-400\`)을 가집니다.
- 클릭 시 분홍색 테두리와 글자 색상(\`border-[#e6007e]\`, \`text-[#e6007e]\`)으로 변경됩니다.
- 텍스트는 클릭 전후 동일하게 유지됩니다.
- 마우스 커서는 클릭 가능 상태를 나타내며, 클릭 시 토글 상태가 변경됩니다.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const 기본_토글_버튼: Story = {
  args: {
    text: '토글 버튼',
  },
};
