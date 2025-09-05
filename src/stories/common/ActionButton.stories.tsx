// src/components/common/ActionButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionButton from '@/components/common/ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Common/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼 안에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼이 활성화되어 클릭되었을 때 실행될 함수입니다.',
    },
    isActive: {
      control: 'boolean',
      description: '버튼 활성화 여부를 설정합니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**ActionButton** 컴포넌트는 텍스트와 활성화 상태에 따라 동작하는 단일 버튼입니다.  
- \`isActive\`가 \`true\`일 경우 핑크색 배경(\`#e6007e\`)이며 클릭이 가능하고,  
- \`false\`일 경우 회색 배경(\`#acacb5/80\`)으로 비활성화되어 클릭할 수 없습니다.  
- 클릭 시 \`text\` 값을 포함한 alert 메시지가 표시됩니다.  
- 호버 시 배경색은 \`hover:bg-pink-500\`로 변합니다.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

// 기본 버튼 (비활성화 상태 - 기본 상태)
export const 기본_버튼: Story = {
  args: {
    text: '로그인',
    isActive: false, // 기본 비활성화 상태
    onClick: () => console.log('클릭 불가 - 비활성화 상태'),
  },
};

// 활성화된 버튼 예시
export const 활성화_버튼: Story = {
  args: {
    text: '회원가입',
    isActive: true, // 활성화 상태
    onClick: () => console.log('회원가입 시도됨'),
  },
};

// 커스텀 텍스트
export const 커스텀_텍스트: Story = {
  args: {
    text: '정보 제출',
    isActive: true,
    onClick: () => console.log('정보 제출됨'),
  },
};
