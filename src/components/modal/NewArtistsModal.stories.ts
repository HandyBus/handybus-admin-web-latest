import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import NewArtistsModal from './NewArtistsModal';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/NewArtistsModal',
  component: NewArtistsModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof NewArtistsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    isOpen: true,
    setIsOpen: fn(),
  },
};
