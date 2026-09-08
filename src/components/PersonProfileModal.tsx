import React, { useState, useMemo } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  UserPlus,
  UserCheck,
  MapPin,
  Star,
  CheckCircle2,
  Share2,
  Bookmark,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Play,
  Volume2,
  Heart,
  Tag,
  ShoppingBag,
  Film,
} from 'lucide-react';
import { MarketItem, ContentPost, ServiceProvider } from '../types';

export interface PersonData {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  city: string;
  district: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  isVerified?: boolean;
}

interface PersonProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonData | ServiceProvider | null;
  allMarketItems: MarketItem[];
  allContentPosts: ContentPost[];
  currentSearchQuery?: string;
  onOpenMarketItem?: (item: MarketItem) => void;
  onOpenContentPost?: (post: ContentPost) => void;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  isOpen,
  onClose,
  person,
  allMarketItems,
  allContentPosts,
  currentSearchQuery = '',
  onOpenMarketItem,
  onOpenContentPost,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  if (!isOpen || !person) return null;

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const cleanWhatsapp = (person.whatsapp || person.phone || '').replace(/\D/g, '');

  // 1. Gather Person's Marketplace Products (and fallback related items if none exist)
  const personProducts = useMemo(() => {
    const directMatches = allMarketItems.filter(
      (m) =>
        m.sellerId === person.id ||
        (person.name && m.sellerName?.toLowerCase().includes(person.name.toLowerCase())) ||
        (person.whatsapp && m.sellerWhatsapp === person.whatsapp)
    );

    let list = directMatches.length > 0 ? directMatches : allMarketItems.slice(0, 5);

    // Intent Logic: Sort and highlight items matching currentSearchQuery
    if (currentSearchQuery.trim()) {
      const qTerms = currentSearchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2);

      list = [...list].sort((a, b) => {
        const textA = `${a.title} ${a.description} ${a.category}`.toLowerCase();
        const textB = `${b.title} ${b.description} ${b.category}`.toLowerCase();
        const scoreA = qTerms.reduce((acc, t) => (textA.includes(t) ? acc + 10 : acc), 0);
        const scoreB = qTerms.reduce((acc, t) => (textB.includes(t) ? acc + 10 : acc), 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [allMarketItems, person, currentSearchQuery]);

  // 2. Gather Person's Content Posts (and fallback related videos if none exist)
  const personContent = useMemo(() => {
    const directMatches = allContentPosts.filter(
      (c) =>
        (person.name && c.creatorName?.toLowerCase().includes(person.name.toLowerCase())) ||
        c.creatorPageId === person.id
    );

    let list = directMatches.length > 0 ? directMatches : allContentPosts.slice(0, 4);

    // Intent Logic: Sort and highlight videos matching currentSearchQuery
    if (currentSearchQuery.trim()) {
      const qTerms = currentSearchQuery
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2);

      list = [...list].sort((a, b) => {
        const textA = `${a.title} ${a.description} ${a.category}`.toLowerCase();
        const textB = `${b.title} ${b.description} ${b.category}`.toLowerCase();
        const scoreA = qTerms.reduce((acc, t) => (textA.includes(t) ? acc + 10 : acc), 0);
        const scoreB = qTerms.reduce((acc, t) => (textB.includes(t) ? acc + 10 : acc), 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [allContentPosts, person, currentSearchQuery]);

  const toggleSave = (id: string, title: string) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`تمت إزالة "${title}" من المحفوظات`);
      } else {
        next.add(id);
        showToast(`تم حفظ "${title}" للرجوع إليه لاحقاً 🔖`);
      }
      return next;
    });
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${person.name} - ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ الرابط بنجاح! ↗️');
    }
  };

  // Check if current item matches intent
  const isItemIntentMatched = (title: string, desc: string) => {
    if (!currentSearchQuery.trim()) return false;
    const terms = currentSearchQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const combined = `${title} ${desc}`.toLowerCase();
    return terms.some((t) => combined.includes(t));
  };

  const currentProduct = personProducts[activeProductIndex] || personProducts[0];
  const currentContent = personContent[activeContentIndex] || personContent[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {copyToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[92vh] max-h-[780px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header (Avatar, Name, Profession tag, Location, Rating, Whatsapp button, Follow button) */}
        <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-5 pt-6 border-b border-neutral-800 shrink-0">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-lg"
              />
              {person.isVerified !== false && (
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-neutral-950 p-1 rounded-full shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 text-right">
              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                <span className="text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-lg">
                  {person.profession || 'مقدم خدمة'}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white truncate">
                  {person.name}
                </h2>
              </div>

              <div className="flex items-center justify-end gap-3 mt-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-neutral-200">({person.reviewCount || 34})</span>
                  <span className="font-black text-amber-400">{person.rating || 4.9}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex items-center gap-1 text-neutral-300">
                  <span>{person.city} - {person.district}</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>

              {person.bio && (
                <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed text-right">
                  {person.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Whatsapp & Follow */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {cleanWhatsapp ? (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`مرحباً ${person.name}، رأيت حسابك في بلينك وأرغب بالتواصل معك.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>واتساب مباشر 🟢</span>
              </a>
            ) : (
              <button
                onClick={() => showToast('رقم الواتساب غير متاح حالياً')}
                className="bg-neutral-800 text-neutral-400 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsFollowing(!isFollowing);
                showToast(!isFollowing ? `أصبحت تتابع ${person.name}` : `تم إلغاء متابعة ${person.name}`);
              }}
              className={`font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors border ${
                isFollowing
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  : 'bg-white hover:bg-neutral-100 text-neutral-950 border-white'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>مُتابَع ✓</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-neutral-950" />
                  <span>متابعة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Exactly 2 Tabs: "المنتجات" & "المحتوى" */}
        <div className="grid grid-cols-2 border-b border-neutral-800 bg-neutral-950 text-xs font-black shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>المنتجات ({personProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === 'content'
                ? 'border-amber-400 text-amber-400 bg-neutral-900/50'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>المحتوى ({personContent.length})</span>
          </button>
        </div>

        {/* Tab 1: المنتجات (Vertical Swipe Video/Photo Feed of User's Marketplace Products) */}
        {activeTab === 'products' && (
          <div className="flex-1 relative overflow-hidden flex flex-col bg-black">
            {personProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mb-2" />
                <p className="font-bold text-sm">لا توجد منتجات معروضة حالياً لهذا المستخدم</p>
              </div>
            ) : (
              <div className="relative flex-1 w-full h-full flex flex-col justify-between">
                {/* Product Image / Video Visual */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={currentProduct.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Intent Highlight Banner if Matched */}
                {isItemIntentMatched(currentProduct.title, currentProduct.description) && (
                  <div className="relative z-10 m-3 self-start bg-amber-400 text-neutral-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                    <span>مطابق لبحثك 🎯 «{currentSearchQuery}»</span>
                  </div>
                )}

                {/* Right Side Vertical Quick Actions: Save, Share, Next/Prev Swiper Controls */}
                <div className="relative z-10 mr-auto ml-3 my-auto flex flex-col items-center gap-3">
                  {/* Previous Item (Swipe Up) */}
                  <button
                    disabled={activeProductIndex === 0}
                    onClick={() => setActiveProductIndex((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 disabled:opacity-30 transition-all active:scale-95"
                    title="المنتج السابق"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={() => toggleSave(currentProduct.id, currentProduct.title)}
                    className={`w-11 h-11 rounded-full flex flex-col items-center justify-center border transition-all active:scale-90 ${
                      savedItemIds.has(currentProduct.id)
                        ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg'
                        : 'bg-black/60 hover:bg-black/80 text-white border-white/20'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${savedItemIds.has(currentProduct.id) ? 'fill-neutral-950' : ''}`} />
                  </button>
                  <span className="text-[10px] text-neutral-300 font-bold -mt-2">
                    {savedItemIds.has(currentProduct.id) ? 'محفوظ' : 'حفظ'}
                  </span>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(currentProduct.title)}
                    className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex flex-col items-center justify-center border border-white/20 active:scale-90 transition-all shadow-md"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-neutral-300 font-bold -mt-2">مشاركة</span>

                  {/* Next Item (Swipe Down) */}
                  <button
                    disabled={activeProductIndex === personProducts.length - 1}
                    onClick={() => setActiveProductIndex((prev) => Math.min(personProducts.length - 1, prev + 1))}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 disabled:opacity-30 transition-all active:scale-95"
                    title="المنتج التالي"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Overlay: Price, Location, Whatsapp, Title & Description */}
                <div className="relative z-10 p-4 pt-10 text-right space-y-2.5">
                  {/* Badge Row: Price & Location */}
                  <div className="flex items-center justify-end gap-2">
                    <div className="bg-neutral-900/90 text-neutral-200 border border-neutral-700 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                      <span>{currentProduct.city} - {currentProduct.district}</span>
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1 shadow-md">
                      <span>{currentProduct.price} {currentProduct.currency || 'د.أ'}</span>
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {currentProduct.title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {currentProduct.description}
                  </p>

                  {/* Whatsapp CTA Button */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${(currentProduct.sellerWhatsapp || cleanWhatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً، أنا مهتم بشراء "${currentProduct.title}" المعروض بسعر ${currentProduct.price} ${currentProduct.currency || 'د.أ'} في بلينك.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>تواصل واتساب للشراء 🟢</span>
                    </a>
                  </div>

                  {/* Indicator Counter */}
                  <div className="text-center pt-1 text-[11px] text-neutral-400 font-bold">
                    إعلان {activeProductIndex + 1} من {personProducts.length} (اسحب للأعلى للتالي)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: المحتوى (Vertical Swipe Video Feed of User's Content) */}
        {activeTab === 'content' && (
          <div className="flex-1 relative overflow-hidden flex flex-col bg-black">
            {personContent.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                <Film className="w-12 h-12 text-neutral-600 mb-2" />
                <p className="font-bold text-sm">لا يوجد محتوى مرئي منشور لهذا المستخدم</p>
              </div>
            ) : (
              <div className="relative flex-1 w-full h-full flex flex-col justify-between">
                {/* Video / Visual Asset */}
                <div className="absolute inset-0 z-0">
                  {currentContent.videoUrl ? (
                    <video
                      key={currentContent.id}
                      src={currentContent.videoUrl}
                      poster={currentContent.posterUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentContent.posterUrl}
                      alt={currentContent.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>

                {/* Intent Highlight Banner if Matched */}
                {isItemIntentMatched(currentContent.title, currentContent.description) && (
                  <div className="relative z-10 m-3 self-start bg-amber-400 text-neutral-950 font-black text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                    <span>محتوى مطابق لبحثك 🎯 «{currentSearchQuery}»</span>
                  </div>
                )}

                {/* Right Side Vertical Actions */}
                <div className="relative z-10 mr-auto ml-3 my-auto flex flex-col items-center gap-3">
                  <button
                    disabled={activeContentIndex === 0}
                    onClick={() => setActiveContentIndex((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 disabled:opacity-30 transition-all active:scale-95"
                    title="المقطع السابق"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                    <span className="text-[10px] text-neutral-200 font-bold mt-1">
                      {currentContent.likes || 120}
                    </span>
                  </div>

                  <button
                    onClick={() => handleShare(currentContent.title)}
                    className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 active:scale-90"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-neutral-300 font-bold -mt-2">مشاركة</span>

                  <button
                    disabled={activeContentIndex === personContent.length - 1}
                    onClick={() => setActiveContentIndex((prev) => Math.min(personContent.length - 1, prev + 1))}
                    className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 disabled:opacity-30 transition-all active:scale-95"
                    title="المقطع التالي"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Overlay Info */}
                <div className="relative z-10 p-4 pt-10 text-right space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                      {currentContent.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {currentContent.title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {currentContent.description}
                  </p>

                  <div className="text-center pt-2 text-[11px] text-neutral-400 font-bold">
                    مقطع {activeContentIndex + 1} من {personContent.length} (اسحب للأعلى للتالي)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
