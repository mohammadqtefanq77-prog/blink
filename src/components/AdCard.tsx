import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Award,
  Sparkles,
  ChevronLeft,
  Star,
  Eye,
} from 'lucide-react';
import { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
  onSelectAd: (ad: Ad) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onSelectAd }) => {
  const mainImage =
    ad.images && ad.images.length > 0
      ? ad.images[0]
      : 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${ad.contactPhone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phoneClean = (ad.whatsapp || ad.contactPhone).replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `مرحباً، استفسر بخصوص إعلانكم: ${ad.serviceOrProduct} (${ad.businessName})`
    );
    window.open(`https://wa.me/${phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelectAd(ad)}
      className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-md active:scale-[0.99] ${
        ad.isSponsored
          ? 'border-amber-300 ring-1 ring-amber-300/60 shadow-xs'
          : 'border-neutral-200/90 shadow-2xs hover:border-neutral-300'
      }`}
    >
      {/* Top Bar for Sponsored or High Match */}
      {ad.isSponsored && (
        <div className="bg-gradient-to-l from-amber-500 via-amber-400 to-amber-500 text-amber-950 px-3 py-1 text-[11px] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
            <span>إعلان ممول وموثق</span>
          </span>
          <span className="text-[10px] bg-amber-600/20 px-1.5 py-0.2 rounded-sm text-amber-950">
            أولوية العرض
          </span>
        </div>
      )}

      <div className="p-3.5 sm:p-4">
        {/* Main Content Layout */}
        <div className="flex gap-3 sm:gap-4">
          {/* Thumbnail Image */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200/60">
            <img
              src={mainImage}
              alt={ad.serviceOrProduct}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {ad.images && ad.images.length > 1 && (
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded-sm">
                +{ad.images.length} صور
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md truncate">
                  {ad.category}
                </span>

                {ad.rating && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{ad.rating}</span>
                    {ad.reviewCount && (
                      <span className="text-neutral-400 font-normal text-[10px]">
                        ({ad.reviewCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Service/Product Title */}
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 line-clamp-1 leading-snug">
                {ad.serviceOrProduct}
              </h4>

              {/* Business Name */}
              <p className="text-xs text-neutral-600 font-medium mb-1 truncate">
                {ad.businessName}
              </p>

              {/* Description snippet */}
              <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-2">
                {ad.description}
              </p>
            </div>

            {/* Location & Distance */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1 shrink-0 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {ad.city} - {ad.district}
                </span>
              </div>

              {typeof ad.distanceKm === 'number' && (
                <div className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-md font-semibold text-[10px] shrink-0">
                  يبعد {ad.distanceKm} كم
                </div>
              )}

              {/* Working hours badge */}
              <div className="flex items-center gap-1 text-neutral-500 text-[10px] shrink-0">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span className="truncate max-w-[140px]">{ad.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Match Reason Pill (if search resulted in high match) */}
        {ad.matchReason && (
          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-100 flex-1 truncate">
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{ad.matchReason}</span>
            </div>

            {typeof ad.matchScore === 'number' && ad.matchScore > 0 && (
              <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md shrink-0">
                تطابق {ad.matchScore}%
              </span>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Call button */}
            <button
              id={`btn-call-${ad.id}`}
              onClick={handleCall}
              className="flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
              title="اتصال هاتفي"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-600" />
              <span>اتصال</span>
            </button>

            {/* WhatsApp button */}
            <button
              id={`btn-whatsapp-${ad.id}`}
              onClick={handleWhatsApp}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
              title="محادثة واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>
          </div>

          {/* Details link button */}
          <button
            id={`btn-details-${ad.id}`}
            onClick={() => onSelectAd(ad)}
            className="flex items-center gap-0.5 text-xs text-neutral-600 hover:text-emerald-700 font-medium py-1 px-1.5 rounded-md transition-colors"
          >
            <span>التفاصيل</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
