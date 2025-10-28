
import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ARMenuCard from './ARMenuCard';

export default function PortfolioSection() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [highlightedItems, setHighlightedItems] = useState([]);
  const [showARMenu, setShowARMenu] = useState(false);
  
  const portfolioItems = useMemo(() => [
    {
      id: 1,
      title: t('corporateKeychains'),
      category: "keychains",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/79a777071_1.png",
      description: t('corporateKeychainsDesc'),
      gallery: [
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/79a777071_1.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/de86d4eff_3.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/4a5c7584e_2.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/369b8becd_6.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/d06e3ad05_5.png"
      ]
    },
    {
      id: 2,
      title: t('customKeychains'),
      category: "keychains",
      image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop",
      description: t('customKeychainsDesc'),
      gallery: [
        "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/150f72888_8.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/f736d2771_4.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/64420496f_9.png"
      ]
    },
    {
      id: 3,
      title: t('displayStand'),
      category: "stands",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/ddc4bab39_7.png",
      description: t('displayStandDesc'),
      gallery: [
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/ddc4bab39_7.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68dd2e6c444436f4bd155b40/ed69d7a96_10.png"
      ]
    },
    {
      id: 4,
      title: t('arMenuSystem'),
      category: "digital",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description: t('arMenuSystemDesc'),
      isARMenu: true
    }
  ], [t]);
  
  useEffect(() => {
    const handleCategorySelect = (e) => {
      const category = e.detail.category;
      setSelectedCategory(category);
      
      const itemsToHighlight = portfolioItems
        .filter(item => item.category === category)
        .map(item => item.id);
      
      setHighlightedItems(itemsToHighlight);
      
      setTimeout(() => {
        setHighlightedItems([]);
      }, 1000);
    };
    
    window.addEventListener('selectPortfolioCategory', handleCategorySelect);
    return () => window.removeEventListener('selectPortfolioCategory', handleCategorySelect);
  }, [portfolioItems]);

  const categories = [
    { id: 'all', name: t('allProjects') },
    { id: 'keychains', name: t('keychains') },
    { id: 'stands', name: t('smartStands') },
    { id: 'digital', name: t('digitalMenus') }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const openGallery = (item) => {
    if (item.isARMenu) {
      setShowARMenu(true);
      document.body.style.overflow = 'hidden';
    } else {
      setSelectedGallery(item);
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setShowARMenu(false);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedGallery.gallery.length) % selectedGallery.gallery.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <section id="portfolio" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
            {t('innovationShowcase')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            {t('portfolioDescription')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 border border-gray-300 hover:text-blue-600 hover:border-blue-400"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                highlightedItems.includes(item.id) ? 'scale-105 z-10' : 'scale-100'
              }`}
            >
              
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-200 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{item.description}</p>
                    <button 
                      onClick={() => openGallery(item)}
                      className="inline-flex items-center px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-md font-medium transition-colors text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {t('view')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AR Menu Modal */}
      {showARMenu && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 z-10 text-white hover:bg-white/10 p-3 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6" />
          </button>
          <ARMenuCard />
        </div>
      )}

      {/* Regular Gallery Modal */}
      {selectedGallery && !showARMenu && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedGallery.title}</h3>
                <p className="text-gray-300 text-sm">{selectedGallery.description}</p>
              </div>
              <button
                onClick={closeGallery}
                className="text-white hover:bg-white/10 p-3 rounded-full transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="h-full flex items-center justify-center p-4 pt-32 pb-32">
            <div className="relative max-w-6xl w-full">
              <img
                src={selectedGallery.gallery[currentImageIndex]}
                alt={selectedGallery.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />

              {selectedGallery.gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-4 rounded-full transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-4 rounded-full transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {selectedGallery.gallery.length}
              </div>
            </div>
          </div>

          {selectedGallery.gallery.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedGallery.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'ring-4 ring-blue-500 scale-110' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${selectedGallery.title} ${idx + 1}`}
                        className="h-20 w-28 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-6 text-gray-400 text-sm hidden md:block">
            <div className="flex gap-4">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
