import type { Meta, StoryObj } from '@storybook/react-vite';
import PhoneIcon from '@/components/common/PhoneButton';

const meta: Meta<typeof PhoneIcon> = {
  title: 'Common/PhoneButton', // 스토리북 사이드바에 표시될 제목
  component: PhoneIcon,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '아이콘 버튼 클릭 시 실행되는 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**PhoneIcon** 컴포넌트는 전화 아이콘 버튼입니다.

- 회색 테두리와 아이콘으로 구성되어 있으며, 텍스트 없이 아이콘만 표시됩니다.
- 마우스를 올리면 배경색이 white → #F4F4F5 로 변경됩니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PhoneIcon>;

export const 기본_전화_아이콘: Story = {
  args: {
    onClick: () => alert('전화 아이콘이 클릭되었습니다!'),
  },
};
