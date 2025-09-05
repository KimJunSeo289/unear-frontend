import type { Meta, StoryObj } from '@storybook/react-vite';
import CouponButton from '@/components/common/CouponButton';

const meta: Meta<typeof CouponButton> = {
  title: 'Common/CouponButton',
  component: CouponButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
    label: {
      control: 'text',
      description: '버튼에 표시될 텍스트입니다.',
      defaultValue: '쿠폰 5개',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
          **CouponButton** 컴포넌트는 쿠폰 수량을 표시하는 버튼입니다.
          깔끔한 흰색 배경과 회색 테두리, 쿠폰 모양 아이콘, 그리고 텍스트를 포함하고 있습니다.
          **마우스 호버 시 배경색이 연한 회색(#f4f4f5)으로 변경되어 버튼 위에 마우스가 있음을 시각적으로 표시합니다.** 🎟️
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CouponButton>;

export const 기본_쿠폰_버튼: Story = {
  args: {
    label: '쿠폰 5개',
    onClick: () => alert('쿠폰 버튼이 클릭되었습니다!'),
  },
};
