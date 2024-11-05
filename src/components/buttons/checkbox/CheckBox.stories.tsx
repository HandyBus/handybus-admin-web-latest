import { Meta, StoryObj } from '@storybook/react';
import CheckBox from './CheckBox';

const meta: Meta<typeof CheckBox> = {
  title: 'Components/buttons/CheckBox',
  component: CheckBox,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CheckBox>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
  },
};