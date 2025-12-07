export enum EncryptionType {
  WPA = 'WPA',
  WEP = 'WEP',
  NONE = 'nopass'
}

export type Language = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt' | 'pl' | 'sk' | 'nl' | 'dk' | 'no' | 'se' | 'fi';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: EncryptionType;
  hidden: boolean;
}

export interface WelcomeCardState {
  generated: boolean;
  messages: Partial<Record<Language, string>>;
  loading: boolean;
}

export interface PrintSettings {
  paperSize: 'A4' | 'Letter';
  cardsPerPage: number;
  languages: Language[];
  languageMode: 'all' | 'perCard';
}
