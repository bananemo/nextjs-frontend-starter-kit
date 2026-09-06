import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-6 py-16">
      <h1 className="text-heading-2">{t('title')}</h1>
      <p className="text-body-1 text-muted-foreground">{t('description')}</p>
      <Button asChild variant="outline">
        <Link href="/">{t('backHome')}</Link>
      </Button>
    </div>
  );
}
