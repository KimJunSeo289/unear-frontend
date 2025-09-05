import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkButton from '@/components/common/BookmarkButton';

const meta: Meta<typeof BookmarkButton> = {
  title: 'Common/BookmarkButton',
  component: BookmarkButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
    label: {
      control: 'text',
      description: '버튼에 표시될 텍스트입니다.',
      defaultValue: '즐겨찾기',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
          **BookmarkButton** 컴포넌트는 즐겨찾기 기능을 수행하는 버튼입니다.
          깔끔한 흰색 배경과 회색 테두리, 별 모양 아이콘, 그리고 텍스트를 포함합니다.
          **마우스 호버 시 배경색이 연한 회색(#f4f4f5)으로 변경되어 사용자가 버튼 위에 있음을 시각적으로 표시합니다.** ⭐
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof BookmarkButton>;

export const 기본_즐겨찾기_버튼: Story = {
  args: {
    label: '즐겨찾기',
    onClick: () => alert('즐겨찾기 버튼이 클릭되었습니다!'),
  },
};
