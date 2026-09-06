import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { FieldWrapperProps } from './field-container';

/**
 * Base props for every form field component.
 *
 * Fields take `control` + `name` and call `useController` themselves rather
 * than being wrapped in a render-prop `<FormField>`. That keeps each field a
 * single self-contained component and keeps call sites flat.
 *
 * Intersect it to add field-specific props:
 *
 *   type MyFieldProps<T extends FieldValues> = FormFieldProps<T> & { ... };
 */
export type FormFieldProps<TFieldValues extends FieldValues> = {
  /** react-hook-form control object. */
  control: Control<TFieldValues>;
  /** Field name path in the form. */
  name: FieldPath<TFieldValues>;
  /** Label and description chrome. */
  containerProps?: FieldWrapperProps;
};
