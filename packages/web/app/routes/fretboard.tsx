import { useState } from 'react';
import { Fretboard, FretboardControls, useFretboard } from '~/features/fretboard';
import { SITE_TITLE } from '~/config';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { useI18n } from '~/lib/i18n';

/* eslint react-refresh/only-export-components: 0 */
export function meta() {
  return [
    { title: `フレットボード - ${SITE_TITLE}` },
    { name: 'description', content: 'ギター・ベースのフレットボード表示とスケール・コード学習ツール' },
  ];
}

export default function FretboardPage() {
  const { t } = useI18n();
  const [showInterval, setShowInterval] = useState(true);

  const { config, notes, setKey, setScaleType, setChordType, setChordKey } = useFretboard({
    stringCount: 6,
    key: 'C',
    scaleType: 'major',
  });

  return (
    <div className="relative space-y-6 py-8">
      {/* フレットボード表示 */}
      <div className="p-6">
        <Fretboard config={config} notes={notes} showInterval={showInterval} className="lg:pl-96" />
      </div>

      {/* サイドバー - 設定カード（デスクトップで絶対配置、モバイルで通常配置） */}
      <div className="lg:fixed lg:top-32 lg:left-8 lg:z-10 lg:w-80">
        <div className="lg:container-none container mx-auto px-4 lg:mx-0 lg:px-0">
          <Card className="!bg-card/90 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">{t('settings', { ns: 'fretboard' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FretboardControls
                selectedKey={config.key}
                scaleType={config.scaleType}
                chordType={config.chordType}
                chordKey={config.chordKey}
                onKeyChange={setKey}
                onScaleTypeChange={setScaleType}
                onChordTypeChange={setChordType}
                onChordKeyChange={setChordKey}
              />

              <div className="border-border border-t pt-4">
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{t('displaySettings', { ns: 'fretboard' })}</h3>
                  <label className="group flex cursor-pointer items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={showInterval}
                      onChange={(e) => setShowInterval(e.target.checked)}
                      className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                      {t('showDegrees', { ns: 'fretboard' })}
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
