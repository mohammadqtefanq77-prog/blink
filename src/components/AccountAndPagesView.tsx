import React, { useState } from 'react';
import {
  User,
  Plus,
  Video,
  Store,
  Building,
  Car,
  Wrench,
  ShieldCheck,
  Wallet,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Coins,
  CreditCard,
  Lock,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { AccountPage, Language, PageType, UserProfile } from '../types';
import { translations } from '../locales/translations';

interface AccountAndPagesViewProps {
  user: UserProfile;
  pages: AccountPage[];
  language: Language;
  onOpenCreatePageModal: () => void;
  onOpenPageDetail: (pageId: string) => void;
}

export const AccountAndPagesView: React.FC<AccountAndPagesViewProps> = ({
  user,
  pages = [],
  language,
  onOpenCreatePageModal,
  onOpenPageDetail,
}) => {
  const t = translations[language];
  const [showPaymentArchitecture, setShowPaymentArchitecture] = useState(false);

  const getPageTypeIcon = (type: PageType) => {
    switch (type) {
      case 'personal':
        return <User className="w-4 h-4 text-emerald-600" />;
      case 'creator':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'store':
        return <Store className="w-4 h-4 text-amber-500" />;
      case 'company':
        return <Building className="w-4 h-4 text-blue-500" />;
      case 'showroom':
        return <Car className="w-4 h-4 text-purple-500" />;
      case 'service':
        return <Wrench className="w-4 h-4 text-cyan-500" />;
    }
  };

  const getPageTypeLabel = (type: PageType) => {
    return t.pageTypes[type] || type;
  };

  // Check if any creator page has a wallet
  const creatorPage = (pages || []).find((p) => p.type === 'creator' && p.wallet);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-right">
      {/* Personal Account Card (Free Forever) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-neutral-900">
                  {user.name}
                </h2>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
                  {t.accounts.personalAccount}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                @{user.username} • {user.phone}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-left border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
            <span className="text-[11px] font-bold text-emerald-600 block">
              ✓ {t.accounts.freeForever}
            </span>
            <span className="text-[10px] text-neutral-400">
              عضوية بلينك المعتمدة
            </span>
          </div>
        </div>
      </div>

      {/* Creator Wallet Card (if user has a creator page) */}
      {creatorPage?.wallet && (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl p-6 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {t.accounts.creatorWallet}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  مرتبط بصفحة: {creatorPage.name}
                </p>
              </div>
            </div>

            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold px-2.5 py-1 rounded-xl">
              سحب الأرباح متاح
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-neutral-400 block mb-1">
                {t.accounts.totalBalance}
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {creatorPage.wallet.balance.toFixed(2)} {creatorPage.wallet.currency}
              </span>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-neutral-400 block mb-1">
                إجمالي الأرباح الكلية
              </span>
              <span className="text-xl font-black text-white font-mono">
                {creatorPage.wallet.totalEarnings.toFixed(2)} {creatorPage.wallet.currency}
              </span>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-neutral-400 block mb-1">
                {t.accounts.giftsReceived}
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {creatorPage.wallet.giftsReceivedCount} هدية
              </span>
            </div>

            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-neutral-400 block mb-1">
                {t.accounts.pendingBalance}
              </span>
              <span className="text-xl font-black text-neutral-300 font-mono">
                {creatorPage.wallet.pendingBalance.toFixed(2)} {creatorPage.wallet.currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* User's Created Activity Pages */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-neutral-900">
              {t.accounts.myPages}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {t.accounts.pageTypesInfo}
            </p>
          </div>

          <button
            id="btn-create-new-page"
            onClick={onOpenCreatePageModal}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xs transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.accounts.createNewPage}</span>
          </button>
        </div>

        {/* Commercial Monthly Subscription Banner (Specification #1 & #4) */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-900">
              {t.accounts.commercialTrial}
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {t.accounts.commercialMonthlyNotice}
            </p>
          </div>
        </div>

        {/* Pages List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-4 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 bg-neutral-50/60 hover:bg-white transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={page.logo}
                  alt={page.name}
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-neutral-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-neutral-900 text-sm truncate">
                      {page.name}
                    </h4>
                    {page.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold">
                      {getPageTypeIcon(page.type)}
                      {getPageTypeLabel(page.type)}
                    </span>
                    <span>• {page.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
                <span className="text-[11px] text-neutral-500">
                  {page.subscription.status === 'trial' ? (
                    <span className="text-amber-700 font-bold">تجريبي مجاني</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">نشط</span>
                  )}
                </span>

                <button
                  id={`btn-view-page-${page.id}`}
                  onClick={() => onOpenPageDetail(page.id)}
                  className="flex items-center gap-1 font-bold text-neutral-900 hover:text-emerald-700 transition-colors"
                >
                  <span>عرض وإدارة الصفحة</span>
                  <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foundational Payment & Deposit Architecture Section */}
      {/* Specification #13: "تأسيس نظام الدفع والعربون — غير ظاهر حالياً" */}
      <div className="bg-white rounded-3xl p-5 border border-neutral-200 text-xs text-neutral-600 space-y-3">
        <button
          onClick={() => setShowPaymentArchitecture(!showPaymentArchitecture)}
          className="w-full flex items-center justify-between text-right font-bold text-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-500" />
            <span>معمارية نظام الدفع والعربون المؤسسي (جاهز برمجياً - غير ظاهر حالياً)</span>
          </div>
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${
              showPaymentArchitecture ? 'rotate-90' : 'rotate-270'
            }`}
          />
        </button>

        {showPaymentArchitecture && (
          <div className="pt-3 border-t border-neutral-100 space-y-3 font-mono text-[11px] bg-neutral-50 p-4 rounded-2xl">
            <p className="text-neutral-700 font-sans">
              {t.accounts.paymentFoundationNotice}
            </p>
            <div className="grid grid-cols-2 gap-2 text-neutral-600">
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200">
                <strong>حالات العربون المعتمدة:</strong>
                <ul className="list-disc pr-4 mt-1 space-y-0.5">
                  <li>عربون مدفوع (Deposit Paid)</li>
                  <li>مكتمل السداد (Fully Paid)</li>
                  <li>بانتظار العربون (Pending Deposit)</li>
                  <li>مسترد وفق الشروط (Refunded)</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200">
                <strong>الربط بين الأطراف:</strong>
                <ul className="list-disc pr-4 mt-1 space-y-0.5">
                  <li>المشتري (Buyer ID & Phone)</li>
                  <li>البائع / مقدم الخدمة (Seller ID)</li>
                  <li>الفاتورة الرقمية (Invoice Engine)</li>
                  <li>بوابة الدفع (Gateway Proxy)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
