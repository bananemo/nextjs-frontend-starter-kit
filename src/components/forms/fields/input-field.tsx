'use client';

import { cn } from 'cn';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import type { Except } from 'type-fest';
import { Input } from '@/components/ui/input';
import { FieldContainer } from '../common/field-container';
import type { FormFieldProps } from '../common/form-field-types';
import type { InputState } from '../common/types';

type InputFieldProps<TFieldValues extends FieldValues> = Except<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'name'
> &
  FormFieldProps<TFieldValues> & {
    state?: InputState;
    /** Store the value as a number rather than a string. */
    numeric?: boolean;
  };

/** Renders a stored numeric value as editable text, tolerating empty and NaN. */
function formatNumeric(value: unknown): string {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? '' : String(value);
  }
  // react-hook-form may hand back the raw string before the first conversion.
  return typeof value === 'string' ? value : '';
}

export function InputField<TFieldValues extends FieldValues>({
  control,
  name,
  containerProps,
  state: stateProp,
  numeric,
  className,
  ...inputProps
}: InputFieldProps<TFieldValues>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name });

  const state = stateProp ?? (error ? 'error' : 'idle');

  /*
   * Numeric fields keep their own raw text. Without it, typing "1." or "-"
   * converts to NaN and the character vanishes from under the cursor.
   * Validation still runs against the numeric value.
   */
  const [rawText, setRawText] = useState(() => (numeric ? formatNumeric(value) : ''));

  /*
   * Resync when the value changes from outside the field, e.g. `reset()`.
   *
   * This has to be an effect rather than a render-phase comparison:
   * react-hook-form propagates the new value through its own store, so during
   * the render immediately after `onChange` the `value` here is still the
   * previous one. Syncing then would clobber the text the user just typed —
   * "12." would snap back to "12". By the time the effect runs, the store has
   * settled. This is the external-system synchronisation an effect is for.
   */
  useEffect(() => {
    if (numeric) {
      // oxlint-disable-next-line react/set-state-in-effect -- see note above
      setRawText((prev) => {
        /*
         * Compare what the text currently *means* against the stored value.
         * `Object.is` rather than `===` because partial input like "-" or "1e"
         * parses to NaN, and `NaN === NaN` is false — which would erase the
         * character the user just typed.
         */
        const parsed = prev.trim() === '' ? undefined : Number(prev);
        return Object.is(parsed, value) ? prev : formatNumeric(value);
      });
    }
  }, [numeric, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    if (!numeric) {
      onChange(text);
      return;
    }

    setRawText(text);
    // NaN for partial input; zod rejects it until the field is complete.
    onChange(text === '' ? undefined : Number(text));
  };

  return (
    <FieldContainer {...containerProps} errorMessage={error?.message} state={state}>
      {({ controlId, describedBy }) => (
        <Input
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' || undefined}
          className={cn(className)}
          id={controlId}
          inputMode={numeric ? 'decimal' : inputProps.inputMode}
          name={name}
          onBlur={onBlur}
          onChange={handleChange}
          ref={ref}
          value={numeric ? rawText : (value ?? '')}
        />
      )}
    </FieldContainer>
  );
}
