'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';
import { ContactFormFields, contactFormSchema } from './contact-form-fields';
import type { ContactFormValues } from './contact-form-fields';

const DEFAULT_VALUES: ContactFormValues = {
  name: '',
  email: '',
  role: 'engineer',
  headcount: 1,
};

/**
 * The page owns the form state and decides what submitting means; the fields
 * module owns the schema and the inputs.
 *
 * Submission here just confirms the validated values — this is a starter, and
 * where the data goes is your project's decision. See the README for the two
 * options that keep the app frontend-only.
 */
export function ContactForm() {
  const t = useTranslations('DemoForm');

  const { control, handleSubmit, formState } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit((values) => {
    track('demo_form_submitted', { role: values.role });
    toast.success(t('submitted', { name: values.name }));
  });

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
      <ContactFormFields control={control} />

      <div>
        <Button disabled={formState.isSubmitting} type="submit">
          {t('submit')}
        </Button>
      </div>
    </form>
  );
}
