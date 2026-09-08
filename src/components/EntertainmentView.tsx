import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Gift,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smile,
  Compass,
  Flame,
  Utensils,
  Trophy,
  Palette,
  Eye,
  Filter,
} from 'lucide-react';
import { ContentPost, EntertainmentCategory } from '../types';

interface EntertainmentViewProps {
  posts: ContentPost[];
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSendGift: (postId: string, coins: number, icon: string, name: string) => void;
}

const CATEGORIES: { label: EntertainmentCategory; icon: any }[] = [
  { label: 'الكل', icon: Sparkles },
  { label: 'مقاطع مضحكة', icon: Smile },
  { label: 'مواهب', icon: Palette },
  { label: 'تحديات', icon: Flame },
  { label: 'سفر ومغامرات', icon: Compass },
  { label: 'رياضة', icon: Trophy },
  { label: 'طبخ', icon: Utensils },
  { label: 'اجتماعي وترفيهي', icon: Sparkles },
  { label: 'صناع محتوى', icon: Sparkles },
];

export const EntertainmentView: React.FC<EntertainmentViewProps> = ({
  posts = [],
  onLike,
  onAddComment,
  onSendGift,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EntertainmentCategory>('الكل');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(posts[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [giftSuccessMsg, setGiftSuccessMsg] = useState<string | null>(null);

  const filteredPosts = (posts || []).filter((post) => {
    if (selectedCategory === 'الكل') return true;
    return post.category.includes(selectedCategory) || post.title.includes(selectedCategory);
  });

  const activePost = filteredPosts.find((p) => p.id === activeVideoId) || filteredPosts[0];

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleGift = (post: ContentPost) => {
    onSendGift(post.id, 25, '🎁', 'صندوق دعم الترفيه');
    setGiftSuccessMsg(`تم إرسال هدية دعم للمبدع ${post.creatorName}! 🎉`);
    setTimeout(() => setGiftSuccessMsg(null), 3000);
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(postId, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-14 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span>المحتوى الترفيهي والفيديوهات القصيرة</span>
            </h1>
            <p className="text-xs text-slate-400">
              قسم مستقل وممتع: مقاطع مضحكة، مواهب، تحديات، سفر وطبخ بدون إعلانات تجارية
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setSelectedCategory(label)}
                className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap font-medium transition flex items-center gap-1.5 ${
                  selectedCategory === label
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {giftSuccessMsg && (
        <div className="max-w-md mx-auto mt-4 px-4">
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold text-center animate-bounce">
            {giftSuccessMsg}
          </div>
        </div>
      )}

      {/* Main Reels / Feed Layout */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-3">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">لا يوجد محتوى في هذا القسم حالياً</h3>
            <p className="text-xs text-slate-400">جرّب اختيار قسم ترفيهي آخر أو تصفح «الكل».</p>
            <button
              onClick={() => setSelectedCategory('الكل')}
              className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              عرض جميع الفيديوهات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Active Video Player Center Stage (Col 1-8) */}
            {activePost && (
              <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Video Container */}
                <div className="relative aspect-[9/16] sm:aspect-[4/5] bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={activePost.videoUrl}
                    poster={activePost.posterUrl}
                    loop
                    autoPlay={isPlaying}
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onClick={handleTogglePlay}
                  />

                  {/* Overlaid Play/Pause Button */}
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition opacity-0 hover:opacity-100"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 pr-1" />}
                    </div>
                  </button>

                  {/* Sound Toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-slate-900"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Category Pill Overlaid */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
                    {activePost.category}
                  </div>

                  {/* Right Side Social Floating Bar */}
                  <div className="absolute left-4 bottom-24 flex flex-col items-center gap-3.5 z-20">
                    <button
                      onClick={() => onLike(activePost.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition group-hover:bg-rose-500/20 group-hover:border-rose-500">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30 group-hover:fill-rose-500" />
                      </div>
                      <span className="text-[11px] font-bold text-white drop-shadow">
                        {activePost.likes}
                      </span>
                    </button>

                    <button
                      onClick={() => setOpenCommentsPostId(activePost.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition">
                        <MessageCircle className="w-5 h-5 text-sky-400" />
                      </div>
                      <span className="text-[11px] font-bold text-white drop-shadow">
                        {activePost.commentsCount || (activePost.comments || []).length}
                      </span>
                    </button>

                    <button
                      onClick={() => handleGift(activePost)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition group-hover:bg-amber-500/20">
                        <Gift className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 drop-shadow">إهداء</span>
                    </button>
                  </div>

                  {/* Bottom Video Meta Info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-12 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={activePost.creatorAvatar}
                        alt={activePost.creatorName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow"
                      />
                      <div>
                        <h4 className="text-sm font-bold leading-tight">{activePost.creatorName}</h4>
                        <span className="text-xs text-slate-300">{activePost.creatorHandle}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-white leading-snug">
                      {activePost.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {activePost.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
                        {activePost.views.toLocaleString()} مشاهدة
                      </span>
                      <span>•</span>
                      <span>{activePost.durationSeconds} ثانية</span>
                      <span>•</span>
                      <span className="text-amber-300 font-semibold">{activePost.aiClassification?.topic || 'ترفيه هادف'}</span>
                    </div>
                  </div>
                </div>

                {/* Comments Section Drawer/Panel */}
                {openCommentsPostId === activePost.id && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">التعليقات والمشاركات</h4>
                      <button
                        onClick={() => setOpenCommentsPostId(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        إغلاق
                      </button>
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {(activePost.comments || []).map((c) => (
                        <div key={c.id} className="flex items-start gap-2 text-xs bg-slate-800/60 p-2 rounded-xl">
                          <img src={c.avatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="font-bold text-slate-200">{c.userName}</span>
                            <p className="text-slate-300 mt-0.5">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={(e) => handleCommentSubmit(e, activePost.id)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أضف تعليقاً لطيفاً..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                      >
                        نشر
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Side Playlist of Entertainment clips (Col 9-12) */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                المقاطع التالية في قسم «{selectedCategory}»
              </h3>

              <div className="space-y-2.5">
                {filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      setActiveVideoId(post.id);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-right p-2.5 rounded-2xl border transition-all flex gap-3 items-center group ${
                      activePost?.id === post.id
                        ? 'bg-slate-800 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-950">
                      <img src={post.posterUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white/90 drop-shadow" />
                      </div>
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 px-1 rounded text-white font-mono">
                        {post.durationSeconds}s
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-amber-400 font-bold block mb-0.5">
                        {post.category}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition">
                        {post.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {post.creatorName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.commentsCount || (post.comments || []).length}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
