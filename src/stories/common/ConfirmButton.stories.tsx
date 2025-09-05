import type { Meta, StoryObj } from '@storybook/react-vite';
import ConfirmButton from '@/components/common/ConfirmButton';

const meta: Meta<typeof ConfirmButton> = {
  title: 'Common/ConfirmButton',
  component: ConfirmButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼 안에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행되는 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**ConfirmButton** 컴포넌트는 작은 사이즈의 확인용 버튼입니다.

- 기본 배경색은 \`#e6007e\`이며, 글자색은 흰색입니다.
- 마우스를 올리면 배경색이 \`pink-500\`으로 변경됩니다.
- 클릭 시 전달된 onClick 함수가 실행됩니다.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmButton>;

export const 기본_확인_버튼: Story = {
  args: {
    text: '인증 확인',
  },
};
