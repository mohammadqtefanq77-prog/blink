import React, { useState } from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Users,
  Building2,
  DollarSign,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  GroupedDeliveryPool,
  SoloDeliveryOrder,
  ShippingCompanyProfile,
} from '../types';

interface ShippingPoolViewProps {
  pools: GroupedDeliveryPool[];
  soloOrders: SoloDeliveryOrder[];
  shippingCompanies: ShippingCompanyProfile[];
  onAcceptGroupedPool: (poolId: string, companyName: string) => void;
  onAcceptSoloOrder: (orderId: string, companyName: string) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

export const ShippingPoolView: React.FC<ShippingPoolViewProps> = ({
  pools,
  soloOrders,
  shippingCompanies,
  onAcceptGroupedPool,
  onAcceptSoloOrder,
  onBackToHome,
  onShowToast,
}) => {
  // Main view mode: 'customer_view' (shows live pools & companies) OR 'company_dashboard' (لوحة تحكم شركة الشحن)
  const [activeMode, setActiveMode] = useState<'customer_view' | 'company_dashboard'>('customer_view');

  // Company Dashboard Subtabs:
  // 1. طلبات تجميع متاحة
  // 2. طلبات فردية
  // 3. شحناتي
  // 4. أرباحي
  const [dashboardTab, setDashboardTab] = useState<
    'grouped_available' | 'solo_orders' | 'my_shipments' | 'my_earnings'
  >('grouped_available');

  const [activeCompany, setActiveCompany] = useState<ShippingCompanyProfile>(
    shippingCompanies[0] || {
      id: 'ship-default',
      name: 'شركة النور للشحن والتوصيل السريع',
      coveredGovernorates: ['عمان', 'مادبا', 'الزرقاء'],
      pooledRateJOD: 1.0,
      soloRateJOD: 5.0,
      phone: '0798765432',
      whatsapp: '962798765432',
      rating: 4.9,
      completedDeliveries: 3420,
      isVerified: true,
      totalEarningsJOD: 4850,
    }
  );

  // Auto messages modal
  const [autoMessageModal, setAutoMessageModal] = useState<{
    isOpen: boolean;
    poolTitle: string;
    storeMsg: string;
    customerMsg: string;
  }>({
    isOpen: false,
    poolTitle: '',
    storeMsg: '',
    customerMsg: '',
  });

  const handleAcceptPool = (pool: GroupedDeliveryPool) => {
    onAcceptGroupedPool(pool.id, activeCompany.name);

    // Prepare simulated auto messages
    const storeMsg = `📦 مندوب «${activeCompany.name}» قادم اليوم الساعة 10:30 صباحاً لاستلام طلبات التجميع المتجهة إلى ${pool.toCity}. يرجى تجهيز الطرود. للتنسيق: ${activeCompany.phone}`;
    const customerMsg = `🚚 تم استلام وتأكيد شحنتك المجمعة من قبل «${activeCompany.name}». رقم المندوب: ${activeCompany.phone}. الشحنة في طريقها إلى ${pool.toCity}.`;

    setAutoMessageModal({
      isOpen: true,
      poolTitle: `شحنة ${pool.fromCity} ⬅️ ${pool.toCity}`,
      storeMsg,
      customerMsg,
    });

    onShowToast(`تم قبول الشحنة المجمعة من قبل ${activeCompany.name}!`);
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-28">
      {/* 1. Header Bar */}
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
                <span>تجميع الشحن والشركات اللوجستية 🚚</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  شحن 1 د.أ فقط
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                تجميع الطلبات جغرافياً بين المحافظات لتخفيض كلفة التوصيل
              </p>
            </div>
          </div>

          {/* Switcher: Customer Pools vs Company Dashboard */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveMode('customer_view')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeMode === 'customer_view'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              خطوط التجميع 🚌
            </button>

            <button
              onClick={() => setActiveMode('company_dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeMode === 'company_dashboard'
                  ? 'bg-[#FF6B00] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>فوت ع شركتي 🚚</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* =================================================================
            VIEW A: CUSTOMER VIEW (Live Grouped Pools & Shipping Companies)
            ================================================================= */}
        {activeMode === 'customer_view' && (
          <div className="space-y-6">
            {/* Explanatory Banner */}
            <div className="bg-gradient-to-l from-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-black bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>نظام التجميع الجغرافي الذكي في الأردن 🇯🇴</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black leading-snug">
                بدل ما تدفع 5 دنانير توصيل لحالك، جمع طلباتك مع أهل منطقتك بـ 1 دينار بس!
              </h2>
              <p className="text-xs text-orange-100 leading-relaxed max-w-2xl">
                عند وصول طلبات المحافظة إلى 10 طلبات، ينطلق باص التجميع المباشر من متاجر عمان إلى باب بيتك في المحافظة.
              </p>
            </div>

            {/* Live Pools Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-black text-neutral-800">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B00]" />
                  <span>خطوط التجميع النشطة حالياً بين المحافظات:</span>
                </span>
                <span className="text-[#FF6B00]">{pools.length} خطوط تجميع</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pools.map((pool) => {
                  const percent = Math.min(100, Math.round((pool.currentCount / pool.targetCount) * 100));
                  const remaining = Math.max(0, pool.targetCount - pool.currentCount);
                  const isReady = pool.currentCount >= pool.targetCount || pool.status === 'ready';

                  return (
                    <div
                      key={pool.id}
                      className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between"
                    >
                      {/* Destination & Status */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🚌</span>
                            <h3 className="font-black text-base text-neutral-900">
                              خط {pool.toCity} (من {pool.fromCity})
                            </h3>
                          </div>
                          <span
                            className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                              isReady
                                ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                                : 'bg-orange-100 text-[#FF6B00]'
                            }`}
                          >
                            {isReady ? 'جاهز للانطلاق 🚀' : 'جاري التجميع ⏳'}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 font-bold leading-relaxed">
                          {pool.toCity}: {pool.currentCount}/{pool.targetCount} طلبات جاهزة من {pool.fromCity} -{' '}
                          {remaining > 0 ? (
                            <span className="text-[#FF6B00]">باقي {remaining} ويطلع الباص</span>
                          ) : (
                            <span className="text-emerald-600 font-black">اكتمل العدد! الباص على وشك التحرك</span>
                          )}
                          {' '}- شحن <b className="text-[#FF6B00]">1 دينار</b> بدلاً من 5.
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                          <span>نسبة اكتمال التجميع</span>
                          <span className="font-black text-neutral-900">{percent}%</span>
                        </div>
                        <div className="w-full h-3.5 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isReady ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-[#FF6B00]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Sample Orders inside this Pool */}
                      <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100 space-y-1.5">
                        <div className="text-[11px] font-black text-neutral-500">آخر المنضمين للخط:</div>
                        <div className="space-y-1">
                          {pool.orders.slice(0, 2).map((ord) => (
                            <div
                              key={ord.orderId}
                              className="flex items-center justify-between text-[11px] text-neutral-700"
                            >
                              <span className="font-bold truncate max-w-[170px]">• {ord.customerName} ({ord.productTitle})</span>
                              <span className="text-neutral-400">{ord.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courier in Charge */}
                      {pool.assignedCourierName && (
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100">
                          <span className="text-neutral-500">المندوب المعتمد:</span>
                          <span className="font-bold text-neutral-900 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                            {pool.assignedCourierName}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registered Shipping Companies */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-xs font-black text-neutral-800">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#FF6B00]" />
                  <span>شركات الشحن المعتمدة في بلينك الأردن:</span>
                </span>
                <span>{shippingCompanies.length} شركة مرخصة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shippingCompanies.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm text-neutral-900">{comp.name}</h4>
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {comp.completedDeliveries.toLocaleString()} شحنة مكتملة بنجاح
                        </div>
                        <div className="text-[11px] text-amber-500 font-bold mt-0.5">
                          ★ {comp.rating} تقييم التزام المواعيد
                        </div>
                      </div>
                    </div>

                    {/* Coverage */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-neutral-500">المحافظات المغطاة:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {comp.coveredGovernorates.map((gov, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded-md"
                          >
                            {gov}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Pill */}
                    <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold">شحن مجمع</div>
                        <div className="font-black text-[#FF6B00]">{comp.pooledRateJOD} د.أ / طلب</div>
                      </div>
                      <div className="h-6 w-px bg-neutral-200" />
                      <div>
                        <div className="text-[10px] text-neutral-500 font-bold">شحن فردي سريع</div>
                        <div className="font-black text-neutral-900">{comp.soloRateJOD} د.أ</div>
                      </div>
                    </div>

                    {/* Contacts */}
                    <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
                      <a
                        href={`https://wa.me/${comp.whatsapp}?text=${encodeURIComponent(
                          `مرحبا ${comp.name}، بدي استفسر عن خدمات الشحن ونقل الطرود على بلينك.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>واتساب</span>
                      </a>
                      <a
                        href={`tel:${comp.phone}`}
                        className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors"
                        title="اتصال"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            VIEW B: SHIPPING COMPANY DASHBOARD (فوت ع شركتي)
            ================================================================= */}
        {activeMode === 'company_dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Company Profile Strip */}
            <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeCompany.logo}
                  alt={activeCompany.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF6B00] shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">{activeCompany.name}</h2>
                    <span className="bg-[#FF6B00] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      شركة شحن معتمدة 🚚
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    لوحة الإدارة واللوجستيات • تغطية: {activeCompany.coveredGovernorates.join('، ')}
                  </p>
                </div>
              </div>

              {/* Earnings Quick Badge */}
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right w-full sm:w-auto">
                <div className="text-xs text-neutral-400">إجمالي الأرباح المكتسبة</div>
                <div className="text-xl font-black text-[#FF6B00]">{activeCompany.totalEarningsJOD} د.أ</div>
              </div>
            </div>

            {/* Dashboard Sub-Tabs (حسب متطلبات المستخدم بدقة):
                1. طلبات تجميع متاحة
                2. طلبات فردية
                3. شحناتي
                4. أرباحي
            */}
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setDashboardTab('grouped_available')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  dashboardTab === 'grouped_available'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <Package className="w-4 h-4 text-[#FF6B00]" />
                <span>1. طلبات تجميع متاحة ({pools.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('solo_orders')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  dashboardTab === 'solo_orders'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <Truck className="w-4 h-4 text-[#FF6B00]" />
                <span>2. طلبات فردية ({soloOrders.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('my_shipments')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  dashboardTab === 'my_shipments'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span>3. شحناتي وعناوين التوصيل</span>
              </button>

              <button
                onClick={() => setDashboardTab('my_earnings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  dashboardTab === 'my_earnings'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>4. أرباحي</span>
              </button>
            </div>

            {/* TAB 1: طلبات تجميع متاحة */}
            {dashboardTab === 'grouped_available' && (
              <div className="space-y-4">
                <div className="text-xs font-black text-neutral-700">
                  شحنات التجميع المتاحة للقبول والانطلاق:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pools.map((pool) => {
                    const payoutJOD = pool.currentCount * 1.5; // Company gets 1.5 JOD per order
                    return (
                      <div
                        key={pool.id}
                        className="bg-white rounded-3xl border-2 border-neutral-200 p-5 shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-black">
                              🚌
                            </div>
                            <div>
                              <h3 className="font-black text-base text-neutral-900">
                                {pool.fromCity} ⬅️ {pool.toCity}
                              </h3>
                              <p className="text-xs text-neutral-500">
                                {pool.currentCount} طلبات مجمعة جاهزة للاستلام
                              </p>
                            </div>
                          </div>

                          <div className="text-left">
                            <div className="text-[11px] text-neutral-400">أجر التوصيل لك</div>
                            <div className="font-black text-lg text-emerald-600">
                              {payoutJOD} د.أ
                            </div>
                          </div>
                        </div>

                        {/* Orders List preview */}
                        <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100 text-xs space-y-2">
                          <span className="font-black text-neutral-700">عناوين الزبائن في {pool.toCity}:</span>
                          <div className="space-y-1">
                            {pool.orders.map((o) => (
                              <div
                                key={o.orderId}
                                className="flex items-center justify-between text-neutral-600 text-[11px]"
                              >
                                <span>• {o.customerName} - {o.destinationCity}</span>
                                <span className="font-bold text-neutral-800">{o.productTitle}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accept Button */}
                        <button
                          onClick={() => handleAcceptPool(pool)}
                          className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white text-xs font-black py-3 rounded-2xl shadow-lg shadow-orange-500/25 transition-all"
                        >
                          <span>قبول الشحنة وإشعار المحلات والزبائن</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: طلبات فردية */}
            {dashboardTab === 'solo_orders' && (
              <div className="space-y-4">
                <div className="text-xs font-black text-neutral-700">الطلبات الفردية السريعة (توصيل فوري):</div>

                <div className="space-y-3">
                  {soloOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-neutral-900">{ord.customerName}</span>
                          <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-bold">
                            {ord.itemsSummary}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 flex items-center gap-2">
                          <span>من: {ord.fromCity}</span>
                          <span>⬅️</span>
                          <span className="text-neutral-900 font-bold">إلى: {ord.toCity}</span>
                          <span>•</span>
                          <span>{ord.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                        <div className="text-left">
                          <div className="text-[10px] text-neutral-400">أجرة التوصيل</div>
                          <div className="font-black text-base text-[#FF6B00]">{ord.deliveryFeeJOD} د.أ</div>
                        </div>

                        <button
                          onClick={() => {
                            onAcceptSoloOrder(ord.id, activeCompany.name);
                            onShowToast(`تم قبول الطلب الفردي لـ ${ord.customerName}!`);
                          }}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors"
                        >
                          قبول الطلب السريع
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: شحناتي مع خريطة العناوين وزر فتح الخريطة */}
            {dashboardTab === 'my_shipments' && (
              <div className="space-y-4">
                <div className="text-xs font-black text-neutral-700">
                  شحناتي الجارية (متابعة المسار وحالة الطرود):
                </div>

                <div className="bg-white rounded-3xl border border-neutral-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="font-black text-base text-neutral-900">
                        رحلة التجميع: عمان ⬅️ مادبا (7 طرود)
                      </h4>
                      <p className="text-xs text-neutral-500">المندوب: أحمد الزعبي (0798765432)</p>
                    </div>

                    {/* Open Map Button */}
                    <a
                      href="https://maps.google.com/?q=Madaba,Jordan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm transition-colors w-fit"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>فتح خريطة مسار العناوين 🗺️</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Shipment Status Stepper (حسب الطلب: جاري التجميع من المحلات -> في الطريق -> تم التوصيل) */}
                  <div className="space-y-2">
                    <div className="text-xs font-black text-neutral-600">حالة الشحنة الحالية:</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                        <span className="text-xs font-black text-emerald-800">1. جاري التجميع</span>
                        <div className="text-[10px] text-emerald-600 font-bold">من المحلات</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-orange-50 border border-[#FF6B00] text-center shadow-xs">
                        <Truck className="w-5 h-5 text-[#FF6B00] mx-auto mb-1 animate-pulse" />
                        <span className="text-xs font-black text-[#FF6B00]">2. في الطريق</span>
                        <div className="text-[10px] text-orange-600 font-bold">إلى مادبا الآن</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-neutral-100 border border-neutral-200 text-center text-neutral-400">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-bold">3. تم التوصيل</span>
                        <div className="text-[10px]">لأبواب البيوت</div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Destinations List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-black text-neutral-800">عناوين التسليم المسجلة:</span>
                    <div className="space-y-2">
                      {[
                        { name: 'محمد القعقاع', addr: 'مادبا - الحي الشرقي قرب مسجد الصحابة', phone: '0781234567' },
                        { name: 'رنا الحمارنة', addr: 'مادبا - طريق ماعين بناية 12', phone: '0799887766' },
                        { name: 'فارس الشوابكة', addr: 'مادبا - قرب كنيسة الخارطة', phone: '0775544332' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
                            <div>
                              <div className="font-black text-neutral-900">{item.name}</div>
                              <div className="text-neutral-500 text-[11px]">{item.addr}</div>
                            </div>
                          </div>
                          <a
                            href={`tel:${item.phone}`}
                            className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>اتصال</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: أرباحي */}
            {dashboardTab === 'my_earnings' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-3xl border border-neutral-200 p-5 text-right space-y-1">
                    <div className="text-xs text-neutral-500 font-bold">أرباح اليوم</div>
                    <div className="text-2xl font-black text-emerald-600">85 د.أ</div>
                    <div className="text-[11px] text-neutral-400">من 56 طرد تم تسليمه</div>
                  </div>

                  <div className="bg-white rounded-3xl border border-neutral-200 p-5 text-right space-y-1">
                    <div className="text-xs text-neutral-500 font-bold">أرباح الشهر الحالي</div>
                    <div className="text-2xl font-black text-neutral-900">1,420 د.أ</div>
                    <div className="text-[11px] text-emerald-600 font-bold">↑ 18% زيادة عن الشهر الماضي</div>
                  </div>

                  <div className="bg-white rounded-3xl border border-neutral-200 p-5 text-right space-y-1">
                    <div className="text-xs text-neutral-500 font-bold">الرصيد القابل للسحب</div>
                    <div className="text-2xl font-black text-[#FF6B00]">630 د.أ</div>
                    <button
                      onClick={() => onShowToast('تم تقديم طلب سحب الأرباح لحسابك البنكي الأردني (IBAN)')}
                      className="mt-1 text-[11px] bg-[#FF6B00] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#e65c00] transition-colors"
                    >
                      طلب تحويل كليك / بنك
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auto Message Modal upon accepting shipment */}
      {autoMessageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-neutral-900">
                  تم إرسال الرسائل الأوتوماتيكية بنجاح!
                </h3>
                <p className="text-xs text-neutral-500">{autoMessageModal.poolTitle}</p>
              </div>
            </div>

            {/* Message to stores */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[11px] font-black text-neutral-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>الرسالة الأوتوماتيكية المرسلة للمحلات:</span>
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono bg-white p-2 rounded-xl border border-neutral-200">
                "{autoMessageModal.storeMsg}"
              </p>
            </div>

            {/* Message to customers */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[11px] font-black text-neutral-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>الرسالة الأوتوماتيكية المرسلة للزبائن:</span>
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono bg-white p-2 rounded-xl border border-neutral-200">
                "{autoMessageModal.customerMsg}"
              </p>
            </div>

            <button
              onClick={() => setAutoMessageModal({ isOpen: false, poolTitle: '', storeMsg: '', customerMsg: '' })}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black py-3 rounded-2xl transition-colors"
            >
              تم المتابعة والانطلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
