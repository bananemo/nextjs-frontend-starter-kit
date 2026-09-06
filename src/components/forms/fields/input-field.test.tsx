import { NextIntlClientProvider } from 'next-intl';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import messages from '@/locales/en.json';
import { InputField } from './input-field';

type Values = { name: string; headcount: number };

function Harness({ numeric = false }: { numeric?: boolean }) {
  const { control, reset } = useForm<Values>({
    defaultValues: { name: '', headcount: 1 },
  });

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {numeric ? (
        <InputField
          containerProps={{ label: 'Team size', description: 'How many people' }}
          control={control}
          name="headcount"
          numeric
        />
      ) : (
        <InputField containerProps={{ label: 'Name' }} control={control} name="name" />
      )}
      <button
        onClick={() => {
          reset({ name: '', headcount: 42 });
        }}
        type="button"
      >
        External reset
      </button>
    </NextIntlClientProvider>
  );
}

describe(InputField, () => {
  it('associates the label with the control', async () => {
    await render(<Harness />);

    await expect.element(page.getByLabelText('Name')).toBeInTheDocument();
  });

  it('exposes the description to assistive technology', async () => {
    await render(<Harness numeric />);

    const input = page.getByLabelText('Team size');
    const describedBy = input.element().getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.querySelector(`#${describedBy}`)?.textContent).toBe('How many people');
  });

  /*
   * Each of these parses to NaN or to a number whose string form differs from
   * what was typed. A naive `===` resync erases the in-progress character.
   */
  it.each([
    ['a trailing decimal point', '12.'],
    ['a lone minus sign', '-'],
    ['a signed decimal in progress', '-5.'],
    ['a leading decimal point', '.5'],
    ['exponent notation in progress', '1e'],
  ])('preserves %s while typing', async (_label, typed) => {
    await render(<Harness numeric />);

    const input = page.getByLabelText('Team size');
    await userEvent.clear(input);
    await userEvent.type(input, typed);

    await expect.element(input).toHaveValue(typed);
  });

  it('accepts a fully typed negative number', async () => {
    await render(<Harness numeric />);

    const input = page.getByLabelText('Team size');
    await userEvent.clear(input);
    await userEvent.type(input, '-5');

    await expect.element(input).toHaveValue('-5');
  });

  it('still adopts a value set from outside the field', async () => {
    await render(<Harness numeric />);

    const input = page.getByLabelText('Team size');
    await userEvent.clear(input);
    await userEvent.type(input, '7');
    await userEvent.click(page.getByRole('button', { name: 'External reset' }));

    await expect.element(input).toHaveValue('42');
  });

  it('clears to empty rather than showing NaN', async () => {
    await render(<Harness numeric />);

    const input = page.getByLabelText('Team size');
    await userEvent.clear(input);

    await expect.element(input).toHaveValue('');
  });
});
