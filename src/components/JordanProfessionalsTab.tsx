import React, { useState, useMemo } from 'react';
import {
  Search,
  Wrench,
  Zap,
  Phone,
  MessageCircle,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
} from 'lucide-react';
import { ServiceProvider, UserLocation } from '../types';

interface JordanProfessionalsTabProps {
  professionals: ServiceProvider[];
  userLocation: UserLocation;
  onRequestService: (provider?: ServiceProvider) => void;
  onOpenPersonProfile?: (provider: ServiceProvider) => void;
}

export const JordanProfessionalsTab: React.FC<JordanProfessionalsTabProps> = ({
  professionals,
  userLocation,
  onRequestService,
  onOpenPersonProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedProviderForDetail, setSelectedProviderForDetail] = useState<ServiceProvider | null>(null);

  // Jordanian quick search pills
  const QUICK_CHIPS = [
    { label: 'المي بتطفح 🚨', query: 'المي بتطفح' },
    { label: 'شورت كهربا ⚡', query: 'كهربجي' },
    { label: 'نجار خشب 🪚', query: 'نجار' },
    { label: 'تصليح تكييف ❄️', query: 'مكيف' },
    { label: 'نقل عفش ديانا 🚚', query: 'نقل عفش' },
    { label: 'دهين منازل 🎨', query: 'دهين' },
    { label: 'مبلط وسيراميك 🧱', query: 'مبلط' },
  ];

  const CATEGORIES = [
    'الكل',
    'سباكة ومواسير',
    'كهرباء وإنارة',
    'نجارة وأثاث',
    'تكييف وتبريد',
    'دهان وديكور',
    'نقل وتحميل',
    'حدادة وألمنيوم',
  ];

  // Smart Query Detection: "المي بتطفح" triggers emergency plumber
  const isEmergencyWaterQuery = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (
      q.includes('المي بتطفح') ||
      q.includes('بتطفح') ||
      q.includes('تسريب مياه') ||
      q.includes('ماسورة انفجرت') ||
      q.includes('غرق') ||
      q.includes('المي قاطعة') ||
      (q.includes('مي') && q.includes('حمام'))
    );
  }, [searchQuery]);

  // Filtered & Ranked Professionals
  const filteredProfessionals = useMemo(() => {
    let list = [...professionals];

    // Category filter
    if (selectedCategory !== 'الكل') {
      list = list.filter((p) => {
        const text = `${p.profession} ${p.category} ${p.servicesOffered?.join(' ')}`.toLowerCase();
        if (selectedCategory === 'سباكة ومواسير') return text.includes('سباك') || text.includes('موسرج') || text.includes('مياه');
        if (selectedCategory === 'كهرباء وإنارة') return text.includes('كهرب');
        if (selectedCategory === 'نجارة وأثاث') return text.includes('نجار') || text.includes('خشب');
        if (selectedCategory === 'تكييف وتبريد') return text.includes('مكيف') || text.includes('تكييف');
        if (selectedCategory === 'دهان وديكور') return text.includes('دهان') || text.includes('دهين');
        if (selectedCategory === 'نقل وتحميل') return text.includes('نقل') || text.includes('عفش') || text.includes('ديانا');
        if (selectedCategory === 'حدادة وألمنيوم') return text.includes('حداد') || text.includes('ألمنيوم');
        return true;
      });
    }

    // Only verified
    if (onlyVerified) {
      list = list.filter((p) => p.isVerified);
    }

    // Search query matching
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      if (isEmergencyWaterQuery) {
        // Prioritize plumbers and water specialists at the top
        list.sort((a, b) => {
          const aIsPlumber = (a.profession + a.bio).includes('سباك') || (a.profession + a.bio).includes('موسرجي');
          const bIsPlumber = (b.profession + b.bio).includes('سباك') || (b.profession + b.bio).includes('موسرجي');
          if (aIsPlumber && !bIsPlumber) return -1;
          if (!aIsPlumber && bIsPlumber) return 1;
          return (a.distanceKm || 99) - (b.distanceKm || 99);
        });
      } else {
        list = list.filter((p) => {
          const combined = `${p.name} ${p.profession} ${p.category} ${p.city} ${p.district} ${p.bio} ${p.servicesOffered?.join(' ')}`.toLowerCase();
          const queryWords = q.split(/\s+/);
          return queryWords.some((w) => combined.includes(w));
        });
      }
    }

    return list;
  }, [professionals, searchQuery, selectedCategory, onlyVerified, isEmergencyWaterQuery]);

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '962' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`مرحبا يا معلم ${name}، شفت إعلانك على تطبيق بلينك الأردن وبدي أستفسر عن خدمتك.`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner - Jordanian Orange & Black */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-black px-3 py-1 rounded-full mb-2 border border-orange-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مهنيين مرخصين وموثقين بالهوية 🇯🇴</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>دليل المهنيين في الأردن</span>
              <span className="text-orange-500">Blink</span>
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1">
              سباك، كهربجي، نجار، دهين، وفنيين معتمدين بقرب موقعك في {userLocation.city}
            </p>
          </div>

          <button
            onClick={() => onRequestService()}
            className="self-start sm:self-auto bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>طلب فزعة أو صيانة فورية</span>
          </button>
        </div>

        {/* Smart Search Input with Jordanian Dialect Support */}
        <div className="mt-4 relative">
          <div className="relative flex items-center">
            <Search className="absolute right-4 w-5 h-5 text-orange-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='ابحث بالعامية: "المي بتطفح"، "كهربجي شورت"، "نجار خشب"، "دهين شاطر"...'
              className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-orange-500 text-white placeholder-neutral-400 text-sm font-medium rounded-2xl pr-12 pl-10 py-3.5 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Jordanian Phrases Pills */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-neutral-400 shrink-0 ml-1">أمثلة سريعة:</span>
            {QUICK_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(chip.query)}
                className={`text-xs font-bold px-3 py-1 rounded-xl whitespace-nowrap transition-all shrink-0 ${
                  searchQuery === chip.query
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/50'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Plumber Banner: Triggers when user writes "المي بتطفح" */}
      {isEmergencyWaterQuery && (
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-3.5 sm:p-4 text-neutral-900 flex items-start gap-3 shadow-md animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">حالة طوارئ مياه 🚨</span>
              <h3 className="font-black text-sm text-red-700">رصدنا إن «المي بتطفح» عندك!</h3>
            </div>
            <p className="text-xs text-neutral-700 mt-1 font-medium leading-relaxed">
              تم استدعاء وفلترة أمهر السباكين والموسرجية الأقرب لموقعك في <strong className="text-red-700">{userLocation.city}</strong> مع جاهزية الحضور الفوري بأدوات كشف التسريب والمعدات.
            </p>
          </div>
        </div>
      )}

      {/* Category Pills & Filters */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyVerified(!onlyVerified)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
            onlyVerified
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>موثق بالهوية فقط</span>
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-bold px-1">
        <span>عرض {filteredProfessionals.length} مهني متوفر الآن في الأردن</span>
        <span>مرتب حسب الأقرب لموقعك 📍</span>
      </div>

      {/* Professionals List (Modern Jordanian Cards with Shadows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredProfessionals.map((prov) => {
          const isPlumber = (prov.profession + prov.bio).includes('سباك') || (prov.profession + prov.bio).includes('موسرجي');
          const isHighlighted = isEmergencyWaterQuery && isPlumber;

          return (
            <div
              key={prov.id}
              className={`bg-white rounded-2xl p-4 transition-all duration-200 hover:shadow-xl border ${
                isHighlighted
                  ? 'border-2 border-red-500/60 shadow-lg shadow-red-500/10 ring-2 ring-red-500/20'
                  : 'border-neutral-200/90 shadow-md hover:border-orange-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={prov.avatar}
                    alt={prov.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-neutral-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  {prov.isAvailableNow && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="متاح الآن" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        onClick={() => onOpenPersonProfile && onOpenPersonProfile(prov)}
                        className="font-black text-sm sm:text-base text-neutral-900 truncate hover:text-orange-600 cursor-pointer transition-colors"
                      >
                        {prov.name}
                      </h3>
                      {prov.isVerified && (
                        <span className="inline-flex items-center gap-0.5 bg-orange-50 text-orange-600 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-orange-200 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-orange-500" />
                          <span>موثق 🇯🇴</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-black px-1.5 py-0.5 rounded-lg shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{prov.rating}</span>
                      <span className="text-[10px] text-amber-600/80 font-normal">({prov.reviewCount})</span>
                    </div>
                  </div>

                  {/* Profession */}
                  <p className="text-xs font-bold text-orange-600 mt-0.5">
                    {prov.profession}
                  </p>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{prov.city} - {prov.district}</span>
                    </span>
                    <span className="bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      تبعد {prov.distanceKm || '1.8'} كم
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio / Description */}
              <p className="text-xs text-neutral-600 font-medium mt-2.5 line-clamp-2 leading-relaxed bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                {prov.bio}
              </p>

              {/* Action Buttons: WhatsApp & Call */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-neutral-100">
                <button
                  onClick={() => handleWhatsApp(prov.phone, prov.name)}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black py-2 px-3 rounded-xl shadow-xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب فوري</span>
                </button>

                <a
                  href={`tel:${prov.phone}`}
                  className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-black py-2 px-3 rounded-xl shadow-xs transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>اتصال مباشر</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProfessionals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
          <Wrench className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <h3 className="font-black text-neutral-800 text-base">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs text-neutral-500 mt-1">جرب تغيير كلمات البحث أو اختر مهنة أخرى من القائمة</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('الكل');
              setOnlyVerified(false);
            }}
            className="mt-3 text-xs font-bold text-orange-600 underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};
