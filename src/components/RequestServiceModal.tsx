import React, { useState } from 'react';
import { X, MapPin, Clock, Camera, Send, CheckCircle2, Wrench, Sparkles } from 'lucide-react';
import { ServiceProvider, ServiceRequest, UserLocation } from '../types';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<ServiceRequest>) => void;
  userLocation: UserLocation;
  allProviders: ServiceProvider[];
}

const COMMON_SERVICES = [
  'دهّين وديكورات',
  'سبّاك وموسرجي',
  'كهربجي منازل',
  'تقليم أشجار وزيتون',
  'عامل زراعي وقطاف',
  'نقل عفش وأثاث',
  'سيارة نقل (ديانا / بيك اب)',
  'عامل يومي وتحميل',
  'نجّار وصيانة أثاث',
  'حدّاد وشبابيك',
  'مبلّط وديكور',
  'فني تكييف وتبريد',
  'سائق خاص وتوصيل',
  'تنظيف أراضي ومزارع',
];

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userLocation,
  allProviders,
}) => {
  const [serviceType, setServiceType] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [city, setCity] = useState(userLocation.city || 'مادبا');
  const [district, setDistrict] = useState(userLocation.district || 'وسط البلد');
  const [locationDetails, setLocationDetails] = useState('');
  const [description, setDescription] = useState('');
  const [timing, setTiming] = useState<'الآن' | 'اليوم' | 'موعد لاحق'>('الآن');
  const [scheduledDate, setScheduledDate] = useState('');
  const [phone, setPhone] = useState('0791234567');
  const [name, setName] = useState('عمر المشترِك');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  // Real-time matching calculation
  const matchingProviders = (allProviders || []).filter((p) => {
    if (!serviceType) return true;
    const term = serviceType.toLowerCase();
    const pText = `${p.profession} ${p.category} ${p.bio}`.toLowerCase();
    return pText.includes(term) || term.split(/\s+/).some((w) => pText.includes(w));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType.trim() || !description.trim()) return;

    onSubmit({
      requesterName: name,
      requesterPhone: phone,
      requesterWhatsapp: phone.replace(/^0/, '962'),
      serviceType: serviceType.trim(),
      category: 'خدمات ومهن حرة',
      city,
      district,
      locationDetails,
      description,
      timing,
      scheduledDate: timing === 'موعد لاحق' ? scheduledDate : undefined,
      images: [],
      status: 'pending',
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">طلب خدمة أو مهنة قريبة منك</h2>
              <p className="text-xs text-slate-400">حدد ما تريده بالتفصيل وابحث عن أقرب مقدم خدمة متاح</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-emerald-400">تم نشر طلبك بنجاح!</h3>
            <p className="text-sm text-slate-300">
              تم إشعار مقدمي الخدمات الأقرب إليك ({matchingProviders.length} متاحون بالقرب منك). سيتم التواصل معك والاتفاق على السعر مباشرة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Service Type Selection or Free Text */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-200">
                ما هي المهنة أو الخدمة المطلوبة؟ <span className="text-amber-400">*</span>
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_SERVICES.slice(0, 8).map((svc) => (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => {
                      setServiceType(svc);
                      setIsCustom(false);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                      serviceType === svc && !isCustom
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {svc}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="أو اكتب أي مهنة/خدمة أخرى تريدها (مثال: تقليم زيتون، صيانة مضخة، نجار باب)..."
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    setIsCustom(true);
                  }}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Timing */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-200">
                الوقت المطلوب لإنجاز الخدمة <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['الآن', 'اليوم', 'موعد لاحق'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTiming(t)}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                      timing === t
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {t === 'الآن' ? 'الآن (فوري)' : t}
                  </button>
                ))}
              </div>

              {timing === 'موعد لاحق' && (
                <div className="mt-3">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-200">
                موقع العمل <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">المدينة</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">الحي أو المنطقة</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="تفاصيل إضافية للموقع (مثال: قرب مسجد الهدى، الطابق الثاني)..."
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-300"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                نحافظ على خصوصيتك: لا يظهر موقعك الدقيق للعامة، بل المدينة والحي فقط لحين الاتفاق مع مقدم الخدمة.
              </p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-200">
                المطلوب بالتفصيل <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="اشرح المشكلة أو العمل المطلوب، المساحة، أو عدد الأشجار أو الأغراض..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">اسمك</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">رقم الهاتف للتواصل</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500 text-left dir-ltr"
                />
              </div>
            </div>

            {/* Live Match Counter Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200">
                  يوجد <strong className="text-amber-400 font-bold">{matchingProviders.length}</strong> مقدم خدمة متاح في منطقتك الأقرب
                </span>
              </div>
              <span className="text-[11px] text-amber-300 font-semibold">اتفاق مباشر على السعر</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                نشر الطلب والبحث عن الأقرب
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
