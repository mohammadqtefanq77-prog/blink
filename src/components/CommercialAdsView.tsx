import React, { useState } from 'react';
import {
  Search,
  Building,
  Store,
  Stethoscope,
  Wrench,
  Car,
  Globe,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { Ad, Language } from '../types';
import { translations } from '../locales/translations';

interface CommercialAdsViewProps {
  ads?: Ad[];
  language: Language;
  onOpenAdDetail: (ad: Ad) => void;
  onOpenAddAdModal: () => void;
}

const CATEGORIES = [
  { id: 'الكل', label: 'الكل', icon: null },
  { id: 'شركات', label: 'شركات ومؤسسات', icon: Building },
  { id: 'محلات', label: 'محلات ومتاجر', icon: Store },
  { id: 'أطباء', label: 'أطباء وعيادات', icon: Stethoscope },
  { id: 'مقدمو خدمات', label: 'مقدمو خدمات وفنيون', icon: Wrench },
  { id: 'منتجات', label: 'منتجات وسيارات', icon: Car },
  { id: 'مواقع', label: 'مواقع ومنصات', icon: Globe },
];

export const CommercialAdsView: React.FC<CommercialAdsViewProps> = ({
  ads = [],
  language,
  onOpenAdDetail,
  onOpenAddAdModal,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('الكل');

  const filteredAds = (ads || []).filter((ad) => {
    if (selectedCategory !== 'الكل' && ad.category !== selectedCategory) {
      return false;
    }
    if (selectedCity !== 'الكل' && ad.city !== selectedCity) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (ad.businessName?.toLowerCase().includes(q) || false) ||
        (ad.serviceOrProduct?.toLowerCase().includes(q) || false) ||
        (ad.description?.toLowerCase().includes(q) || false) ||
        (ad.city?.toLowerCase().includes(q) || false);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 text-right">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
              {t.ads.title}
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              {t.ads.subtitle}
            </p>
          </div>

          <button
            id="btn-add-commercial-ad"
            onClick={onOpenAddAdModal}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة إعلان تجاري</span>
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-ads-search"
              type="text"
              placeholder="ابحث عن شركة، محل، عيادة، فني، أو خدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-right"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2 pt-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-neutral-100 border-none text-xs font-semibold text-neutral-700 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="الكل">كل المدن</option>
              <option value="مادبا">مادبا</option>
              <option value="عمان">عمان</option>
              <option value="الرياض">الرياض</option>
            </select>
            <span className="text-[11px] text-neutral-400 font-mono mr-auto">
              {filteredAds.length} إعلان ونشاط معتمد
            </span>
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            onClick={() => onOpenAdDetail(ad)}
            className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
          >
            <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
              <img
                src={ad.images[0]}
                alt={ad.businessName}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl">
                  {ad.category}
                </span>
                {ad.isSponsored && (
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-extrabold px-2 py-1 rounded-xl shadow-xs">
                    مميز
                  </span>
                )}
              </div>

              {ad.priceTag && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-neutral-900 font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs">
                  {ad.priceTag}
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    {ad.city} - {ad.district}
                  </span>
                  {ad.rating && (
                    <span className="flex items-center gap-1 font-bold text-neutral-700">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {ad.rating}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors">
                  {ad.businessName}
                </h3>
                <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {ad.serviceOrProduct}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-400 truncate">
                  {ad.workingHours}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {ad.whatsapp && (
                    <a
                      href={`https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                      title="مراسلة واتساب"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href={`tel:${ad.contactPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                    title="اتصال مباشر"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
