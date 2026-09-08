import React, { useState } from 'react';
import {
  X,
  Heart,
  Eye,
  Gift,
  Share2,
  Bookmark,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Play,
  Volume2,
  Tag,
  Plus,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  Calendar,
} from 'lucide-react';
import { BlinkEntityProfile, ProfileTag, ProfileStory, ProfileMediaItem } from '../types';

interface BlinkProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BlinkEntityProfile | null;
  onShowToast: (msg: string) => void;
}

export const BlinkProfileModal: React.FC<BlinkProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onShowToast,
}) => {
  // Tabs for Creator and Service: 'videos' | 'photos'
  const [activeMediaTab, setActiveMediaTab] = useState<'videos' | 'photos'>('videos');

  // Selected Media item
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Active Story Viewer
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  // Likes, saves, gifts state
  const [likesCount, setLikesCount] = useState<number>(profile?.totalLikes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [giftsCount, setGiftsCount] = useState<number>(profile?.totalGifts || 0);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [newStoryModalOpen, setNewStoryModalOpen] = useState(false);
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [selectedTagModal, setSelectedTagModal] = useState<ProfileTag | null>(null);

  if (!isOpen || !profile) return null;

  const currentMediaList = activeMediaTab === 'videos' ? profile.videos : profile.photos;
  const currentMedia: ProfileMediaItem | undefined = currentMediaList[activeMediaIndex] || currentMediaList[0];

  const handleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikesCount((prev) => prev + 1);
      onShowToast('تم تسجيل إعجابك بالمحتوى ❤️');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name} على بلينك الأردن`,
        text: profile.bio,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('تم نسخ رابط الصفحة للمشاركة 🔗');
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    onShowToast(!isSaved ? 'تم حفظ العنصر في مفضلتك 🔖' : 'تمت إزالة العنصر من المفضلة');
  };

  const handleSendGift = (giftName: string, coins: number) => {
    setGiftsCount((prev) => prev + 1);
    setIsGiftModalOpen(false);
    onShowToast(`تم إرسال «${giftName}» (${coins} دينار) كدعم لـ ${profile.name} 🎁🇯🇴`);
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryCaption.trim()) {
      onShowToast('يرجى كتابة نص للستوري');
      return;
    }
    const newStory: ProfileStory = {
      id: `story-${Date.now()}`,
      mediaUrl: profile.avatar,
      mediaType: 'image',
      caption: newStoryCaption.trim(),
      createdAt: 'الآن',
    };
    profile.stories = [newStory, ...(profile.stories || [])];
    setNewStoryCaption('');
    setNewStoryModalOpen(false);
    onShowToast('تم نشر الستوري بنجاح وستظهر أعلى صفحتك 📸!');
  };

  const cleanWhatsapp = (profile.whatsapp || profile.phone).replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 text-white rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden my-auto animate-slideUp font-['Tajawal',sans-serif] flex flex-col max-h-[92vh]">
        {/* =========================================================================
            HEADER BAR
            - Left: Close Button
            - Profile identity: Name, Verified 🇯🇴 Badge, Profession
            - Top Right: 
              * If Creator: 3 counters (❤️ Likes - 👁️ Views - 🎁 Gifts)
              * If Store / Restaurant / Company: Rating ⭐
            ========================================================================= */}
        <div className="p-4 sm:p-5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          {/* Right Side: Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-13 h-13 sm:w-15 sm:h-15 rounded-full object-cover border-2 border-[#FF6B00] shadow-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  if (profile.stories && profile.stories.length > 0) {
                    setViewingStoryIndex(0);
                  } else {
                    onShowToast(`صورة حساب ${profile.name}`);
                  }
                }}
              />
              {profile.stories && profile.stories.length > 0 && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-tr from-[#FF6B00] to-amber-400 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[8px]">
                  📸
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-black text-base sm:text-lg text-white truncate">
                  {profile.name}
                </h2>
                {/* Jordan National ID Verification Badge */}
                {profile.isVerified && (
                  <div
                    className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0"
                    title={`تم التحقق بالهوية الوطنية الأردنية (${profile.nationalIdMasked || 'موثق'})`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>موثوق بالهوية الوطنية 🇯🇴</span>
                  </div>
                )}
                {/* Financial/Commercial Plan Badge */}
                {profile.role !== 'creator' && profile.role !== 'service' && (
                  <div
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-[#FF6B00]/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-black shrink-0"
                    title="نظام مالي تجاري مركب وممول"
                  >
                    <Star className="w-3 h-3" />
                    <span>حساب تجاري ممول 💎</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-neutral-400 font-medium flex items-center gap-2 mt-0.5">
                <span className="text-[#FF6B00] font-bold">{profile.titleOrProfession}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>{profile.city} {profile.district ? `- ${profile.district}` : ''}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Left Side: Top Counters / Rating + Close */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* 1. CREATOR TOP RIGHT COUNTERS: Likes ❤️, Views 👁️, Gifts 🎁 */}
            {profile.role === 'creator' ? (
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-2xl">
                <div className="flex flex-col items-center px-1">
                  <span className="text-xs font-black text-rose-500 flex items-center gap-0.5">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    <span>{likesCount.toLocaleString()}</span>
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium">إعجاب</span>
                </div>

                <div className="w-[1px] h-6 bg-neutral-800" />

                <div className="flex flex-col items-center px-1">
                  <span className="text-xs font-black text-sky-400 flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    <span>{(profile.totalViews || 2400).toLocaleString()}</span>
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium">مشاهدة</span>
                </div>

                <div className="w-[1px] h-6 bg-neutral-800" />

                <div className="flex flex-col items-center px-1">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-0.5">
                    <Gift className="w-3 h-3 fill-amber-400" />
                    <span>{giftsCount.toLocaleString()}</span>
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium">هدايا</span>
                </div>
              </div>
            ) : (
              /* 2. STORE / RESTAURANT / COMPANY / SERVICE: Rating ⭐ at top right */
              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-2xl">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-black text-white">{profile.rating || 4.9}</span>
                <span className="text-[10px] text-neutral-400">({profile.reviewCount || 120})</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            INSTAGRAM-STYLE STORIES BAR (Above Profile Content)
            Allows creator / business to show stories and add new stories
            ========================================================================= */}
        <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-800/80 flex items-center gap-3 overflow-x-auto no-scrollbar shrink-0">
          {/* Add Story Button */}
          <button
            onClick={() => setNewStoryModalOpen(true)}
            className="flex flex-col items-center gap-1 shrink-0 group"
            title="أضف ستوري جديد"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#FF6B00] bg-neutral-900 group-hover:bg-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white">
              أضف ستوري
            </span>
          </button>

          {/* Active Stories */}
          {profile.stories &&
            profile.stories.map((story, sIdx) => (
              <button
                key={story.id}
                onClick={() => setViewingStoryIndex(sIdx)}
                className="flex flex-col items-center gap-1 shrink-0 group"
              >
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#FF6B00] via-amber-400 to-rose-500 group-hover:scale-105 transition-transform shadow-md">
                  <img
                    src={story.mediaUrl}
                    alt={story.caption}
                    className="w-full h-full rounded-full object-cover border border-neutral-950 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] font-medium text-neutral-300 max-w-[60px] truncate">
                  {story.caption || 'ستوري'}
                </span>
              </button>
            ))}
        </div>

        {/* =========================================================================
            BODY CONTENT AREA
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Bio strip */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
              {profile.bio}
            </p>
          )}

          {/* =======================================================================
              1. CRAFTSMAN (خدمات / صنايعي) SPECIAL HIGHLIGHT:
                 - Location & Profession prominently displayed
                 - Years of experience
                 - Fast broadcast & direct call
              ======================================================================= */}
          {profile.role === 'service' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-neutral-900 to-neutral-900 border border-[#FF6B00]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-neutral-400 mb-1">بيانات الحرفي المعتمد:</div>
                <div className="text-lg font-black text-white flex items-center gap-2">
                  <span>{profile.titleOrProfession}</span>
                  <span className="text-xs bg-[#FF6B00] text-white px-2 py-0.5 rounded-full font-bold">
                    خبرة {profile.experienceYears || 8} سنوات
                  </span>
                </div>
                <div className="text-xs text-neutral-300 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>الموقع المعتمد: {profile.city} - {profile.district || 'كامل المحافظة'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${profile.phone}`}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-neutral-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>اتصال هاتفي</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    `مرحبا معلم ${profile.name}، شفت حسابك الموثق على بلينك وبدي خدمة ${profile.titleOrProfession}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب مباشر</span>
                </a>
              </div>
            </div>
          )}

          {/* =======================================================================
              STACKED TABS FOR MEDIA: (فيديو / صور)
              Ordered vertically or as prominent stacked tabs
              ======================================================================= */}
          <div className="flex flex-col sm:flex-row gap-2 border-b border-neutral-800 pb-3">
            <button
              onClick={() => {
                setActiveMediaTab('videos');
                setActiveMediaIndex(0);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                activeMediaTab === 'videos'
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-[#FF6B00]/30'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>فيديو ({profile.videos?.length || 0})</span>
            </button>

            <button
              onClick={() => {
                setActiveMediaTab('photos');
                setActiveMediaIndex(0);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border ${
                activeMediaTab === 'photos'
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-[#FF6B00]/30'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>صور ومعرض أعمال ({profile.photos?.length || 0})</span>
            </button>
          </div>

          {/* =======================================================================
              MAIN MEDIA STAGE WITH FLOATING CARDS & INTERACTION BUTTONS
              Strictly matching user requirements for each profile type:
              1. Creator: Full video, floating card, left (Like, Share, Save), bottom right animated gift box
              2. Store (Cars / Real Estate): Floating card with price in JOD, location, green WhatsApp, clickable @tags
              3. Restaurant: Floating card with price in JOD, location, green WhatsApp, menu
              4. Service: Work showcase video/photo, clear profession/location
              5. Company: Like, Share, Location, green WhatsApp
              ======================================================================= */}
          {currentMedia ? (
            <div className="relative aspect-[4/5] sm:aspect-video rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group">
              {/* Media Element: Video or Image */}
              {currentMedia.type === 'video' ? (
                <video
                  src={currentMedia.mediaUrl}
                  poster={currentMedia.posterUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentMedia.mediaUrl}
                  alt={currentMedia.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => onShowToast(`عرض صورة: ${currentMedia.title}`)}
                />
              )}

              {/* Top gradient for legibility */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/25 to-black/50" />

              {/* =====================================================================
                  LEFT SIDE BUTTONS: LIKE ❤️, SHARE 🔗, SAVE 🔖
                  (As specifically required for Creator and Company)
                  ===================================================================== */}
              <div className="absolute top-4 left-4 z-20 flex flex-col items-center gap-2.5">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                    hasLiked
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40'
                      : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                  }`}
                  title="إعجاب"
                >
                  <Heart className={`w-5 h-5 ${hasLiked ? 'fill-white' : ''}`} />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all active:scale-90"
                  title="مشاركة"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {/* Save Button */}
                <button
                  onClick={handleToggleSave}
                  className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                    isSaved
                      ? 'bg-[#FF6B00] text-white border-orange-400 shadow-lg'
                      : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                  }`}
                  title="حفظ"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* =====================================================================
                  BOTTOM RIGHT ANIMATED GIFT BOX FOR CREATOR 🎁
                  (أسفل الشاشة يمين صندوق هدايا صغير متحرك)
                  ===================================================================== */}
              {profile.role === 'creator' && (
                <div className="absolute bottom-6 right-6 z-30">
                  <button
                    onClick={() => setIsGiftModalOpen(true)}
                    className="relative p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF6B00] to-rose-500 text-white shadow-xl shadow-orange-500/40 border-2 border-white/30 animate-bounce flex items-center gap-2 group active:scale-95"
                    title="أرسل هدية أو دعماً لصانع المحتوى 🎁"
                  >
                    <Gift className="w-6 h-6 fill-white text-white group-hover:rotate-12 transition-transform" />
                    <span className="text-xs font-black drop-shadow-sm hidden sm:inline">
                      أرسل هدية 🎁
                    </span>
                  </button>
                </div>
              )}

              {/* =====================================================================
                  FLOATING INFORMATIONAL CARD (البطاقة التعريفية الاحترافية العائمة)
                  Contains:
                  - Title / Caption
                  - Price in JOD (خانة السعر بالدينار الأردني)
                  - Location (الموقع)
                  - Green direct WhatsApp button (زر واتساب أخضر مباشر)
                  - Clickable Tags (@) for Cars & Real Estate
                  ===================================================================== */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-700/70 shadow-2xl text-right space-y-3">
                {/* Media Title */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-white leading-snug">
                      {currentMedia.title}
                    </h3>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>{currentMedia.location || profile.city}</span>
                    </div>
                  </div>

                  {/* PRICE IN JORDANIAN DINARS (Very Important) */}
                  {(currentMedia.priceJOD || profile.featuredPriceJOD) && (
                    <div className="bg-[#FF6B00] text-white px-3.5 py-1.5 rounded-xl shadow-lg font-black text-sm sm:text-base whitespace-nowrap shrink-0 flex items-center gap-1 border border-white/20">
                      <span>{(currentMedia.priceJOD || profile.featuredPriceJOD)?.toLocaleString()}</span>
                      <span className="text-xs font-bold">د.أ (JOD)</span>
                    </div>
                  )}
                </div>

                {/* CLICKABLE TAGS (@) FOR CARS & REAL ESTATE */}
                {((currentMedia.tags && currentMedia.tags.length > 0) ||
                  (profile.storeTags && profile.storeTags.length > 0)) && (
                  <div className="pt-1 border-t border-neutral-800/80">
                    <div className="text-[11px] text-neutral-400 font-bold mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#FF6B00]" />
                      <span>شركاء الخدمة المعتمدون (اضغط للتفاصيل):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(currentMedia.tags || profile.storeTags || []).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTagModal(t)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900/90 hover:bg-[#FF6B00]/20 text-[#FF6B00] hover:text-white border border-[#FF6B00]/30 text-xs font-black transition-colors flex items-center gap-1 active:scale-95"
                        >
                          <span>{t.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIRECT GREEN WHATSAPP BUTTON */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      `مرحبا ${profile.name}، بخصوص «${currentMedia.title}» المعلن على بلينك الأردن:`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>تواصل عبر واتساب فوراً</span>
                  </a>

                  <a
                    href={`tel:${profile.phone}`}
                    className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-neutral-700 transition-colors"
                    title="اتصال هاتفي"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-neutral-400 bg-neutral-950 rounded-2xl border border-neutral-800">
              لا توجد وسائط مضافة حالياً
            </div>
          )}

          {/* =======================================================================
              MEDIA THUMBNAILS CAROUSEL (Switch active video / photo)
              ======================================================================= */}
          {currentMediaList.length > 1 && (
            <div>
              <div className="text-xs font-bold text-neutral-400 mb-2">المزيد من المعروضات:</div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                {currentMediaList.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeMediaIndex === idx
                        ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/40 scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={m.posterUrl || m.mediaUrl}
                      alt={m.title}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    {m.type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =======================================================================
              RESTAURANT SPECIAL MENU SECTION (أطباق المطعم)
              ======================================================================= */}
          {profile.role === 'restaurant' && profile.menuItems && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>🍽️ قائمة الوجبات الأكثر طلباً</span>
                  <span className="text-xs font-bold text-[#FF6B00] bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-500/30">
                    لحم بلدي ودجاج طازج
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex gap-3 items-center group transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer border border-neutral-800 group-hover:scale-105 transition-transform"
                      onClick={() => onShowToast(`وجبة: ${item.name}`)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-medium">
                        {item.description}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs font-black text-[#FF6B00]">
                          {item.priceJOD} دينار
                        </span>
                        <a
                          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                            `مرحبا، بدي أطلب وجبة: ${item.name} (${item.priceJOD} دينار) من مطعم ${profile.name}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>اطلب فوراً</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: FULL SCREEN STORY VIEWER (مثل انستغرام)
          ========================================================================= */}
      {viewingStoryIndex !== null && profile.stories && profile.stories[viewingStoryIndex] && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between p-4">
            {/* Story Progress Bars */}
            <div className="flex gap-1 mb-2 z-20">
              {profile.stories.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full ${
                    idx <= viewingStoryIndex ? 'bg-[#FF6B00]' : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>

            {/* Story Header */}
            <div className="flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-white"
                />
                <div>
                  <div className="text-xs font-black text-white">{profile.name}</div>
                  <div className="text-[10px] text-neutral-300">
                    {profile.stories[viewingStoryIndex].createdAt}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingStoryIndex(null)}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Image */}
            <img
              src={profile.stories[viewingStoryIndex].mediaUrl}
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

            {/* Story Caption */}
            <div className="relative z-20 p-3 bg-black/60 backdrop-blur-sm rounded-2xl text-center">
              <p className="text-sm font-bold text-white">
                {profile.stories[viewingStoryIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: SEND GIFT TO CREATOR (صندوق الهدايا الداعم للمحتوى)
          ========================================================================= */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-5 border border-neutral-700 text-white space-y-4 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl">
                  🎁
                </div>
                <h3 className="font-black text-base text-white">
                  إرسال هدية داعمة لـ {profile.name}
                </h3>
              </div>
              <button
                onClick={() => setIsGiftModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              اختر الهدية التي تود تقديمها تقديراً للمحتوى الأردني الهادف:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'فنجان قهوة أردنية ☕', price: 1 },
                { name: 'درع الإبداع 🛡️', price: 3 },
                { name: 'صقر أردني 🦅', price: 5 },
                { name: 'سيف العز ⚔️', price: 10 },
              ].map((g, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendGift(g.name, g.price)}
                  className="p-3 rounded-2xl bg-neutral-950 hover:bg-[#FF6B00]/20 border border-neutral-800 hover:border-[#FF6B00] transition-all text-right group flex flex-col justify-between"
                >
                  <div className="font-black text-sm text-white group-hover:text-[#FF6B00]">
                    {g.name}
                  </div>
                  <div className="text-xs font-bold text-amber-400 mt-2">
                    {g.price} دينار أردني
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW STORY (أضف ستوري)
          ========================================================================= */}
      {newStoryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddStory}
            className="w-full max-w-md bg-neutral-900 rounded-3xl p-5 border border-neutral-700 text-white space-y-4 animate-slideUp"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-white">إضافة ستوري جديد للصفحة 📸</h3>
              <button
                type="button"
                onClick={() => setNewStoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1">
                نص الستوري أو التحديث:
              </label>
              <input
                type="text"
                required
                value={newStoryCaption}
                onChange={(e) => setNewStoryCaption(e.target.value)}
                placeholder="مثال: خصم خاص اليوم لزبائن بلينك / بث مباشر قريباً..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-medium text-white focus:ring-2 focus:ring-[#FF6B00] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF6B00] hover:bg-[#e65c00] text-white font-black text-sm rounded-xl transition-all"
            >
              نشر الستوري فوراً 🚀
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: TAG PARTNER DETAILS (@مركز فحص، @تعديل، @زينة، إلخ)
          ========================================================================= */}
      {selectedTagModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 rounded-3xl p-5 border border-neutral-700 text-white space-y-4 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-black text-base text-white">{selectedTagModal.label}</h3>
              </div>
              <button
                onClick={() => setSelectedTagModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl text-xs text-neutral-300 space-y-1.5 border border-neutral-800">
              <div>
                <strong>النوع:</strong>{' '}
                {selectedTagModal.category === 'inspection'
                  ? 'مركز فحص سيارات معتمد'
                  : selectedTagModal.category === 'tuning'
                  ? 'كراج تعديل وصيانة متقدمة'
                  : selectedTagModal.category === 'accessories'
                  ? 'إكسسوارات وزينة ونانو سيراميك'
                  : selectedTagModal.category === 'upholstery'
                  ? 'تنجيد وفرش أصلي'
                  : selectedTagModal.category === 'construction'
                  ? 'شركة بناء ومقاولات'
                  : selectedTagModal.category === 'kitchen'
                  ? 'تصنيع وتركيب مطابخ'
                  : 'شريك خدمة معتمد'}
              </div>
              <div>
                <strong>الموقع:</strong> {selectedTagModal.location || profile.city}
              </div>
              <div className="text-emerald-400 font-bold">
                ✓ شريك موثوق ومفحوص ضمن شبكة بلينك الأردن 🇯🇴
              </div>
            </div>

            <button
              onClick={() => {
                onShowToast(`تم اختيار التواصل مع الشريك ${selectedTagModal.label}`);
                setSelectedTagModal(null);
              }}
              className="w-full py-2.5 bg-[#FF6B00] text-white font-black text-xs rounded-xl"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
