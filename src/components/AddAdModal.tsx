import React, { useState } from 'react';
import { X, Plus, CheckCircle, Image as ImageIcon, Sparkles, Building2, Store, Stethoscope, Wrench, ShoppingBag, Globe } from 'lucide-react';
import { Ad } from '../types';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAd: (adData: Omit<Ad, 'id' | 'createdAt'>) => Promise<void>;
}

export const AD_CATEGORIES = [
  { label: 'شركات', icon: Building2, desc: 'شركات، مكاتب، مؤسسات تجارية وخدمية' },
  { label: 'محلات', icon: Store, desc: 'متاجر، مطاعم، مقاهي، معارض' },
  { label: 'أطباء', icon: Stethoscope, desc: 'أطباء، عيادات، مراكز طبية وصحية' },
  { label: 'مقدمو خدمات', icon: Wrench, desc: 'فنيون، حرفيون، صيانة، استشارات' },
  { label: 'منتجات', icon: ShoppingBag, desc: 'سيارات، أجهزة، إلكترونيات، بضائع' },
  { label: 'مواقع', icon: Globe, desc: 'مواقع إلكترونية، منصات، متاجر رقمية' },
];

const PRESET_IMAGES = [
  {
    category: 'أطباء',
    label: 'طبيب / عيادة',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'محلات',
    label: 'محل / متجر',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'شركات',
    label: 'شركة / مؤسسة',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'مقدمو خدمات',
    label: 'خدمات وصيانة',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'منتجات',
    label: 'منتج / سلعة',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'مواقع',
    label: 'موقع إلكتروني',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
];

export const AddAdModal: React.FC<AddAdModalProps> = ({
  isOpen,
  onClose,
  onSaveAd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(AD_CATEGORIES[0].label);
  const [serviceOrProduct, setServiceOrProduct] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [location, setLocation] = useState('الرياض - حي العليا');
  const [price, setPrice] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('يرجى إدخال الاسم (اسم الشركة أو المحل أو الطبيب أو مقدم الخدمة أو المنتج أو الموقع)');
      return;
    }
    if (!serviceOrProduct.trim()) {
      setErrorMsg('يرجى إدخال الخدمة أو المنتج');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('يرجى كتابة وصف للإعلان');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('يرجى إدخال الموقع');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('يرجى إدخال رقم التواصل');
      return;
    }

    try {
      setIsSubmitting(true);
      // Parse city and district from location string if possible
      const locationParts = location.split(/[-–—,]/).map((s) => s.trim());
      const city = locationParts[0] || 'الرياض';
      const district = locationParts[1] || locationParts[0];

      await onSaveAd({
        businessName: name.trim(),
        category,
        serviceOrProduct: serviceOrProduct.trim(),
        description: description.trim(),
        images: [imageUrl || PRESET_IMAGES[0].url],
        city,
        district,
        locationLat: 24.7136 + (Math.random() - 0.5) * 0.04,
        locationLng: 46.6753 + (Math.random() - 0.5) * 0.04,
        contactPhone: contactPhone.trim(),
        whatsapp: contactPhone.trim().replace(/[^0-9]/g, ''),
        workingHours: 'متاح للتواصل',
        isSponsored: false,
        priceTag: price.trim() ? price.trim() : undefined,
      });

      // Reset
      setName('');
      setServiceOrProduct('');
      setDescription('');
      setPrice('');
      setContactPhone('');
      onClose();
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء حفظ الإعلان: ' + (err.message || 'حاول مجدداً'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-neutral-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                <Plus className="w-4 h-4" />
              </span>
              <span>أضف إعلانك في بلينك</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              شركات، محلات، أطباء، مقدمو خدمات، منتجات ومواقع
            </p>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-right">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* 1. الاسم (Name) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              الاسم *
            </label>
            <input
              id="input-ad-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم الشركة، المحل، الطبيب، مقدم الخدمة، المنتج، أو الموقع"
              required
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* 2. نوع الإعلان (Ad Type) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              نوع الإعلان *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AD_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      setCategory(cat.label);
                      const matchingImg = PRESET_IMAGES.find((p) => p.category === cat.label);
                      if (matchingImg) setImageUrl(matchingImg.url);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="text-xs font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. الخدمة أو المنتج (Service or Product) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              الخدمة أو المنتج *
            </label>
            <input
              id="input-ad-service-product"
              type="text"
              value={serviceOrProduct}
              onChange={(e) => setServiceOrProduct(e.target.value)}
              placeholder="مثال: استشارات زراعة الأسنان، شاورما وصاج، نقل أثاث، هاتف للبيع..."
              required
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* 4. الوصف (Description) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              الوصف *
            </label>
            <textarea
              id="input-ad-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً مفصلاً لتسهيل عثور المستخدمين على إعلانك باللغة الطبيعية..."
              required
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none resize-none transition-colors"
            />
          </div>

          {/* 5. الصور (Images) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              الصور *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_IMAGES.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(item.url)}
                  className={`p-1 rounded-xl border transition-all text-center ${
                    imageUrl === item.url
                      ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                      : 'border-neutral-200 hover:border-neutral-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-10 object-cover rounded-lg mb-0.5"
                  />
                  <span className="text-[9px] block text-neutral-600 font-medium truncate">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              id="input-ad-image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="أو أدخل رابط صورة مباشرة (https://...)"
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono text-left"
              dir="ltr"
            />
          </div>

          {/* 6. الموقع (Location) & 7. السعر بشكل اختياري (Optional Price) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                الموقع *
              </label>
              <input
                id="input-ad-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="المدينة والحي أو الرابط الإلكتروني"
                required
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center justify-between">
                <span>السعر</span>
                <span className="text-[10px] text-neutral-400 font-normal">(اختياري)</span>
              </label>
              <input
                id="input-ad-price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 150 ر.س أو يبدأ من 50 ر.س"
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 8. رقم التواصل (Contact Phone) */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              رقم التواصل *
            </label>
            <input
              id="input-ad-contact"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="0500000000 أو +966500000000"
              required
              dir="ltr"
              className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none text-left font-mono transition-colors"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              id="btn-cancel-add-modal"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              id="btn-submit-save-ad"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'جارِ النشر...' : 'نشر الإعلان'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
