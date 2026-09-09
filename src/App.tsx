import React, { useState } from 'react';
import {
  Language,
  UserLocation,
  ContentPost,
} from './types';
import {
  INITIAL_CONTENT_POSTS,
} from './data/initialData';
import { DEFAULT_USER_LOCATION } from './data/initialAds';
import { INITIAL_BLINK_PRODUCTS } from './data/blinkMasterData';
import { JordanSmartMarketView } from './components/JordanSmartMarketView';
import { SmartMarketSevenView } from './components/SmartMarketSevenView';
import { JordanContentFeedView } from './components/JordanContentFeedView';
import { LocationModal } from './components/LocationModal';
import { Globe, MapPin, Search, Clapperboard, Store, ChevronLeft } from 'lucide-react';
import { JordanFlag } from './components/JordanFlag';

export type BlinkAppView = 'home' | 'market' | 'content';

export default function App() {
  const [currentView, setCurrentView] = useState<BlinkAppView>('home');
  const [language, setLanguage] = useState<Language>('ar');
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);

  const [products] = useState(INITIAL_BLINK_PRODUCTS);
  const [contentPosts] = useState<ContentPost[]>(INITIAL_CONTENT_POSTS);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleSelectLocation = (city: string, district?: string) => {
    setUserLocation({
      city,
      district: district || 'الوسط',
      coordinates: [31.9539, 35.9106],
    });
    setIsLocationModalOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('market');
    }
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-neutral-50 text-neutral-900 font-['Tajawal',sans-serif] selection:bg-[#FF6B00] selection:text-white antialiased flex flex-col"
    >
      {/* 1. TOP: Country / Language Selector */}
      <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-white shadow-sm z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs sm:text-sm font-bold transition-colors border border-neutral-200"
        >
          <Globe className="w-4 h-4 text-neutral-600" />
          <span>{language === 'ar' ? 'ع / EN' : 'EN / ع'}</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 sm:px-4 py-2 rounded-full transition-colors border border-neutral-200"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B00]" />
            <span>{userLocation.city || 'عمان'}</span>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-neutral-900 text-white px-3 sm:px-4 py-2 rounded-full shadow-md">
            <JordanFlag className="w-4 h-3 sm:w-5 sm:h-3.5 rounded-sm shrink-0" />
            <span className="font-black text-xs sm:text-sm tracking-wide">الأردن</span>
          </div>
        </div>
      </header>

      {/* Main Home Dashboard */}
      {currentView === 'home' && (
        <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto p-4 sm:p-6 gap-8">
          
          {/* 2. CENTER: Search Box */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[35vh]">
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? "ابحث عن أي شيء تحتاجه..." : "Search for anything..."}
                className="w-full pl-4 pr-14 py-4 sm:py-6 bg-white border-2 border-neutral-200 focus:border-[#FF6B00] rounded-full shadow-xl text-base sm:text-xl font-bold outline-none transition-all placeholder:text-neutral-400"
              />
              <button 
                type="submit"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-95 rounded-full flex items-center justify-center shadow-md transition-all"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>

          {/* 3 & 4. BOTTOM: Content (Right in RTL) & Smart Market (Left in RTL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-auto pb-4 sm:pb-8">
            {/* Content Section */}
            <button
              onClick={() => setCurrentView('content')}
              className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-8 sm:p-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[32px] sm:rounded-[40px] border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500 rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clapperboard className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-indigo-900 mb-1 sm:mb-2">{language === 'ar' ? 'المحتوى' : 'Content'}</h2>
                <p className="text-indigo-700/80 font-medium text-sm sm:text-base">{language === 'ar' ? 'استكشف أحدث الفيديوهات والمنشورات' : 'Explore the latest videos & posts'}</p>
              </div>
            </button>

            {/* Smart Market Section */}
            <button
              onClick={() => setCurrentView('market')}
              className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-8 sm:p-12 bg-gradient-to-br from-orange-50 to-amber-50 rounded-[32px] sm:rounded-[40px] border-2 border-orange-100 hover:border-[#FF6B00]/40 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FF6B00] rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-[#FF6B00] mb-1 sm:mb-2">{language === 'ar' ? 'السوق الذكي' : 'Smart Market'}</h2>
                <p className="text-orange-700/80 font-medium text-sm sm:text-base">{language === 'ar' ? 'تسوق واكتشف أحدث المنتجات والخدمات' : 'Shop and discover latest products'}</p>
              </div>
            </button>
          </div>
        </main>
      )}

      {/* Views */}
      {currentView === 'market' && (
        <div className="flex-1 flex flex-col bg-neutral-50 relative">
          <header className="bg-white shadow-sm p-4 sticky top-0 z-50 flex items-center">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 font-bold text-neutral-600 hover:text-black">
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" /> {language === 'ar' ? 'رجوع للرئيسية' : 'Back to Home'}
            </button>
          </header>
          <div className="flex-1 relative z-0">
            <SmartMarketSevenView
              items={products.filter((p) =>
                ['appliances', 'furniture', 'pets', 'pet_supplies', 'tools', 'home_tools', 'wholesale'].includes(p.category)
              )}
              userLocation={userLocation}
              onAddItem={() => {}}
              onBackToHome={() => setCurrentView('home')}
              onShowToast={() => {}}
            />
          </div>
        </div>
      )}

      {currentView === 'content' && (
        <div className="flex-1 flex flex-col bg-neutral-50 relative">
          <header className="bg-white shadow-sm p-4 sticky top-0 z-50 flex items-center">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 font-bold text-neutral-600 hover:text-black">
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" /> {language === 'ar' ? 'رجوع للرئيسية' : 'Back to Home'}
            </button>
          </header>
          <div className="flex-1 p-0 sm:p-6 relative z-0">
            <JordanContentFeedView
              posts={contentPosts}
              onBackToHome={() => setCurrentView('home')}
              onOpenCreatorProfile={() => {}}
              onShowToast={() => {}}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
}
