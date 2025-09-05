import type { Meta, StoryObj } from '@storybook/react-vite';
import _404State from '@/components/common/404State';

const meta: Meta<typeof _404State> = {
  title: 'Common/404State',
  component: _404State,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**404State** 컴포넌트는 요청한 페이지를 찾을 수 없음을 사용자에게 알려주는 UI입니다.
중앙에 안내 문구와 관련 이미지를 보여줍니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof _404State>;

export const 기본_404_상태: Story = {};
