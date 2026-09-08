import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  MapPin,
  Compass,
  MessageCircle,
  Plus,
  Heart,
  Share2,
  ChevronLeft,
  X,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { BlinkProductItem } from '../types';
import { JORDAN_GOVERNORATES } from '../data/jordanBlinkData';

interface SmartMarketSevenViewProps {
  items: BlinkProductItem[];
  userLocation: { city: string; coordinates?: [number, number] };
  onAddItem: (newItem: BlinkProductItem) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

// Strictly the 7 categories requested by user
const SEVEN_CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '✨' },
  { id: 'أجهزة كهربائية', label: 'أجهزة كهربائية', icon: '🔌' },
  { id: 'عفش جديد ومستعمل', label: 'عفش جديد ومستعمل', icon: '🛋️' },
  { id: 'حيوانات', label: 'حيوانات', icon: '🐶' },
  { id: 'مستلزمات حيوانات', label: 'مستلزمات حيوانات', icon: '🐾' },
  { id: 'عدد صناعية وزراعية', label: 'عدد صناعية وزراعية', icon: '🔧' },
  { id: 'أدوات بيت', label: 'أدوات بيت', icon: '🏠' },
  { id: 'بيع جملة وبضاعة', label: 'بيع جملة وبضاعة', icon: '📦' },
] as const;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

export const SmartMarketSevenView: React.FC<SmartMarketSevenViewProps> = ({
  items,
  userLocation,
  onAddItem,
  onBackToHome,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('كل المناطق');
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [likedItems, setLikedItems] = useState<{ [id: string]: boolean }>({});

  // New item form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<BlinkProductItem['smartCategory']>('أجهزة كهربائية');
  const [formPrice, setFormPrice] = useState('');
  const [formCondition, setFormCondition] = useState<'جديد' | 'مستعمل'>('مستعمل');
  const [formCity, setFormCity] = useState(userLocation.city || 'عمان');
  const [formDistrict, setFormDistrict] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('079');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('');

  const userLat = userLocation.coordinates?.[0] || 31.9539;
  const userLng = userLocation.coordinates?.[1] || 35.9106;

  // Toggle GPS Nearby
  const handleToggleNearby = () => {
    if (!isNearbyActive) {
      setIsNearbyActive(true);
      onShowToast('📍 تم تفعيل فلتر الأقرب إليك حسب الـ GPS');
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
      onShowToast(next ? 'تمت إضافة السلعة للمفضلة ❤️' : 'تم الإلغاء');
      return { ...prev, [id]: next };
    });
  };

  // Handle Form Submit
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice) {
      onShowToast('يرجى كتابة عنوان السلعة وسعرها');
      return;
    }

    const newItem: BlinkProductItem = {
      id: `smart-${Date.now()}`,
      category: 'smart_market',
      smartCategory: formCategory,
      title: formTitle,
      description: formDesc || 'سلعة معروضة للبيع المباشر على سوق بلينك الذكي',
      priceJOD: Number(formPrice) || 10,
      image:
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      condition: formCondition,
      city: formCity,
      district: formDistrict || 'المركز',
      lat: userLat,
      lng: userLng,
      likesCount: 1,
      sharesCount: 0,
      whatsapp: formWhatsapp.replace(/\s+/g, ''),
      tags: formTags
        ? formTags.split(',').map((t) => (t.trim().startsWith('@') ? t.trim() : `@${t.trim()}`))
        : ['@سوق ذكي'],
      createdAt: new Date().toISOString(),
    };

    onAddItem(newItem);
    setIsAddModalOpen(false);
    onShowToast('🎉 تم نشر سلعتك بنجاح على سوق بلينك الذكي!');

    // Reset
    setFormTitle('');
    setFormPrice('');
    setFormDesc('');
    setFormDistrict('');
  };

  // Filtered Smart Market items
  const filteredItems = useMemo(() => {
    let list = items.filter((it) => it.category === 'smart_market');

    if (activeCategory !== 'all') {
      list = list.filter((it) => it.smartCategory === activeCategory);
    }

    if (selectedGovernorate !== 'كل المناطق') {
      list = list.filter(
        (it) => it.city.includes(selectedGovernorate) || selectedGovernorate.includes(it.city)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (it) =>
          (it.title?.toLowerCase().includes(q) || false) ||
          (it.description?.toLowerCase().includes(q) || false) ||
          (it.smartCategory && it.smartCategory.toLowerCase().includes(q))
      );
    }

    const listWithDist = list.map((it) => ({
      ...it,
      computedDist: calculateDistanceKm(userLat, userLng, it.lat, it.lng),
    }));

    if (isNearbyActive) {
      listWithDist.sort((a, b) => a.computedDist - b.computedDist);
    }

    return listWithDist;
  }, [items, activeCategory, selectedGovernorate, searchQuery, isNearbyActive, userLat, userLng]);

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-28">
      {/* 1. Sticky Header Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToHome}
              className="w-10 h-10 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2">
                <span>السوق الذكي 🧠</span>
                <span className="text-xs bg-orange-100 text-[#FF6B00] font-bold px-2 py-0.5 rounded-full">
                  7 أقسام فقط
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                أجهزة، عفش، حيوانات ومستلزماتها، عدد، أدوات بيت، بيع جملة
              </p>
            </div>
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.98] text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>أضف سلعة للبيع</span>
          </button>
        </div>

        {/* 2. Top Filter Controls (GPS Nearby + Governorate) */}
        <div className="bg-neutral-50 border-t border-neutral-100 px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
            {/* GPS Nearby */}
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

        {/* 3. The 7 Strict Categories Horizontal Bar */}
        <div className="bg-white border-t border-neutral-100 px-4 py-2.5 overflow-x-auto no-scrollbar">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            {SEVEN_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
          <span>
            المعروضات ({filteredItems.length}) في {selectedGovernorate}:
          </span>
          {isNearbyActive && <span className="text-[#FF6B00]">مرتبة حسب الأقرب لموقعك GPS</span>}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto text-2xl">
              🧠
            </div>
            <h3 className="font-black text-base text-neutral-800">لا توجد سلع معروضة حالياً في هذا القسم</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              كن أول من يعرض سلعتك في قسم {activeCategory} واستقبل استفسارات الزبائن مباشرة على واتسابك!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#FF6B00] text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-[#e65c00] transition-colors"
            >
              أضف سلعتك الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isLiked = likedItems[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image with Floating Badges */}
                  <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Condition Badge & Distance */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10">
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm ${
                          item.condition === 'جديد'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-neutral-900/80 backdrop-blur-md text-white border-white/20'
                        }`}
                      >
                        {item.condition || 'مستعمل'}
                      </span>

                      <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                        يبعد {item.computedDist} كم
                      </span>
                    </div>

                    {/* Floating Overlay Card: [السعر بالدينار] [📍 الموقع] [واتساب] [تاغ] */}
                    <div className="absolute bottom-3 right-3 left-3 bg-black/75 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white space-y-2 z-10">
                      <div className="flex items-center justify-between">
                        {/* Price in JOD */}
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-xl text-[#FF6B00]">
                            {item.priceJOD.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-white">د.أ</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-neutral-300">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span>
                            {item.city} ({item.district})
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Button + Like */}
                      <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                        <a
                          href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                            `مرحبا، شفت إعلان «${item.title}» بسعر ${item.priceJOD} د.أ على سوق بلينك وبدي استفسر.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>واتساب فوري</span>
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
                  </div>

                  {/* Body Text */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="text-[10px] font-black text-[#FF6B00] mb-1">
                        {item.smartCategory}
                      </div>
                      <h3 className="font-black text-sm text-neutral-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Interactive Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-md border border-neutral-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Item Modal (with GPS + Area Name) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-neutral-900">إضافة سلعة للسوق الذكي</h3>
                  <p className="text-xs text-neutral-500">حفظ الإحداثيات والمنطقة لنظام الأقرب إلي</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  القسم (من الأقسام الـ 7 فقط):
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="أجهزة كهربائية">🔌 أجهزة كهربائية</option>
                  <option value="عفش جديد ومستعمل">🛋️ عفش جديد ومستعمل</option>
                  <option value="حيوانات">🐶 حيوانات</option>
                  <option value="مستلزمات حيوانات">🐾 مستلزمات حيوانات</option>
                  <option value="عدد صناعية وزراعية">🔧 عدد صناعية وزراعية</option>
                  <option value="أدوات بيت">🏠 أدوات بيت</option>
                  <option value="بيع جملة وبضاعة">📦 بيع جملة وبضاعة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  عنوان السلعة:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: غسالة سامسونج 9 كغم استعمال نظيف"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-neutral-700 mb-1">
                    السعر بالدينار:
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="مثال: 150"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-700 mb-1">الحالة:</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value="مستعمل">مستعمل</option>
                    <option value="جديد">جديد</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-neutral-700 mb-1">المحافظة:</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                  >
                    {JORDAN_GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.name}>
                        {gov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-neutral-700 mb-1">
                    المنطقة / الحي:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع فلسطين، طبربور"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  رقم الواتساب للتواصل:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="079xxxxxxx"
                  value={formWhatsapp}
                  onChange={(e) => setFormWhatsapp(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-neutral-700 mb-1">
                  شرح وتفاصيل السلعة:
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب مواصفات السلعة، الملحقات، وسبب البيع..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#e65c00] text-white text-sm font-black py-3 rounded-2xl shadow-xl shadow-orange-500/30 transition-all"
                >
                  نشر السلعة فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
