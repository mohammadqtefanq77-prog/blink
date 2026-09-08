import React from 'react';
import {
  Wrench,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  MapPin,
  Globe,
  Plus,
  Zap,
} from 'lucide-react';
import { Language, UserLocation } from '../types';

export type ActiveNavTab = 'pro' | 'market' | 'order' | 'verified';

interface NavbarProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  language: Language;
  onLanguageToggle: () => void;
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  language,
  onLanguageToggle,
  userLocation,
  onOpenLocationModal,
  onOpenQuickAdd,
}) => {
  const NAV_ITEMS: { id: ActiveNavTab; label: string; icon: any; badge?: string }[] = [
    { id: 'pro', label: 'مهني', icon: Wrench },
    { id: 'market', label: 'سوق', icon: ShoppingBag, badge: 'بدي' },
    { id: 'order', label: 'طلب', icon: Sparkles, badge: 'AI' },
    { id: 'verified', label: 'موثوق', icon: ShieldCheck, badge: '🇯🇴' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand: Blink - الأردن */}
        <div className="flex items-center gap-3">
          <button
            id="btn-logo-home"
            onClick={() => onTabChange('pro')}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl text-white tracking-tight">Blink</span>
                <span className="text-orange-500 font-black text-sm sm:text-base">الأردن 🇯🇴</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold -mt-1">منصة الخدمات والسوق المباشر</span>
            </div>
          </button>

          {/* Location Badge */}
          <button
            id="btn-nav-location"
            onClick={onOpenLocationModal}
            className="hidden sm:flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors"
            title="تغيير المحافظة"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="truncate max-w-[100px]">{userLocation.city}</span>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs (The 4 Exact Tabs) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 shadow-inner">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-tab-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-100'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-800 text-orange-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side Actions: Location on mobile & Post */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLocationModal}
            className="sm:hidden flex items-center gap-1 bg-neutral-900 text-neutral-300 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-neutral-800"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span>{userLocation.city}</span>
          </button>

          <button
            id="btn-nav-quick-add"
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs sm:text-sm font-black px-3.5 py-2 rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة إعلان / طلب</span>
          </button>
        </div>
      </div>
    </header>
  );
};

