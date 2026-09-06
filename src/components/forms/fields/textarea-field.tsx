'use client';

import { cn } from 'cn';
import { useController } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import type { Except } from 'type-fest';
import { Textarea } from '@/components/ui/textarea';
import { FieldContainer } from '../common/field-container';
import type { FormFieldProps } from '../common/form-field-types';
import type { InputState } from '../common/types';

type TextareaFieldProps<TFieldValues extends FieldValues> = Except<
  React.ComponentProps<typeof Textarea>,
  'value' | 'onChange' | 'onBlur' | 'name'
> &
  FormFieldProps<TFieldValues> & { state?: InputState };

export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  containerProps,
  state: stateProp,
  className,
  ...textareaProps
}: TextareaFieldProps<TFieldValues>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name });

  const state = stateProp ?? (error ? 'error' : 'idle');

  return (
    <FieldContainer {...containerProps} errorMessage={error?.message} state={state}>
      {({ controlId, describedBy }) => (
        <Textarea
          {...textareaProps}
          aria-describedby={describedBy}
          aria-invalid={state === 'error' || undefined}
          className={cn(className)}
          id={controlId}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          value={value ?? ''}
        />
      )}
    </FieldContainer>
  );
}
