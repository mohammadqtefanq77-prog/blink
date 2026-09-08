import React, { useState } from 'react';
import { X, ShoppingBag, MapPin, Tag, Phone, MessageCircle } from 'lucide-react';
import { MarketItem, Language } from '../types';
import { translations } from '../locales/translations';

interface AddMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveMarketItem: (item: Partial<MarketItem>) => void;
}

const CATEGORIES: MarketItem['category'][] = [
  'أجهزة وأدوات منزلية',
  'سيارات ومركبات',
  'أثاث ومفروشات',
  'هواتف وإلكترونيات',
  'طيور ومواشي وحلال',
  'منتجات زراعية',
  'منتجات مصانع وتجار',
  'خدمات ونقل',
  'أخرى',
];

export const AddMarketModal: React.FC<AddMarketModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveMarketItem,
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MarketItem['category']>('أجهزة وأدوات منزلية');
  const [condition, setCondition] = useState<MarketItem['condition']>('مستعمل بحالة ممتازة');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [city, setCity] = useState('مادبا');
  const [district, setDistrict] = useState('وسط البلد');
  const [phone, setPhone] = useState('+962791234567');
  const [whatsapp, setWhatsapp] = useState('962791234567');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    onSaveMarketItem({
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      price: parseFloat(price) || 0,
      currency: 'دينار',
      isNegotiable,
      city,
      district,
      sellerId: 'user-me',
      sellerName: 'محمد قطيفان',
      sellerPhone: phone,
      sellerWhatsapp: whatsapp,
      sellerPageType: 'personal',
      images: [imageUrl],
      isSponsored: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 text-right flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">إضافة سلعة في سوق البيع والشراء</h3>
              <p className="text-[11px] text-neutral-500">أجهزة، أثاث، سيارات، هواتف، مواشي، خدمات</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              اسم السلعة / المعروض:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: أسطوانة غاز أصلية مع منظم نحاسي"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                القسم / التصنيف:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MarketItem['category'])}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                الحالة:
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as MarketItem['condition'])}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700"
              >
                <option value="جديد">جديد بالكرتونة</option>
                <option value="مستعمل بحالة ممتازة">مستعمل بحالة ممتازة</option>
                <option value="مستعمل">مستعمل</option>
                <option value="خدمة">خدمة</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              تفاصيل ومواصفات السلعة:
            </label>
            <textarea
              required
              rows={3}
              placeholder="اكتب مواصفات السلعة، الموديل، المرفقات، سبب البيع..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                السعر (دينار):
              </label>
              <input
                type="number"
                required
                placeholder="مثال: 45"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex flex-col justify-end pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-neutral-900 w-4 h-4"
                />
                <label htmlFor="chk-negotiable" className="text-xs font-bold text-neutral-700">
                  السعر قابل للتفاوض البسيط
                </label>
              </div>
            </div>
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
                الحي / المنطقة:
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
                رقم الاتصال:
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
                رقم واتساب:
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
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
              نشر السلعة في السوق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
