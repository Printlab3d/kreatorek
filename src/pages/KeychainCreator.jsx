
import React, { useState } from 'react';
import Keychain3DViewer from '../components/creator/Keychain3DViewer';
import ControlPanel from '../components/creator/ControlPanel';
import { useLanguage } from '../components/context/LanguageContext';

export default function KeychainCreator() {
  const { t } = useLanguage();
  
  const [keychainConfig, setKeychainConfig] = useState({
    shape: 'circle',
    size: 3,
    width: 3,
    height: 4,
    color: '#3b82f6',
    hasBorder: true,
    borderColor: '#1f2937',
    graphicUrl: null,
    graphicScale: 70,
    showGraphic: false,
    hookPosition: 'top-center',
    productionMethod: 'laser',
    hasNFC: false,
    quantity: 100
  });

  const handleConfigChange = (updates) => {
    setKeychainConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      const effectiveSize = newConfig.shape === 'rectangle' 
        ? Math.min(newConfig.width, newConfig.height)
        : newConfig.size;
      
      if (effectiveSize < 2.5 && newConfig.hasNFC) {
        newConfig.hasNFC = false;
      }
      
      return newConfig;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setKeychainConfig(prev => ({
          ...prev,
          graphicUrl: event.target.result,
          showGraphic: true
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePrice = () => {
      return { total: (keychainConfig.quantity * 1.5 + (keychainConfig.hasNFC ? 5 : 0)).toFixed(2) };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex">
          {/* Left Side - Fixed 3D Preview */}
          <div className="w-1/2 h-screen fixed left-0 top-0 pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="h-full flex items-center justify-center p-8">
              <div className="w-full h-full max-w-4xl">
                <Keychain3DViewer config={keychainConfig} />
              </div>
            </div>
          </div>

          {/* Right Side - Scrollable Controls */}
          <div className="w-1/2 ml-auto min-h-screen bg-white">
            <div className="min-h-screen flex flex-col">
              <div className="pt-16">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                    <span className="text-blue-800 font-semibold text-xs uppercase tracking-wide">
                      {t('3dCreator') || 'Kreator 3D'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2">
                    {t('designYourKeychain')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t('personalizeKeychain')}
                  </p>
                </div>

                {/* Control Panel */}
                <div className="px-8 py-6">
                  <ControlPanel
                    config={keychainConfig}
                    onConfigChange={handleConfigChange}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col pt-16">
        {/* Top - Fixed 3D Preview */}
        <div className="fixed top-16 left-0 right-0 z-10 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm" style={{ height: '35vh' }}>
          <div className="h-full w-full p-4 flex items-center justify-center">
            <div className="w-full h-full max-w-lg">
              <Keychain3DViewer config={keychainConfig} />
            </div>
          </div>
        </div>

        {/* Bottom - Scrollable Controls */}
        <div className="flex-1 bg-white" style={{ marginTop: '35vh' }}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-2">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <span className="text-blue-800 font-semibold text-[10px] uppercase tracking-wide">
                {t('3dCreator') || 'Kreator 3D'}
              </span>
            </div>
            <h1 className="text-xl font-black text-gray-900 mb-1">
              {t('designYourKeychain')}
            </h1>
            <p className="text-xs text-gray-600">
              {t('personalizeKeychain')}
            </p>
          </div>

          {/* Control Panel */}
          <div className="px-3 py-4 pb-12">
            <ControlPanel
              config={keychainConfig}
              onConfigChange={handleConfigChange}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>

      {/* Sticky Preview for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-top-lg p-4 border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">{t('totalCost', { count: keychainConfig.quantity }).split(':')[0]}:</span>
          <span className="text-2xl font-bold text-green-600">{calculatePrice().total.toLocaleString()} zł</span>
        </div>
        <button
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 text-base flex items-center justify-center gap-2"
        >
          🛒 {t('orderNow')}
        </button>
      </div>
    </div>
  );
}
