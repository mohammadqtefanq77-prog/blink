import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Send,
  Flag,
  Sparkles,
  Phone,
  Eye,
  Star,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { ContentPost, GiftItem, UserLocation, Language, Ad } from '../types';
import { DIGITAL_GIFTS } from '../data/initialData';
import { translations } from '../locales/translations';

interface ContentFeedProps {
  posts?: ContentPost[];
  currentLocation?: UserLocation;
  allAds?: Ad[];
  language: Language;
  onOpenPage: (pageId: string) => void;
  onOpenAdDetail?: (ad: Ad) => void;
  onLikePost?: (postId: string) => void;
  onCommentPost?: (postId: string, text: string) => void;
  onSendGift?: (postId: string, gift: GiftItem) => void;
  onOpenAddContentModal?: () => void;
}

export const ContentFeed: React.FC<ContentFeedProps> = ({
  posts = [],
  currentLocation = { city: 'مادبا', district: 'وسط البلد', lat: 31.7197, lng: 35.7941, displayName: 'مادبا' },
  allAds = [],
  language,
  onOpenPage,
  onOpenAdDetail,
  onLikePost,
  onCommentPost,
  onSendGift,
  onOpenAddContentModal,
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [followingCreators, setFollowingCreators] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [activeGiftSent, setActiveGiftSent] = useState<GiftItem | null>(null);
  const [isMiniAdDismissed, setIsMiniAdDismissed] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const safePosts = Array.isArray(posts) && posts.length > 0 ? posts : [];
  const currentPost = safePosts[currentIndex] || safePosts[0];

  // Pick contextual mini-ad based on post or current user location (e.g., Madaba user gets Madaba ad)
  const safeAds = Array.isArray(allAds) ? allAds : [];
  const matchedMiniAd = safeAds.length > 0
    ? safeAds.find((ad) => {
        if (currentPost?.aiClassification?.geolocation?.includes(ad.city)) return true;
        if (currentLocation && ad.city?.toLowerCase() === currentLocation.city?.toLowerCase()) return true;
        return ad.isSponsored;
      }) || safeAds[0]
    : null;

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsMiniAdDismissed(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsMiniAdDismissed(false);
    }
  };

  const toggleLike = () => {
    if (!currentPost) return;
    const isLiked = likedPosts[currentPost.id];
    setLikedPosts({ ...likedPosts, [currentPost.id]: !isLiked });
    onLikePost(currentPost.id);
  };

  const toggleSave = () => {
    if (!currentPost) return;
    setSavedPosts({ ...savedPosts, [currentPost.id]: !savedPosts[currentPost.id] });
  };

  const toggleFollow = () => {
    if (!currentPost) return;
    setFollowingCreators({
      ...followingCreators,
      [currentPost.creatorPageId]: !followingCreators[currentPost.creatorPageId],
    });
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentPost) return;
    onCommentPost(currentPost.id, newComment.trim());
    setNewComment('');
  };

  const handleGiftClick = (gift: GiftItem) => {
    if (!currentPost) return;
    onSendGift(currentPost.id, gift);
    setActiveGiftSent(gift);
    setIsGiftModalOpen(false);
    setTimeout(() => {
      setActiveGiftSent(null);
    }, 2500);
  };

  const handleReport = () => {
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  if (!currentPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 text-neutral-500">
        <p className="text-sm">لا يوجد محتوى متاح حالياً.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-5rem)] min-h-[580px] max-h-[820px] bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col select-none border border-neutral-800">
      {/* Video Canvas / Poster presentation */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-neutral-900">
        <video
          key={currentPost.id}
          src={currentPost.videoUrl}
          poster={currentPost.posterUrl}
          playsInline
          autoPlay
          loop
          muted
          className="w-full h-full object-cover brightness-95"
        />

        {/* Subtle Dark Vignette gradient to make text readable while keeping video clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Clean Top Bar */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
          {/* Sponsorship pill if sponsored */}
          {currentPost.isSponsored ? (
            <div className="flex items-center gap-1.5 bg-amber-500/90 text-neutral-950 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              <Award className="w-3.5 h-3.5" />
              <span>{currentPost.sponsorTagline || `${t.contentFeed.sponsoredBy} ${currentPost.sponsorName}`}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-neutral-900/60 text-white/90 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentPost.category}</span>
            </div>
          )}

          {/* Up / Down Navigation Controls */}
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
            <button
              id="btn-prev-video"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title={t.contentFeed.prevVideo}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-white/70 px-1">
              {currentIndex + 1}/{posts.length}
            </span>
            <button
              id="btn-next-video"
              onClick={handleNext}
              disabled={currentIndex === posts.length - 1}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
              title={t.contentFeed.nextVideo}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Screen Title & Minimal Info at Bottom Left/Center */}
        <div className="absolute bottom-16 inset-x-4 z-20 pointer-events-auto transition-opacity duration-300">
          <div className="space-y-1.5 max-w-[85%] text-right" dir="rtl">
            <h2 className="text-white font-extrabold text-sm sm:text-base leading-snug drop-shadow-md">
              {currentPost.title}
            </h2>
            <p className="text-neutral-300 text-xs line-clamp-2 drop-shadow-xs font-normal">
              {currentPost.description}
            </p>
          </div>
        </div>

        {/* Small Arrow on Left Side to Toggle Options Drawer */}
        {/* Requirement: "سهم صغير في الجهة اليسرى لفتح الخيارات" */}
        <button
          id="btn-toggle-options-drawer"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 px-2.5 py-3 rounded-2xl backdrop-blur-md border shadow-2xl transition-all duration-300 active:scale-95 ${
            isDrawerOpen
              ? 'bg-white text-neutral-900 border-white'
              : 'bg-black/70 text-white border-white/20 hover:bg-black/90'
          }`}
          title={t.contentFeed.options}
        >
          <div className="flex flex-col items-center gap-1">
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                isDrawerOpen ? 'rotate-180 text-neutral-900' : 'text-emerald-400'
              }`}
            />
            <span className="text-[10px] font-bold writing-mode-vertical uppercase tracking-wider">
              {isDrawerOpen ? t.common.close : t.contentFeed.options}
            </span>
          </div>
        </button>

        {/* Gift Animation Float */}
        {activeGiftSent && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none animate-bounce">
            <span className="text-6xl filter drop-shadow-xl">{activeGiftSent.icon}</span>
            <div className="mt-2 bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
              {t.contentFeed.sendGiftSuccess}
            </div>
          </div>
        )}

        {/* Non-intrusive Mini-Ad at Bottom ~1/4 screen */}
        {/* Requirement: "إعلان مصغر غير مزعج أسفل الشاشة بمساحة حوالي ربع الشاشة أثناء مشاهدة المحتوى" */}
        {!isMiniAdDismissed && matchedMiniAd && !isDrawerOpen && (
          <div className="absolute bottom-2 inset-x-3 z-25 bg-neutral-900/95 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shadow-2xl text-right">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {t.contentFeed.miniAdTitle} ({matchedMiniAd.city})
                </span>
                <span className="text-neutral-400 text-[10px]">
                  {matchedMiniAd.category}
                </span>
              </div>
              <button
                id="btn-dismiss-mini-ad"
                onClick={() => setIsMiniAdDismissed(true)}
                className="text-neutral-400 hover:text-white p-1 rounded-md"
                title={t.contentFeed.closeAd}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <img
                src={matchedMiniAd.images[0]}
                alt={matchedMiniAd.businessName}
                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-xs font-bold truncate">
                  {matchedMiniAd.businessName}
                </h4>
                <p className="text-neutral-300 text-[11px] truncate">
                  {matchedMiniAd.serviceOrProduct}
                </p>
              </div>
              <button
                id="btn-view-mini-ad"
                onClick={() => onOpenAdDetail(matchedMiniAd)}
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-neutral-950 font-bold text-[11px] px-2.5 py-1.5 rounded-xl shrink-0 transition-colors shadow-xs"
              >
                {t.contentFeed.exploreAd}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Options Drawer (when small arrow on left side is clicked) */}
      {isDrawerOpen && (
        <div className="absolute inset-y-0 right-0 left-12 z-35 bg-neutral-950/95 backdrop-blur-xl border-l border-white/10 text-white flex flex-col justify-between p-4 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenPage(currentPost.creatorPageId)}
                className="flex items-center gap-2 text-right group"
              >
                <img
                  src={currentPost.creatorAvatar}
                  alt={currentPost.creatorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold group-hover:text-emerald-400 transition-colors">
                      {currentPost.creatorName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {currentPost.creatorHandle}
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-follow-creator"
                onClick={toggleFollow}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                  followingCreators[currentPost.creatorPageId]
                    ? 'bg-white/15 text-neutral-300'
                    : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'
                }`}
              >
                {followingCreators[currentPost.creatorPageId]
                  ? t.contentFeed.following
                  : t.contentFeed.follow}
              </button>
              <button
                id="btn-close-drawer"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 py-3 border-b border-white/10 text-center text-[11px]">
            <div className="flex flex-col items-center">
              <Eye className="w-4 h-4 text-neutral-400 mb-0.5" />
              <span className="font-bold">{currentPost.views.toLocaleString()}</span>
              <span className="text-[10px] text-neutral-500">{t.contentFeed.views}</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mb-0.5" />
              <span className="font-bold">{currentPost.creatorRating}</span>
              <span className="text-[10px] text-neutral-500">تقييم</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart
                className={`w-4 h-4 mb-0.5 ${
                  likedPosts[currentPost.id]
                    ? 'text-rose-500 fill-rose-500'
                    : 'text-neutral-400'
                }`}
              />
              <span className="font-bold">
                {currentPost.likes + (likedPosts[currentPost.id] ? 1 : 0)}
              </span>
              <span className="text-[10px] text-neutral-500">{t.contentFeed.likes}</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-4 h-4 text-neutral-400 mb-0.5" />
              <span className="font-bold">{currentPost.commentsCount}</span>
              <span className="text-[10px] text-neutral-500">{t.contentFeed.comments}</span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-4 gap-2 py-3 border-b border-white/10">
            {/* Like */}
            <button
              id="btn-drawer-like"
              onClick={toggleLike}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                likedPosts[currentPost.id]
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedPosts[currentPost.id] ? 'fill-rose-500' : ''}`} />
              <span className="text-[10px] mt-1">{t.contentFeed.likes}</span>
            </button>

            {/* Gift */}
            <button
              id="btn-drawer-gift"
              onClick={() => setIsGiftModalOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] mt-1">{t.contentFeed.gifts}</span>
            </button>

            {/* Save */}
            <button
              id="btn-drawer-save"
              onClick={toggleSave}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                savedPosts[currentPost.id]
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${savedPosts[currentPost.id] ? 'fill-emerald-500' : ''}`} />
              <span className="text-[10px] mt-1">{t.contentFeed.saves}</span>
            </button>

            {/* WhatsApp Contact if creator enabled it */}
            {currentPost.whatsappEnabled && currentPost.whatsappNumber ? (
              <a
                id="btn-drawer-whatsapp"
                href={`https://wa.me/${currentPost.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-[10px] mt-1">واتساب</span>
              </a>
            ) : (
              <button
                id="btn-drawer-share"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: currentPost.title, url: window.location.href });
                  }
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] mt-1">{t.contentFeed.shares}</span>
              </button>
            )}
          </div>

          {/* AI Smart Classification Summary badge */}
          {currentPost.aiClassification && (
            <div className="my-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  تصنيف الذكاء الاصطناعي الذكي:
                </span>
                <span>{currentPost.aiClassification.contentType}</span>
              </div>
              <p className="text-neutral-300 text-[10px]">
                {currentPost.aiClassification.topic} ({currentPost.aiClassification.level})
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {currentPost.aiClassification.keywords.map((kw, i) => (
                  <span key={i} className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] text-neutral-300">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1">
            <h5 className="text-[11px] font-bold text-neutral-400">التعليقات والمناقشات:</h5>
            {currentPost.comments && currentPost.comments.length > 0 ? (
              currentPost.comments.map((c) => (
                <div key={c.id} className="p-2 rounded-xl bg-white/5 border border-white/5 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <img src={c.avatar} alt={c.userName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[11px] font-bold text-neutral-200">{c.userName}</span>
                    </div>
                    <span className="text-[9px] text-neutral-500">{c.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 pr-6">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-neutral-500 text-center py-4">كن أول من يعلّق على هذا المحتوى.</p>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSendComment} className="pt-2 border-t border-white/10 flex items-center gap-2">
            <input
              id="input-post-comment"
              type="text"
              placeholder={t.contentFeed.addCommentPlaceholder}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              id="btn-send-comment"
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-neutral-950 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Report Footer */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-neutral-500">
            <button
              id="btn-report-post"
              onClick={handleReport}
              className="flex items-center gap-1 text-neutral-400 hover:text-rose-400 transition-colors"
            >
              <Flag className="w-3 h-3" />
              <span>{reportSuccess ? t.common.reportSent : t.contentFeed.report}</span>
            </button>
            <span>Blink Clean Content Engine</span>
          </div>
        </div>
      )}

      {/* Gift Selection Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-white/15 w-full max-w-sm rounded-3xl p-5 text-white shadow-2xl text-right">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">إرسال هدية رقمية ودعم لصانع المحتوى</h3>
              </div>
              <button
                onClick={() => setIsGiftModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-4">
              تدعم الهدايا استمرار صناع المحتوى في تقديم المعرفة والأبحاث، وتُضاف قيمتها مباشرة إلى محفظة صانع المحتوى.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {DIGITAL_GIFTS.map((gift) => (
                <button
                  key={gift.id}
                  id={`btn-gift-${gift.id}`}
                  onClick={() => handleGiftClick(gift)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400 transition-all group"
                >
                  <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                    {gift.icon}
                  </span>
                  <span className="text-xs font-bold">{gift.name}</span>
                  <span className="text-[10px] text-amber-400 font-mono mt-0.5">
                    {gift.coins} عملة
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white/5 p-3 rounded-xl text-[11px] text-neutral-400 flex items-center justify-between">
              <span>رصيد عملاتك الحالي:</span>
              <span className="font-bold text-amber-400 font-mono">1,250 عملة (مجانية تجريبياً)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
