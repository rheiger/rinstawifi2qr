import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { WifiData, WelcomeCardState } from '../types';

interface QrDisplayProps {
  wifiData: WifiData;
  cardState: WelcomeCardState;
  onGenerateCard: () => void;
}

export const QrDisplay: React.FC<QrDisplayProps> = ({ wifiData, cardState, onGenerateCard }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  // QR Format: WIFI:T:WPA;S:mynetwork;P:mypass;;
  const escapeString = (str: string) => {
    return str.replace(/([\\;,:"])/g, '\\$1');
  };

  const qrValue = `WIFI:T:${wifiData.encryption};S:${escapeString(wifiData.ssid)};P:${escapeString(wifiData.password)};H:${wifiData.hidden};;`;

  const handlePrint = () => {
    window.print();
  };

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
      {/* Print View Only - Hidden on Screen */}
      <div className="hidden print-only fixed inset-0 bg-white z-[9999] p-10">
         <div className="border-4 border-black p-8 max-w-2xl mx-auto rounded-3xl text-center">
            <h1 className="text-4xl font-bold mb-4">Wi-Fi Network</h1>
            <p className="text-2xl mb-8">{cardState.generated ? cardState.message : 'Scan to connect'}</p>
            
            <div className="flex justify-center mb-8">
              <QRCodeCanvas
                value={qrValue}
                size={400}
                level="Q"
                includeMargin={true}
              />
            </div>

            <div className="text-left inline-block border-t-2 border-black pt-6 px-8">
               <p className="text-2xl font-mono mb-2"><strong>Network:</strong> {wifiData.ssid}</p>
               {wifiData.encryption !== 'nopass' && (
                 <p className="text-2xl font-mono"><strong>Password:</strong> {wifiData.password}</p>
               )}
            </div>
         </div>
      </div>

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
