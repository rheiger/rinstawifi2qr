import React, { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff, ShieldCheck, Router } from 'lucide-react';
import { EncryptionType, WifiData, Language } from '../types';
import { t } from '../utils/i18n';

interface WifiFormProps {
  wifiData: WifiData;
  setWifiData: React.Dispatch<React.SetStateAction<WifiData>>;
  language: Language;
}

export const WifiForm: React.FC<WifiFormProps> = ({ wifiData, setWifiData, language }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof WifiData, value: string | boolean) => {
    setWifiData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Router size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">{t(language, 'networkDetails')}</h2>
      </div>

      <div className="space-y-5">
        {/* SSID Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t(language, 'ssidLabel')}</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Wifi size={18} />
            </div>
            <input
              type="text"
              value={wifiData.ssid}
              onChange={(e) => handleChange('ssid', e.target.value)}
              placeholder={t(language, 'ssidPlaceholder') as string}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Encryption Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t(language, 'securityLabel')}</label>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <ShieldCheck size={18} />
            </div>
            <select
              value={wifiData.encryption}
              onChange={(e) => handleChange('encryption', e.target.value as EncryptionType)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value={EncryptionType.WPA}>WPA / WPA2 / WPA3 (Recommended)</option>
              <option value={EncryptionType.WEP}>WEP (Legacy)</option>
              <option value={EncryptionType.NONE}>None (Open Network)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </div>
          </div>
        </div>

        {/* Password Input */}
        {wifiData.encryption !== EncryptionType.NONE && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t(language, 'passwordLabel')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={wifiData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Hidden Network Checkbox */}
        <div className="flex items-center pt-2">
          <input
            id="hidden-network"
            type="checkbox"
            checked={wifiData.hidden}
            onChange={(e) => handleChange('hidden', e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="hidden-network" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
            {t(language, 'hiddenLabel')}
          </label>
        </div>
      </div>
    </div>
  );
};
