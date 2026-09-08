import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Heart,
  ShoppingCart,
  Phone,
  ChevronLeft,
  ArrowRight,
  Filter,
  Compass,
  Building2,
  Car,
  Home,
  Shirt,
  Utensils,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { BlinkStore, BlinkProductItem } from '../types';
import { JORDAN_GOVERNORATES } from '../data/jordanBlinkData';

interface UnifiedStoreViewProps {
  category: 'cars' | 'real_estate' | 'clothes' | 'restaurants';
  stores: BlinkStore[];
  products: BlinkProductItem[];
  userLocation: { city: string; coordinates?: [number, number] };
  onOrderGrouped: (product: BlinkProductItem) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  initialStoreId?: string | null;
}

// Distance calculation helper (Haversine formula in km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export const UnifiedStoreView: React.FC<UnifiedStoreViewProps> = ({
  category,
  stores,
  products,
  userLocation,
  onOrderGrouped,
  onBackToHome,
  onShowToast,
  initialStoreId = null,
}) => {
  // Navigation & Inside Store State
  const [selectedStore, setSelectedStore] = useState<BlinkStore | null>(() => {
    if (initialStoreId) {
      return stores.find((s) => s.id === initialStoreId) || null;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'stores' | 'items'>(
    initialStoreId ? 'items' : 'stores'
  );

  // Filters
  const [selectedGovernorate, setSelectedGovernorate] = useState('كل المناطق');
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [likedItems, setLikedItems] = useState<{ [id: string]: boolean }>({});

  // Meta info by category
  const meta = {
    cars: {
      title: 'معارض وسوق السيارات في الأردن 🚗',
      subtitle: 'تصفح معارض السيارات الحديثة والمستعملة أو استعرض السيارات بفحص كامل وكفالة',
      storeName: 'معارض سيارات',
      itemName: 'سيارات معروضة',
      icon: <Car className="w-5 h-5" />,
    },
    real_estate: {
      title: 'مكاتب وشركات العقارات 🏠',
      subtitle: 'شقق للبيع وللإيجار، فلل، ومشاريع استثمارية في عمان والمحافظات',
      storeName: 'شركات العقار',
      itemName: 'عقارات وشقق',
      icon: <Home className="w-5 h-5" />,
    },
    clothes: {
      title: 'متاجر الألبسة والأزياء 👕',
      subtitle: 'أحدث الموديلات الرجالية والنسائية مع خدمة التوصيل المجمع بدينار واحد 🛒',
      storeName: 'متاجر ألبسة',
      itemName: 'ملابس وأزياء',
      icon: <Shirt className="w-5 h-5" />,
    },
    restaurants: {
      title: 'المطاعم والوجبات السريعة 🍔',
      subtitle: 'أشهر المطاعم الأردنية، شاورما، برجر، ومناسف بطلب فوري أو شحن مجمع',
      storeName: 'مطاعم',
      itemName: 'وجبات وأطباق',
      icon: <Utensils className="w-5 h-5" />,
    },
    factories: {
      title: 'مصانع الأردن للبيع بالجملة 🏭',
      subtitle: 'منتجات من المصنع مباشرة للتجار، اطلب للتجميع وشركة الشحن توصلك',
      storeName: 'مصانع',
      itemName: 'منتجات جملة',
      icon: <span className="text-lg">🏭</span>,
    },
  }[category] || {
    title: 'أقسام بلينك',
    subtitle: '',
    storeName: 'متاجر',
    itemName: 'منتجات',
    icon: null,
  };

  // User coordinates default or Amman
  const userLat = userLocation.coordinates?.[0] || 31.9539;
  const userLng = userLocation.coordinates?.[1] || 35.9106;

  // Toggle GPS Nearby
  const handleToggleNearby = () => {
    if (!isNearbyActive) {
      setIsNearbyActive(true);
      onShowToast('📍 تم تفعيل ترتيب المعروضات حسب الأقرب إلى موقعك GPS');
    } else {
      setIsNearbyActive(false);
      onShowToast('تم إلغاء فلتر الأقرب');
    }
  };

  // Toggle Like
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => {
      const next = !prev[id];
      onShowToast(next ? 'تمت الإضافة إلى إعجاباتك ❤️' : 'تم إلغاء الإعجاب');
      return { ...prev, [id]: next };
    });
  };

  // Filtered & Sorted Stores
  const filteredStores = useMemo(() => {
    let list = stores.filter((s) => s.category === category);

    if (selectedGovernorate !== 'كل المناطق') {
      list = list.filter((s) => s.city.includes(selectedGovernorate) || selectedGovernorate.includes(s.city));
    }

    // Attach distances
    const listWithDist = list.map((s) => ({
      ...s,
      computedDist: calculateDistanceKm(userLat, userLng, s.lat, s.lng),
    }));

    if (isNearbyActive) {
      listWithDist.sort((a, b) => a.computedDist - b.computedDist);
    }

    return listWithDist;
  }, [stores, category, selectedGovernorate, isNearbyActive, userLat, userLng]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.category === category);

    if (selectedStore) {
      list = list.filter((p) => p.storeId === selectedStore.id);
    } else if (selectedGovernorate !== 'كل المناطق') {
      list = list.filter((p) => p.city.includes(selectedGovernorate) || selectedGovernorate.includes(p.city));
    }

    const listWithDist = list.map((p) => ({
      ...p,
      computedDist: calculateDistanceKm(userLat, userLng, p.lat, p.lng),
    }));

    if (isNearbyActive) {
      listWithDist.sort((a, b) => a.computedDist - b.computedDist);
    }

    return listWithDist;
  }, [products, category, selectedStore, selectedGovernorate, isNearbyActive, userLat, userLng]);

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-28">
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Back & Title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (selectedStore) {
                  setSelectedStore(null);
                } else {
                  onBackToHome();
                }
              }}
              className="w-10 h-10 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors"
              title="رجوع"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2">
                <span>{selectedStore ? selectedStore.name : meta.title}</span>
                {selectedStore && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium line-clamp-1">
                {selectedStore ? `📍 ${selectedStore.city} - ${selectedStore.district}` : meta.subtitle}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Only if not inside a specific store) */}
          {!selectedStore && (
            <div className="flex items-center bg-neutral-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'stores'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {meta.storeName} ({filteredStores.length})
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'items'
                    ? 'bg-white text-[#FF6B00] shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {meta.itemName} ({filteredProducts.length})
              </button>
            </div>
          )}
        </div>

        {/* 2. Top Controls Strip (GPS Nearby + Region Selector) */}
        <div className="bg-neutral-50 border-t border-neutral-100 px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
            {/* GPS Nearby Button */}
            <button
              onClick={handleToggleNearby}
              className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                isNearbyActive
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>📍 الأقرب إلي</span>
              {isNearbyActive && <span className="text-[10px] bg-white/20 px-1 rounded">مفعل</span>}
            </button>

            {/* Region Select */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>اختر المنطقة:</span>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="bg-white border border-neutral-300 rounded-xl px-2.5 py-1 text-xs font-black text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
              >
                <option value="كل المناطق">كل المناطق ▼</option>
                {JORDAN_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.name}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inside Store Banner (If viewing inside a store) */}
      {selectedStore && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-white rounded-3xl border border-neutral-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={selectedStore.logo}
                alt={selectedStore.name}
                className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-neutral-900">{selectedStore.name}</h2>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                    موثوق بالهوية 🇯🇴
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 max-w-xl">{selectedStore.bio}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {selectedStore.rating} ({selectedStore.reviewCount} تقييم)
                  </span>
                  <span>• {selectedStore.itemsCount} معروضات</span>
                  <span>• يبعد {calculateDistanceKm(userLat, userLng, selectedStore.lat, selectedStore.lng)} كم</span>
                </div>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://wa.me/${selectedStore.whatsapp}?text=${encodeURIComponent(
                  `مرحبا ${selectedStore.name}، شفت متجركم على بلينك وبدي استفسر عن المعروضات.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب المتجر</span>
              </a>
              <a
                href={`tel:${selectedStore.phone}`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span>اتصال</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 pt-5">
        {/* =================================================================
            VIEW 1: STORES GRID (معارض السيارات، شركات العقار، متاجر الألبسة، المطاعم)
            ================================================================= */}
        {!selectedStore && activeTab === 'stores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span>عرض المتاجر المعتمدة في {selectedGovernorate}:</span>
              <span>{filteredStores.length} متجر متاح</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  {/* Store Cover / Photo */}
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img
                      src={store.coverImage || store.logo}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Logo & Verification Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2.5">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
                      />
                      <div className="text-white">
                        <div className="font-black text-sm drop-shadow-md flex items-center gap-1">
                          <span>{store.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-neutral-200">
                          📍 {store.city} ({store.district})
                        </div>
                      </div>
                    </div>

                    {/* Distance Pill */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                      يبعد {store.computedDist} كم
                    </div>
                  </div>

                  {/* Store Details & Tags */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {store.bio}
                    </p>

                    {/* Tags */}
                    {store.tags && store.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {store.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-orange-50 text-[#FF6B00] font-black px-2 py-0.5 rounded-lg border border-orange-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Stats & Button */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {store.rating}
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-neutral-600 font-bold">
                          {store.itemsCount} {meta.itemName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-black text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                        <span>دخول المتجر</span>
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================
            VIEW 2: PRODUCTS GRID WITH NEW FLOATING CARDS SPECIFICATION
            ================================================================= */}
        {(selectedStore || activeTab === 'items') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span>
                {selectedStore ? `المعروضات داخل ${selectedStore.name}:` : `كل الـ ${meta.itemName}:`}
              </span>
              <span>{filteredProducts.length} عنصر</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((item) => {
                const isLiked = likedItems[item.id];

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Media Container with Floating Overlay */}
                    <div className="relative aspect-square sm:aspect-4/3 bg-neutral-900 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                      {/* Top Badges (Store Name & Distance) */}
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10">
                        <span className="text-[11px] font-black bg-neutral-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20">
                          {item.storeName || item.city}
                        </span>

                        <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                          يبعد {item.computedDist} كم
                        </span>
                      </div>

                      {/* =============================================================
                          FLOATING CARD OVERLAY SPECIFICATIONS (حسب الطلب تماماً)
                          ============================================================= */}

                      {/* SPEC A: CLOTHES & RESTAURANTS FLOATING 2-ROW CARD */}
                      {(category === 'clothes' || category === 'restaurants') && (
                        <div className="absolute bottom-3 right-3 left-3 space-y-2 z-10">
                          {/* Row 1: [إعجاب ❤️ مع عداد] [السعر بالدينار برتقالي #FF6B00 كبير] [مشاركة ↗️] */}
                          <div className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 flex items-center justify-between text-white">
                            {/* Like with counter */}
                            <button
                              onClick={(e) => handleToggleLike(item.id, e)}
                              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FF6B00] transition-colors"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                                }`}
                              />
                              <span>{item.likesCount + (isLiked ? 1 : 0)}</span>
                            </button>

                            {/* Price: Big Orange #FF6B00 in JOD */}
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-xl text-[#FF6B00]">
                                {item.priceJOD}
                              </span>
                              <span className="font-black text-xs text-white">د.أ</span>
                            </div>

                            {/* Share */}
                            <button
                              onClick={() => onShowToast(`تم نسخ رابط ${item.title}`)}
                              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                              title="مشاركة"
                            >
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                          </div>

                          {/* Row 2: [زر "طلب بتجمع 🛒" برتقالي كبير] [زر واتساب أخضر 💬] */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onOrderGrouped(item)}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.98] text-white text-xs sm:text-sm font-black py-2.5 px-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>طلب بتجمع 🛒</span>
                            </button>

                            <a
                              href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                                `مرحبا، معجب بـ «${item.title}» بسعر ${item.priceJOD} د.أ على بلينك وبدي أطلبه.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-colors shrink-0"
                              title="محادثة واتساب مباشرة"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* SPEC B: CARS & REAL ESTATE CARD [السعر] [📍 الموقع + المسافة] [واتساب] [تاغ] */}
                      {(category === 'cars' || category === 'real_estate') && (
                        <div className="absolute bottom-3 right-3 left-3 bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white space-y-2 z-10">
                          <div className="flex items-center justify-between">
                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                              <span className="font-black text-xl text-[#FF6B00]">
                                {item.priceJOD.toLocaleString()}
                              </span>
                              <span className="text-xs font-bold text-white">د.أ</span>
                            </div>

                            {/* Location + Distance */}
                            <div className="flex items-center gap-1 text-[11px] text-neutral-300">
                              <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                              <span>
                                {item.city} • {item.computedDist} كم
                              </span>
                            </div>
                          </div>

                          {/* WhatsApp & Call Buttons */}
                          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                            <a
                              href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                                `مرحبا، شفت إعلان «${item.title}» بسعر ${item.priceJOD} د.أ على تطبيق بلينك وبدي استفسر.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>واتساب الفوري</span>
                            </a>

                            <button
                              onClick={(e) => handleToggleLike(item.id, e)}
                              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white shrink-0"
                            >
                              <Heart
                                className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Title & Description Below Image */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        <h3 className="font-black text-sm sm:text-base text-neutral-900 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Interactive Tags (Cars & Real Estate) */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {item.tags.map((tag, idx) => (
                            <button
                              key={idx}
                              onClick={() => onShowToast(`فتح الشريك: ${tag}`)}
                              className="text-[10px] bg-neutral-100 hover:bg-orange-50 hover:text-[#FF6B00] text-neutral-700 font-bold px-2 py-0.5 rounded-md border border-neutral-200 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Specific metadata chips (Cars year / Clothes sizes) */}
                      {item.carYear && (
                        <div className="text-[11px] text-neutral-500 font-bold flex items-center gap-2">
                          <span>موديل: {item.carYear}</span>
                          <span>•</span>
                          <span>الممشى: {item.carMileage}</span>
                        </div>
                      )}

                      {item.sizes && (
                        <div className="text-[11px] text-neutral-500 font-bold flex items-center gap-1.5">
                          <span>المقاسات المتوفرة:</span>
                          <span className="text-[#FF6B00] font-black">{item.sizes.join(' - ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
