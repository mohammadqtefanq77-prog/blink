import React, { useState } from 'react';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Tag,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Store,
  Building,
  Car,
  Layers,
} from 'lucide-react';
import { MarketItem, Language, PageType } from '../types';
import { translations } from '../locales/translations';

interface MarketViewProps {
  items?: MarketItem[];
  language: Language;
  onOpenItemDetail: (item: MarketItem) => void;
  onOpenPage: (pageId: string) => void;
  onOpenAddMarketModal: () => void;
}

const CATEGORIES = [
  'الكل',
  'أجهزة وأدوات منزلية',
  'سيارات ومركبات',
  'أثاث ومفروشات',
  'هواتف وإلكترونيات',
  'طيور ومواشي وحلال',
  'منتجات زراعية',
  'منتجات مصانع وتجار',
  'خدمات ونقل',
];

export const MarketView: React.FC<MarketViewProps> = ({
  items = [],
  language,
  onOpenItemDetail,
  onOpenPage,
  onOpenAddMarketModal,
}) => {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [selectedCondition, setSelectedCondition] = useState('الكل');

  const filteredItems = (items || []).filter((item) => {
    if (selectedCategory !== 'الكل' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedCity !== 'الكل' && item.city !== selectedCity) {
      return false;
    }
    if (selectedCondition !== 'الكل' && item.condition !== selectedCondition) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (item.title?.toLowerCase().includes(q) || false) ||
        (item.description?.toLowerCase().includes(q) || false) ||
        (item.category?.toLowerCase().includes(q) || false) ||
        (item.city?.toLowerCase().includes(q) || false);
      if (!match) return false;
    }
    return true;
  });

  const getPageIcon = (type?: PageType) => {
    switch (type) {
      case 'store':
        return <Store className="w-3 h-3 text-amber-600" />;
      case 'company':
        return <Building className="w-3 h-3 text-blue-600" />;
      case 'showroom':
        return <Car className="w-3 h-3 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Header & Primary Action */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 justify-end">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                {t.market.title}
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              {t.market.subtitle}
            </p>
          </div>

          <button
            id="btn-add-market-listing"
            onClick={onOpenAddMarketModal}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.market.newListing}</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-market-search"
              type="text"
              placeholder={t.market.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-right"
            />
          </div>

          {/* Categories Scrolling Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-right">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters (City & Condition) */}
          <div className="flex items-center gap-2 pt-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-neutral-100 border-none text-xs font-semibold text-neutral-700 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="الكل">{t.market.allCities}</option>
              <option value="مادبا">مادبا</option>
              <option value="عمان">عمان</option>
              <option value="إربد">إربد</option>
              <option value="الرياض">الرياض</option>
            </select>

            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-neutral-100 border-none text-xs font-semibold text-neutral-700 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="الكل">كل الحالات</option>
              <option value="جديد">جديد بالكرتونة</option>
              <option value="مستعمل بحالة ممتازة">مستعمل بحالة ممتازة</option>
              <option value="مستعمل">مستعمل</option>
              <option value="خدمة">خدمة</option>
            </select>

            <span className="text-[11px] text-neutral-400 font-mono mr-auto">
              {filteredItems.length} سلعة معروضة
            </span>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-neutral-200 text-neutral-500">
          <p className="text-sm font-medium">{t.market.noItemsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group text-right"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="bg-neutral-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl">
                    {item.condition}
                  </span>
                  {item.isSponsored && (
                    <span className="bg-amber-500 text-neutral-950 text-[10px] font-extrabold px-2 py-1 rounded-xl shadow-xs">
                      مميز
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-neutral-900 font-black text-sm px-3 py-1.5 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-1">
                  <span>{item.price.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-neutral-500">{item.currency}</span>
                  {item.isNegotiable && (
                    <span className="text-[10px] text-emerald-600 font-medium mr-1">(قابل للتفاوض)</span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {item.city} - {item.district}
                    </span>
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Seller info & actions */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  {item.sellerPageId ? (
                    <button
                      onClick={() => onOpenPage(item.sellerPageId!)}
                      className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 hover:text-emerald-700 transition-colors"
                      title={t.market.visitPage}
                    >
                      {getPageIcon(item.sellerPageType)}
                      <span className="truncate max-w-[130px]">{item.sellerName}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-500 font-medium truncate max-w-[130px]">
                      {item.sellerName}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.sellerWhatsapp && (
                      <a
                        href={`https://wa.me/${item.sellerWhatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                        title={t.market.whatsappSeller}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    <a
                      href={`tel:${item.sellerPhone}`}
                      className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                      title={t.market.callSeller}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
