export enum EncryptionType {
  WPA = 'WPA',
  WEP = 'WEP',
  NONE = 'nopass'
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: EncryptionType;
  hidden: boolean;
}

export interface WelcomeCardState {
  generated: boolean;
  message: string;
  loading: boolean;
}

export interface PrintSettings {
  paperSize: 'A4' | 'Letter';
  cardsPerPage: number;
}
