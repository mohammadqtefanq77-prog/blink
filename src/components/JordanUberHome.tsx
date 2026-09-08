import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Sparkles,
  BookOpen,
  Store,
  X,
  Phone,
  MessageCircle,
  Star,
  CheckCircle2,
  ChevronLeft,
  Wrench,
  Zap,
  Hammer,
  Truck,
  Shield,
  Clock,
  Radio,
  Car,
  Home,
  Shirt,
  Utensils,
  Search,
  ShoppingCart,
  Clapperboard,
  Brain,
} from 'lucide-react';
import { JordanFlag } from './JordanFlag';
import { ServiceProvider, UserLocation, RegistrationRole } from '../types';

interface JordanUberHomeProps {
  userLocation: UserLocation;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  onOpenLocationModal: () => void;
  onNavigateToMarket: () => void;
  onNavigateToContent: () => void;
  onNavigateToCategory?: (category: 'cars' | 'real_estate' | 'clothes' | 'restaurants') => void;
  onNavigateToShipping?: () => void;
  onOpenVerifiedModal: () => void;
  professionals: ServiceProvider[];
  onOpenPersonProfile?: (provider: ServiceProvider) => void;
  onOpenRegistration?: (role?: RegistrationRole) => void;
  onShowToast: (message: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

// Exactly the 5 requested categories
export interface MainCategoryOption {
  id: string;
  name: string;
  icon: string;
  subtext: string;
  accentColor: string;
  searchKey: string;
}

export const MAIN_5_CATEGORIES: MainCategoryOption[] = [
  {
    id: 'plumber',
    name: 'سباك',
    icon: '🚰',
    subtext: 'مواسير، حنفيات، كشف تسريب مياه، وتركيب مضخات',
    accentColor: 'from-blue-600 to-cyan-700',
    searchKey: 'سباك',
  },
  {
    id: 'electrician',
    name: 'كهربائي',
    icon: '⚡',
    subtext: 'شورت كهربا، إنارة، تصليح أعطال، وتمديدات قواطع',
    accentColor: 'from-amber-500 to-orange-600',
    searchKey: 'كهربجي',
  },
  {
    id: 'carpenter',
    name: 'نجار',
    icon: '🪚',
    subtext: 'فك وتركيب أثاث، تصليح أبواب ومطابخ، وغرف نوم',
    accentColor: 'from-amber-700 to-stone-800',
    searchKey: 'نجار',
  },
  {
    id: 'blacksmith',
    name: 'حداد',
    icon: '🔨',
    subtext: 'حمايات شبابيك، أبواب أمان، مظلات، وأعمال لحام',
    accentColor: 'from-neutral-700 to-neutral-900',
    searchKey: 'حداد',
  },
  {
    id: 'mover',
    name: 'نقل أثاث',
    icon: '🚚',
    subtext: 'ديانات نقل عفش، كادر تحميل وتنزيل، وونش هيدروليك',
    accentColor: 'from-emerald-600 to-teal-800',
    searchKey: 'نقل عفش',
  },
];

export const JordanUberHome: React.FC<JordanUberHomeProps> = ({
  userLocation,
  language,
  onToggleLanguage,
  onOpenLocationModal,
  onNavigateToMarket,
  onNavigateToContent,
  onNavigateToCategory,
  onNavigateToShipping,
  onOpenVerifiedModal,
  professionals,
  onOpenPersonProfile,
  onOpenRegistration,
  onShowToast,
  cartCount = 0,
  onOpenCart,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetStep, setBottomSheetStep] = useState<'main_choice' | 'need_service' | 'want_to_register'>('main_choice');
  const [selectedCategory, setSelectedCategory] = useState<MainCategoryOption | null>(null);
  const [broadcastState, setBroadcastState] = useState<{ [key: string]: boolean }>({});
  const [searchIntentQuery, setSearchIntentQuery] = useState('');

  // Filter professionals when a category is selected
  const matchingProviders = selectedCategory
    ? professionals.filter((p) => {
        const text = `${p.profession} ${p.bio} ${p.servicesOffered?.join(' ') || ''}`.toLowerCase();
        return text.includes(selectedCategory.searchKey?.toLowerCase() || '');
      })
    : [];

  const handleBroadcastCategory = (catName: string) => {
    setBroadcastState((prev) => ({ ...prev, [catName]: true }));
    onShowToast(`تم تعميم طلبك على جميع معلمي ${catName} في ${userLocation.city || 'المنطقة'}! سيتواصلون معك فوراً.`);
  };

  // Smart Search Intent routing
  const handlePerformIntentSearch = (rawText: string) => {
    const q = rawText.trim().toLowerCase();
    if (!q) return;

    if (q.includes('سيار') || q.includes('معرض') || q.includes('معارض') || q.includes('هايبرد') || q.includes('فحص')) {
      setIsBottomSheetOpen(false);
      onNavigateToCategory?.('cars');
      onShowToast('تم توجيهك إلى شبكة معارض ومتاجر السيارات 🚗');
      return;
    }
    if (q.includes('عقار') || q.includes('شقة') || q.includes('شقق') || q.includes('فيلا') || q.includes('اسكان') || q.includes('مكتب عقار')) {
      setIsBottomSheetOpen(false);
      onNavigateToCategory?.('real_estate');
      onShowToast('تم توجيهك إلى شركات ومكاتب العقارات 🏠');
      return;
    }
    if (q.includes('لبس') || q.includes('البسة') || q.includes('ملابس') || q.includes('بلوز') || q.includes('جاكيت') || q.includes('بنطلون') || q.includes('هودي')) {
      setIsBottomSheetOpen(false);
      onNavigateToCategory?.('clothes');
      onShowToast('تم توجيهك إلى متاجر الألبسة وتجميع الشحن (1 د.أ) 👕');
      return;
    }
    if (q.includes('مطعم') || q.includes('مطاعم') || q.includes('وجبة') || q.includes('اكل') || q.includes('برجر') || q.includes('مشاوي') || q.includes('شاورما')) {
      setIsBottomSheetOpen(false);
      onNavigateToCategory?.('restaurants');
      onShowToast('تم توجيهك إلى المطاعم وقوائم الطعام الموثقة 🍔');
      return;
    }
    if (q.includes('شحن') || q.includes('توصيل') || q.includes('طرد') || q.includes('طرود') || q.includes('تجميع') || q.includes('ديانا')) {
      setIsBottomSheetOpen(false);
      if (onNavigateToShipping) {
        onNavigateToShipping();
      }
      onShowToast('تم توجيهك إلى بولز وتجميع شركات الشحن 🚚');
      return;
    }
    if (q.includes('سوق') || q.includes('جملة') || q.includes('حيوان') || q.includes('اجهزة') || q.includes('اثاث') || q.includes('عفش') || q.includes('عدد')) {
      setIsBottomSheetOpen(false);
      onNavigateToMarket();
      onShowToast('تم توجيهك إلى السوق الذكي (7 أقسام) 🧠');
      return;
    }
    if (q.includes('محتوى') || q.includes('فيديو') || q.includes('ستوري') || q.includes('صانع') || q.includes('ريلز')) {
      setIsBottomSheetOpen(false);
      onNavigateToContent();
      onShowToast('تم توجيهك إلى منصة المحتوى وفيديوهات صناع الأردن 🎬');
      return;
    }

    // Craftsman match
    const foundCat = MAIN_5_CATEGORIES.find((c) => q.includes(c.name) || q.includes(c.searchKey));
    if (foundCat) {
      setBottomSheetStep('need_service');
      setSelectedCategory(foundCat);
      return;
    }

    // Default: switch to need_service
    setBottomSheetStep('need_service');
    onShowToast(`البحث عن: «${rawText}» في خدمات بلينك`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-white text-neutral-900 font-['Tajawal',sans-serif]">
      {/* 1. Header: 
          - Left: Language toggle (ع / EN + Globe icon)
          - Right: Word "الأردن" + correct Jordan flag + location pin */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-20">
        {/* Left: Language (ع / EN + Globe) */}
        <div className="flex items-center gap-2">
          <button
            id="header-lang-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-bold transition-all active:scale-95 border border-neutral-200/80 shadow-sm"
            title="تبديل اللغة"
          >
            <Globe className="w-4 h-4 text-neutral-600" />
            <span>{language === 'ar' ? 'ع / EN' : 'EN / ع'}</span>
          </button>

          {/* Discreet National ID Badge */}
          <button
            id="header-verified-shortcut"
            onClick={onOpenVerifiedModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200/70"
            title="الحسابات الموثقة بالهوية الوطنية 🇯🇴"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>موثوق 🇯🇴</span>
          </button>
        </div>

        {/* Right: Word "الأردن" + Jordan Flag + Location Pin */}
        <div className="flex items-center gap-2.5">
          <button
            id="header-location-btn"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full border border-neutral-200/80 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>{userLocation.city || 'عمان'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-neutral-950 text-white px-3.5 py-1.5 rounded-full shadow-md">
            <JordanFlag className="w-6 h-3.5 rounded-sm shrink-0" />
            <span className="font-black text-xs sm:text-sm tracking-wide">الأردن</span>
          </div>
        </div>
      </header>

      {/* 2. Middle of Screen: 
          Massive orange rounded button "شو محتاج اليوم؟" with Uber-like minimalist design */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 my-auto relative">
        {/* Floating Cart Indicator if items exist */}
        {cartCount > 0 && (
          <button
            onClick={onOpenCart}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950 text-white shadow-xl border border-neutral-700 hover:border-[#FF6B00] transition-all active:scale-95 animate-bounce"
          >
            <ShoppingCart className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-xs font-black">
              سلة التجميع: {cartCount} قطع (شحن 1 د.أ)
            </span>
          </button>
        )}

        <button
          id="btn-what-do-you-need-today"
          onClick={() => {
            setSelectedCategory(null);
            setBottomSheetStep('main_choice');
            setSearchIntentQuery('');
            setIsBottomSheetOpen(true);
          }}
          className="w-full max-w-lg py-7 sm:py-9 px-6 sm:px-10 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.98] text-white font-black text-2xl sm:text-4xl rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-[#FF6B00]/40 transition-all duration-300 flex items-center justify-center gap-3.5 text-center tracking-tight border-4 border-white/20 ring-4 ring-[#FF6B00]/20 hover:shadow-orange-500/50"
        >
          <span>شو محتاج اليوم؟</span>
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white/90 animate-pulse shrink-0" />
        </button>
      </main>

      {/* 3. Footer:
          6/7 Main sections requested by master prompt:
          [محتوى 🎬] [سوق ذكي 🧠] [سيارات 🚗] [عقار 🏠] [البسة 👕] [مطاعم 🍔] [شحن 🚚] */}
      <footer className="w-full border-t border-neutral-200 bg-white/95 backdrop-blur-md py-2 sm:py-2.5 px-2 sm:px-4 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {/* 1. محتوى 🎬 */}
          <button
            id="footer-content-btn"
            onClick={onNavigateToContent}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="محتوى وفيديوهات صناع الأردن"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🎬
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">محتوى</span>
          </button>

          {/* 2. سوق ذكي 🧠 */}
          <button
            id="footer-smart-market-btn"
            onClick={onNavigateToMarket}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="السوق الذكي - 7 أقسام صارمة"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-orange-50 group-hover:bg-[#FF6B00] text-[#FF6B00] group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🧠
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">سوق ذكي</span>
          </button>

          {/* 3. سيارات 🚗 */}
          <button
            id="footer-cars-btn"
            onClick={() => onNavigateToCategory?.('cars')}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="معارض ومتاجر السيارات"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🚗
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">سيارات</span>
          </button>

          {/* 4. عقار 🏠 */}
          <button
            id="footer-real-estate-btn"
            onClick={() => onNavigateToCategory?.('real_estate')}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="شركات ومكاتب العقارات"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🏠
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">عقار</span>
          </button>

          {/* 5. البسة 👕 */}
          <button
            id="footer-clothes-btn"
            onClick={() => onNavigateToCategory?.('clothes')}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="متاجر الألبسة وتجميع الشحن (1 د.أ)"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              👕
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">ألبسة</span>
          </button>

          {/* 6. مطاعم 🍔 */}
          <button
            id="footer-restaurants-btn"
            onClick={() => onNavigateToCategory?.('restaurants')}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="المطاعم وقوائم الطعام"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🍔
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">مطاعم</span>
          </button>

          {/* 7. شحن 🚚 */}
          <button
            id="footer-shipping-btn"
            onClick={() => onNavigateToShipping?.()}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="شركات الشحن وبولز التجميع"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 group-hover:bg-[#FF6B00] text-emerald-700 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🚚
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">شحن</span>
          </button>

          {/* 8. مصانع 🏭 */}
          <button
            id="footer-factories-btn"
            onClick={() => onNavigateToCategory?.('factories')}
            className="flex-1 min-w-[58px] sm:min-w-[70px] group flex flex-col items-center gap-1 text-neutral-700 hover:text-[#FF6B00] transition-colors py-1 px-1 rounded-xl active:scale-95"
            title="مصانع ومنتجات جملة للتجميع"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-neutral-100 group-hover:bg-[#FF6B00] text-neutral-800 group-hover:text-white flex items-center justify-center transition-all shadow-sm text-base">
              🏭
            </div>
            <span className="text-[11px] sm:text-xs font-black truncate">مصانع</span>
          </button>
        </div>
      </footer>

      {/* 4. Bottom Sheet for "شو محتاج اليوم؟" */}
      {isBottomSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setIsBottomSheetOpen(false);
              setSelectedCategory(null);
            }}
          />

          {/* Sheet Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-t-[40px] shadow-2xl border-t border-neutral-200 p-5 sm:p-7 max-h-[88vh] overflow-y-auto z-10 animate-slideUp">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-4" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  {bottomSheetStep === 'main_choice' && 'شو محتاج اليوم؟'}
                  {bottomSheetStep === 'want_to_register' && 'بدي أسجل في بلينك 📝'}
                  {bottomSheetStep === 'need_service' && (
                    selectedCategory ? (
                      <span className="flex items-center gap-2">
                        <span>{selectedCategory.icon}</span>
                        <span>معلمو {selectedCategory.name} في {userLocation.city || 'الأردن'}</span>
                      </span>
                    ) : (
                      'بدي خدمة 🧰'
                    )
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
                  {bottomSheetStep === 'main_choice' && 'اختر ما ترغب به: طلب خدمة فورية أو تسجيل نشاطك التجاري في بلينك'}
                  {bottomSheetStep === 'want_to_register' && 'اختر نوع الحساب للانتقال إلى فورم التسجيل المخصص والمباشر في Firebase'}
                  {bottomSheetStep === 'need_service' && (
                    selectedCategory
                      ? 'فنيون معتمدون وموثقون بالهوية الوطنية 🇯🇴 جاهزون لخدمتك فوراً'
                      : 'اختر تصنيف الخدمة التي تحتاجها وسنوصلك بأقرب معلم موثوق'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Back button for Service category detail */}
                {bottomSheetStep === 'need_service' && selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span>التصنيفات</span>
                  </button>
                )}

                {/* Back button from sub-steps to main choice */}
                {(bottomSheetStep === 'want_to_register' || (bottomSheetStep === 'need_service' && !selectedCategory)) && (
                  <button
                    onClick={() => setBottomSheetStep('main_choice')}
                    className="flex items-center gap-1 text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span>الرجوع</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsBottomSheetOpen(false);
                    setSelectedCategory(null);
                  }}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* =================================================================
                STEP 1: MAIN CHOICE ("بدي خدمة" vs "بدي أسجل" + Smart Intent Search)
                ================================================================= */}
            {bottomSheetStep === 'main_choice' && (
              <div className="space-y-4 py-2">
                {/* Quick Intent Search Input */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchIntentQuery}
                      onChange={(e) => setSearchIntentQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePerformIntentSearch(searchIntentQuery);
                        }
                      }}
                      placeholder="اكتب ما تبحث عنه: معارض سيارات، شقة قريبة، متجر ألبسة، مطعم، شركة شحن..."
                      className="w-full pl-16 pr-12 py-3.5 rounded-2xl bg-neutral-100 border-2 border-neutral-200 focus:border-[#FF6B00] focus:bg-white text-sm font-bold outline-none transition-all"
                    />
                    <Search className="w-5 h-5 text-neutral-400 absolute right-4 top-4" />
                    {searchIntentQuery && (
                      <button
                        onClick={() => handlePerformIntentSearch(searchIntentQuery)}
                        className="absolute left-2.5 top-2.5 px-3 py-1.5 rounded-xl bg-[#FF6B00] text-white text-xs font-black hover:bg-[#e65c00] transition-colors"
                      >
                        بحث
                      </button>
                    )}
                  </div>

                  {/* Direct Intent Clickable Shortcuts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                    <button
                      onClick={() => handlePerformIntentSearch('سيارات')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      🚗 معارض سيارات
                    </button>
                    <button
                      onClick={() => handlePerformIntentSearch('عقار')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      🏠 مكاتب عقار
                    </button>
                    <button
                      onClick={() => handlePerformIntentSearch('البسة')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      👕 متاجر ألبسة
                    </button>
                    <button
                      onClick={() => handlePerformIntentSearch('مطاعم')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      🍔 مطاعم
                    </button>
                    <button
                      onClick={() => handlePerformIntentSearch('شحن')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      🚚 شركات شحن
                    </button>
                    <button
                      onClick={() => handlePerformIntentSearch('سوق ذكي')}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] border border-neutral-200 text-neutral-700 font-bold whitespace-nowrap transition-colors active:scale-95"
                    >
                      🧠 سوق ذكي
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Choice 1: بدي خدمة */}
                  <button
                    id="btn-choice-need-service"
                    onClick={() => setBottomSheetStep('need_service')}
                    className="p-5 rounded-3xl bg-neutral-50 hover:bg-orange-50/60 border-2 border-neutral-200 hover:border-[#FF6B00] transition-all flex flex-col items-start text-right group shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 text-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                      🧰
                    </div>
                    <div className="font-black text-xl text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                      بدي خدمة
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                      سباك، كهربائي، نجار، حداد، نقل أثاث، وفزعة طوارئ مياه وكهرباء سريعة
                    </div>
                    <div className="mt-4 text-xs font-black text-[#FF6B00] flex items-center gap-1">
                      <span>عرض الفنيين والتصنيفات</span>
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Choice 2: بدي أسجل */}
                  <button
                    id="btn-choice-want-register"
                    onClick={() => setBottomSheetStep('want_to_register')}
                    className="p-5 rounded-3xl bg-neutral-50 hover:bg-orange-50/60 border-2 border-neutral-200 hover:border-[#FF6B00] transition-all flex flex-col items-start text-right group shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 text-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                      📝
                    </div>
                    <div className="font-black text-xl text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                      بدي أسجل
                    </div>
                    <div className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                      صانع محتوى، خدمات (صنايعي)، شركة، متجر (سيارات/عقار)، مطعم، أو شركة شحن
                    </div>
                    <div className="mt-4 text-xs font-black text-[#FF6B00] flex items-center gap-1">
                      <span>اختيار نوع الحساب والتسجيل</span>
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================
                STEP 2A: WANT TO REGISTER (6 Registration Options)
                ================================================================= */}
            {bottomSheetStep === 'want_to_register' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-neutral-500 mb-1">
                  اختر أحد الخيارات الـ 6 للانتقال لفورم التسجيل المخصص:
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {/* 1. صانع محتوى */}
                  <button
                    id="sheet-reg-creator"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('creator');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🎥
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          صانع محتوى
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          فيديوهات وثائقية، تجارب هادفة، ستوريات، وعداد هدايا وإعجابات
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* 2. خدمات (صنايعي) */}
                  <button
                    id="sheet-reg-service"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('service');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🔧
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          خدمات (سباك، كهربائي، نجار...)
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          مهني حر، تحديد المهنة والمحافظة والخبرة واستقبال طلبات فورية
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* 3. شركة */}
                  <button
                    id="sheet-reg-company"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('company');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🏢
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          شركة
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          شركات مقاولات، نقل، وتوريد مع التوثيق بالهوية الوطنية 🇯🇴 وواتساب
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* 4. متجر */}
                  <button
                    id="sheet-reg-store"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('store');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🚗
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          متجر (سيارات / عقار / تجارة)
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          أسعار بالدينار، بطاقة تعريفية، وميزة التاغ @ لشركاء الخدمة (فحص، تعديل، فرش)
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* 5. مطعم */}
                  <button
                    id="sheet-reg-restaurant"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('restaurant');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🍽️
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          مطعم
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          قائمة وجبات، أسعار بالدينار، وموقع وطلب مباشر عبر واتساب
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>

                  {/* 6. شركة شحن */}
                  <button
                    id="sheet-reg-shipping"
                    onClick={() => {
                      setIsBottomSheetOpen(false);
                      onOpenRegistration?.('shipping');
                    }}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        🚚
                      </div>
                      <div>
                        <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                          شركة شحن وتوصيل طرود
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          استقبال شحنات التجميع (1 د.أ) والطلبات السريعة وإدارة خطوط السير
                        </div>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================
                STEP 2B: NEED SERVICE (5 Categories or Providers)
                ================================================================= */}
            {bottomSheetStep === 'need_service' && !selectedCategory && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MAIN_5_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      id={`category-btn-${cat.id}`}
                      onClick={() => setSelectedCategory(cat)}
                      className="group text-right p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 active:scale-[0.98] border border-neutral-200/80 hover:border-[#FF6B00]/40 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-white shadow-sm border border-neutral-200/60 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="font-black text-lg text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                            {cat.name}
                          </div>
                          <div className="text-xs text-neutral-500 font-medium line-clamp-1 mt-0.5">
                            {cat.subtext}
                          </div>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-neutral-400 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Quick Emergency Strip */}
                <div className="bg-neutral-950 text-white p-4 rounded-2xl flex items-center justify-between gap-3 mt-4 border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF6B00] flex items-center justify-center text-xl shrink-0">
                      🚨
                    </div>
                    <div>
                      <div className="font-black text-sm text-white">طوارئ مياه أو كهرباء؟</div>
                      <div className="text-xs text-neutral-400">
                        اطلب فزعة عاجلة وسيحضر أقرب فني مرخص خلال 20 دقيقة
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const plumber = MAIN_5_CATEGORIES[0];
                      setSelectedCategory(plumber);
                    }}
                    className="bg-[#FF6B00] hover:bg-[#e65c00] text-white text-xs font-black px-3.5 py-2 rounded-xl shrink-0 transition-colors"
                  >
                    فزعة طوارئ
                  </button>
                </div>
              </div>
            )}

            {/* Case B: Selected Category Detail & Providers */}
            {bottomSheetStep === 'need_service' && selectedCategory && (
              <div className="space-y-4">
                {/* 1-Click Broadcast for this Category */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-right">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-neutral-900">
                        تعميم طلب {selectedCategory.name} فوري على المنطقة
                      </div>
                      <div className="text-xs text-neutral-600">
                        إشعار فوري لجميع معلمي {selectedCategory.name} في {userLocation.city || 'عمان'} للرد عليك
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBroadcastCategory(selectedCategory.name)}
                    disabled={broadcastState[selectedCategory.name]}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 ${
                      broadcastState[selectedCategory.name]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FF6B00] hover:bg-[#e65c00] text-white active:scale-95'
                    }`}
                  >
                    {broadcastState[selectedCategory.name] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم التعميم بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-4 h-4" />
                        <span>تعميم بنقرة واحدة</span>
                      </>
                    )}
                  </button>
                </div>

                {/* List of Verified Providers in this Category */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-neutral-500 flex items-center justify-between">
                    <span>المعلمين المتاحين في منطقتك ({matchingProviders.length})</span>
                    <span className="text-emerald-700 font-black">جميعهم موثقون بالهوية الوطنية 🇯🇴</span>
                  </div>

                  {matchingProviders.length > 0 ? (
                    matchingProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#FF6B00]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={provider.avatar}
                            alt={provider.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-neutral-100 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-black text-sm text-neutral-900">{provider.name}</h4>
                              {provider.isIdentityVerified && (
                                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>موثوق 🇯🇴 99%</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-600 font-medium mt-0.5">
                              {provider.profession} • {provider.city} ({provider.district})
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                              <span className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {provider.rating} ({provider.reviewCount} تقييم)
                              </span>
                              <span>• خبرة {provider.yearsOfExperience || 8} سنوات</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                          {/* Direct WhatsApp */}
                          <a
                            href={`https://wa.me/${provider.whatsapp || '962791234567'}?text=${encodeURIComponent(
                              `مرحبا معلم ${provider.name}، شفت حسابك الموثق على تطبيق بلينك وبحاجة لخدمة ${selectedCategory.name} في ${userLocation.city || 'عمان'}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>واتساب</span>
                          </a>

                          {/* Direct Phone */}
                          <a
                            href={`tel:${provider.phone}`}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>اتصال</span>
                          </a>

                          {onOpenPersonProfile && (
                            <button
                              onClick={() => onOpenPersonProfile(provider)}
                              className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                              title="عرض الملف والتفاصيل"
                            >
                              الملف
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                      <p className="text-sm text-neutral-600 font-bold mb-2">
                        سيتم توجيه طلبك إلى أقرب معلم {selectedCategory.name} معتمد فوراً.
                      </p>
                      <button
                        onClick={() => handleBroadcastCategory(selectedCategory.name)}
                        className="bg-[#FF6B00] text-white text-xs font-black px-4 py-2 rounded-xl"
                      >
                        تعميم الطلب الآن
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
