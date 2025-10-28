

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../components/context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/Home';
  
  // Derive currentPageName for conditional footer rendering
  const currentPageName = location.pathname === '/' || location.pathname === '/Home' 
    ? 'Home' 
    : location.pathname.substring(1); // Removes leading slash, e.g., '/KeychainCreator' becomes 'KeychainCreator'

  useEffect(() => {
    document.title = 'PrintLab3D - Druk 3D + NFC';
    
    // Favicon
    const setFavicon = () => {
      // Usuń stare favicony jeśli istnieją
      const oldFavicons = document.querySelectorAll('link[rel*="icon"]');
      oldFavicons.forEach(favicon => favicon.remove());
      
      // Dodaj nowy favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cfe7df0d39f29d6e4de1c0/3b011ec77_printlab_oem.jpg';
      document.head.appendChild(favicon);
      
      // Dodaj też apple-touch-icon
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cfe7df0d39f29d6e4de1c0/3b011ec77_printlab_oem.jpg';
      document.head.appendChild(appleTouchIcon);
    };
    
    setFavicon();
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Łączymy druk 3D i technologię NFC - spersonalizowane breloki, stojaki na telefon i menu cyfrowe z chipem NFC');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Łączymy druk 3D i technologię NFC - spersonalizowane breloki, stojaki na telefon i menu cyfrowe z chipem NFC';
      document.head.appendChild(meta);
    }

    const updateOrCreateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('og:title', 'PrintLab3D - Druk 3D + NFC');
    updateOrCreateMeta('og:description', 'Łączymy druk 3D i technologię NFC - spersonalizowane breloki, stojaki i menu cyfrowe');
    updateOrCreateMeta('og:type', 'website');
    updateOrCreateMeta('og:image', 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cfe7df0d39f29d6e4de1c0/3b011ec77_printlab_oem.jpg');
  }, []);

  const handleNavigation = (sectionId) => {
    if (isHomePage) {
      // Jeśli jesteśmy na stronie głównej, scrolluj do sekcji
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      // Jeśli jesteśmy na innej stronie, przekieruj do strony głównej z hash
      window.location.href = `/#${sectionId}`;
    }
  };

  // Obsługa scroll do sekcji po załadowaniu strony głównej z hash
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isHomePage]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - zwiększony z-index */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Link do strony głównej */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 sm:w-12 h-8 sm:h-12 flex items-center justify-center">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68cfe7df0d39f29d6e4de1c0/3b011ec77_printlab_oem.jpg" 
                  alt="PrintLab3D" 
                  className="h-6 sm:h-10 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className="font-black text-lg sm:text-xl text-gray-900">PrintLab3D</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('services')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t('services')}
              </button>
              <button 
                onClick={() => handleNavigation('portfolio')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t('portfolio')}
              </button>
              <Link 
                to="/KeychainCreator"
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Kreator 3D
              </Link>
              <button 
                onClick={() => handleNavigation('about')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => handleNavigation('contact')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {t('contact')}
              </button>
              
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {language.toUpperCase()}
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => { changeLanguage('en'); setShowLanguageMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🇬🇧 English
                      </button>
                      <button
                        onClick={() => { changeLanguage('pl'); setShowLanguageMenu(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🇵🇱 Polski
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleNavigation('contact')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-full shadow-lg shadow-blue-500/25 font-medium transition-all"
              >
                {t('getQuote')}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - zwiększony z-index */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => { handleNavigation('services'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              >
                {t('services')}
              </button>
              <button 
                onClick={() => { handleNavigation('portfolio'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              >
                {t('portfolio')}
              </button>
              <Link 
                to="/KeychainCreator"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              >
                Kreator 3D
              </Link>
              <button 
                onClick={() => { handleNavigation('about'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => { handleNavigation('contact'); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
              >
                {t('contact')}
              </button>
              
              {/* Language Buttons */}
              <div className="flex gap-2 px-4 pt-2">
                <button
                  onClick={() => { changeLanguage('en'); setIsMenuOpen(false); }}
                  className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-colors ${language === 'en' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => { changeLanguage('pl'); setIsMenuOpen(false); }}
                  className={`flex-1 px-4 py-2 rounded-lg border font-medium transition-colors ${language === 'pl' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'}`}
                >
                  🇵🇱 PL
                </button>
              </div>
              
              <button 
                onClick={() => { handleNavigation('contact'); setIsMenuOpen(false); }}
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-500/25 font-medium transition-all mt-4"
              >
                {t('getQuote')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-14 sm:pt-16">
        {children}
      </main>

      {/* Footer - tylko dla strony głównej, nie dla kreatora */}
      {(!currentPageName || currentPageName === 'Home') ? (
        <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  PrintLab3D
                </h3>
                <p className="text-gray-400">
                  {t('footerDescription')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('company')}</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleNavigation('services')}
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {t('services')}
                  </button>
                  <button 
                    onClick={() => handleNavigation('portfolio')}
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {t('portfolio')}
                  </button>
                  <button 
                    onClick={() => handleNavigation('about')}
                    className="block text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {t('aboutUs')}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t('contact')}</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Email: contact@printlab3d.eu</p>
                  <p>Tel: +48 532 882 689</p>
                  <p>Szczecin, Kołobrzeg</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>© 2024 PrintLab3D. {t('allRights')}</p>
              <p className="mt-2">{t('madeWithLove')}</p>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
};

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}

