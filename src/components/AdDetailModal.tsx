import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Award,
  Star,
  Share2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { Ad } from '../types';

interface AdDetailModalProps {
  ad: Ad | null;
  onClose: () => void;
}

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  onClose,
}) => {
  if (!ad) return null;

  const handleCall = () => {
    window.location.href = `tel:${ad.contactPhone}`;
  };

  const handleWhatsApp = () => {
    const phoneClean = (ad.whatsapp || ad.contactPhone).replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحباً، أود الاستفسار عن إعلانكم: ${ad.serviceOrProduct} (${ad.businessName})`
    );
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.serviceOrProduct,
          text: `${ad.businessName} - ${ad.serviceOrProduct} في ${ad.city}`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(
        `${ad.businessName} - ${ad.serviceOrProduct}\nرقم التواصل: ${ad.contactPhone}`
      );
      alert('تم نسخ تفاصيل الإعلان إلى الحافظة');
    }
  };

  const handleMapDirection = () => {
    const query = encodeURIComponent(`${ad.businessName} ${ad.district} ${ad.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const image = ad.images?.[0] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200">
        {/* Top Image & Header */}
        <div className="relative h-52 sm:h-60 bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={image}
            alt={ad.serviceOrProduct}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close & Share Buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              id="btn-close-ad-detail"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              id="btn-share-ad-detail"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-md transition-colors"
              title="مشاركة الإعلان"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Badges on bottom of image */}
          <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-2">
            <div>
              {ad.isSponsored && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-md mb-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5 fill-amber-950" />
                  <span>إعلان ممول معتمد</span>
                </span>
              )}
              <h2 className="text-white text-lg font-bold drop-shadow-md leading-tight">
                {ad.serviceOrProduct}
              </h2>
              <p className="text-white/80 text-xs font-medium">
                {ad.businessName}
              </p>
            </div>

            {ad.rating && (
              <div className="bg-black/60 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold text-xs shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{ad.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-right">
          {/* Category and Price Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">نوع الإعلان:</span>
              <span className="text-xs font-bold bg-neutral-900 text-white px-2.5 py-0.5 rounded-lg">
                {ad.category}
              </span>
            </div>
            {ad.priceTag && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-500 font-medium">السعر / العرض:</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  {ad.priceTag}
                </span>
              </div>
            )}
          </div>

          {/* AI Match highlight if available */}
          {ad.matchReason && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-900 mb-0.5">
                  تقييم الذكاء الاصطناعي لمطابقة طلبك:
                </span>
                <p className="leading-relaxed text-emerald-800">{ad.matchReason}</p>
              </div>
            </div>
          )}

          {/* Description Section */}
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              تفاصيل الإعلان
            </h3>
            <p className="text-sm text-neutral-800 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/60 whitespace-pre-line">
              {ad.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Location */}
            <div className="flex items-center gap-2.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 block font-medium">الموقع الجغرافي</span>
                <span className="font-bold text-neutral-800 block truncate">
                  {ad.city} - {ad.district}
                </span>
                {typeof ad.distanceKm === 'number' && (
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    يبعد عنك {ad.distanceKm} كم
                  </span>
                )}
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-center gap-2.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 block font-medium">ساعات العمل</span>
                <span className="font-bold text-neutral-800 block truncate">
                  {ad.workingHours}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  متاح للتواصل
                </span>
              </div>
            </div>
          </div>

          {/* Location button */}
          <button
            id="btn-navigate-map"
            onClick={handleMapDirection}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
            <span>عرض موقع النشاط على الخريطة والاتجاهات</span>
          </button>
        </div>

        {/* Footer Contact Action Buttons */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2.5">
          <button
            id="btn-modal-call"
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-900 active:scale-98 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-xs"
          >
            <Phone className="w-4 h-4 text-neutral-300" />
            <span>اتصال هاتفي</span>
          </button>

          <button
            id="btn-modal-whatsapp"
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-xs shadow-emerald-600/25"
          >
            <MessageCircle className="w-4 h-4" />
            <span>محادثة واتساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
