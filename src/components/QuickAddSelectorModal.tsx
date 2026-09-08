import React from 'react';
import { X, Video, ShoppingBag, Building2, UserPlus, ChevronLeft, Wrench, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

export type QuickAddOption = 'content' | 'market' | 'commercial' | 'page' | 'service_request' | 'service_provider';

interface QuickAddSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectOption: (option: QuickAddOption) => void;
}

export const QuickAddSelectorModal: React.FC<QuickAddSelectorModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectOption,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const OPTIONS = [
    {
      id: 'service_request' as const,
      title: 'طلب خدمة أو مهنة قريبة منك 🛠️',
      desc: 'دهين، سباك، كهربجي، تقليم زيتون، عمال تحميل، نقل عفش، أو أي خدمة تطلبها',
      icon: Wrench,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'service_provider' as const,
      title: 'تسجيل كصاحب مهنة أو حرفي 👨‍🔧',
      desc: 'سجل مهنتك وموقعك وخدماتك مجاناً واستقبل طلبات من الجيران والأشخاص القريبين منك',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'content' as const,
      title: 'نشر محتوى هادف أو ترفيهي',
      desc: 'فيديوهات قصيرة ومفيدة، سياحة، طبخ، مواهب ومقاطع ممتعة',
      icon: Video,
      color: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'market' as const,
      title: 'إعلان بيع سلعة في السوق',
      desc: 'عرض أجهزة، سيارات، أثاث، هواتف، أو مواشي في سوق البيع والشراء',
      icon: ShoppingBag,
      color: 'bg-cyan-50 text-cyan-700',
    },
    {
      id: 'commercial' as const,
      title: 'إضافة إعلان تجاري / نشاط',
      desc: 'إعلان لشركتك، متجرك، عيادتك، أو خدماتك في دليل الأنشطة التجارية القريب',
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'page' as const,
      title: 'إنشاء صفحة جديدة لنشاطك',
      desc: 'صفحة شخصية، صانع محتوى، متجر، شركة، معرض سيارات، أو مقدم خدمة',
      icon: UserPlus,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">ماذا تريد أن تضيف اليوم؟</h3>
            <p className="text-[11px] text-neutral-500">اختر القسم المناسب لإعلانك أو نشاطك</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-5 space-y-2.5">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onClose();
                  onSelectOption(opt.id);
                }}
                className="w-full p-4 rounded-2xl border border-neutral-200/80 hover:border-neutral-400 bg-neutral-50/50 hover:bg-white transition-all flex items-center justify-between gap-3 group text-right shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${opt.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                      {opt.desc}
                    </p>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 rotate-180 shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
