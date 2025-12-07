import React, { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { WifiData, WelcomeCardState, PrintSettings, Language } from '../types';
import { t } from '../utils/i18n';
import { getRandomPhrase } from '../utils/phrases';

interface PrintLayoutProps {
  wifiData: WifiData;
  cardState: WelcomeCardState;
  printSettings: PrintSettings;
  language: Language;
}

const escapeString = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');

const qrValueFromWifi = (wifiData: WifiData) =>
  `WIFI:T:${wifiData.encryption};S:${escapeString(wifiData.ssid)};P:${escapeString(wifiData.password)};H:${wifiData.hidden};;`;

const columnsForCount = (count: number) => {
  if (count >= 10) return 4;
  if (count >= 7) return 4;
  if (count >= 5) return 3;
  if (count >= 3) return 2;
  return 1;
};

export const PrintLayout: React.FC<PrintLayoutProps> = ({ wifiData, cardState, printSettings, language }) => {
  const isReady = wifiData.ssid.length > 0 && (wifiData.encryption === 'nopass' || wifiData.password.length > 0);
  const qrValue = useMemo(() => qrValueFromWifi(wifiData), [wifiData]);
  const languages = printSettings.languages.length ? printSettings.languages : [language];
  const cards =
    printSettings.languageMode === 'perCard'
      ? Array.from({ length: printSettings.cardsPerPage }, (_, idx) => languages[idx % languages.length])
      : Array.from({ length: printSettings.cardsPerPage }, () => 'all');
  const columns = columnsForCount(printSettings.cardsPerPage);

  if (!isReady) {
    return (
      <div className="hidden print-only p-10 text-center">
        <p className="text-lg">{t(language, 'enterDetails')}</p>
      </div>
    );
  }

  return (
    <div className="hidden print-only p-8">
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {cards.map((langCode, idx) => {
          const isAll = langCode === 'all';
          const perCardLangs = isAll ? languages : [langCode as Language];
          return (
          <div
            key={idx}
            className="border-2 border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between h-full"
          >
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold mb-1">Wi-Fi</h1>
              <div className="space-y-1">
                {perCardLangs.map((langItem) => {
                  const msg =
                    getRandomPhrase(langItem as Language, wifiData.ssid) ||
                    cardState.messages[langItem as Language] ||
                    cardState.messages.en ||
                    t(language, 'welcomePlaceholder');
                  return (
                    <p key={langItem} className="text-sm text-slate-700 italic">
                      {msg}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <QRCodeCanvas
                value={qrValue}
                size={160}
                level="Q"
                includeMargin={true}
                imageSettings={{
                  src: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
                  x: undefined,
                  y: undefined,
                  height: 30,
                  width: 30,
                  excavate: true,
                }}
              />
            </div>

            <div className="w-full border-t border-slate-300 pt-3 text-left">
              <p className="text-sm font-mono mb-1"><strong>{t(language, 'ssidLabel')}:</strong> {wifiData.ssid}</p>
              {wifiData.encryption !== 'nopass' && (
                <p className="text-sm font-mono"><strong>{t(language, 'passwordShown')}:</strong> {wifiData.password}</p>
              )}
              {wifiData.hidden && (
                <p className="text-xs text-slate-500 mt-1">{t(language, 'hiddenNetwork')}</p>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};
