import type { Meta, StoryObj } from '@storybook/react-vite';
import MiniLocationButton from '@/components/common/MiniLocationButton';

const meta: Meta<typeof MiniLocationButton> = {
  title: 'Common/MiniLocationButton',
  component: MiniLocationButton,
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
**MiniLocationButton** 컴포넌트는 위치 정보를 보여주기 위한 작고 심플한 버튼입니다.

- 핫핑크 테두리, 아이콘, 텍스트 구성
- **마우스 호버 시** 배경색은 \`pink-50\`, 텍스트 및 아이콘 색상은 더 진한 핑크(\`pink-600\`)로 변경됩니다.
- 모바일이나 간단한 위치 정보 인터랙션에 적합한 버튼입니다. 📍
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MiniLocationButton>;

export const 기본_위치_보기_버튼: Story = {
  args: {
    onClick: () => alert('위치 보기 버튼이 클릭되었습니다!'),
  },
};
