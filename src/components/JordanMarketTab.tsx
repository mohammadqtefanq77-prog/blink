import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Tag,
  Search,
  Plus,
  MessageCircle,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  Users,
  ArrowUpRight,
  Filter,
  X,
  AlertCircle,
  Share2,
  Bookmark,
  ChevronLeft,
} from 'lucide-react';
import { MarketItem, UserLocation } from '../types';
import { BuyerSearchRequest } from '../types';

interface JordanMarketTabProps {
  marketItems: MarketItem[];
  buyerRequests: BuyerSearchRequest[];
  userLocation: UserLocation;
  onAddNewMarketItem: (item: MarketItem) => void;
  onAddNewBuyerRequest: (req: BuyerSearchRequest) => void;
  onOpenItemDetail?: (item: MarketItem) => void;
}

export const JordanMarketTab: React.FC<JordanMarketTabProps> = ({
  marketItems,
  buyerRequests,
  userLocation,
  onAddNewMarketItem,
  onAddNewBuyerRequest,
  onOpenItemDetail,
}) => {
  // Modal states
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [matchedBuyersModalData, setMatchedBuyersModalData] = useState<{
    itemTitle: string;
    keyword: string;
    buyers: BuyerSearchRequest[];
  } | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'buyers'>('items');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  // Form states for "بدي أبيع"
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
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
  });

  // Form states for "بدي أشتري"
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

  const CATEGORIES = [
    'الكل',
    'أجهزة وأدوات منزلية',
    'سيارات ومركبات',
    'أثاث ومفروشات',
    'هواتف وإلكترونيات',
    'طيور ومواشي وحلال',
    'منتجات زراعية',
  ];

  // CORE LOGIC: Find buyers who wrote "بدي" + product name
  const findMatchingBuyersForProduct = (title: string, category: string): BuyerSearchRequest[] => {
    const textToMatch = `${title} ${category}`.toLowerCase();
    return buyerRequests.filter((buyer) => {
      const keyword = buyer.productKeyword?.toLowerCase() || '';
      const raw = buyer.rawQuery?.toLowerCase() || '';
      const safeTitle = title?.toLowerCase() || '';
      // Check if keyword is in title or title contains keyword
      return (
        (keyword && textToMatch.includes(keyword)) ||
        (safeTitle && keyword.includes(safeTitle.split(' ')[0])) ||
        raw.split(/\s+/).some((word) => word.length > 2 && textToMatch.includes(word))
      );
    });
  };

  // Submit "بدي أبيع"
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.title.trim()) return;

    const newItem: MarketItem = {
      id: `item-${Date.now()}`,
      sellerId: 'current-user',
      sellerName: 'أنت (البائع)',
      sellerPhone: sellForm.sellerPhone,
      sellerWhatsapp: '962' + sellForm.sellerPhone.replace(/^0/, ''),
      sellerCity: sellForm.city,
      sellerDistrict: sellForm.district,
      city: sellForm.city,
      district: sellForm.district,
      title: sellForm.title,
      description: sellForm.description || `معروض للبيع في ${sellForm.city} - ${sellForm.title} بحالة ممتازة وفحص كامل.`,
      price: parseFloat(sellForm.price) || 50,
      currency: 'دينار',
      isNegotiable: sellForm.isNegotiable,
      category: sellForm.category as any,
      condition: sellForm.condition as any,
      images: [sellForm.imageUrl],
      status: 'active',
      viewsCount: 1,
      createdAt: 'الآن',
      distanceKm: 0.8,
    };

    onAddNewMarketItem(newItem);
    setIsSellModalOpen(false);

    // EXECUTE CORE LOGIC: Search database of people who wrote "بدي" + product
    const matched = findMatchingBuyersForProduct(sellForm.title, sellForm.category);
    setMatchedBuyersModalData({
      itemTitle: sellForm.title,
      keyword: sellForm.title.split(' ')[0] || 'المنتج',
      buyers: matched,
    });
  };

  // Submit "بدي أشتري"
  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyForm.productKeyword.trim()) return;

    const newRequest: BuyerSearchRequest = {
      id: `buyer-${Date.now()}`,
      buyerName: buyForm.buyerName,
      buyerPhone: buyForm.buyerPhone,
      buyerWhatsapp: '962' + buyForm.buyerPhone.replace(/^0/, ''),
      productKeyword: buyForm.productKeyword.trim(),
      rawQuery: buyForm.rawQuery || `بدي ${buyForm.productKeyword} بسعر مناسب ومستعجل`,
      category: buyForm.category,
      maxBudget: buyForm.maxBudget ? parseFloat(buyForm.maxBudget) : undefined,
      currency: 'دينار',
      city: buyForm.city,
      district: buyForm.district,
      lat: userLocation.lat,
      lng: userLocation.lng,
      distanceKm: 1.2,
      createdAt: 'الآن',
      status: 'active',
      isVerifiedWithId: true,
      nationalIdMasked: '995102****',
    };

    onAddNewBuyerRequest(newRequest);
    setIsBuyModalOpen(false);
    setActiveSubTab('buyers');
  };

  // Open WhatsApp with buyer
  const handleOpenBuyerWhatsApp = (buyer: BuyerSearchRequest, productTitle?: string) => {
    const phone = buyer.buyerWhatsapp || '962' + buyer.buyerPhone.replace(/^0/, '');
    const text = encodeURIComponent(
      `مرحبا أخ ${buyer.buyerName}، شفت طلبك على تطبيق بلينك الأردن («${buyer.rawQuery}»)، عندي هاد المنتج متاح للبيع ${productTitle ? `( ${productTitle} )` : ''} وبسعر مناسب.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Filtered market items
  const filteredItems = useMemo(() => {
    let list = [...marketItems];
    if (selectedCategory !== 'الكل') {
      list = list.filter((i) => i.category === selectedCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((i) =>
        ((i.title || '') + ' ' + (i.description || '') + ' ' + (i.sellerCity || ''))
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [marketItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 pb-20">
      {/* 2 MAIN ACTION BUTTONS: "بدي أبيع" & "بدي أشتري" (Hero Section) */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-orange-400 text-xs font-black bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                سوق بلينك الذكي 🇯🇴
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                سوق الأردن المباشر: <span className="text-orange-500">المنتج يبحث عن زبونه</span>
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-2xl text-xs font-bold text-neutral-300">
              <Users className="w-4 h-4 text-orange-400" />
              <span>{buyerRequests.length} مشتري يبحثون الآن</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 mb-4 leading-relaxed">
            عندك غرض بدك تبيعه؟ اعرضه وبكبسة زر النظام رح يوصلك بالمشترين اللي كتبوا "بدي" نفس الغرض مع المسافة والواتساب!
          </p>

          {/* THE TWO CORE BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Button 1: بدي أبيع (Orange) */}
            <button
              id="btn-i-want-to-sell"
              onClick={() => setIsSellModalOpen(true)}
              className="group bg-orange-500 hover:bg-orange-600 active:scale-98 text-white p-4 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-between text-right border-2 border-orange-400/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-black text-lg">بدي أبيع 🏷️</div>
                  <div className="text-xs text-orange-100 font-medium">
                    اعرض منتجك وشوف مين بدور عليه فوراً
                  </div>
                </div>
              </div>
              <Plus className="w-5 h-5 text-white/80 shrink-0" />
            </button>

            {/* Button 2: بدي أشتري (Jet Black with Orange Glow) */}
            <button
              id="btn-i-want-to-buy"
              onClick={() => setIsBuyModalOpen(true)}
              className="group bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white p-4 rounded-2xl shadow-lg border-2 border-neutral-700 transition-all flex items-center justify-between text-right hover:border-orange-500/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-black text-lg text-white group-hover:text-orange-400 transition-colors">
                    بدي أشتري 🔍
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">
                    سجل طلبك وأي بائع ينزل غرضك رح يتواصل معك
                  </div>
                </div>
              </div>
              <Plus className="w-5 h-5 text-orange-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: "معروض للبيع" vs "مشترين بانتظار منتجاتهم (بدي)" */}
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
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span>معروض للبيع ({filteredItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('buyers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'buyers'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طلبات المشترين النشطة ({buyerRequests.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-[180px] sm:max-w-xs w-full">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في السوق..."
            className="w-full bg-white border border-neutral-200 rounded-xl pr-9 pl-3 py-1.5 text-xs font-medium outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* VIEW 1: Active Items for Sale */}
      {activeSubTab === 'items' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenItemDetail && onOpenItemDetail(item)}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.condition}
                  </span>
                  <div className="absolute bottom-2 right-2 bg-orange-600 text-white font-black text-xs px-2 py-1 rounded-lg shadow-md">
                    {item.price} {item.currency}
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span className="truncate">{item.sellerCity} - {item.sellerDistrict}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const phone = item.sellerWhatsapp || '962' + item.sellerPhone.replace(/^0/, '');
                        const msg = encodeURIComponent(`مرحبا، بستفسر عن إعلانك على بلينك: «${item.title}» بسعر ${item.price} دينار.`);
                        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black py-1.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </button>
                    <a
                      href={`tel:${item.sellerPhone}`}
                      onClick={(e) => e.stopPropagation()}
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
        </div>
      )}

      {/* VIEW 2: Active Buyer Requests (CORE LOGIC: الناس اللي كاتبة "بدي") */}
      {activeSubTab === 'buyers' && (
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-800">
              <strong className="text-orange-700 block font-black mb-0.5">
                نظام «المنتج يبحث عن زبونه»:
              </strong>
              هؤلاء مشترون أردنيون حقيقيون كتبوا «بدي» عن منتجات محددة بميزانياتهم ومواقعهم. إذا عندك نفس المنتج، تواصل معهم مباشرة على الواتساب وتمم البيعة بثوانٍ!
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {buyerRequests.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-md hover:shadow-xl hover:border-orange-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-neutral-900">{buyer.buyerName}</span>
                        {buyer.isVerifiedWithId && (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>موثق بالهوية 🇯🇴</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{buyer.city} - {buyer.district}</span>
                        </span>
                        <span className="text-orange-600 font-bold">
                          على بعد {buyer.distanceKm || '2.5'} كم
                        </span>
                      </div>
                    </div>

                    {buyer.maxBudget && (
                      <div className="bg-neutral-950 text-orange-400 font-black text-xs px-2.5 py-1 rounded-xl shrink-0">
                        ميزانية: {buyer.maxBudget} {buyer.currency}
                      </div>
                    )}
                  </div>

                  {/* Core Query String */}
                  <div className="mt-3 bg-neutral-50 border border-neutral-100 p-2.5 rounded-xl text-xs font-bold text-neutral-800 leading-relaxed">
                    <span className="text-orange-600 ml-1">طلبه:</span>
                    «{buyer.rawQuery}»
                  </div>
                </div>

                {/* Action: Contact Buyer on WhatsApp */}
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-neutral-400 font-medium">
                    سُجل {buyer.createdAt}
                  </span>

                  <button
                    onClick={() => handleOpenBuyerWhatsApp(buyer)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>تواصل معه على الواتساب 💬</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CORE LOGIC MATCH RESULTS POPUP (When someone posts via "بدي أبيع") */}
      {matchedBuyersModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-orange-500 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMatchedBuyersModalData(null)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Match Header */}
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-orange-500/30 animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-black px-3 py-1 rounded-full">
                🎯 نظام المنتج يبحث عن زبونه
              </span>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 mt-2">
                لقينا مشترين بانتظار هذا المنتج فوراً!
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                تم نشر إعلانك «{matchedBuyersModalData.itemTitle}» وفحص قاعدة بيانات المشترين المسجلين:
              </p>
            </div>

            {/* List of matched buyers */}
            <div className="space-y-3 my-4">
              {matchedBuyersModalData.buyers.length > 0 ? (
                matchedBuyersModalData.buyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="bg-neutral-50 rounded-2xl p-3.5 border-2 border-orange-200 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-sm text-neutral-900 flex items-center gap-1.5">
                          <span>{buyer.buyerName}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            موثق 🇯🇴
                          </span>
                        </div>
                        <div className="text-xs text-orange-600 font-bold mt-0.5">
                          {buyer.buyerName} بدور على هاد المنتج - على بعد {buyer.distanceKm || '2.3'} كم ({buyer.city})
                        </div>
                      </div>

                      {buyer.maxBudget && (
                        <span className="bg-neutral-900 text-white text-xs font-black px-2 py-1 rounded-lg">
                          ميزانيته: {buyer.maxBudget} دينار
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-700 bg-white p-2 rounded-xl border border-neutral-200">
                      <strong>طلب المشتري:</strong> «{buyer.rawQuery}»
                    </div>

                    {/* Prominent WhatsApp Button */}
                    <button
                      onClick={() => handleOpenBuyerWhatsApp(buyer, matchedBuyersModalData.itemTitle)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all mt-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تواصل مع {buyer.buyerName} على الواتساب فوراً 💬</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-neutral-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-neutral-700">
                    تم نشر إعلانك بنجاح في السوق!
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    سيقوم النظام بإشعارك تلقائياً بمجرد قيام أي مشتري بالبحث أو طلب هذا المنتج.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setMatchedBuyersModalData(null)}
              className="w-full bg-neutral-950 hover:bg-neutral-900 text-white font-black text-xs py-3 rounded-xl transition-all"
            >
              تم، المتابعة إلى السوق
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: "بدي أبيع" (I Want to Sell) */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSellModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-neutral-900">بدي أبيع غرض 🏷️</h2>
                <p className="text-xs text-neutral-500">نظام بلينك رح يطابق غرضك مع المشترين فوراً</p>
              </div>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-neutral-700 mb-1">اسم الغرض / السلعة *</label>
                <input
                  type="text"
                  required
                  placeholder='مثال: "غسالة إل جي 8 كيلو أوتوماتيك نظيفة"'
                  value={sellForm.title}
                  onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 mb-1">السعر المطلوب (دينار) *</label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={sellForm.price}
                    onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">الحالة</label>
                  <select
                    value={sellForm.condition}
                    onChange={(e) => setSellForm({ ...sellForm, condition: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="جديد بالكرتونة">جديد بالكرتونة</option>
                    <option value="مستعمل بحالة ممتازة">مستعمل بحالة ممتازة</option>
                    <option value="مستعمل بحالة جيدة">مستعمل بحالة جيدة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={sellForm.city}
                    onChange={(e) => setSellForm({ ...sellForm, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">المنطقة / الحي</label>
                  <input
                    type="text"
                    value={sellForm.district}
                    onChange={(e) => setSellForm({ ...sellForm, district: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">رقم الهاتف / الواتساب للتواصل *</label>
                <input
                  type="tel"
                  required
                  value={sellForm.sellerPhone}
                  onChange={(e) => setSellForm({ ...sellForm, sellerPhone: e.target.value })}
                  placeholder="0791234567"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">تفاصيل إضافية عن الغرض</label>
                <textarea
                  rows={2}
                  value={sellForm.description}
                  onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                  placeholder="المواصفات، سبب البيع، إمكانية المعاينة والتوصيل..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm py-3 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>نشر الغرض والبحث عن المشترين فوراً</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: "بدي أشتري" (I Want to Buy) */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBuyModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-950 text-orange-400 flex items-center justify-center font-black">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-neutral-900">بدي أشتري غرض 🔍</h2>
                <p className="text-xs text-neutral-500">سجل طلبك وأي بائع ينزل غرضك رح يوصلك إشعار</p>
              </div>
            </div>

            <form onSubmit={handleBuySubmit} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-neutral-700 mb-1">اسمك الكريم</label>
                <input
                  type="text"
                  value={buyForm.buyerName}
                  onChange={(e) => setBuyForm({ ...buyForm, buyerName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">شو المنتج اللي بتدور عليه بالزبط؟ *</label>
                <input
                  type="text"
                  required
                  placeholder='مثال: "غسالة"، "سيارة بريوس"، "بلايستيشن 5"...'
                  value={buyForm.productKeyword}
                  onChange={(e) => setBuyForm({ ...buyForm, productKeyword: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">تفاصيل طلبك بالعامية</label>
                <textarea
                  rows={2}
                  value={buyForm.rawQuery}
                  onChange={(e) => setBuyForm({ ...buyForm, rawQuery: e.target.value })}
                  placeholder='مثال: "بدي غسالة إل جي حوضين مستعملة نظيفة خالية من الصدأ وبسعر حنين"'
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 mb-1">أقصى ميزانية (دينار)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={buyForm.maxBudget}
                    onChange={(e) => setBuyForm({ ...buyForm, maxBudget: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={buyForm.city}
                    onChange={(e) => setBuyForm({ ...buyForm, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">رقم الواتساب للتواصل عندما يتوفر المنتج *</label>
                <input
                  type="tel"
                  required
                  value={buyForm.buyerPhone}
                  onChange={(e) => setBuyForm({ ...buyForm, buyerPhone: e.target.value })}
                  placeholder="0799887766"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-900 active:scale-98 text-white font-black text-sm py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Search className="w-4 h-4 text-orange-400" />
                <span>تسجيل طلبي وتنبيه البائعين فوراً</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
