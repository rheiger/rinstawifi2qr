const templates = [
  'Welcome to {ssid}! Feel free to hop on and enjoy the bandwidth.',
  '{ssid} is open for you—scan the code, grab a seat, and get comfy.',
  'Glad you are here at {ssid}. Connect and make yourself at home.',
  'Jump onto {ssid} and settle in. The good vibes are on the house.',
  '{ssid} is ready—connect, relax, and enjoy a fast, reliable signal.',
];

const pickTemplate = (ssid: string) => {
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx].replace('{ssid}', ssid);
};

export const generateWelcomeMessage = async (ssid: string): Promise<string> => {
  if (!ssid.trim()) {
    return 'Welcome! Connect and enjoy the fast lane.';
  }

  // Keep async signature for future API use without requiring a key today.
  return pickTemplate(ssid);
};
