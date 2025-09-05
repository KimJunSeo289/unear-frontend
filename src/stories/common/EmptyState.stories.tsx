import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from '@/components/common/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Common/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**EmptyState** 컴포넌트는 데이터가 없을 때 사용자에게 안내 메시지를 보여주기 위한 UI입니다.  
중앙에 아이콘(또는 일러스트 이미지)과 안내 문구가 수직 정렬되어 있으며,  
반응형 레이아웃으로 다양한 빈 상태 화면에서 재사용할 수 있습니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const 기본_빈_상태_화면: Story = {};
