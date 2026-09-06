import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/demo/contact-form';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'DemoForm' });

  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: '/demo/form',
    locale,
  });
}

export default async function DemoFormPage() {
  const t = await getTranslations('DemoForm');

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-2">{t('title')}</h1>
        <p className="text-body-1 text-muted-foreground">{t('description')}</p>
      </div>
      <ContactForm />
    </div>
  );
}
