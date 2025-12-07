import React, { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { WifiData, WelcomeCardState, PrintSettings } from '../types';

interface QrDisplayProps {
  wifiData: WifiData;
  cardState: WelcomeCardState;
  onGenerateCard: () => void;
  printSettings: PrintSettings;
  setPrintSettings: React.Dispatch<React.SetStateAction<PrintSettings>>;
}

export const QrDisplay: React.FC<QrDisplayProps> = ({ wifiData, cardState, onGenerateCard, printSettings, setPrintSettings }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // QR Format: WIFI:T:WPA;S:mynetwork;P:mypass;;
  const escapeString = (str: string) => {
    return str.replace(/([\\;,:"])/g, '\\$1');
  };

  const qrValue = `WIFI:T:${wifiData.encryption};S:${escapeString(wifiData.ssid)};P:${escapeString(wifiData.password)};H:${wifiData.hidden};;`;

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const styleId = 'print-page-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@page { size: ${printSettings.paperSize}; margin: 12mm; }`;
    return () => {
      styleEl?.parentNode?.removeChild(styleEl);
    };
  }, [printSettings.paperSize]);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `wifi-qr-${wifiData.ssid || 'network'}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isReady = wifiData.ssid.length > 0 && (wifiData.encryption === 'nopass' || wifiData.password.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Screen View */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {!isReady ? (
          <div className="p-12 flex flex-col items-center text-center text-slate-400">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <AlertCircle size={32} />
             </div>
             <p className="text-lg">Enter network details to generate QR code</p>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center">
            <div ref={qrRef} className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-inner mb-6">
              <QRCodeCanvas
                value={qrValue}
                size={220}
                level="Q"
                bgColor={"#ffffff"}
                fgColor={"#0f172a"}
                includeMargin={true}
                imageSettings={{
                  src: "https://cdn-icons-png.flaticon.com/512/93/93158.png", // Generic Wifi Icon
                  x: undefined,
                  y: undefined,
                  height: 34,
                  width: 34,
                  excavate: true,
                }}
              />
            </div>
            
            <div className="text-center mb-8 w-full">
               <h3 className="text-xl font-bold text-slate-900 mb-1">{wifiData.ssid}</h3>
               {wifiData.encryption !== 'nopass' && (
                 <p className="font-mono text-slate-500 bg-slate-100 py-1 px-3 rounded-full text-sm inline-block">
                   {wifiData.password}
                 </p>
               )}
            </div>

            {/* AI Card Section */}
            <div className="w-full bg-indigo-50/50 rounded-xl p-4 mb-6 border border-indigo-100">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm">
                   <Sparkles size={16} className="text-indigo-500" />
                   Welcome Card
                 </div>
              </div>
              
              {cardState.loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-2 bg-indigo-200 rounded"></div>
                    <div className="h-2 bg-indigo-200 rounded w-5/6"></div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 italic text-sm mb-3">
                  "{cardState.generated ? cardState.message : 'Generate a unique welcome message for your guests...'}"
                </p>
              )}
              
              {!cardState.generated && !cardState.loading && (
                 <button 
                  onClick={onGenerateCard}
                  className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors w-full"
                 >
                   Generate Welcome Message
                 </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                <Download size={18} />
                Save Image
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
              >
                <Printer size={18} />
                Print Card
              </button>
            </div>

            <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <label className="text-slate-700 font-medium">Paper size</label>
                <select
                  value={printSettings.paperSize}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, paperSize: e.target.value as PrintSettings['paperSize'] }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-700 font-medium">Cards per page</label>
                <select
                  value={printSettings.cardsPerPage}
                  onChange={(e) => setPrintSettings(prev => ({ ...prev, cardsPerPage: Number(e.target.value) }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                  {[1,2,4,6,8,9,12].map(count => (
                    <option key={count} value={count}>{count}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1">
          <Share2 size={12} />
          Your Wi-Fi details are processed locally and never sent to a server.
        </p>
      </div>
    </div>
  );
};
