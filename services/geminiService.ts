import { Language } from '../types';
import { phrasesByLanguage } from '../utils/phrases';

export const generateWelcomeMessage = async (ssid: string, language: Language): Promise<string> => {
  const templates = phrasesByLanguage[language] || phrasesByLanguage.en;
  if (!templates || templates.length === 0) {
    return 'Welcome! Connect and enjoy the fast lane.';
  }
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx].replace('{ssid}', ssid || 'Wi-Fi');
};
