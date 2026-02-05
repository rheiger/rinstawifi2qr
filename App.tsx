import React, { useState, useEffect } from 'react';
import { Wifi, Grip, Sparkles } from 'lucide-react';
import { WifiForm } from './components/WifiForm';
import { QrDisplay } from './components/QrDisplay';
import { PrintLayout } from './components/PrintLayout';
import { WifiData, EncryptionType, WelcomeCardState, Language, CustomMessages } from './types';
import { generateWelcomeMessage } from './services/geminiService';
import { PrintSettings } from './types';
import { detectLanguage, languageOptions, t } from './utils/i18n';

const APP_VERSION = 'V1.0.1';

const App: React.FC = () => {
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: '',
    password: '',
    encryption: EncryptionType.WPA,
    hidden: false,
  });

  const [cardState, setCardState] = useState<WelcomeCardState>({
    generated: false,
    messages: {},
    loading: false,
  });

  const [customMessages, setCustomMessages] = useState<CustomMessages>({});

  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    paperSize: 'A4',
    cardsPerPage: 4,
    languages: [detectLanguage()],
    languageMode: 'perCard',
  });

  const [uiLanguage, setUiLanguage] = useState<Language>(detectLanguage());
  const [showAbout, setShowAbout] = useState(false);

  // Reset card state when SSID changes significantly to encourage re-generation
  useEffect(() => {
    if (cardState.generated) {
       setCardState(prev => ({ ...prev, generated: false, messages: {} }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wifiData.ssid]);

  // Ensure selected languages include the UI language
  useEffect(() => {
    setPrintSettings(prev => {
      if (prev.languages.includes(uiLanguage)) return prev;
      const next = [uiLanguage, ...prev.languages].slice(0, 4);
      return { ...prev, languages: next };
    });
  }, [uiLanguage]);

  // Ensure enough cards when using per-card distribution
  useEffect(() => {
    setPrintSettings(prev => {
      if (prev.languageMode === 'perCard' && prev.cardsPerPage < prev.languages.length) {
        return { ...prev, cardsPerPage: prev.languages.length };
      }
      return prev;
    });
  }, [printSettings.languageMode, printSettings.languages]);

  const handleGenerateCard = async () => {
    if (!wifiData.ssid) return;
    
    setCardState(prev => ({ ...prev, loading: true }));
    
    const languagesToGenerate = printSettings.languages.length ? printSettings.languages : [uiLanguage];
    const entries = await Promise.all(
      languagesToGenerate.map(async (lang) => ({
        lang,
        message: customMessages[lang] && customMessages[lang]!.trim().length > 0
          ? customMessages[lang]!
          : await generateWelcomeMessage(wifiData.ssid, lang),
      }))
    );
    const messageMap: WelcomeCardState['messages'] = {};
    entries.forEach(({ lang, message }) => {
      messageMap[lang] = message;
    });
    
    setCardState({
      loading: false,
      generated: true,
      messages: messageMap,
    });
  };

  const isReady = wifiData.ssid.length > 0 && (wifiData.encryption === 'nopass' || wifiData.password.length > 0);

  useEffect(() => {
    if (!isReady || cardState.loading) return;
    const langs = printSettings.languages.length ? printSettings.languages : [uiLanguage];
    const missing = langs.filter(l => !customMessages[l] && !cardState.messages[l]);
    if (missing.length === 0) return;
    handleGenerateCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, wifiData.ssid, printSettings.languages]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Screen view only */}
      <div className="print-hide flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                {/* You can replace this Wifi icon with your logo image: <img src="logo.png" className="w-6 h-6" /> */}
                <Wifi size={20} strokeWidth={3} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                RinstaWiFi2QR
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              <Sparkles size={14} />
              <span>Offline welcome generator</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{APP_VERSION}</span>
              <select
                value={uiLanguage}
                onChange={(e) => setUiLanguage(e.target.value as Language)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white"
              >
                {languageOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.flag} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column: Input */}
              <div className="lg:col-span-7 space-y-6">
                <div className="mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 mb-3">{t(uiLanguage, 'heroTitle')}</h1>
                  <p className="text-slate-600 text-lg">
                    {t(uiLanguage, 'heroSubtitle')}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm">
                  <div className="font-semibold">{t(uiLanguage, 'apologyTitle')}</div>
                  <div>{t(uiLanguage, 'apologyBody')}</div>
                </div>
                
                <WifiForm wifiData={wifiData} setWifiData={setWifiData} language={uiLanguage} />
                
                {/* Instructions / Tips */}
                <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 text-sm text-slate-600 space-y-3">
                   <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                     <Grip size={16} />
                     {t(uiLanguage, 'howItWorks')}
                   </h4>
                   <ul className="list-disc pl-5 space-y-1 ml-1">
                     {(t(uiLanguage, 'howItWorksSteps') as string[]).map((step, idx) => (
                       <li key={idx}>{step}</li>
                     ))}
                   </ul>
                </div>
              </div>

              {/* Right Column: Preview & Actions */}
              <div className="lg:col-span-5">
                <div className="sticky top-24">
                  <QrDisplay 
                    wifiData={wifiData} 
                    cardState={cardState}
                    onGenerateCard={handleGenerateCard}
                    printSettings={printSettings}
                    setPrintSettings={setPrintSettings}
                    language={uiLanguage}
                    customMessages={customMessages}
                    setCustomMessages={setCustomMessages}
                  />
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} RinstaWiFi2QR. {t(uiLanguage, 'footerText')}
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <span>{t(uiLanguage, 'ideaBy')}</span>
              <a href="mailto:richie.eiger@gmail.com" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-600">
                Richie
              </a>
            </p>
            <button
              onClick={() => setShowAbout(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-600"
            >
              {t(uiLanguage, 'about')}
            </button>
          </div>
        </footer>
      </div>
      <PrintLayout
        wifiData={wifiData}
        cardState={cardState}
        printSettings={printSettings}
        language={uiLanguage}
        customMessages={customMessages}
      />

      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t(uiLanguage, 'aboutTitle')}</h2>
                <p className="text-sm text-slate-600 mt-1">{t(uiLanguage, 'aboutBody')}</p>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold text-slate-800">{t(uiLanguage, 'revisionHistory')}</div>
              <div className="mt-2 text-sm text-slate-700 space-y-1">
                <div><strong>V1.0.1</strong> – Fix Wi‑Fi QR encoding order/compatibility. Add multilingual UI, print options, and message overrides.</div>
                <div><strong>V1.0.0</strong> – Initial release.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
