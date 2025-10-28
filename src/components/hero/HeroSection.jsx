import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const { t } = useLanguage();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPortfolioCategory = (category) => {
    const portfolioElement = document.getElementById('portfolio');
    if (portfolioElement) {
      const headerOffset = 80;
      const elementPosition = portfolioElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('selectPortfolioCategory', { 
          detail: { category } 
        }));
      }, 800);
    }
  };

  const features = [
    { 
      icon: "🔑", 
      title: t('keychains'), 
      desc: t('keychainsDesc'),
      category: 'keychains'
    },
    { 
      icon: "📱", 
      title: t('smartStands'), 
      desc: t('smartStandsDesc'),
      category: 'stands'
    },
    { 
      icon: "🍽️", 
      title: t('digitalMenus'), 
      desc: t('digitalMenusDesc'),
      category: 'digital'
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-0">
        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            PrintLab
          </span>
          <span className="text-blue-400">3D</span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
          {t('heroTagline')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 lg:mb-16 px-4 max-w-2xl mx-auto">
          <Link
            to="/KeychainCreator"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base inline-flex items-center justify-center"
          >
            🎨 Stwórz Własnego Breloka
            <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button 
            onClick={() => scrollToSection('portfolio')}
            className="w-full sm:w-auto border-2 border-blue-400 bg-blue-400/10 text-white hover:bg-blue-400/20 hover:border-blue-300 font-semibold px-6 sm:px-8 py-3 rounded-full backdrop-blur-sm text-sm sm:text-base transition-all duration-300 inline-flex items-center justify-center"
          >
            <svg className="mr-2 w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {t('watchDemo')}
          </button>
        </div>

        {/* Features preview z linkami */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPortfolioCategory(feature.category)}
              className="group cursor-pointer touch-manipulation"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-2">{feature.desc}</p>
                <div className="flex items-center justify-center text-blue-400 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="mr-1">Zobacz więcej</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}