import type { Meta, StoryObj } from '@storybook/react-vite';
import LocationButton from '@/components/common/LocationButton';

const meta: Meta<typeof LocationButton> = {
  title: 'Common/LocationButton', // Storybook 사이드바에 표시될 컴포넌트의 제목입니다.
  component: LocationButton, // 스토리를 만들 컴포넌트를 지정합니다.
  tags: ['autodocs'], // 자동 문서화 활성화
  argTypes: {
    onClick: {
      action: 'clicked', // 버튼 클릭 시 'clicked' 액션이 기록됩니다.
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
          **LocationButton** 컴포넌트는 사용자에게 특정 위치를 보여주거나 관련된 액션을 수행할 수 있도록 하는 버튼입니다.
          분홍색 테두리와 전화 아이콘, 그리고 '전화 걸기' 텍스트를 포함하고 있습니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LocationButton>;

export const 기본_위치_버튼: Story = {
  args: {
    onClick: () => alert('위치 버튼이 클릭되었습니다!'), // 클릭 시 실행될 함수입니다.
  },
};
