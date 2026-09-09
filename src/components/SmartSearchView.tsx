import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Sparkles,
  MapPin,
  ChevronRight,
  Phone,
  MessageCircle,
  Play,
  Star,
  ExternalLink,
  Wrench,
  Film,
  ShoppingBag,
  Building2,
  Users,
  Video,
  Mic,
  MicOff,
  User,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
  Utensils,
  Scale,
  PlusCircle,
} from 'lucide-react';
import {
  SearchResultResponse,
  UserLocation,
  Language,
  ContentPost,
  MarketItem,
  Ad,
  ServiceProvider,
} from '../types';
import { translations } from '../locales/translations';

interface SmartSearchViewProps {
  onPerformSearch: (query: string) => Promise<SearchResultResponse | null>;
  searchResult: SearchResultResponse | null;
  isSearching: boolean;
  userLocation: UserLocation;
  language: Language;
  onOpenLocationModal: () => void;
  onOpenContentPost: (post: ContentPost) => void;
  onOpenAdDetail: (ad: Ad) => void;
  onOpenPage: (page: any) => void;
  onNavigateToServices?: () => void;
  onNavigateToEntertainment?: () => void;
  onNavigateToMarket?: () => void;
  onRequestServiceClick?: () => void;
  onOpenPersonProfile?: (person: any) => void;
  onOpenRegisterProvider?: () => void;
  onOpenAddMarketModal?: () => void;
  onOpenAddContentModal?: () => void;
  allAds?: Ad[];
}

// Exactly 5 contextual suggestions when focusing the search box
const SMART_FOCUS_SUGGESTIONS = [
  {
    id: 'services',
    title: 'أصحاب مهن وخدمات قريبة',
    query: 'بدي كهربجي قريب',
    icon: Wrench,
    desc: 'سباك، دهين، كهربجي، نقل عفش، تقليم زيتون',
    badge: 'خدمات فورية',
  },
  {
    id: 'taxi',
    title: 'سيارة أجرة وسفريات',
    query: 'بدي سيارة أجرة',
    icon: Car,
    desc: 'توصيل مشاوير خاصة، سفريات المطار والمحافظات',
    badge: 'تنقل سريع',
  },
  {
    id: 'market',
    title: 'السوق الذكي (بيع وشراء)',
    query: 'بدي سيارة للبيع',
    icon: ShoppingBag,
    desc: 'سيارات، موبايلات، أجهزة، بلايستيشن، أثاث مستعمل',
    badge: 'صفقات مباشرة',
  },
  {
    id: 'restaurants',
    title: 'مطاعم ومأكولات قريبة',
    query: 'بدي مطعم شاورما',
    icon: Utensils,
    desc: 'شاورما على الفحم، وجبات سريعة، مأكولات شعبية',
    badge: 'أقرب لك',
  },
  {
    id: 'lawyer',
    title: 'محامي واستشارات قانونية',
    query: 'بدي محامي استشارة قانونية',
    icon: Scale,
    desc: 'صياغة عقود، استشارات، متابعة قضايا',
    badge: 'معتمد',
  },
];

export const SmartSearchView: React.FC<SmartSearchViewProps> = ({
  onPerformSearch,
  searchResult,
  isSearching,
  userLocation,
  language,
  onOpenLocationModal,
  onOpenContentPost,
  onOpenAdDetail,
  onOpenPage,
  onNavigateToServices,
  onNavigateToEntertainment,
  onNavigateToMarket,
  onRequestServiceClick,
  onOpenPersonProfile,
  onOpenRegisterProvider,
  onOpenAddMarketModal,
  onOpenAddContentModal,
  allAds = [],
}) => {
  const t = translations[language];
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAllRanked, setShowAllRanked] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'all' | 'services' | 'market' | 'content' | 'ads'>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Reset showAllRanked on new query
  useEffect(() => {
    setShowAllRanked(false);
  }, [searchResult?.query]);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: prompt user
      const simulatedVoices = [
        'المي بتطفح',
        'بدي كهربجي قريب',
        'بدي سيارة أجرة',
        'بدي أبيع غسالة',
        'بدي محامي استشارة',
      ];
      const randomPrompt = simulatedVoices[Math.floor(Math.random() * simulatedVoices.length)];
      setQuery(randomPrompt);
      onPerformSearch(randomPrompt);
      return;
    }

    try {
      if (isListening) {
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-JO';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setIsFocused(false);
        onPerformSearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsFocused(false);
    onPerformSearch(query.trim());
  };

  const handleSelectSuggestion = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    setIsFocused(false);
    onPerformSearch(suggestedQuery);
  };

  // Switch to next ad cleanly
  const handleNextAd = () => {
    if (allAds.length === 0) return;
    setCurrentAdIndex((prev) => (prev + 1) % allAds.length);
  };

  const currentAd = allAds.length > 0 ? allAds[currentAdIndex % allAds.length] : null;

  // Check for conversational action triggers
  const cleanQ = (searchResult?.query || query).trim().toLowerCase();
  const isAddJobIntent =
    cleanQ.includes('أضيف مهنتي') ||
    cleanQ.includes('اضيف مهنتي') ||
    cleanQ.includes('بدي اضيف مهنتي') ||
    cleanQ.includes('بدي أضيف مهنتي') ||
    cleanQ.includes('تسجيل مهنة') ||
    cleanQ.includes('اضافة مهنة') ||
    cleanQ.includes('أريد إضافة مهنتي');

  const isAddMarketIntent =
    cleanQ.includes('أريد بيع') ||
    cleanQ.includes('اريد بيع') ||
    cleanQ.includes('بدي ابيع') ||
    cleanQ.includes('بدي أبيع') ||
    cleanQ.includes('إضافة إعلان بيع') ||
    cleanQ.includes('اضافة اعلان بالسوق') ||
    cleanQ.includes('بيع سلعة');

  const isAddContentIntent =
    cleanQ.includes('أنشر فيديو') ||
    cleanQ.includes('انشر فيديو') ||
    cleanQ.includes('أريد نشر فيديو') ||
    cleanQ.includes('بدي انشر فيديو') ||
    cleanQ.includes('إضافة محتوى') ||
    cleanQ.includes('اضافة محتوى');

  const analysis = searchResult?.analysis;
  const services = searchResult?.matchedServices || [];
  const content = searchResult?.matchedContent || [];
  const market = searchResult?.matchedMarket || [];
  const ads = searchResult?.matchedAds || [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-right pb-24">
      {/* 1. TOP HEADER & LOCATION */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-2xl border border-neutral-200 shadow-2xs transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{userLocation.displayName || `${userLocation.city} - ${userLocation.district}`}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-neutral-900 tracking-tight">بلينك</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>

      {/* 2. MAIN SMART SEARCH BOX (The Primary Entrance) */}
      <div ref={containerRef} className="relative z-30">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center bg-white rounded-3xl border-2 border-neutral-900/10 hover:border-neutral-900/20 focus-within:border-neutral-900 shadow-sm transition-all overflow-hidden">
            {/* Search Input */}
            <input
              ref={inputRef}
              id="input-smart-search-box"
              type="text"
              dir="rtl"
              value={query}
              onFocus={() => setIsFocused(true)}
              onClick={() => setIsFocused(true)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب أو تكلّم بلغتك... (مثال: «بدي كهربجي» أو «المي بتطفح»)"
              className="w-full pr-4 pl-24 py-4 text-sm sm:text-base font-medium text-neutral-900 bg-transparent focus:outline-none placeholder-neutral-400 text-right"
            />

            {/* Voice Mic & Submit Buttons */}
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="تكلّم بطلبك (بحث صوتي)"
                className={`p-2.5 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
              </button>

              {/* Submit Search Button */}
              <button
                id="btn-run-smart-search"
                type="submit"
                disabled={!query.trim() || isSearching}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white p-2.5 rounded-2xl transition-all shadow-xs active:scale-95"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Listening Indicator */}
        {isListening && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>جارٍ الاستماع لطلبك الصوتي الآن... تكلّم بلغتك الطبيعية</span>
            </div>
            <button
              type="button"
              onClick={() => setIsListening(false)}
              className="text-red-900 hover:underline text-[11px]"
            >
              إلغاء
            </button>
          </div>
        )}

        {/* Exactly 4-5 Contextual Suggestions (Shown ONLY when Search Box is active/focused) */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-neutral-200 rounded-3xl shadow-2xl p-3 space-y-1 text-right animate-in fade-in duration-150">
            <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400">
                اختر ما تبحث عنه مباشرة أو اكتب طلبك:
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg">
                5 خيارات فورية
              </span>
            </div>

            {SMART_FOCUS_SUGGESTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.query)}
                  className="w-full text-right p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-900 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 rotate-180 shrink-0 transition-colors" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Voice simulation prompts */}
      <div className="flex flex-wrap items-center gap-1.5 px-1">
        <span className="text-[11px] font-bold text-neutral-400">جرب بالصوت أو النص:</span>
        {[
          '🗣️ المي بتطفح',
          'بدي كهربجي قريب',
          'بدي سيارة أجرة',
          'بدي أبيع غسالة',
          'بدي مطعم شاورما',
        ].map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectSuggestion(tag.replace('🗣️ ', ''))}
            className="text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-xl transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isSearching && (
        <div className="bg-white rounded-3xl p-10 border border-neutral-200 text-center space-y-3 shadow-2xs">
          <div className="w-10 h-10 border-3 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-neutral-700">الذكاء الاصطناعي يفهم طلبك ويرتب لك الأقرب والأنسب...</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CONVERSATIONAL ACTION BANNERS (If query expresses intent to register or sell) */}
      {/* ========================================================================= */}
      {isAddJobIntent && onOpenRegisterProvider && (
        <div className="bg-amber-500 text-neutral-950 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-right shadow-sm animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-black flex items-center gap-1.5">
              <Wrench className="w-4 h-4" />
              <span>تسجيل مهنتك وحرفتك في بلينك 🛠️</span>
            </span>
            <p className="text-xs font-medium text-neutral-900">
              سجل مهنتك لتظهر لسكان منطقتك فور بحثهم عن خدمتك والتواصل معك مباشرة عبر واتساب والمكالمات.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRegisterProvider}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-black transition shadow-xs"
          >
            تسجيل مهنتي الآن
          </button>
        </div>
      )}

      {isAddMarketIntent && onOpenAddMarketModal && (
        <div className="bg-emerald-600 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-right shadow-sm animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-black flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>إضافة سلعة للبيع في السوق السريع 🛒</span>
            </span>
            <p className="text-xs text-emerald-100 font-medium">
              اعرض سيارتك، هاتفك، أثاثك، أو أجهزتك للبيع المباشر دون وسيط.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddMarketModal}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black transition shadow-xs"
          >
            + إضافة سلعة الآن
          </button>
        </div>
      )}

      {isAddContentIntent && onOpenAddContentModal && (
        <div className="bg-neutral-900 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-right shadow-sm animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-black flex items-center gap-1.5">
              <Film className="w-4 h-4 text-amber-400" />
              <span>نشر مقطع فيديو أو محتوى جديد 🎬</span>
            </span>
            <p className="text-xs text-neutral-300 font-medium">
              انشر فيديوهاتك مع التصنيف التلقائي الذكي بين الترفيه والمعرفة.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddContentModal}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-amber-500 text-neutral-950 hover:bg-amber-400 text-xs font-black transition shadow-xs"
          >
            + نشر محتوى جديد
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SEARCH RESULTS PRESENTATION (When query is active) */}
      {/* ========================================================================= */}
      {!isSearching && searchResult && (
        <div className="space-y-5">
          {/* AI Intent Badge */}
          {analysis && (
            <div className="bg-neutral-900 text-white rounded-3xl p-4 sm:p-5 border border-neutral-800 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>فهم النية بالذكاء الاصطناعي</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  التصنيف: <strong className="text-white">{analysis.extractedCategory}</strong>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {analysis.explanation}
              </p>
            </div>
          )}

          {/* Top 4-5 Unified Smart Ranked Matches */}
          {searchResult.rankedItems && searchResult.rankedItems.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/70 rounded-3xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">
                      أفضل الخيارات المناسبة لطلبك 🎯
                    </h3>
                    <p className="text-[11px] text-neutral-600">
                      مرتبة حسب المطابقة • الأقرب لموقعك • الأعلى تقييماً
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-lg">
                  {showAllRanked ? `الكل (${searchResult.rankedItems.length})` : 'أفضل 5 نتائج'}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {(showAllRanked ? searchResult.rankedItems : searchResult.rankedItems.slice(0, 5)).map((item, idx) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    {/* Item Meta & Info */}
                    <div
                      onClick={() => {
                        if (item.type === 'service' && onOpenPersonProfile) {
                          onOpenPersonProfile(item.rawItem);
                        } else if (item.type === 'ad') {
                          onOpenAdDetail(item.rawItem);
                        } else if (item.type === 'content') {
                          onOpenContentPost(item.rawItem);
                        } else if (item.type === 'page' && typeof onOpenPage === 'function') {
                          onOpenPage(item.rawItem);
                        } else if (item.type === 'store_product' || item.type === 'market_item') {
                          // Handle later if needed
                        }
                      }}
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    >
                      <div className="relative shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 rounded-2xl object-cover border border-neutral-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700">
                            {item.typeLabel}
                          </span>
                          {item.isAvailableNow && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                              🟢 متاح الآن
                            </span>
                          )}
                          {item.rating && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{item.rating}</span>
                            </span>
                          )}
                          {item.distanceKm !== undefined && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                              {item.distanceKm} كم
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-neutral-900 text-sm mt-1 truncate hover:text-amber-800 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                          {item.subtitle || item.description}
                        </p>
                        {item.price && (
                          <span className="text-xs font-black text-amber-700 mt-1 block">
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {/* Person Profile Page Trigger */}
                      {item.type === 'service' && onOpenPersonProfile && (
                        <button
                          type="button"
                          onClick={() => onOpenPersonProfile(item.rawItem)}
                          className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition flex items-center gap-1"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>الملف</span>
                        </button>
                      )}

                      {item.whatsapp && (
                        <a
                          href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          title="واتساب"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}

                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>اتصال</span>
                        </a>
                      )}

                      {item.type === 'content' && (
                        <button
                          type="button"
                          onClick={() => onOpenContentPost(item.rawItem)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>مشاهدة</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More toggle */}
              {searchResult.rankedItems.length > 5 && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAllRanked(!showAllRanked)}
                    className="px-4 py-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition"
                  >
                    {showAllRanked
                      ? 'عرض أقل (الـ 5 خيارات الأولى فقط) ▲'
                      : `عرض باقي النتائج (+${searchResult.rankedItems.length - 5}) ▼`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CENTER SINGLE AD (When in Clean Home state or on the primary screen) */}
      {/* "في منتصف الشاشة يظهر إعلان واحد فقط في كل مرة. الإعلان يكون واضحًا ومنظمًا" */}
      {/* ========================================================================= */}
      {!searchResult && currentAd && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-neutral-400">إعلان تجاري مميز في منطقتك</span>
            {allAds.length > 1 && (
              <button
                type="button"
                onClick={handleNextAd}
                className="text-[11px] font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
              >
                <span>الإعلان التالي</span>
                <RotateCw className="w-3 h-3 text-amber-600" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-2xs hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div
                onClick={() => onOpenAdDetail(currentAd)}
                className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
              >
                <img
                  src={currentAd.images[0]}
                  alt={currentAd.businessName}
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                      إعلان تجاري
                    </span>
                    <h3 className="font-black text-neutral-900 text-sm sm:text-base truncate">
                      {currentAd.businessName}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
                    {currentAd.serviceOrProduct}
                  </p>
                  <span className="text-[11px] text-neutral-400 font-medium mt-1 block">
                    📍 {currentAd.city} - {currentAd.district}
                  </span>
                </div>
              </div>

              {/* Ad Contact Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                {currentAd.whatsapp && (
                  <a
                    href={`https://wa.me/${currentAd.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                    title="واتساب"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`tel:${currentAd.phone}`}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-2xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DIRECT PILLAR SHORTCUTS (Content Portal & Market Portal) */}
      {/* Base Rule: Market on one side, Content on other, Search in center */}
      {/* ========================================================================= */}
      {!searchResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Market Portal */}
          {onNavigateToMarket && (
            <button
              type="button"
              onClick={onNavigateToMarket}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-3xl p-4 text-right transition shadow-2xs hover:shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 group-hover:text-emerald-800 transition">
                    🛒 السوق الذكي
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    بيع وشراء مباشر للأفراد دون وسيط
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 rotate-180 transition" />
            </button>
          )}

          {/* Content Portal */}
          {onNavigateToEntertainment && (
            <button
              type="button"
              onClick={onNavigateToEntertainment}
              className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-3xl p-4 text-right transition shadow-2xs hover:shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 group-hover:text-rose-800 transition">
                    🎬 المحتوى والترفيه
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    فيديوهات قصيرة وتجارب وصناع محتوى
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 rotate-180 transition" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
