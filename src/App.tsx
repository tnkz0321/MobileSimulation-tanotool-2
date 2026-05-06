/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Wifi, 
  Mail, 
  Users, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  Info,
  RotateCcw,
  AlertCircle,
  Plus,
  Palette
} from 'lucide-react';

type EmailType = 'carrier' | 'free' | 'other';

interface Theme {
  id: string;
  name: string;
  fontBody: string;
  fontDisplay: string;
  brand: string;
  brandLight: string;
  bg: string;
}

const THEMES: Theme[] = [
  { id: 'modern', name: 'Modern Blue', fontBody: 'Inter', fontDisplay: 'Inter', brand: '#2563eb', brandLight: '#eff6ff', bg: '#f8fafc' },
  { id: 'swiss', name: 'Swiss Minimal', fontBody: 'Inter', fontDisplay: 'Space Grotesk', brand: '#ef4444', brandLight: '#fef2f2', bg: '#ffffff' },
  { id: 'startup', name: 'Energetic Startup', fontBody: 'Inter', fontDisplay: 'Montserrat', brand: '#8b5cf6', brandLight: '#f5f3ff', bg: '#ffffff' },
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [showDesignMenu, setShowDesignMenu] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-family-body', currentTheme.fontBody);
    root.style.setProperty('--font-family-display', currentTheme.fontDisplay);
    root.style.setProperty('--theme-brand', currentTheme.brand);
    root.style.setProperty('--theme-brand-light', currentTheme.brandLight);
    document.body.style.backgroundColor = currentTheme.bg;
    
    // Handle dark theme text visibility
    if (currentTheme.bg === '#0f172a' || currentTheme.bg === '#020617') {
      document.body.classList.add('dark');
      root.style.setProperty('--color-slate-900', '#f8fafc');
      root.style.setProperty('--color-slate-800', '#f1f5f9');
      root.style.setProperty('--color-slate-700', '#e2e8f0');
      root.style.setProperty('--color-slate-600', '#94a3b8');
      root.style.setProperty('--color-slate-500', '#64748b');
    } else {
      document.body.classList.remove('dark');
      root.style.setProperty('--color-slate-900', '#0f172a');
      root.style.setProperty('--color-slate-800', '#1e293b');
      root.style.setProperty('--color-slate-700', '#334155');
      root.style.setProperty('--color-slate-600', '#475569');
      root.style.setProperty('--color-slate-500', '#64748b');
    }
  }, [currentTheme]);
  // Carrier names and selection states
  const CARRIER_OPTIONS = ['ドコモ', 'au', 'ソフトバンク', 'Y!mobile', 'UQmobile', 'ahamo'];
  
  const [selectedCarrierA, setSelectedCarrierA] = useState<string>('ドコモ');
  const [customCarrierA, setCustomCarrierA] = useState<string>('');
  const [selectedCarrierB, setSelectedCarrierB] = useState<string>('au');

  // Derived display names for results
  const nameA = selectedCarrierA === 'その他' ? (customCarrierA || 'その他') : selectedCarrierA;
  const nameB = selectedCarrierB;

  // Input states
  const [devices, setDevices] = useState([{ deviceFeeA: 0, deviceFeeB: 0, planFeeA: 0, planFeeB: 0 }]);
  const [targetDevice, setTargetDevice] = useState<string>('');
  const [selectedEmail, setSelectedEmail] = useState<EmailType>('free');
  const [linesCount, setLinesCount] = useState<number>(1);
  const [internetService, setInternetService] = useState<string>('');
  const [hasInternetDiscount, setHasInternetDiscount] = useState<'yes' | 'no' | 'unknown'>('no');
  const [validationError, setValidationError] = useState(false);
  const [carrierSameError, setCarrierSameError] = useState(false);
  
  const [showResults, setShowResults] = useState(false);

  // Calculations (Dynamic for multiple units)
  const MONTHS = 23;
  const deviceSavingsTotal = devices.reduce((sum, d) => sum + (d.deviceFeeA - d.deviceFeeB) * MONTHS, 0);
  const planSavingsTotal = devices.reduce((sum, d) => sum + (d.planFeeA - d.planFeeB) * MONTHS, 0);
  const grandTotalSavings = deviceSavingsTotal + planSavingsTotal;
  const totalSavingsPerUnit = devices.length > 0 ? grandTotalSavings / devices.length : 0;

  const handleAddDevice = () => {
    if (devices.length < 6) {
      setDevices([...devices, { deviceFeeA: 0, deviceFeeB: 0, planFeeA: 0, planFeeB: 0 }]);
    }
  };

  const handleCopyFirstDevice = (index: number) => {
    if (index === 0) return;
    const newDevices = [...devices];
    newDevices[index] = { ...newDevices[0] };
    setDevices(newDevices);
  };

  const updateDevice = (index: number, field: keyof typeof devices[0], value: number) => {
    const newDevices = [...devices];
    newDevices[index][field] = value;
    setDevices(newDevices);
  };

  const handleCalculate = () => {
    if (nameA === nameB) {
      setCarrierSameError(true);
      const element = document.getElementById('carrier-section');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setCarrierSameError(false);

    const hasIncomplete = devices.every(d => d.deviceFeeA === 0 && d.deviceFeeB === 0);
    if (hasIncomplete) {
      setValidationError(true);
      const element = document.getElementById('device-fees-section');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationError(false);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setShowResults(false);
    setDevices([{ deviceFeeA: 0, deviceFeeB: 0, planFeeA: 0, planFeeB: 0 }]);
    setSelectedEmail('free');
    setLinesCount(1);
    setSelectedCarrierA('ドコモ');
    setCustomCarrierA('');
    setSelectedCarrierB('au');
    setTargetDevice('');
    setInternetService('');
    setHasInternetDiscount('no');
    setValidationError(false);
    setCarrierSameError(false);
  };

  const handleBack = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500`}>
      {/* Design Selector (Admin Tool) */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button 
            onClick={() => setShowDesignMenu(!showDesignMenu)}
            className="w-12 h-12 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-full hover:bg-white flex items-center justify-center transition-transform active:scale-95"
          >
            <Palette className="w-6 h-6 text-brand" />
          </button>
          
          <AnimatePresence>
            {showDesignMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 z-[60]"
              >
                <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto pt-1">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentTheme(theme);
                        setShowDesignMenu(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left transition-all ${currentTheme.id === theme.id ? 'bg-brand/10 text-brand' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{theme.name}</span>
                        <span className="text-[10px] opacity-60 font-mono">{theme.fontDisplay}</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.brand }}></div>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg }}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close overlay when menu is open */}
          {showDesignMenu && (
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={() => setShowDesignMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-8 px-6 mb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-2xl mb-4">
            <Smartphone className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-2 relative inline-block">
            スマホ料金比較シミュレーター
            <span className="block sm:absolute sm:bottom-0 sm:right-0 sm:translate-y-full text-xs text-slate-600 font-bold tracking-wider mt-1 sm:mt-0">
              tano tool
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-4 sm:mt-6">
            現状のキャリアと乗り換え先の料金を比較して
            <br />
            2年間でどれくらいお得になるか診断します
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="inputs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Carrier Name Settings */}
              <section id="carrier-section" className={`input-card transition-all duration-300 ${carrierSameError ? 'border-red-500 bg-red-50/30' : 'border-brand/10 bg-brand-light/10'}`}>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full space-y-2">
                    <label className={`text-sm font-black uppercase tracking-widest mb-1.5 block ${carrierSameError ? 'text-red-500' : 'text-brand'}`}>検討中キャリア名</label>
                    <div className="relative">
                      <select
                        value={selectedCarrierA}
                        onChange={(e) => {
                          setSelectedCarrierA(e.target.value);
                          setCarrierSameError(false);
                        }}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all font-bold appearance-none cursor-pointer text-center text-lg shadow-sm ${carrierSameError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'focus:ring-brand/20 focus:border-brand'}`}
                      >
                        {CARRIER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        <option value="その他">その他</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
                    </div>
                    {selectedCarrierA === 'その他' && (
                      <motion.input 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="text" 
                        value={customCarrierA} 
                        onChange={(e) => {
                          setCustomCarrierA(e.target.value);
                          setCarrierSameError(false);
                        }} 
                        className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all text-base text-center ${carrierSameError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'focus:ring-brand/20 focus:border-brand'}`}
                        placeholder="キャリア名を入力"
                      />
                    )}
                  </div>
                  <div className="hidden sm:flex flex-shrink-0 text-slate-400 font-extrabold text-sm italic px-2 pt-10 whitespace-nowrap">正直比較</div>
                  <div className="flex-1 w-full space-y-2">
                    <label className={`text-sm font-black uppercase tracking-widest mb-1.5 block ${carrierSameError ? 'text-red-500' : 'text-brand'}`}>乗り換え後のキャリア名</label>
                    <div className="relative">
                      <select
                        value={selectedCarrierB}
                        onChange={(e) => {
                          setSelectedCarrierB(e.target.value);
                          setCarrierSameError(false);
                        }}
                        className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 outline-none transition-all font-bold appearance-none cursor-pointer text-center text-lg shadow-sm ${carrierSameError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'focus:ring-brand/20 focus:border-brand'}`}
                      >
                        {CARRIER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
                    </div>
                  </div>
                </div>
                {carrierSameError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-xs text-red-500 font-bold flex items-center justify-center gap-1.5"
                  >
                    <AlertCircle className="w-3 h-3" />
                    キャリアが同一です
                  </motion.p>
                )}
              </section>

              {/* Target Device Selection */}
              <section className="input-card">
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
                  <Smartphone className="w-5 h-5 text-brand" />
                  <h2>検討中の端末 <span className="text-xs font-normal text-slate-400 ml-2">※入力任意</span></h2>
                </div>
                <div>
                  <input
                    type="text"
                    value={targetDevice}
                    onChange={(e) => setTargetDevice(e.target.value)}
                    placeholder="例 : iPhone17 256GB"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Fees */}
                <section id="device-fees-section" className={`input-card transition-all duration-300 ${validationError ? 'border-red-500 bg-red-50/30' : ''}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 font-bold">
                      <Smartphone className={`w-5 h-5 ${validationError ? 'text-red-500' : 'text-brand'}`} />
                      <h2 className={validationError ? 'text-red-600' : 'text-slate-900'}>端末代金（月々）</h2>
                    </div>
                    {devices.length < 6 && (
                      <button
                        onClick={handleAddDevice}
                        className="text-xs bg-brand/10 text-brand px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-brand/20 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        もう１台追加する
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    {devices.map((device, index) => (
                      <div key={index} className="space-y-4 p-4 bg-slate-50/50 rounded-xl relative border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{index + 1}台目</span>
                          {index > 0 && (
                            <button
                              onClick={() => handleCopyFirstDevice(index)}
                              className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm hover:bg-slate-50 transition-all font-medium"
                            >
                              1台目情報コピー
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className={`block text-[14px] font-medium mb-1 ${validationError ? 'text-red-500' : 'text-slate-500'}`}>
                              <span className="font-bold text-[16px]">{nameA}</span>（機種変更後の端末割賦/月）
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={device.deviceFeeA || ''}
                                onChange={(e) => {
                                  updateDevice(index, 'deviceFeeA', Number(e.target.value));
                                  if (validationError) setValidationError(false);
                                }}
                                placeholder="0"
                                className={`w-full pl-4 pr-12 py-3 bg-white border rounded-xl focus:ring-4 outline-none transition-all text-lg font-bold ${validationError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-slate-200 focus:ring-brand/10 focus:border-brand'}`}
                              />
                              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold ${validationError ? 'text-red-400' : 'text-slate-400'}`}>円</span>
                            </div>
                          </div>
                          <div>
                            <label className={`block text-[14px] font-medium mb-1 ${validationError ? 'text-red-500' : 'text-slate-500'}`}>
                              <span className="font-bold text-[16px]">{nameB}</span>（乗り換え後の端末割賦/月）
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={device.deviceFeeB || ''}
                                onChange={(e) => {
                                  updateDevice(index, 'deviceFeeB', Number(e.target.value));
                                  if (validationError) setValidationError(false);
                                }}
                                placeholder="0"
                                className={`w-full pl-4 pr-12 py-3 bg-white border rounded-xl focus:ring-4 outline-none transition-all text-lg font-bold ${validationError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-slate-200 focus:ring-brand/10 focus:border-brand'}`}
                              />
                              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold ${validationError ? 'text-red-400' : 'text-slate-400'}`}>円</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {validationError && (
                    <p className="mt-4 text-xs text-red-500 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      端末代金のいずれかを入力してください
                    </p>
                  )}
                </section>

                {/* Plan Fees */}
                <section className="input-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Wifi className="w-5 h-5 text-brand" />
                      <h2>通信料金（月々）</h2>
                    </div>
                    {devices.length < 6 && (
                      <button
                        onClick={handleAddDevice}
                        className="text-xs bg-brand/10 text-brand px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-brand/20 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        もう１台追加する
                      </button>
                    )}
                  </div>

                  <div className="space-y-8">
                    {devices.map((device, index) => (
                      <div key={index} className="space-y-4 p-4 bg-slate-50/50 rounded-xl relative border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{index + 1}台目</span>
                          {index > 0 && (
                            <button
                              onClick={() => handleCopyFirstDevice(index)}
                              className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm hover:bg-slate-50 transition-all font-medium"
                            >
                              1台目情報コピー
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[14px] font-medium text-slate-500 mb-1">
                              <span className="font-bold text-[16px]">{nameA}</span>（現在のプラン料金/月）
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={device.planFeeA || ''}
                                onChange={(e) => updateDevice(index, 'planFeeA', Number(e.target.value))}
                                placeholder="0"
                                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all text-lg font-bold"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">円</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[14px] font-medium text-slate-500 mb-1">
                              <span className="font-bold text-[16px]">{nameB}</span>（乗り換え後のプラン料金/月）
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={device.planFeeB || ''}
                                onChange={(e) => updateDevice(index, 'planFeeB', Number(e.target.value))}
                                placeholder="0"
                                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none transition-all text-lg font-bold"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">円</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Email and Line Info */}
                <section className="input-card md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                        <Mail className="w-5 h-5 text-brand" />
                        <h2>メールオプション</h2>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          現在ご利用のメールアドレス
                        </label>
                        <div className="relative">
                          <select
                            id="email-select"
                            value={selectedEmail}
                            onChange={(e) => setSelectedEmail(e.target.value as EmailType)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="carrier">キャリアメール (@docomo, @ezweb, @softbank等)</option>
                            <option value="free">フリーメール (Gmail, iCloud等)</option>
                            <option value="other">その他</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                        <Users className="w-5 h-5 text-brand" />
                        <h2>契約・購入情報</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex flex-col justify-end h-10 text-sm font-medium text-slate-600 mb-1.5 leading-tight">
                            <span>家族内同一キャリア回線数</span>
                            <span className="text-[10px] opacity-70 font-normal">家族割回線</span>
                          </label>
                          <div className="relative">
                            <select
                              id="lines-select"
                              value={linesCount}
                              onChange={(e) => setLinesCount(Number(e.target.value))}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none cursor-pointer"
                            >
                              {[1, 2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num}回線</option>
                              ))}
                              <option value={7}>7回線以上</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Internet Information */}
                <section className="input-card md:col-span-2">
                  <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
                    <Wifi className="w-5 h-5 text-brand" />
                    <h2>インターネット利用状況 <span className="text-xs font-normal text-slate-400 ml-2">※入力任意</span></h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        現在使用しているインターネット
                      </label>
                      <input
                        type="text"
                        value={internetService}
                        onChange={(e) => setInternetService(e.target.value)}
                        placeholder="例: ドコモ光、ソフトバンク光、J:COMなど"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        現在のインターネットとのセット割引の有無
                      </label>
                      <div className="relative">
                        <select
                          value={hasInternetDiscount}
                          onChange={(e) => setHasInternetDiscount(e.target.value as 'yes' | 'no' | 'unknown')}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all appearance-none cursor-pointer font-medium"
                        >
                          <option value="yes">有り</option>
                          <option value="no">無し</option>
                          <option value="unknown">不明</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">▼</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  id="btn-calculate"
                  onClick={handleCalculate}
                  className="group flex items-center gap-2 px-12 py-4 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  結果をみる
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Total Savings Hero */}
              <div className="bg-gradient-to-br from-brand to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-brand/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    {targetDevice && (
                      <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest mb-2 bg-white/10 px-2 py-0.5 rounded inline-block">
                        検討端末: {targetDevice}
                      </p>
                    )}
                    <p className="text-blue-100 font-medium mb-1 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4" />
                      2年間の料金差額 ({devices.length}台合計)
                    </p>
                    <h2 className="text-[60px] sm:text-[70px] font-extrabold tracking-tight relative inline-block text-white leading-none">
                      <span className="text-2xl mr-1">¥</span>
                      {grandTotalSavings.toLocaleString()}
                      <span className="text-2xl ml-1">!</span>

                      {/* Dynamic Stamps */}
                      {grandTotalSavings >= 50000 ? (
                        <motion.div
                          initial={{ scale: 3, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: -15 }}
                          transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                          className="absolute -top-12 -right-36 sm:-right-44 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border-4 border-red-500 rounded-full text-red-500 font-black text-center leading-tight opacity-100 pointer-events-none z-10 p-2 bg-white shadow-xl"
                        >
                          <div className="relative border-2 border-red-500 rounded-full w-full h-full flex items-center justify-center flex-col">
                            <span className="text-[12px] sm:text-[13px] mb-0.5">お乗り換えが</span>
                            <span className="text-sm sm:text-base">超お得です</span>
                          </div>
                        </motion.div>
                      ) : grandTotalSavings > 0 ? (
                        <motion.div
                          initial={{ scale: 3, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: -12 }}
                          transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                          className="absolute -top-4 -right-28 border-4 border-red-500 text-red-500 font-black px-3 py-1 rounded-lg text-lg tracking-tighter opacity-100 pointer-events-none z-10 bg-white shadow-lg"
                        >
                          おトク！
                        </motion.div>
                      ) : null}
                    </h2>
                    <p className="mt-2 text-blue-100/90 text-sm font-medium">
                      1人 {totalSavingsPerUnit.toLocaleString()}円お得になります。
                      {devices.length > 1 && (
                        <span className="block sm:inline sm:ml-2">
                          {devices.length}人（台）なら {grandTotalSavings.toLocaleString()}円お得になります。
                        </span>
                      )}
                    </p>
                    <p className="mt-4 text-xs text-white/70 bg-black/20 px-3 py-1.5 rounded inline-block font-medium">
                      ※返却プログラムで端末を2年後返却した場合の概算です
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {grandTotalSavings > 0 ? (
                      <p className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                        {nameB}への乗り換えがおすすめです
                      </p>
                    ) : (
                      <p className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                        {nameA}での継続も優秀なプランです
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visualization Timeline */}
              <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-slate-900 font-bold mb-8 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-brand" />
                  おトクな買い方のスケジュールイメージ
                </h3>
                <div className="relative pt-6 pb-2">
                  {/* Timeline track */}
                  <div className="h-2 w-full bg-slate-100 rounded-full flex relative">
                    <div className="h-full w-1/2 bg-brand rounded-l-full relative group">
                      <div className="absolute -top-10 left-0 text-[10px] font-bold text-slate-400">0ヶ月</div>
                      <div className="absolute -top-6 left-0 right-0 text-center text-[10px] font-bold text-brand">シミュレーション期間 (23ヶ月)</div>
                    </div>
                    <div className="h-full w-1/2 bg-slate-200 rounded-r-full relative">
                      <div className="absolute -top-10 right-0 text-[10px] font-bold text-slate-300">48ヶ月</div>
                    </div>
                  </div>

                  {/* Return Point Marker */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-0.5 h-10 bg-brand/30 border-l border-dashed border-brand"></div>
                    <div className="mt-2 bg-brand text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                      ここでお返し
                    </div>
                    <div className="mt-1 text-[10px] font-bold text-slate-500">約2年後</div>
                  </div>

                  {/* Summary blocks */}
                  <div className="mt-16 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-light/20 rounded-2xl border border-brand/5">
                      <div className="text-[10px] font-bold text-brand uppercase tracking-tighter mb-1">STEP 01: 使い始め</div>
                      <p className="text-sm font-bold text-slate-800">最新端末を月々安く利用</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">STEP 02: 約2年後</div>
                      <p className="text-sm font-bold text-slate-500">端末返却で残債のお支払不要</p>
                    </div>
                  </div>

                  {/* Disclaimers */}
                  <div className="mt-6 flex flex-col items-end gap-1 text-[10px] text-slate-400">
                    <p>※キャリアによってお得な返却時期が異なります</p>
                    <p>※返却時に手数料がかかる場合があります</p>
                  </div>
                </div>
              </section>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="result-card flex flex-col justify-between relative overflow-hidden">
                  {deviceSavingsTotal > 0 && (
                    <motion.div
                      initial={{ scale: 3, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                      className="absolute top-4 right-4 border-2 border-red-500 text-red-500 font-black px-2 py-0.5 rounded text-sm tracking-tighter opacity-100 pointer-events-none z-10 bg-white shadow-sm"
                    >
                      お得
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-slate-700 font-bold text-lg mb-2 uppercase tracking-wide">
                      端末のお得になる金額 ({devices.length}台分)
                    </h3>
                    <p className="text-4xl font-black text-slate-900 mb-4">
                      {deviceSavingsTotal.toLocaleString()}円
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {(deviceSavingsTotal / devices.length).toLocaleString()}円 / 1台
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 self-start">
                    <Info className="w-3 h-3" />
                    (現状月額 - 乗り換え後月額) × {MONTHS}ヶ月 × {devices.length}台
                  </div>
                </section>

                <section className="result-card flex flex-col justify-between relative overflow-hidden">
                  {planSavingsTotal > 0 && (
                    <motion.div
                      initial={{ scale: 3, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.7 }}
                      className="absolute top-4 right-4 border-2 border-red-500 text-red-500 font-black px-2 py-0.5 rounded text-sm tracking-tighter opacity-100 pointer-events-none z-10 bg-white shadow-sm"
                    >
                      お得
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-slate-700 font-bold text-lg mb-2 uppercase tracking-wide">
                      通信料金のお得になる金額 ({devices.length}回線分)
                    </h3>
                    <p className="text-4xl font-black text-slate-900 mb-4">
                      {planSavingsTotal.toLocaleString()}円
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {(planSavingsTotal / devices.length).toLocaleString()}円 / 1回線
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 self-start">
                    <Info className="w-3 h-3" />
                    (現状月額 - 乗り換え後月額) × {MONTHS}ヶ月 × {devices.length}回線
                  </div>
                </section>

                <section className="result-card md:col-span-2">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-900">乗り換えにあたって今回注意すべきこと</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-brand" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">メールアドレスの継続</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                          {selectedEmail === 'carrier' 
                            ? '330円プラスで引き続き利用可（持ち運びサービス等）' 
                            : '追加料金なしで引き続き利用可\nお乗り換えしても問題なし！'}
                        </p>
                      </div>
                    </div>

                    {devices.length !== linesCount && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-brand" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">家族割への影響</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            { (linesCount - devices.length) >= 3 
                              ? 'ご家族の回線が十分残るため、元のキャリアの家族割は継続可能です。' 
                              : `${linesCount - devices.length}回線以下のため、スタッフから詳細な料金案内をいたします`}
                          </p>
                        </div>
                      </div>
                    )}

                    {hasInternetDiscount === 'yes' && (
                      <div className="flex gap-4 sm:col-span-2 pt-6 border-t border-slate-50">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                          <Wifi className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">インターネット割引</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">
                            インターネットのセット割引に関しては、スタッフから料金案内させていただきます。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button
                  id="btn-back"
                  onClick={handleBack}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                >
                  ← 入力ページに戻る
                </button>
                <button
                  id="btn-retry"
                  onClick={handleReset}
                  className="w-full sm:w-auto flex flex-col items-center justify-center gap-1 px-8 py-3 text-slate-500 font-bold hover:text-red-500 transition-colors cursor-pointer text-center"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    最初からやり直す
                  </div>
                  <span className="text-[10px] font-normal opacity-60 leading-none">(入力データはリセットされます)</span>
                </button>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  id="btn-confirm"
                  disabled
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg opacity-50 cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  プランの詳細を相談する
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="mt-20 text-center text-slate-400 text-sm px-6">
        <p>© 2026 スマホ乗り換えシミュレーター</p>
        <p className="mt-1 italic">※ 本シミュレーション結果は概算であり、実際の契約条件により異なる場合があります。</p>
      </footer>
    </div>
  );
}
