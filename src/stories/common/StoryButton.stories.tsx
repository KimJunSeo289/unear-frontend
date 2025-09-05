import type { Meta, StoryObj } from '@storybook/react-vite';
import StoryButton from '@/components/common/StoryButton';

const meta: Meta<typeof StoryButton> = {
  title: 'Common/StoryButton', // Storybook 사이드바에 표시될 컴포넌트 이름
  component: StoryButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      defaultValue: '스토리 보기',
      description: '버튼에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**StoryButton** 컴포넌트는 사용자에게 '스토리 보기'와 같은 행동을 유도하기 위한 버튼입니다.  
파란색 계열의 배경을 가지며, 텍스트는 중앙 정렬되고, **마우스 호버 시 배경색이 더 진한 파란색으로 부드럽게 전환됩니다.**

- 기본 크기: \`221x45px\`
- 텍스트는 자동 줄임표 처리 및 중앙 정렬
- hover 시 배경 색상 강조
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StoryButton>;

export const 기본_스토리_버튼: Story = {
  args: {
    text: '스토리 보기',
    onClick: () => alert('스토리 버튼이 클릭되었습니다!'),
  },
};
