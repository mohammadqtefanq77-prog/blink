import React, { useState, useMemo } from 'react';
import {
  Wrench,
  MapPin,
  Clock,
  Star,
  Phone,
  MessageCircle,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Truck,
  Leaf,
  Users,
  AlertCircle,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ServiceProvider, ServiceRequest, UserLocation } from '../types';
import { RequestServiceModal } from './RequestServiceModal';
import { RegisterProviderModal } from './RegisterProviderModal';
import { ServiceReviewModal } from './ServiceReviewModal';
import { calculateDistanceKm } from '../data/initialServices';

interface NearbyServicesViewProps {
  providers: ServiceProvider[];
  serviceRequests: ServiceRequest[];
  userLocation: UserLocation;
  onRequestService: (request: Partial<ServiceRequest>) => void;
  onRegisterProvider: (provider: ServiceProvider) => void;
  onSubmitReview: (providerId: string, review: { reviewerName: string; rating: number; comment: string }) => void;
  onReport?: (id: string, name: string) => void;
  onOpenPersonProfile?: (provider: ServiceProvider) => void;
}

export const NearbyServicesView: React.FC<NearbyServicesViewProps> = ({
  providers = [],
  serviceRequests = [],
  userLocation,
  onRequestService,
  onRegisterProvider,
  onSubmitReview,
  onReport,
  onOpenPersonProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [seasonalOnly, setSeasonalOnly] = useState<boolean>(false);
  const [transportOnly, setTransportOnly] = useState<boolean>(false);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'jobs'>('distance');
  const [activeSubTab, setActiveSubTab] = useState<'providers' | 'requests'>('providers');

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [reviewingProvider, setReviewingProvider] = useState<ServiceProvider | null>(null);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<ServiceProvider | null>(null);
  const [selectedWorkImage, setSelectedWorkImage] = useState<string | null>(null);

  // Compute distance for all providers relative to userLocation
  const computedProviders = useMemo(() => {
    return (providers || []).map((prov) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        prov.locationLat || userLocation.lat,
        prov.locationLng || userLocation.lng
      );
      return {
        ...prov,
        distanceKm: dist,
      };
    });
  }, [providers, userLocation]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return computedProviders.filter((prov) => {
      if (selectedCategory !== 'الكل' && prov.category !== selectedCategory) {
        return false;
      }
      if (seasonalOnly && !prov.isSeasonal) return false;
      if (transportOnly && !prov.isTransport) return false;
      if (availableNowOnly && !prov.isAvailableNow) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${prov.name} ${prov.profession} ${prov.bio} ${prov.city} ${prov.district} ${prov.serviceAreas.join(' ')}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        // Nearest first, then available
        if (a.distanceKm !== b.distanceKm) return (a.distanceKm || 99) - (b.distanceKm || 99);
        if (a.isAvailableNow !== b.isAvailableNow) return a.isAvailableNow ? -1 : 1;
        return b.rating - a.rating;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'jobs') {
        return b.completedJobsCount - a.completedJobsCount;
      }
      return 0;
    });
  }, [computedProviders, selectedCategory, seasonalOnly, transportOnly, availableNowOnly, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner / Hero */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 pt-6 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <MapPin className="w-3.5 h-3.5" />
                  موقعك الحالي: {userLocation.city} - {userLocation.district || 'وسط البلد'}
                </span>
                <span className="text-xs text-slate-400">نطاق التغطية الأقرب</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <span>خدمات ومهن قريبة منك</span>
                <span className="text-xl">🛠️</span>
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                اعثر على أمهر الحرفيين ومقدمي الخدمات الأقرب إليك: عمال يومية، دهّانون، سباكون، كهربائيون، خدمات تقليم وزراعة، نقل عفش وسيارات، وأي مهنة أخرى تبحث عنها.
              </p>
            </div>

            {/* Main CTAs */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <button
                id="btn-request-service"
                onClick={() => setIsRequestModalOpen(true)}
                className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>اطلب أي خدمة الآن</span>
              </button>
              <button
                id="btn-register-provider"
                onClick={() => setIsRegisterModalOpen(true)}
                className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-4 py-3 rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 text-sm"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>سجّل كصاحب مهنة</span>
              </button>
            </div>
          </div>

          {/* Quick Seasonal & Transport Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800/60">
            <span className="text-xs font-semibold text-slate-400">الخدمات الرائجة والموسمية:</span>

            <button
              onClick={() => {
                setSeasonalOnly(!seasonalOnly);
                if (!seasonalOnly) {
                  setTransportOnly(false);
                  setSelectedCategory('خدمات زراعية وموسمية');
                } else {
                  setSelectedCategory('الكل');
                }
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                seasonalOnly
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>موسم الزيتون والتقليم والحصاد 🫒</span>
            </button>

            <button
              onClick={() => {
                setTransportOnly(!transportOnly);
                if (!transportOnly) {
                  setSeasonalOnly(false);
                  setSelectedCategory('نقل وتحميل');
                } else {
                  setSelectedCategory('الكل');
                }
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                transportOnly
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>نقل عفش وسيارة نقل (ديانا) 🚚</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('عامل يومي');
              }}
              className="text-xs px-3 py-1.5 rounded-lg border bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600 transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>عامل يومي وتحميل وتنزيل 👷</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Controls: Search, Category, Sub-tab & Sort */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search within services */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="ابحث عن مهنة (دهين، سباك، نجار، زيتون)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Sub Tabs: Providers vs Open Requests */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setActiveSubTab('providers')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'providers'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>مقدمو الخدمات ({filteredProviders.length})</span>
              </button>
              <button
                onClick={() => setActiveSubTab('requests')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeSubTab === 'requests'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>طلبات الجيران القريبة ({serviceRequests.length})</span>
              </button>
            </div>

            {/* Sort & Available Toggle */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">
                <input
                  type="checkbox"
                  checked={availableNowOnly}
                  onChange={(e) => setAvailableNowOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-emerald-500 focus:ring-0"
                />
                <span className="text-emerald-400 font-semibold">متاح الآن</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="distance">الأقرب إليك أولاً (بالكيلومتر)</option>
                <option value="rating">الأعلى تقييماً ⭐</option>
                <option value="jobs">الأكثر إنجازاً للخدمات</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-800/80 pt-3">
            {[
              'الكل',
              'صيانة وبناء',
              'خدمات زراعية وموسمية',
              'نقل وتحميل',
              'خدمات منزلية',
              'عمالة ومهن حرة',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSeasonalOnly(false);
                  setTransportOnly(false);
                }}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition font-medium ${
                  selectedCategory === cat && !seasonalOnly && !transportOnly
                    ? 'bg-slate-100 text-slate-900 border-white font-bold'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section: Providers List */}
        {activeSubTab === 'providers' && (
          <div>
            {filteredProviders.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
                <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">لم يتم العثور على مقدم خدمة يطابق هذا البحث</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  تستطيع نشر طلبك بالاسم والمواصفات وسيقوم أقرب الفنيين والعمال بالتواصل معك فوراً، أو تغيير معايير البحث.
                </p>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-amber-400 transition"
                >
                  اطلب هذه الخدمة الآن
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProviders.map((prov) => (
                  <div
                    key={prov.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={prov.avatar}
                              alt={prov.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                            />
                            {prov.isAvailableNow && (
                              <span
                                title="متاح الآن للعمل الفوري"
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                                {prov.name}
                              </h3>
                              {prov.isVerified && (
                                <ShieldCheck className="w-4 h-4 text-emerald-400" title="هوية موثقة" />
                              )}
                            </div>
                            <span className="inline-block text-xs font-semibold text-amber-400 mt-0.5">
                              {prov.profession}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                              <span className="flex items-center gap-1 text-slate-300">
                                <MapPin className="w-3 h-3 text-amber-400" />
                                {prov.city} • {prov.district}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                يبعد {prov.distanceKm || 1.2} كم
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="text-left shrink-0">
                          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-amber-300">{prov.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {prov.completedJobsCount} خدمة منجزة
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-2">
                        {prov.bio}
                      </p>

                      {/* Portfolio Thumbnails */}
                      {prov.portfolioImages && prov.portfolioImages.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                            نماذج من الأعمال السابقة:
                          </span>
                          <div className="flex gap-2">
                            {prov.portfolioImages.slice(0, 3).map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedWorkImage(img)}
                                className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700/80 hover:opacity-90 transition relative group/thumb"
                              >
                                <img src={img} alt="عمل سابق" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Service Coverage Areas */}
                      {prov.serviceAreas && prov.serviceAreas.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-slate-400">مناطق التغطية:</span>
                          {prov.serviceAreas.map((area, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${prov.phone}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">اتصال مباشر</span>
                        </a>

                        {prov.whatsapp && (
                          <a
                            href={`https://wa.me/${prov.whatsapp}?text=${encodeURIComponent(
                              `مرحباً معلم ${prov.name}، رأيت ملفك على منصة بلينك وأرغب بطلب خدمة ${prov.profession}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">واتساب</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onOpenPersonProfile && (
                          <button
                            onClick={() => onOpenPersonProfile(prov)}
                            className="px-2.5 py-2 text-xs rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center gap-1 font-bold"
                            title="الملف الشخصي والمنتجات والمحتوى"
                          >
                            <span>الملف</span>
                            <span className="text-[10px]">👤</span>
                          </button>
                        )}

                        <button
                          onClick={() => setReviewingProvider(prov)}
                          className="px-2.5 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition flex items-center gap-1"
                          title="تقييم الخدمة المنجزة"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>تقييم</span>
                        </button>

                        <button
                          onClick={() => onReport && onReport(prov.id, prov.name)}
                          className="p-2 text-xs rounded-xl text-slate-400 hover:text-red-400 transition"
                          title="إبلاغ عن مخالفة"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section: Open Requests List */}
        {activeSubTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300">طلبات الجيران وأصحاب المنازل القريبة</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  تصفح الأعمال المطلوبة حالياً في محيط منطقتك، إذا كنت حرفياً أو لديك سيارة أو وقت، يمكنك التواصل وإنجاز العمل بالاتفاق.
                </p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shrink-0"
              >
                أضف طلبك الآن
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                        {req.serviceType}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">{req.requesterName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {req.city} - {req.district} {req.locationDetails ? `(${req.locationDetails})` : ''}
                      </p>
                    </div>

                    <div className="text-left">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          req.timing === 'الآن'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {req.timing === 'الآن' ? '⚡ مطلوب فوراً' : req.timing}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">{req.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {req.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400">
                      {req.agreedPrice ? `الاتفاق: ${req.agreedPrice}` : 'السعر: بالاتفاق المباشر بين الطرفين'}
                    </span>

                    <a
                      href={`tel:${req.requesterPhone}`}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>تواصل لإنجاز الطلب</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedWorkImage && (
        <div
          onClick={() => setSelectedWorkImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
        >
          <div className="max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-700">
            <img src={selectedWorkImage} alt="عمل سابق" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Modals */}
      <RequestServiceModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={onRequestService}
        userLocation={userLocation}
        allProviders={providers}
      />

      <RegisterProviderModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={onRegisterProvider}
        userLocation={userLocation}
      />

      {reviewingProvider && (
        <ServiceReviewModal
          isOpen={!!reviewingProvider}
          onClose={() => setReviewingProvider(null)}
          provider={reviewingProvider}
          onSubmitReview={onSubmitReview}
        />
      )}
    </div>
  );
};
