import React, { useState } from 'react';
import { X, UserCheck, Briefcase, MapPin, Phone, CheckCircle2, ShieldCheck, Plus, Image as ImageIcon } from 'lucide-react';
import { ServiceProvider, UserLocation } from '../types';

interface RegisterProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (provider: ServiceProvider) => void;
  userLocation: UserLocation;
}

export const RegisterProviderModal: React.FC<RegisterProviderModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  userLocation,
}) => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [category, setCategory] = useState<ServiceProvider['category']>('صيانة وبناء');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [city, setCity] = useState(userLocation.city || 'مادبا');
  const [district, setDistrict] = useState(userLocation.district || 'وسط البلد');
  const [serviceAreas, setServiceAreas] = useState('مادبا، حنينا، ماعين');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
  ]);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (portfolioUrl.trim()) {
      setPortfolioImages([...portfolioImages, portfolioUrl.trim()]);
      setPortfolioUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !profession.trim() || !phone.trim()) return;

    const newProvider: ServiceProvider = {
      id: `prov-${Date.now()}`,
      name: name.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      profession: profession.trim(),
      category,
      bio: bio.trim() || `مقدم خدمة محترف في مجال ${profession} وخبرة ${experienceYears} سنوات.`,
      experienceYears: Number(experienceYears) || 3,
      completedJobsCount: 0,
      rating: 5.0,
      reviewCount: 0,
      isAvailableNow,
      city,
      district,
      locationLat: userLocation.lat || 31.7197,
      locationLng: userLocation.lng || 35.7941,
      distanceKm: 0.8,
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).replace(/^0/, '962'),
      portfolioImages,
      serviceAreas: serviceAreas.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      isVerified: true,
      reviews: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegister(newProvider);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">تسجيل صاحب مهنة أو مقدم خدمة</h2>
              <p className="text-xs text-slate-400">انضم مجاناً واستقبل طلبات من الأشخاص القريبين منك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-emerald-400">تم تسجيل ملفك بنجاح!</h3>
            <p className="text-sm text-slate-300">
              ملفك الآن معروض لجميع المستخدمين القريبين في منطقتك، ويمكنك استقبال الاتصالات وطلبات العمل فوراً.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">
                  الاسم الكامل أو اسم الورشة <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: المعلم إبراهيم النجار"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">
                  رقم الهاتف للتواصل <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="079XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-left dir-ltr"
                />
              </div>
            </div>

            {/* Profession & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">
                  المهنة أو الخدمة <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: دهين، سباك، كهربجي، تقليم زيتون، نقل عفش..."
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">التصنيف الرئيسي</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-200"
                >
                  <option value="صيانة وبناء">صيانة وبناء</option>
                  <option value="خدمات زراعية وموسمية">خدمات زراعية وموسمية</option>
                  <option value="نقل وتحميل">نقل وتحميل</option>
                  <option value="خدمات منزلية">خدمات منزلية</option>
                  <option value="عمالة ومهن حرة">عمالة ومهن حرة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>

            {/* Experience & Availability */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">سنوات الخبرة</label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="pt-5">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={isAvailableNow}
                    onChange={(e) => setIsAvailableNow(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-emerald-400">متاح الآن للعمل الفوري 🟢</span>
                </label>
              </div>
            </div>

            {/* Location & Coverage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">المدينة</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">الحي أو المنطقة</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">المناطق التي تخدمها (مفصولة بفواصل)</label>
              <input
                type="text"
                placeholder="مثال: مادبا، ماعين، ذيبان، ناعور، جنوب عمان"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">نبذة عن خبرتك والخدمات التي تقدمها</label>
              <textarea
                rows={2}
                placeholder="اذكر نوعية الأعمال والمعدات ومميزات العمل معك..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Portfolio pictures */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">معرض الأعمال السابقة (روابط صور)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... رابط صورة من أعمالك"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة
                </button>
              </div>

              {portfolioImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {portfolioImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                      <img src={img} alt="عمل سابق" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPortfolioImages(portfolioImages.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                تأكيد التسجيل وعرض ملفي للزبائن
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-sm font-medium"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
