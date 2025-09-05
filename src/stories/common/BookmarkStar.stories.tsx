import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkStar from '@/components/common/BookmarkStar';

const meta: Meta<typeof BookmarkStar> = {
  title: 'Common/BookmarkStar',
  component: BookmarkStar,
  tags: ['autodocs'],
  argTypes: {
    isBookmarked: {
      control: 'boolean',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    className: {
      control: 'text',
    },
    onToggle: { action: 'toggled' },
  },
};

export default meta;
type Story = StoryObj<typeof BookmarkStar>;

export const Default: Story = {
  args: {
    isBookmarked: false,
    size: 'md',
  },
};

export const Bookmarked: Story = {
  args: {
    isBookmarked: true,
    size: 'md',
    onToggle: (val) => console.log('toggled:', val),
  },
};

export const Small: Story = {
  args: {
    isBookmarked: false,
    size: 'sm',
    onToggle: (val) => console.log('toggled:', val),
  },
};

export const Large: Story = {
  args: {
    isBookmarked: true,
    size: 'lg',
    onToggle: (val) => console.log('toggled:', val),
  },
};

export const CustomStyled: Story = {
  args: {
    isBookmarked: false,
    size: 'md',
    onToggle: (val) => console.log('toggled:', val),
    className: 'scale-90 shadow-md',
  },
};
