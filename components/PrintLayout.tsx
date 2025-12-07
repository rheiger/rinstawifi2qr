import React, { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { WifiData, WelcomeCardState, PrintSettings } from '../types';

interface PrintLayoutProps {
  wifiData: WifiData;
  cardState: WelcomeCardState;
  printSettings: PrintSettings;
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

export const PrintLayout: React.FC<PrintLayoutProps> = ({ wifiData, cardState, printSettings }) => {
  const isReady = wifiData.ssid.length > 0 && (wifiData.encryption === 'nopass' || wifiData.password.length > 0);
  const qrValue = useMemo(() => qrValueFromWifi(wifiData), [wifiData]);
  const cards = Array.from({ length: printSettings.cardsPerPage }, (_, idx) => idx);
  const columns = columnsForCount(printSettings.cardsPerPage);

  if (!isReady) {
    return (
      <div className="hidden print-only p-10 text-center">
        <p className="text-lg">Add network details and regenerate the QR code before printing.</p>
      </div>
    );
  }

  return (
    <div className="hidden print-only p-8">
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {cards.map((idx) => (
          <div
            key={idx}
            className="border-2 border-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between h-full"
          >
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold mb-1">Wi-Fi Network</h1>
              <p className="text-sm text-slate-700 italic">
                {cardState.generated ? cardState.message : 'Scan to connect'}
              </p>
            </div>

            <div className="flex justify-center mb-4">
              <QRCodeCanvas
                value={qrValue}
                size={160}
                level="Q"
                includeMargin={true}
              />
            </div>

            <div className="w-full border-t border-slate-300 pt-3 text-left">
              <p className="text-sm font-mono mb-1"><strong>Network:</strong> {wifiData.ssid}</p>
              {wifiData.encryption !== 'nopass' && (
                <p className="text-sm font-mono"><strong>Password:</strong> {wifiData.password}</p>
              )}
              {wifiData.hidden && (
                <p className="text-xs text-slate-500 mt-1">Hidden network</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
