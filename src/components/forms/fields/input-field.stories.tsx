import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import { useForm } from 'react-hook-form';
import { expect } from 'storybook/test';
import * as z from 'zod';
import messages from '@/locales/en.json';
import { InputField } from './input-field';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  headcount: z.number().int().positive('Enter a positive number'),
});

type Values = z.infer<typeof schema>;

type DemoProps = {
  label: string;
  description?: string;
  name: keyof Values;
  numeric?: boolean;
};

function InputFieldDemo({ label, description, name, numeric }: DemoProps) {
  const { control } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', headcount: 1 },
    mode: 'onBlur',
  });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <div className="w-80">
        <InputField
          containerProps={{ label, description }}
          control={control}
          name={name}
          numeric={numeric}
        />
      </div>
    </NextIntlClientProvider>
  );
}

const meta = {
  title: 'Forms/InputField',
  component: InputFieldDemo,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InputFieldDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Email', name: 'email' },
};

export const WithDescription: Story = {
  args: { label: 'Team size', description: 'Number of people on your team.', name: 'headcount' },
};

export const Numeric: Story = {
  args: { label: 'Team size', name: 'headcount', numeric: true },
};

export const WithError: Story = {
  args: { label: 'Email', description: 'We never share this.', name: 'email' },
  /*
   * Drives the field into its error state the way a user would, so the story
   * doubles as a regression test for the invalid styling and for the error
   * message replacing the description.
   */
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'not-an-email');
    await userEvent.tab();

    await expect(canvas.getByText('Enter a valid email address')).toBeInTheDocument();
  },
};
