import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Heart,
  Share2,
  Bookmark,
  Play,
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { ContentPost } from '../types';

interface JordanContentFeedViewProps {
  posts: ContentPost[];
  onBackToHome: () => void;
  onOpenCreatorProfile?: (authorName: string) => void;
  onShowToast: (msg: string) => void;
}

export const JordanContentFeedView: React.FC<JordanContentFeedViewProps> = ({
  posts,
  onBackToHome,
  onOpenCreatorProfile,
  onShowToast,
}) => {
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20 font-['Tajawal',sans-serif]">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-neutral-900 leading-none">
              محتوى بلينك الهادف 📖
            </h1>
            <span className="text-xs text-neutral-500 font-medium">
              نصائح صيانة، تجارب حرفية، وإرشادات عملية للأردنيين
            </span>
          </div>
        </div>

        <div className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
          محتوى موثق 🇯🇴
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Post Author */}
            <div className="p-4 flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  if (onOpenCreatorProfile) {
                    onOpenCreatorProfile(post.authorName);
                  } else {
                    onShowToast(`فتح صفحة صانع المحتوى ${post.authorName}`);
                  }
                }}
                title={`عرض صفحة ${post.authorName} الشخصية 🇯🇴`}
              >
                <div className="relative">
                  <img
                    src={post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#FF6B00] shadow-sm cursor-pointer group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[10px]">🇯🇴</span>
                </div>
                <div>
                  <div className="font-black text-sm text-neutral-900 flex items-center gap-1 group-hover:text-[#FF6B00] transition-colors">
                    <span>{post.authorName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-neutral-500 font-medium">
                    {post.authorProfession || 'خبير معتمد'} • {post.city || 'عمان'}
                  </div>
                </div>
              </div>

              <span className="text-xs font-black text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                {post.category || 'نصائح صيانة'}
              </span>
            </div>

            {/* Post Media (if any) */}
            {post.mediaUrl && (
              <div
                className="relative aspect-video bg-neutral-950 overflow-hidden cursor-pointer group"
                onClick={() => {
                  if (onOpenCreatorProfile) {
                    onOpenCreatorProfile(post.authorName);
                  } else {
                    onShowToast(`عرض وسائط: ${post.title}`);
                  }
                }}
              >
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
                {post.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#FF6B00] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-[#FF6B00] ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text & Content */}
            <div className="p-4">
              <h2 className="font-black text-base text-neutral-900 mb-1.5 leading-snug">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                {post.description || post.text}
              </p>

              {/* Interactions */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-neutral-600 text-xs font-bold">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    likedPosts[post.id] ? 'text-red-600 font-black' : 'hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-red-600' : ''}`} />
                  <span>{post.likesCount + (likedPosts[post.id] ? 1 : 0)} إعجاب</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.title, text: post.description, url: window.location.href });
                    } else {
                      onShowToast('تم نسخ رابط المقال للمشاركة!');
                    }
                  }}
                  className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
