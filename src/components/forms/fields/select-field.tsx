'use client';

import { useController } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldContainer } from '../common/field-container';
import type { FormFieldProps } from '../common/form-field-types';
import type { InputState } from '../common/types';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps<TFieldValues extends FieldValues> = FormFieldProps<TFieldValues> & {
  options: SelectOption[];
  placeholder?: string;
  state?: InputState;
  disabled?: boolean;
};

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  containerProps,
  options,
  placeholder,
  state: stateProp,
  disabled,
}: SelectFieldProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name });

  const state = stateProp ?? (error ? 'error' : 'idle');

  return (
    <FieldContainer {...containerProps} errorMessage={error?.message} state={state}>
      {({ controlId, describedBy }) => (
        <Select disabled={disabled} onValueChange={onChange} value={value ?? ''}>
          <SelectTrigger
            aria-describedby={describedBy}
            aria-invalid={state === 'error' || undefined}
            className="w-full"
            id={controlId}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldContainer>
  );
}
