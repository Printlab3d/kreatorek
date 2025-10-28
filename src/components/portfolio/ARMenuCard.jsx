import React from 'react';

export default function ARMenuCard() {
  const menuItems = [
    {
      name: 'Brelok Prezentacyjny',
      description: 'Elegancki brelok z funkcją NFC, idealny do prezentacji produktów',
      icon: '🔑',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Brelok Okazjonalny',
      description: 'Limitowana edycja breloków na specjalne okazje',
      icon: '🎁',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      name: 'Brelok Firmowy',
      description: 'Spersonalizowany brelok z logo Twojej firmy',
      icon: '💼',
      gradient: 'from-blue-700 to-cyan-700'
    },
    {
      name: 'Stojak NFC',
      description: 'Interaktywny stojak z technologią NFC',
      icon: '📱',
      gradient: 'from-cyan-700 to-blue-700'
    }
  ];

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="min-h-full px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-4">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-400 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Produkt w trakcie tworzenia
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                PrintLab3D
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">Menu Produktów AR</p>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-xl sm:text-3xl">{item.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                  {item.description}
                </p>

                {/* Button */}
                <button className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50">
                  <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                    Zobacz w AR
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </span>
                </button>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="text-center pb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-gray-300 font-medium text-xs sm:text-sm">
                Powered by AR Technology
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}