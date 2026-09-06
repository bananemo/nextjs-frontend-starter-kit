import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import { JsonLd } from '@/lib/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';

const FEATURE_KEYS = ['ui', 'forms', 'observability', 'analytics', 'i18n', 'seo'] as const;

export default async function HomePage() {
  const t = await getTranslations('Home');

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-heading-1">{t('title')}</h1>
          <p className="text-body-1 text-muted-foreground">{t('subtitle')}</p>
          <div>
            <Button asChild>
              <Link href="/demo/form">
                {t('demoFormLink')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-3">{t('features.heading')}</h2>
          <ul className="flex flex-col gap-2">
            {FEATURE_KEYS.map((key) => (
              <li className="text-body-1 text-muted-foreground" key={key}>
                {t(`features.${key}`)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
