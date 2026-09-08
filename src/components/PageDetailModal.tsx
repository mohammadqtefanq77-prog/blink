import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Star,
  Phone,
  MessageCircle,
  Globe,
  ShieldCheck,
  Flag,
  Share2,
  Users,
  Eye,
  Award,
  Sparkles,
  ShoppingBag,
  Wrench,
  Tag,
  Check,
} from 'lucide-react';
import { AccountPage, ContentPost, MarketItem, Language } from '../types';
import { translations } from '../locales/translations';

interface PageDetailModalProps {
  page: AccountPage | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  relatedContent?: ContentPost[];
  relatedMarketItems?: MarketItem[];
  onOpenContentPost: (post: ContentPost) => void;
}

export const PageDetailModal: React.FC<PageDetailModalProps> = ({
  page,
  isOpen,
  onClose,
  language,
  relatedContent = [],
  relatedMarketItems = [],
  onOpenContentPost,
}) => {
  const t = translations[language];
  const [isFollowing, setIsFollowing] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'services' | 'content'>('overview');

  if (!isOpen || !page) return null;

  const isCreator = page.type === 'creator';

  const handleReport = () => {
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 text-right flex flex-col max-h-[92vh]">
        {/* Cover Photo */}
        <div className="relative h-36 sm:h-48 w-full bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={page.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'}
            alt={page.name}
            className="w-full h-full object-cover brightness-90"
          />
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="px-6 pt-0 pb-4 border-b border-neutral-100 relative shrink-0">
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="flex items-end gap-3">
              <img
                src={page.logo}
                alt={page.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="mb-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg sm:text-xl font-black text-neutral-900">
                    {page.name}
                  </h2>
                  {page.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <span className="text-xs text-neutral-400 font-mono block">
                  {page.handle} • {page.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs ${
                isFollowing
                  ? 'bg-neutral-100 text-neutral-700'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              {isFollowing ? t.contentFeed.following : t.contentFeed.follow}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {page.bio}
          </p>

          {/* Quick Info & Stats */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {page.city} {page.district ? `- ${page.district}` : ''}
            </span>
            {page.workingHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {page.workingHours}
              </span>
            )}
            <span className="flex items-center gap-1 font-bold text-neutral-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {page.rating} ({page.reviewCount} تقييم)
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              {page.followersCount.toLocaleString()} متابع
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-100 text-xs font-bold text-neutral-600 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            نظرة عامة
          </button>
          {isCreator && (
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeTab === 'content'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              المحتوى المنشور ({relatedContent.length})
            </button>
          )}
          {page.products && page.products.length > 0 && (
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeTab === 'products'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              المنتجات ({page.products.length})
            </button>
          )}
          {page.services && page.services.length > 0 && (
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeTab === 'services'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              الخدمات ({page.services.length})
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Special Gifts Box for Content Creator */}
              {isCreator && page.giftsReceived && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>الهدايا التقديرية التي استقبلها صانع المحتوى:</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {page.giftsReceived.map((g) => (
                      <div key={g.id} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs shadow-2xs">
                        <span className="text-base">{g.icon}</span>
                        <span className="font-bold text-neutral-800">{g.giftName}:</span>
                        <span className="text-amber-700 font-bold font-mono">{g.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Offers banner if available */}
              {page.offers && page.offers.map((offer) => (
                <div key={offer.id} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>{offer.title}</span>
                  </div>
                  <span className="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-lg">
                    {offer.discount}
                  </span>
                </div>
              ))}

              {/* Contact Channels */}
              {page.allowDirectContact && (
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-800">قنوات التواصل والزيارة:</h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={`tel:${page.contactPhone}`}
                      className="flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال: {page.contactPhone}</span>
                    </a>

                    {page.whatsapp && (
                      <a
                        href={`https://wa.me/${page.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>مراسلة واتساب</span>
                      </a>
                    )}

                    {page.website && (
                      <a
                        href={page.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-neutral-200 text-neutral-800 text-xs font-bold px-3.5 py-2 rounded-xl"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>الموقع الإلكتروني</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Tab for Creator */}
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedContent.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenContentPost(c)}
                  className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 cursor-pointer hover:border-neutral-400 transition-all flex gap-3"
                >
                  <img src={c.posterUrl} alt={c.title} className="w-16 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex flex-col justify-between">
                    <h5 className="font-bold text-xs line-clamp-2">{c.title}</h5>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span>{c.views} مشاهدة</span>
                      {c.isSponsored && <span className="text-amber-600 font-bold">مدعوم</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && page.products && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.products.map((p) => (
                <div key={p.id} className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 flex gap-3 items-center">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs truncate">{p.name}</h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{p.desc}</p>
                    <span className="text-xs font-black text-emerald-700 block mt-1">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && page.services && (
            <div className="space-y-2.5">
              {page.services.map((s) => (
                <div key={s.id} className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs">{s.name}</h5>
                    {s.price && <span className="text-xs font-bold text-emerald-700">{s.price}</span>}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Report */}
        <div className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <button
            onClick={handleReport}
            className="flex items-center gap-1 hover:text-rose-600 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>{reportSent ? t.common.reportSent : 'الإبلاغ عن الصفحة'}</span>
          </button>
          <span>بلينك • منصة معتمدة</span>
        </div>
      </div>
    </div>
  );
};
