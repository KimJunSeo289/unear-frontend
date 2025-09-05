// src/components/common/MiniButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import MiniButton from '@/components/common/MiniButton';

const meta: Meta<typeof MiniButton> = {
  title: 'Common/MiniButton',
  component: MiniButton,
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼 안에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
    isActive: {
      control: 'boolean',
      description: '버튼 활성화 여부를 나타냅니다.',
      defaultValue: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**MiniButton** 컴포넌트는 사용자의 액션을 유도하는 미니 스타일 버튼입니다.  
\`isActive\` 값이 \`true\`이면 버튼이 핑크색 배경(\`#e6007e\`)으로 활성화되고,  
\`false\` 또는 생략 시에는 회색 배경(\`#acacb5/80\`)으로 비활성화되며 클릭할 수 없습니다.  
\`onClick\` 핸들러는 버튼이 활성화된 경우에만 호출됩니다.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MiniButton>;

// ✅ 기본값 테스트 (isActive 생략 → false로 작동)
export const 기본: Story = {
  args: {
    text: '룰렛 돌리기',
    onClick: () => console.log('룰렛 돌리기 버튼 클릭 시도됨 (기본값은 비활성화 상태)'),
  },
};

// ✅ 명시적으로 활성화 상태
export const 활성화_버튼: Story = {
  args: {
    text: '룰렛 돌리기',
    isActive: true,
    onClick: () => console.log('룰렛 돌리기 버튼 클릭됨'),
  },
};

// ✅ 다양한 텍스트 예시
export const 커스텀_텍스트: Story = {
  args: {
    text: '확인 완료',
    isActive: true,
    onClick: () => console.log('확인 완료 버튼 클릭됨'),
  },
};
