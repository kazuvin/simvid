import { SITE_TITLE } from '~/config';
import { OklchGenerator } from '~/features/oklch-generator';
import { useI18n } from '~/lib/i18n';

/* eslint react-refresh/only-export-components: 0 */
export function meta() {
  return [{ title: SITE_TITLE }, { name: 'description', content: `Welcome to ${SITE_TITLE}` }];
}

export default function Home() {
  const { t, ready } = useI18n();

  if (!ready) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{t('messages.loading')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <OklchGenerator />
    </div>
  );
}
