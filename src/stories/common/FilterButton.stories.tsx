import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterButton from '@/components/common/FilterButton';

const meta: Meta<typeof FilterButton> = {
  title: 'Common/FilterButton',
  component: FilterButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
    text: {
      control: 'text',
      description: '버튼에 표시될 텍스트입니다.',
      defaultValue: '전체',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**FilterButton** 컴포넌트는 선택 가능한 태그 형태의 버튼입니다.  
기본적으로 흰색 배경과 회색 테두리, 검정 텍스트로 구성되어 있으며,  
선택(활성화) 시 핑크색 테두리와 핑크 텍스트로 전환됩니다.  

- 내부적으로 상태를 관리하며 토글 방식으로 동작합니다.
- 외부에서 \`onClick\` 핸들러도 전달할 수 있습니다. 🎯
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FilterButton>;

export const 기본_필터_버튼: Story = {
  args: {
    text: '전체',
    onClick: () => alert('필터 버튼이 클릭되었습니다!'),
  },
};
