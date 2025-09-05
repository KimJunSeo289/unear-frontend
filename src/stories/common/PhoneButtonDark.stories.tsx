import type { Meta, StoryObj } from '@storybook/react-vite';
import PhoneButtonDark from '@/components/common/PhoneButtonDark';

const meta: Meta<typeof PhoneButtonDark> = {
  title: 'Common/PhoneButtonDark',
  component: PhoneButtonDark,
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
**PhoneButtonDark**는 어두운 배경에 어울리도록 디자인된 전화 버튼입니다.  
기본적으로 어두운 남색(#251A49) 배경과 연한 회색 아이콘 및 테두리를 사용하며, **호버 시 밝은 회색 배경과 진한 회색 아이콘으로 전환됩니다.**

- 사이즈: \`58x31.6px\`
- 마우스 호버 시 시각적 피드백 제공
- 전화 아이콘은 완전한 SVG 커스터마이징 형태로 포함됨
- 다크 UI와 시각적으로 잘 어울리는 디자인 ☎️
        `,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PhoneButtonDark>;

export const 기본_다크_테마_전화_버튼: Story = {
  args: {
    onClick: () => alert('전화 버튼이 클릭되었습니다!'),
  },
};
