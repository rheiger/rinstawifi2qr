import { WifiData, EncryptionType } from '../types';

const escapeString = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');

export const buildWifiQrValue = (wifiData: WifiData) => {
  const ssid = escapeString(wifiData.ssid);
  const pass = escapeString(wifiData.password);
  const parts = [`WIFI:T:${wifiData.encryption}`, `S:${ssid}`];

  if (wifiData.encryption !== EncryptionType.NONE && pass) {
    parts.push(`P:${pass}`);
  }
  if (wifiData.hidden) {
    parts.push('H:true');
  }

  return `${parts.join(';')};;`;
};
