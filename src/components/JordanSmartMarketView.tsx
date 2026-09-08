import React, { useState, useMemo } from 'react';
import {
  Tag,
  Search,
  Plus,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  Users,
  Radio,
  ArrowRight,
  ChevronLeft,
  X,
  AlertCircle,
  Filter,
  DollarSign,
  Wrench,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { MarketItem, BuyerSearchRequest, ServiceProvider, UserLocation } from '../types';

interface JordanSmartMarketViewProps {
  marketItems: MarketItem[];
  buyerRequests: BuyerSearchRequest[];
  professionals: ServiceProvider[];
  userLocation: UserLocation;
  onAddNewMarketItem: (item: MarketItem) => void;
  onAddNewBuyerRequest: (req: BuyerSearchRequest) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
  onOpenPersonProfile?: (provider: any) => void;
}

interface SmartAlgorithmAnalysis {
  detectedProblem: string;
  requiredEntities: {
    title: string;
    type: 'service' | 'hardware' | 'material';
    icon: string;
  }[];
  estimatedCostRangeJOD: string;
  matchedProviders: ServiceProvider[];
}

export const JordanSmartMarketView: React.FC<JordanSmartMarketViewProps> = ({
  marketItems,
  buyerRequests,
  professionals,
  userLocation,
  onAddNewMarketItem,
  onAddNewBuyerRequest,
  onBackToHome,
  onShowToast,
  onOpenPersonProfile,
}) => {
  // Modal states
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Tab & Filter states
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'buyers'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // Smart Algorithm State
  const [algoInput, setAlgoInput] = useState('');
  const [isAnalyzingAlgo, setIsAnalyzingAlgo] = useState(false);
  const [algoResult, setAlgoResult] = useState<SmartAlgorithmAnalysis | null>(null);
  const [isBroadcastSent, setIsBroadcastSent] = useState(false);

  // Form state for "بدي أبيع"
  const [sellForm, setSellForm] = useState({
    title: '',
    category: 'أجهزة وأدوات منزلية',
    price: '',
    isNegotiable: true,
    condition: 'مستعمل بحالة ممتازة',
    city: userLocation.city || 'عمان',
    district: userLocation.district || 'صويلح',
    sellerPhone: '0791234567',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  });

  // Form state for "بدي أشتري"
  const [buyForm, setBuyForm] = useState({
    buyerName: 'مستخدم بلينك',
    productKeyword: '',
    rawQuery: '',
    maxBudget: '',
    category: 'أجهزة وأدوات منزلية',
    city: userLocation.city || 'عمان',
    district: userLocation.district || 'تلاع العلي',
    buyerPhone: '0799887766',
  });

  // Quick chips for smart algorithm
  const SMART_ALGO_PRESETS = [
    { label: 'المي بتطفح 🚨', query: 'المي بتطفح' },
    { label: 'شورت كهربا طافي البيت ⚡', query: 'شورت كهربا' },
    { label: 'باب خشب محشور 🪚', query: 'باب خشب' },
    { label: 'حمايات شبابيك حديد 🔨', query: 'حماية حديد' },
    { label: 'نقل كنب وغرفة نوم 🚚', query: 'نقل كنب' },
  ];

  // The Smart Algorithm function: Understanding problems like "المي بتطفح" -> سباك + مضخة + مواد عزل
  const runSmartAlgorithm = (text: string) => {
    if (!text.trim()) {
      setAlgoResult(null);
      return;
    }

    setIsAnalyzingAlgo(true);
    setIsBroadcastSent(false);

    setTimeout(() => {
      const q = text.toLowerCase();
      let detectedProblem = 'احتياج صيانة وفحص عام';
      let entities: { title: string; type: 'service' | 'hardware' | 'material'; icon: string }[] = [];
      let costRange = '15 - 35 د.أ';
      let searchKey = 'سباك';

      if (q.includes('بتطفح') || q.includes('طفحت') || q.includes('مي') || q.includes('تسريب') || q.includes('مواسير') || q.includes('حنفية')) {
        detectedProblem = 'طوارئ تسريب وارتداد مياه وصرف صحي';
        entities = [
          { title: 'سباك وموسرجي طوارئ', type: 'service', icon: '🚰' },
          { title: 'مضخة مياه غاطسة أو دينمو سحب', type: 'hardware', icon: '⚙️' },
          { title: 'مواد عزل وسيليكون تسكير تسريب', type: 'material', icon: '🛡️' },
        ];
        costRange = '15 - 35 د.أ (أجور سباكة) + 45 د.أ (مضخة تقديرية)';
        searchKey = 'سباك';
      } else if (q.includes('كهرب') || q.includes('شورت') || q.includes('قاطع') || q.includes('إنارة')) {
        detectedProblem = 'عطل كهربائي طارئ في القواطع أو الأسلاك';
        entities = [
          { title: 'كهربائي معتمد لفحص الشورت', type: 'service', icon: '⚡' },
          { title: 'قواطع تيار رئيسية وأسلاك نحاسية', type: 'hardware', icon: '🔌' },
          { title: 'مواد عزل وتب شيلد وتأريض', type: 'material', icon: '🛡️' },
        ];
        costRange = '15 - 30 د.أ';
        searchKey = 'كهربجي';
      } else if (q.includes('نجار') || q.includes('باب') || q.includes('خشب') || q.includes('خزانة')) {
        detectedProblem = 'صيانة أو فك وتركيب خشب وأبواب';
        entities = [
          { title: 'نجار أبواب ومطابخ', type: 'service', icon: '🪚' },
          { title: 'مفصلات وكيلونات أمان إيطالية', type: 'hardware', icon: '🔑' },
          { title: 'براغي تثبيت وغراء خشب ألماني', type: 'material', icon: '🪵' },
        ];
        costRange = '20 - 45 د.أ';
        searchKey = 'نجار';
      } else if (q.includes('حديد') || q.includes('حداد') || q.includes('حماية') || q.includes('مظلة')) {
        detectedProblem = 'تفصيل وتركيب حديد أمان وحمايات';
        entities = [
          { title: 'معلم حدادة ولحام متنقل', type: 'service', icon: '🔨' },
          { title: 'قضبان حديد مبروم ومربعات أمان', type: 'hardware', icon: '⛓️' },
          { title: 'دهان أساس ضد الصدأ (أكسيد)', type: 'material', icon: '🎨' },
        ];
        costRange = '30 - 65 د.أ (للحماية الواحدة)';
        searchKey = 'حداد';
      } else if (q.includes('نقل') || q.includes('عفش') || q.includes('كنب') || q.includes('ديانا')) {
        detectedProblem = 'ترحيل ونقل أثاث مع كادر وتنزيل';
        entities = [
          { title: 'سيارة نقل ديانا مجهزة', type: 'service', icon: '🚚' },
          { title: 'عمال تحميل وتنزيل محترفون', type: 'service', icon: '👷' },
          { title: 'كرتون وتغليف نايلون فقاعي', type: 'material', icon: '📦' },
        ];
        costRange = '35 - 70 د.أ';
        searchKey = 'نقل عفش';
      } else {
        detectedProblem = `طلب خاص: ${text}`;
        entities = [
          { title: 'فني معتمد للمعاينة', type: 'service', icon: '🛠️' },
          { title: 'قطع غيار ولوازم أصلية', type: 'hardware', icon: '📦' },
        ];
        costRange = '15 - 35 د.أ';
        searchKey = 'صيانة';
      }

      // Filter matched providers
      const matched = professionals.filter((p) => {
        const full = `${p.profession} ${p.bio} ${p.servicesOffered?.join(' ') || ''}`.toLowerCase();
        return full.includes(searchKey.toLowerCase());
      });

      setAlgoResult({
        detectedProblem,
        requiredEntities: entities,
        estimatedCostRangeJOD: costRange,
        matchedProviders: matched.length > 0 ? matched : professionals.slice(0, 3),
      });

      setIsAnalyzingAlgo(false);
    }, 250);
  };

  const handleBroadcastOrder = () => {
    setIsBroadcastSent(true);
    onShowToast(`تم تعميم طلبك بنجاح على جميع الفنيين المعتمدين في ${userLocation.city || 'عمان'}! سيتواصلون معك عبر الواتساب فوراً.`);
  };

  // Submit Sell Form
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.title || !sellForm.price) return;

    const newItem: MarketItem = {
      id: `item-${Date.now()}`,
      title: sellForm.title,
      description: sellForm.description || `معروض للبيع في ${sellForm.city} - ${sellForm.title} بحالة ممتازة.`,
      price: parseFloat(sellForm.price) || 50,
      currency: 'د.أ',
      isNegotiable: sellForm.isNegotiable,
      condition: sellForm.condition,
      category: sellForm.category,
      city: sellForm.city,
      district: sellForm.district,
      sellerCity: sellForm.city,
      sellerDistrict: sellForm.district,
      sellerId: `seller-${Date.now()}`,
      sellerName: 'بائع بلينك المعتمد',
      sellerPhone: sellForm.sellerPhone,
      sellerWhatsapp: '962' + sellForm.sellerPhone.replace(/^0/, ''),
      images: [sellForm.imageUrl],
      status: 'active',
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    onAddNewMarketItem(newItem);
    setIsSellModalOpen(false);
    setSellForm({
      title: '',
      category: 'أجهزة وأدوات منزلية',
      price: '',
      isNegotiable: true,
      condition: 'مستعمل بحالة ممتازة',
      city: userLocation.city || 'عمان',
      district: userLocation.district || 'صويلح',
      sellerPhone: '0791234567',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    });
  };

  // Submit Buy Form
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyForm.productKeyword) return;

    const newBuyer: BuyerSearchRequest = {
      id: `buyer-${Date.now()}`,
      buyerName: buyForm.buyerName || 'مشتري مهتم',
      buyerPhone: buyForm.buyerPhone,
      buyerWhatsapp: '962' + buyForm.buyerPhone.replace(/^0/, ''),
      productKeyword: buyForm.productKeyword,
      rawQuery: buyForm.rawQuery || `بدي ${buyForm.productKeyword} بميزانية ${buyForm.maxBudget} دينار`,
      maxBudget: parseFloat(buyForm.maxBudget) || 100,
      currency: 'د.أ',
      city: buyForm.city,
      district: buyForm.district,
      lat: 31.9539,
      lng: 35.9106,
      distanceKm: 3.2,
      isVerifiedWithId: true,
      nationalIdMasked: '992104****',
      category: buyForm.category,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onAddNewBuyerRequest(newBuyer);
    setIsBuyModalOpen(false);
    setBuyForm({
      buyerName: 'مستخدم بلينك',
      productKeyword: '',
      rawQuery: '',
      maxBudget: '',
      category: 'أجهزة وأدوات منزلية',
      city: userLocation.city || 'عمان',
      district: userLocation.district || 'تلاع العلي',
      buyerPhone: '0799887766',
    });
  };

  // Filtered market items
  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => {
      const matchSearch =
        (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      const matchCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [marketItems, searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 font-['Tajawal',sans-serif]">
      {/* Top Header Bar inside Market */}
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
              سوق بلينك الذكي 🏷️
            </h1>
            <span className="text-xs text-neutral-500 font-medium">
              نظام المنتج يبحث عن زبونه وتواصل واتساب فوري
            </span>
          </div>
        </div>

        <div className="text-xs font-bold text-neutral-600 bg-orange-50 text-[#FF6B00] px-3 py-1 rounded-full border border-orange-200">
          🇯🇴 الأردن - {userLocation.city || 'عمان'}
        </div>
      </div>

      {/* 1. THE TWO LARGE BUTTONS STACKED ON TOP OF EACH OTHER ("بدي أبيع" و "بدي أشتري") */}
      <div className="flex flex-col gap-3">
        {/* Button 1: بدي أبيع (Orange) */}
        <button
          id="btn-market-i-want-to-sell"
          onClick={() => setIsSellModalOpen(true)}
          className="group w-full bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.99] text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-between text-right border-2 border-orange-400/40"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Tag className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-xl sm:text-2xl">بدي أبيع 🏷️</div>
              <div className="text-xs sm:text-sm text-orange-100 font-medium mt-0.5">
                اعرض سلعتك والنظام سيطابقها فوراً مع المشترين اللي كتبوا "بدي"
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
        </button>

        {/* Button 2: بدي أشتري (Jet Black with Orange Accent) */}
        <button
          id="btn-market-i-want-to-buy"
          onClick={() => setIsBuyModalOpen(true)}
          className="group w-full bg-neutral-950 hover:bg-neutral-900 active:scale-[0.99] text-white p-4 sm:p-5 rounded-2xl shadow-lg border-2 border-neutral-800 transition-all flex items-center justify-between text-right hover:border-[#FF6B00]/50"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-xl sm:text-2xl text-white group-hover:text-[#FF6B00] transition-colors">
                بدي أشتري 🔍
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 font-medium mt-0.5">
                سجل طلبك وميزانيتك وأي بائع ينزل غرضك رح يوصله إشعار ويتواصل معك
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-800 text-[#FF6B00] flex items-center justify-center shrink-0">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* 2. SMART ALGORITHM SECTION: 
          "مثال إذا كتب المستخدم 'المي بتطفح' النظام يفهم انه يحتاج سباك + مضخة + مواد عزل"
          "التكلفة التقديرية بالدينار الأردني، مع عرض أنسب المزودين في المحافظة، وزر تعميم الطلب بنقرة واحدة على جميع الفنيين في المنطقة" */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-orange-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-neutral-900">
              خوارزمية الفهم الذكي للاحتياجات والمنتجات
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              اكتب مشكلتك بالعامية والنظام يحللها: يحدد السلعة، المواد، والفني، مع التكلفة التقديرية وتعميم الطلب
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            id="algo-problem-input"
            type="text"
            value={algoInput}
            onChange={(e) => {
              setAlgoInput(e.target.value);
              runSmartAlgorithm(e.target.value);
            }}
            placeholder="اكتب شو محتاج أو شو مشكلتك (مثال: المي بتطفح، شورت كهربا، باب محشور)..."
            className="w-full bg-neutral-50 border-2 border-neutral-200 rounded-2xl pr-4 pl-24 py-3.5 text-xs sm:text-sm font-bold text-neutral-900 outline-none focus:border-[#FF6B00] focus:bg-white transition-all shadow-inner"
          />
          <button
            onClick={() => runSmartAlgorithm(algoInput || 'المي بتطفح')}
            className="absolute left-2 top-2 bottom-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white px-4 rounded-xl text-xs font-black transition-colors flex items-center gap-1 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تحليل AI</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-neutral-400 shrink-0">جرّب فوراً:</span>
          {SMART_ALGO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setAlgoInput(preset.query);
                runSmartAlgorithm(preset.query);
              }}
              className={`shrink-0 text-[11px] font-black px-3 py-1.5 rounded-full border transition-all ${
                algoInput === preset.query
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-neutral-100 hover:bg-orange-50 text-neutral-700 border-neutral-200 hover:border-orange-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* ALGORITHM RESULT EXPANDED CARD */}
        {algoResult && (
          <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4 animate-fadeIn">
            {/* Header of analysis */}
            <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider bg-orange-200/60 px-2 py-0.5 rounded-md">
                  نتيجة الفهم الذكي
                </span>
                <div className="font-black text-sm text-neutral-900 mt-1">
                  المشكلة: {algoResult.detectedProblem}
                </div>
              </div>
              <div className="bg-white border border-orange-300 px-3 py-1.5 rounded-xl text-xs font-black text-[#FF6B00] shadow-sm">
                التكلفة التقديرية العادلة: {algoResult.estimatedCostRangeJOD}
              </div>
            </div>

            {/* Required Entities: سباك + مضخة + مواد عزل */}
            <div>
              <div className="text-xs font-black text-neutral-800 mb-2">
                النظام فهم وتوقع أنك بحاجة للمكونات التالية لحل المشكلة:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {algoResult.requiredEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center gap-2.5 shadow-sm"
                  >
                    <span className="text-2xl">{ent.icon}</span>
                    <div>
                      <div className="font-black text-xs text-neutral-900">{ent.title}</div>
                      <div className="text-[10px] text-neutral-500 font-bold">
                        {ent.type === 'service'
                          ? 'مهني معتمد'
                          : ent.type === 'hardware'
                          ? 'جهاز / معدات'
                          : 'مواد ولوازم'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast Button */}
            <div className="bg-neutral-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF6B00] flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="font-black text-sm text-white">
                    تعميم الطلب بنقرة واحدة على جميع الفنيين في المنطقة
                  </div>
                  <div className="text-xs text-neutral-400">
                    بث المشكلة لأقرب السباكين والمختصين في {userLocation.city || 'عمان'} فوراً
                  </div>
                </div>
              </div>

              <button
                id="btn-broadcast-one-click"
                onClick={handleBroadcastOrder}
                disabled={isBroadcastSent}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 ${
                  isBroadcastSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#FF6B00] hover:bg-[#e65c00] text-white active:scale-95'
                }`}
              >
                {isBroadcastSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم تعميم الطلب بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>تعميم بنقرة واحدة</span>
                  </>
                )}
              </button>
            </div>

            {/* Matched Providers in the Governorate */}
            <div>
              <div className="text-xs font-black text-neutral-700 mb-2 flex items-center justify-between">
                <span>أنسب المزودين المعتمدين في محافظة {userLocation.city || 'عمان'}:</span>
                <span className="text-emerald-700 text-[11px]">موثقون بالهوية الوطنية 🇯🇴</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {algoResult.matchedProviders.slice(0, 2).map((prov) => (
                  <div
                    key={prov.id}
                    className="bg-white border border-neutral-200 rounded-xl p-3 shadow-sm hover:border-[#FF6B00]/40 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prov.avatar}
                        alt={prov.name}
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="font-black text-xs text-neutral-900 flex items-center gap-1">
                          <span>{prov.name}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                            🇯🇴 99%
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-medium">
                          {prov.profession} • {prov.city}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* WhatsApp direct */}
                      <a
                        href={`https://wa.me/${prov.whatsapp || '962791234567'}?text=${encodeURIComponent(
                          `مرحبا، بستفسر عن خدمة السباكة والصيانة الطارئة لحالة (${algoInput || 'المي بتطفح'}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>واتساب</span>
                      </a>
                      {/* Direct call */}
                      <a
                        href={`tel:${prov.phone}`}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 p-1.5 rounded-lg transition-colors"
                        title="اتصال مباشر"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. SUB-TABS: "معروض للبيع" vs "طلبات المشترين (بدي)" */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('items')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'items'
                ? 'bg-neutral-950 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <span>المنتجات المعروضة ({filteredItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('buyers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'buyers'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طلبات المشترين (بدي) ({buyerRequests.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-[180px] sm:max-w-xs w-full">
          <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المنتجات..."
            className="w-full bg-white border border-neutral-200 rounded-xl pr-8 pl-3 py-1.5 text-xs font-bold outline-none focus:border-[#FF6B00]"
          />
        </div>
      </div>

      {/* VIEW 1: All Market Items with Direct WhatsApp Button & JOD Cost */}
      {activeSubTab === 'items' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-neutral-200 hover:border-[#FF6B00]/60 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Image & Price */}
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <img
                  src={item.images[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  {item.condition}
                </span>
                <div className="absolute bottom-2 right-2 bg-[#FF6B00] text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-md">
                  {item.price} {item.currency}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-neutral-900 line-clamp-1 group-hover:text-[#FF6B00] transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-1">
                    <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{item.city} - {item.district}</span>
                  </div>
                </div>

                {/* Direct WhatsApp Action Button (Mandatory for Every Item) */}
                <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5">
                  <a
                    href={`https://wa.me/${item.sellerWhatsapp || '962' + item.sellerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `مرحبا، بستفسر عن إعلانك على بلينك الأردن: «${item.title}» بسعر ${item.price} دينار.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>واتساب</span>
                  </a>
                  <a
                    href={`tel:${item.sellerPhone}`}
                    className="w-7 h-7 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    title="اتصال"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Buyer Requests (الناس اللي كاتبة "بدي") */}
      {activeSubTab === 'buyers' && (
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-800 leading-relaxed">
              <strong className="text-orange-700 block font-black mb-0.5">
                نظام «المنتج يبحث عن زبونه»:
              </strong>
              هؤلاء مشترون أردنيون حقيقيون كتبوا «بدي» عن منتجات محددة بميزانياتهم ومواقعهم. إذا عندك نفس المنتج، تواصل معهم مباشرة على الواتساب!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {buyerRequests.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-neutral-900">{buyer.buyerName}</span>
                        {buyer.isVerifiedWithId && (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>موثق 🇯🇴</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{buyer.city} - {buyer.district}</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 text-[#FF6B00] text-xs font-black px-2.5 py-1 rounded-xl">
                      ميزانيته: {buyer.maxBudget} {buyer.currency}
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-xs text-neutral-800 font-bold mt-3">
                    «{buyer.rawQuery}»
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${buyer.buyerWhatsapp || '962' + buyer.buyerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                      `مرحبا ${buyer.buyerName}، شفت طلبك على بلينك: «${buyer.rawQuery}» وعندي غرض مناسب الك بسعر ممتاز.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تواصل واتساب مع المشتري</span>
                  </a>
                  <a
                    href={`tel:${buyer.buyerPhone}`}
                    className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
                    title="اتصال"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: بدي أبيع */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="text-xl font-black text-neutral-900">بدي أبيع 🏷️</h3>
                <p className="text-xs text-neutral-500 font-medium">
                  اعرض منتجك للبيع وسنطابقه فوراً مع المشترين المسجلين
                </p>
              </div>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">اسم المنتج / السلعة *</label>
                <input
                  type="text"
                  required
                  value={sellForm.title}
                  onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                  placeholder="مثال: غسالة أوتوماتيك سامسونج 8 كيلو"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">السعر المطلوب (د.أ) *</label>
                  <input
                    type="number"
                    required
                    value={sellForm.price}
                    onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                    placeholder="120"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">الحالة</label>
                  <select
                    value={sellForm.condition}
                    onChange={(e) => setSellForm({ ...sellForm, condition: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B00]"
                  >
                    <option value="جديد بالكرتونة">جديد بالكرتونة</option>
                    <option value="مستعمل بحالة ممتازة">مستعمل بحالة ممتازة</option>
                    <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={sellForm.city}
                    onChange={(e) => setSellForm({ ...sellForm, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">رقم الهاتف / الواتساب</label>
                  <input
                    type="tel"
                    value={sellForm.sellerPhone}
                    onChange={(e) => setSellForm({ ...sellForm, sellerPhone: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">تفاصيل إضافية</label>
                <textarea
                  rows={2}
                  value={sellForm.description}
                  onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                  placeholder="نظيفة جداً مع كفالة، فحص كامل..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#FF6B00]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#e65c00] text-white font-black text-sm transition-all shadow-lg shadow-orange-500/30"
              >
                نشر الإعلان ومطابقة المشترين فوراً
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: بدي أشتري */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="text-xl font-black text-neutral-900">بدي أشتري 🔍</h3>
                <p className="text-xs text-neutral-500 font-medium">
                  سجل طلب الشراء وميزانيتك ليصل إشعار للبائعين
                </p>
              </div>
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">شو بدك تشتري؟ *</label>
                <input
                  type="text"
                  required
                  value={buyForm.productKeyword}
                  onChange={(e) => setBuyForm({ ...buyForm, productKeyword: e.target.value, rawQuery: `بدي ${e.target.value}` })}
                  placeholder="مثال: غسالة، بلايستيشن 5، ثلاجة، سيارة بيك أب..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">الحد الأقصى للميزانية (د.أ) *</label>
                  <input
                    type="number"
                    required
                    value={buyForm.maxBudget}
                    onChange={(e) => setBuyForm({ ...buyForm, maxBudget: e.target.value })}
                    placeholder="100"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={buyForm.city}
                    onChange={(e) => setBuyForm({ ...buyForm, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">رقم الهاتف للتواصل واتساب *</label>
                <input
                  type="tel"
                  required
                  value={buyForm.buyerPhone}
                  onChange={(e) => setBuyForm({ ...buyForm, buyerPhone: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white font-black text-sm transition-all shadow-lg border-2 border-[#FF6B00]/40"
              >
                تسجيل طلب "بدي أشتري" وتنبيه البائعين
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
