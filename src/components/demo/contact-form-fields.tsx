'use client';

import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';
import * as z from 'zod';
import { InputField } from '@/components/forms/fields/input-field';
import { SelectField } from '@/components/forms/fields/select-field';

/**
 * Schema and fields live together, separate from the page that owns the form
 * state. The page decides what submitting means; this module decides what the
 * data is and how it is captured.
 */

/*
 * Mapped to literal message keys rather than built by interpolation, so the
 * typed-message augmentation can verify each one exists.
 */
const ROLE_LABEL_KEYS = {
  engineer: 'roleEngineer',
  designer: 'roleDesigner',
  other: 'roleOther',
} as const;

const ROLES = ['engineer', 'designer', 'other'] as const satisfies (keyof typeof ROLE_LABEL_KEYS)[];

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  role: z.enum(ROLES, { message: 'Select a role' }),
  /*
   * `z.coerce.number()` has an input type of `unknown`, which violates
   * react-hook-form's FieldValues constraint. Use `z.number()` and let
   * InputField's `numeric` prop do the conversion.
   */
  headcount: z.number().int().positive('Enter a positive number'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactFormFields({ control }: { control: Control<ContactFormValues> }) {
  const t = useTranslations('DemoForm');

  return (
    <div className="flex flex-col gap-5">
      <InputField
        containerProps={{ label: t('name') }}
        control={control}
        name="name"
        placeholder={t('namePlaceholder')}
      />

      <InputField
        containerProps={{ label: t('email') }}
        control={control}
        name="email"
        placeholder={t('emailPlaceholder')}
        type="email"
      />

      <SelectField
        containerProps={{ label: t('role') }}
        control={control}
        name="role"
        options={Object.entries(ROLE_LABEL_KEYS).map(([role, labelKey]) => ({
          value: role,
          label: t(labelKey),
        }))}
        placeholder={t('rolePlaceholder')}
      />

      <InputField
        containerProps={{ label: t('headcount'), description: t('headcountDescription') }}
        control={control}
        name="headcount"
        numeric
      />
    </div>
  );
}
