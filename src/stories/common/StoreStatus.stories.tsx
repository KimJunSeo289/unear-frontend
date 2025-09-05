import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreStatus from '@/components/common/StoreStatus';

const meta: Meta<typeof StoreStatus> = {
  title: 'Common/StoreStatus',
  component: StoreStatus,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'radio',
      options: ['영업중', '영업종료', '필수 매장', '이벤트 매장'],
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StoreStatus>;

export const Open: Story = {
  args: {
    status: '영업중',
  },
};

export const Closed: Story = {
  args: {
    status: '영업종료',
  },
};

export const MustVisit: Story = {
  args: {
    status: '필수 매장',
  },
};

export const EventStore: Story = {
  args: {
    status: '이벤트 매장',
  },
};

export const CustomStyled: Story = {
  args: {
    status: '영업종료',
    className: 'scale-90 shadow-md',
  },
};
