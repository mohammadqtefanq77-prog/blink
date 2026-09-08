import React, { useState } from 'react';
import {
  X,
  User,
  Video,
  Store,
  Building,
  Car,
  Wrench,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AccountPage, Language, PageType } from '../types';
import { translations } from '../locales/translations';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSavePage: (page: Partial<AccountPage>) => void;
}

const PAGE_TYPES: { type: PageType; title: string; desc: string; icon: any; isCommercial: boolean }[] = [
  { type: 'personal', title: 'صفحة شخصية', desc: 'للملف الشخصي، السيرة الذاتية والتواصل الفردي', icon: User, isCommercial: false },
  { type: 'creator', title: 'صفحة صاحب محتوى', desc: 'لنشر الفيديوهات المعرفية، كسب المتابعين، وتلقي الهدايا', icon: Video, isCommercial: false },
  { type: 'store', title: 'صفحة متجر أو محل', desc: 'لعرض المنتجات، العروض، العنوان، وساعات العمل', icon: Store, isCommercial: true },
  { type: 'company', title: 'صفحة شركة أو مؤسسة', desc: 'للشركات، الخدمات اللوجستية، العقود، والأعمال الكبرى', icon: Building, isCommercial: true },
  { type: 'showroom', title: 'صفحة معرض سيارات أو مركبات', desc: 'لمعارض السيارات والآليات مع المواصفات والأسعار', icon: Car, isCommercial: true },
  { type: 'service', title: 'صفحة مقدم خدمة أو فني', desc: 'للمهندسين والفنيين والحرفيين المستقلين', icon: Wrench, isCommercial: true },
];

export const CreatePageModal: React.FC<CreatePageModalProps> = ({
  isOpen,
  onClose,
  language,
  onSavePage,
}) => {
  const t = translations[language];
  const [selectedType, setSelectedType] = useState<PageType>('store');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('مطاعم ومحلات');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('مادبا');
  const [district, setDistrict] = useState('وسط البلد');
  const [phone, setPhone] = useState('+962791234567');
  const [whatsapp, setWhatsapp] = useState('962791234567');
  const [workingHours, setWorkingHours] = useState('9:00 ص - 10:00 م');

  if (!isOpen) return null;

  const currentTypeConfig = PAGE_TYPES.find((p) => p.type === selectedType) || PAGE_TYPES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSavePage({
      ownerId: 'user-me',
      type: selectedType,
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      category,
      bio: bio.trim() || 'صفحة معتمدة على منصة بلينك',
      city,
      district,
      contactPhone: phone,
      whatsapp,
      workingHours,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      rating: 5.0,
      reviewCount: 1,
      followersCount: 12,
      viewsCount: 45,
      allowDirectContact: true,
      isVerified: true,
      subscription: {
        plan: currentTypeConfig.isCommercial ? 'commercial_monthly' : 'free_personal',
        status: currentTypeConfig.isCommercial ? 'trial' : 'active',
        trialEndsAt: '2026-10-30T00:00:00Z',
        priceMonthly: currentTypeConfig.isCommercial ? 15 : 0,
        currency: 'JOD',
      },
      wallet: selectedType === 'creator' ? {
        balance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        giftsReceivedCount: 0,
        stickersCount: 0,
        currency: 'JOD',
      } : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 text-right flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">إنشاء صفحة مناسبة لنشاطك</h3>
            <p className="text-[11px] text-neutral-500">اختر نوع الصفحة المناسبة لعملك أو هويتك</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Page Type Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              نوع الصفحة المطلوبة:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAGE_TYPES.map((pt) => {
                const Icon = pt.icon;
                const isSelected = selectedType === pt.type;
                return (
                  <button
                    key={pt.type}
                    type="button"
                    onClick={() => setSelectedType(pt.type)}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <div>
                      <span className="text-xs font-bold block">{pt.title}</span>
                      <span className={`text-[10px] mt-0.5 block line-clamp-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {pt.isCommercial ? 'اشتراك تجاري' : 'مجانية'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subscription note */}
          {currentTypeConfig.isCommercial && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>النظام التجاري:</strong> تكون الصفحات التجارية باشتراك شهري عند إطلاق النظام التجاري رسمياً. تستفيد حالياً من <strong>فترة تجريبية مجانية كاملة المزايا</strong>.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              اسم الصفحة / النشاط:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: مخابز الشام الحديثة، أو عيادة د. رائد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                معرف الصفحة (@handle):
              </label>
              <input
                type="text"
                placeholder="sham_bakery"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                التصنيف أو التخصص:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              نبذة مختصرة عن الصفحة:
            </label>
            <textarea
              rows={2}
              placeholder="اكتب نبذة عن الخدمات، المنتجات، والخبرات..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                المدينة:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                الحي / العنوان:
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                رقم التواصل:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                ساعات العمل:
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-800"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              تأكيد وإنشاء الصفحة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
