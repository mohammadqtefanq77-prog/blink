import React, { useState } from 'react';
import { X, Store, Car, Building, Utensils, Shirt, Factory, Video, User, Briefcase, Users, UploadCloud, CheckCircle2, Loader2, MapPin, Phone, MessageCircle } from 'lucide-react';
import { AccountPage, ServiceProvider, ServiceRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REGISTRATION_TYPES = [
  { id: 'trader', label: 'تاجر', icon: Store, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
  { id: 'showroom', label: 'معرض سيارات', icon: Car, color: 'bg-slate-50 text-slate-600', border: 'border-slate-200' },
  { id: 'realestate', label: 'شركة عقار', icon: Building, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200' },
  { id: 'restaurant', label: 'مطعم', icon: Utensils, color: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
  { id: 'clothing', label: 'متجر ألبسة', icon: Shirt, color: 'bg-pink-50 text-pink-600', border: 'border-pink-200' },
  { id: 'factory', label: 'مصنع / شركة', icon: Factory, color: 'bg-stone-50 text-stone-600', border: 'border-stone-200' },
  { id: 'creator', label: 'صانع محتوى', icon: Video, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
  { id: 'individual', label: 'فرد مهني / حرفي', icon: User, color: 'bg-teal-50 text-teal-600', border: 'border-teal-200' },
  { id: 'jobseeker', label: 'باحث عن عمل', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
  { id: 'workers', label: 'باحث عن عمال', icon: Users, color: 'bg-red-50 text-red-600', border: 'border-red-200' },
];

export default function UnifiedRegistrationModal({ isOpen, onClose, onSuccess }: Props) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    whatsapp: '',
    description: '',
    categories: '',
    photos: [] as string[],
    age: '',
    contact: '',
    profession: '',
    workType: '',
    estimatedTime: '',
    workersNeeded: ''
  });

  if (!isOpen) return null;

  const handleBack = () => setSelectedType(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const city = formData.location.split('-')[0]?.trim() || 'عمان';
      const district = formData.location.split('-')[1]?.trim() || 'عام';

      if (['trader', 'showroom', 'realestate', 'restaurant', 'clothing', 'factory', 'creator'].includes(selectedType!)) {
        // Map to AccountPage
        let pageType = 'store';
        let category = 'عام';
        if (selectedType === 'trader') category = 'متاجر وتجارة';
        if (selectedType === 'showroom') { pageType = 'showroom'; category = 'معارض سيارات'; }
        if (selectedType === 'realestate') { pageType = 'company'; category = 'عقارات'; }
        if (selectedType === 'restaurant') category = 'مطاعم';
        if (selectedType === 'clothing') category = 'ألبسة';
        if (selectedType === 'factory') { pageType = 'company'; category = 'مصانع وشركات'; }
        if (selectedType === 'creator') { pageType = 'creator'; category = 'صناعة محتوى'; }

        let bio = formData.description;
        if (formData.categories) bio += ` | التصنيفات/الأنواع: ${formData.categories}`;
        if (formData.age) bio += ` | العمر: ${formData.age}`;
        if (formData.contact) bio += ` | تواصل: ${formData.contact}`;

        const payload = {
          id: `page_${Date.now()}`,
          ownerId: 'user_123',
          type: pageType,
          name: formData.name,
          handle: `@${formData.name.replace(/\s+/g, '').toLowerCase()}`,
          logo: formData.photos[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80',
          bio,
          category,
          city,
          district,
          contactPhone: formData.phone,
          whatsapp: formData.whatsapp,
          rating: 0,
          reviewCount: 0,
          followersCount: 0,
          viewsCount: 0,
          allowDirectContact: true
        };
        await fetch('/api/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } 
      else if (['individual', 'jobseeker'].includes(selectedType!)) {
        // Map to ServiceProvider
        const payload = {
          id: `sp_${Date.now()}`,
          name: formData.name,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
          profession: formData.profession || (selectedType === 'jobseeker' ? 'باحث عن عمل' : 'مهني مستقل'),
          category: selectedType === 'jobseeker' ? 'أخرى' : 'عمالة ومهن حرة',
          bio: `${selectedType === 'jobseeker' ? 'يبحث عن عمل' : formData.description} ${formData.age ? `| العمر: ${formData.age}` : ''}`,
          experienceYears: 0,
          completedJobsCount: 0,
          rating: 0,
          reviewCount: 0,
          isAvailableNow: true,
          city,
          district,
          phone: formData.phone || formData.contact,
          whatsapp: formData.whatsapp,
          portfolioImages: formData.photos
        };
        await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      else if (selectedType === 'workers') {
        // Map to Ad so it appears in AI Search
        const payload = {
          id: `ad_${Date.now()}`,
          businessName: 'صاحب عمل',
          category: 'مطلوب موظفين وعمال',
          serviceOrProduct: formData.workType || 'مطلوب عمال',
          description: `المطلوب: ${formData.workType}\nالمدة: ${formData.estimatedTime}\nالعدد المطلوب: ${formData.workersNeeded}`,
          images: formData.photos.length ? formData.photos : ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&q=80'],
          city,
          district,
          contactPhone: formData.phone || formData.contact,
          whatsapp: formData.whatsapp,
          workingHours: 'حسب الاتفاق',
          isSponsored: false,
          createdAt: new Date().toISOString()
        };
        await fetch('/api/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        setSelectedType(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const commonLocation = (
      <div>
        <label className="block text-sm font-bold text-neutral-700 mb-2">الموقع (المدينة - المنطقة)</label>
        <div className="relative">
          <MapPin className="w-5 h-5 text-neutral-400 absolute right-3 top-2.5" />
          <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="مثال: عمان - الدوار السابع" className="w-full pr-10 pl-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
        </div>
      </div>
    );
    const commonContact = (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">رقم الهاتف</label>
          <div className="relative">
            <Phone className="w-5 h-5 text-neutral-400 absolute right-3 top-2.5" />
            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="079..." className="w-full pr-10 pl-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none text-left" dir="ltr" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">واتساب</label>
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-green-500 absolute right-3 top-2.5" />
            <input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="079..." className="w-full pr-10 pl-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none text-left" dir="ltr" />
          </div>
        </div>
      </div>
    );
    const commonName = (label: string) => (
      <div>
        <label className="block text-sm font-bold text-neutral-700 mb-2">{label}</label>
        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={`أدخل ${label}`} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
      </div>
    );
    const commonDesc = (
      <div>
        <label className="block text-sm font-bold text-neutral-700 mb-2">الوصف</label>
        <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="اكتب وصفاً مختصراً..." className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none min-h-[100px] resize-none" />
      </div>
    );
    const commonPhotos = (
      <div>
        <label className="block text-sm font-bold text-neutral-700 mb-2">الصور</label>
        <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
          <UploadCloud className="w-8 h-8 mb-2 text-neutral-400" />
          <span className="text-sm">اضغط لرفع الصور</span>
        </div>
      </div>
    );

    switch (selectedType) {
      case 'trader':
      case 'factory':
        return (
          <div className="space-y-4">
            {commonName('اسم المتجر / الشركة')}
            {commonLocation}
            {commonContact}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">تصنيفات المنتجات</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: إلكترونيات، أدوات منزلية..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonDesc}
            {commonPhotos}
          </div>
        );
      case 'showroom':
        return (
          <div className="space-y-4">
            {commonName('اسم المعرض')}
            {commonLocation}
            {commonContact}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">أنواع السيارات</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: هايبرد، كهرباء، بنزين..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonDesc}
            {commonPhotos}
          </div>
        );
      case 'realestate':
        return (
          <div className="space-y-4">
            {commonName('اسم الشركة')}
            {commonLocation}
            {commonContact}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">أنواع العقارات</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: شقق، أراضي، فلل..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonDesc}
            {commonPhotos}
          </div>
        );
      case 'restaurant':
        return (
          <div className="space-y-4">
            {commonName('اسم المطعم')}
            {commonLocation}
            {commonContact}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">أصناف المنيو</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: شاورما، برجر، مشاوي..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonDesc}
            {commonPhotos}
          </div>
        );
      case 'clothing':
        return (
          <div className="space-y-4">
            {commonName('اسم المتجر')}
            {commonLocation}
            {commonContact}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">أنواع الألبسة</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: رجالي، ستاتي، أطفال..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonDesc}
            {commonPhotos}
          </div>
        );
      case 'creator':
        return (
          <div className="space-y-4">
            {commonName('الاسم')}
            {commonLocation}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">نوع المحتوى</label>
              <input required value={formData.categories} onChange={e => setFormData({...formData, categories: e.target.value})} placeholder="مثال: ترفيهي، تعليمي، تقني..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">العمر</label>
              <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="العمر" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">معلومات التواصل</label>
              <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="رقم، ايميل، أو رابط" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
          </div>
        );
      case 'individual':
        return (
          <div className="space-y-4">
            {commonName('الاسم')}
            {commonLocation}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">المهنة / الحرفة</label>
              <input required value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} placeholder="مثال: نجار، كهربائي، مصمم..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">العمر</label>
              <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="العمر" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonContact}
          </div>
        );
      case 'jobseeker':
        return (
          <div className="space-y-4">
            {commonName('الاسم')}
            {commonLocation}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">المهنة / التخصص</label>
              <input required value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} placeholder="مثال: محاسب، مهندس، بائع..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">العمر</label>
              <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="العمر" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonContact}
          </div>
        );
      case 'workers':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">نوع العمل المطلوب</label>
              <input required value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})} placeholder="مثال: طراشة، تنظيف، تحميل وتنزيل..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonLocation}
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">المدة المتوقعة (تقريباً)</label>
              <input required value={formData.estimatedTime} onChange={e => setFormData({...formData, estimatedTime: e.target.value})} placeholder="مثال: يومان، أسبوع، 5 ساعات..." className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">عدد العمال المطلوب</label>
              <input required type="number" value={formData.workersNeeded} onChange={e => setFormData({...formData, workersNeeded: e.target.value})} placeholder="العدد" className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none" />
            </div>
            {commonContact}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-2xl bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            {selectedType && (
              <button onClick={handleBack} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                {selectedType ? REGISTRATION_TYPES.find(t => t.id === selectedType)?.label : 'تسجيل جديد'}
              </h2>
              <p className="text-sm font-medium text-neutral-500 mt-1">
                {selectedType ? 'أكمل البيانات أدناه لإتمام التسجيل' : 'اختر نوع الحساب الذي تود تسجيله في بلينك'}
              </p>
            </div>
          </div>
          {!selectedType && (
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-2">تم التسجيل بنجاح!</h3>
              <p className="text-neutral-500 font-medium">سيظهر حسابك/إعلانك في نتائج البحث فوراً</p>
            </div>
          ) : !selectedType ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {REGISTRATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg bg-white ${type.border} group`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${type.color}`}>
                    <type.icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-neutral-800 text-sm sm:text-base text-center">{type.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <form id="registration-form" onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-neutral-100">
              {renderFormFields()}
            </form>
          )}
        </div>

        {selectedType && !success && (
          <div className="p-4 sm:p-6 bg-white border-t border-neutral-100">
            <button
              type="submit"
              form="registration-form"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#e66000] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-base sm:text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'إتمام التسجيل'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
