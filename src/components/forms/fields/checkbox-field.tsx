'use client';

import { useController } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FieldContainer } from '../common/field-container';
import type { FormFieldProps } from '../common/form-field-types';
import type { InputState } from '../common/types';

type CheckboxFieldProps<TFieldValues extends FieldValues> = Omit<
  FormFieldProps<TFieldValues>,
  'containerProps'
> & {
  /** Rendered beside the checkbox rather than above it. */
  label: string;
  description?: string;
  state?: InputState;
  disabled?: boolean;
};

/**
 * Checkboxes put their label to the right of the control, so this field owns
 * its own layout instead of delegating the label to `FieldContainer`.
 */
export function CheckboxField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  state: stateProp,
  disabled,
}: CheckboxFieldProps<TFieldValues>) {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({ control, name });

  const state = stateProp ?? (error ? 'error' : 'idle');

  return (
    <FieldContainer description={description} errorMessage={error?.message} state={state}>
      {({ controlId, describedBy }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            aria-describedby={describedBy}
            aria-invalid={state === 'error' || undefined}
            checked={Boolean(value)}
            disabled={disabled}
            id={controlId}
            name={name}
            onCheckedChange={onChange}
            ref={ref}
          />
          <Label className="text-body-1 font-normal" htmlFor={controlId}>
            {label}
          </Label>
        </div>
      )}
    </FieldContainer>
  );
}
