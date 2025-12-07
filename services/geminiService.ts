import { Language } from '../types';
import { getRandomPhrase } from '../utils/phrases';

export const generateWelcomeMessage = async (ssid: string, language: Language): Promise<string> => {
  return getRandomPhrase(language, ssid);
};
