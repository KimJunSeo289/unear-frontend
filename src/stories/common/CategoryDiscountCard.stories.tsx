import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryDiscountCard from '@/components/common/CategoryDiscountCard';

const meta: Meta<typeof CategoryDiscountCard> = {
  title: 'Common/CategoryDiscountCard',
  component: CategoryDiscountCard,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [
        'cafe',
        'food',
        'shopping',
        'education',
        'culture',
        'bakery',
        'beauty',
        'convenience',
        'activity',
        'popup',
      ],
    },
    categoryName: { control: 'text' },
    discountPercentage: { control: 'number' },
    discountAmount: { control: 'number' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryDiscountCard>;

export const Default: Story = {
  args: {
    category: 'food',
    categoryName: '외식',
    discountPercentage: 42,
    discountAmount: 8904,
  },
};

export const Cafe: Story = {
  args: {
    category: 'cafe',
    categoryName: '카페',
    discountPercentage: 35,
    discountAmount: 12500,
  },
};

export const Shopping: Story = {
  args: {
    category: 'shopping',
    categoryName: '쇼핑',
    discountPercentage: 28,
    discountAmount: 15600,
  },
};

export const CustomStyled: Story = {
  args: {
    category: 'beauty',
    categoryName: '뷰티',
    discountPercentage: 50,
    discountAmount: 25000,
    className: 'border-2 border-primary shadow-md',
  },
};
