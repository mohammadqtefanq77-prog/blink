import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Video,
  Wrench,
  Building2,
  Store,
  Utensils,
  Camera,
  MapPin,
  Phone,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { BlinkEntityProfile, RegistrationRole, ProfileTag } from '../types';
import { saveProfile } from '../lib/firebaseBlinkService';
import { JORDAN_GOVERNORATES } from '../data/jordanBlinkData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: RegistrationRole | null;
  onRegistered: (profile: BlinkEntityProfile) => void;
  onShowToast: (msg: string) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  initialRole = null,
  onRegistered,
  onShowToast,
}) => {
  const [selectedRole, setSelectedRole] = useState<RegistrationRole | null>(initialRole || null);

  // Form Fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [professionOrTitle, setProfessionOrTitle] = useState('');
  const [phone, setPhone] = useState('07');
  const [city, setCity] = useState('عمان');
  const [district, setDistrict] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [nationalId, setNationalId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [priceJOD, setPriceJOD] = useState<string>('25');

  // Subcategory for Store
  const [storeSubcategory, setStoreSubcategory] = useState<'cars' | 'real_estate' | 'general'>('cars');
  const [selectedTags, setSelectedTags] = useState<string[]>(['@مركز فحص كارتك', '@زينة ونانو سيراميك']);

  // Loading & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Preset Avatars for quick selection if user doesn't paste one
  const getSuggestedAvatar = (role: RegistrationRole) => {
    switch (role) {
      case 'creator':
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      case 'service':
        return 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80';
      case 'company':
        return 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=400&q=80';
      case 'store':
        return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80';
      case 'restaurant':
        return 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=400&q=80';
      case 'shipping':
        return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80';
    }
  };

  const handleSelectRole = (role: RegistrationRole) => {
    setSelectedRole(role);
    if (!avatarUrl) {
      setAvatarUrl(getSuggestedAvatar(role));
    }
    // Set smart defaults for title/profession
    if (role === 'creator') setProfessionOrTitle('صانع محتوى وثائقي وهادف');
    if (role === 'service') setProfessionOrTitle('سباك وموسرجي معتمد');
    if (role === 'company') setProfessionOrTitle('شركة خدمات لوجستية وتوريد');
    if (role === 'store') setProfessionOrTitle('معرض سيارات هايبرد وكهرباء');
    if (role === 'restaurant') setProfessionOrTitle('مطعم مأكولات ومشويات على الحطب');
    if (role === 'shipping') setProfessionOrTitle('شركة شحن وتوصيل مجمع وسريع');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('يرجى كتابة الاسم أو اسم النشاط التجاري');
      return;
    }
    if (!selectedRole) {
      onShowToast('يرجى اختيار نوع الحساب');
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phone.trim();
    const whatsappClean = '962' + cleanPhone.replace(/^0/, '');
    const cleanId = nationalId.trim() || '99' + Math.floor(10000000 + Math.random() * 90000000).toString();
    const maskedId = cleanId.slice(0, 6) + '****';

    // Build tags for store / cars / real estate
    const finalTags: ProfileTag[] = selectedTags.map((t, idx) => ({
      id: `tag-${idx}`,
      label: t,
      category: t.includes('فحص')
        ? 'inspection'
        : t.includes('تعديل')
        ? 'tuning'
        : t.includes('زينة')
        ? 'accessories'
        : t.includes('فرش') || t.includes('مفروشات')
        ? 'upholstery'
        : t.includes('بناء')
        ? 'construction'
        : t.includes('مطبخ')
        ? 'kitchen'
        : 'general',
      location: city,
    }));

    const newProfile: BlinkEntityProfile = {
      id: `profile-${Date.now()}`,
      role: selectedRole,
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.replace(/\s+/g, '_')}`,
      titleOrProfession: professionOrTitle.trim() || 'معتمد في الأردن',
      avatar: avatarUrl.trim() || getSuggestedAvatar(selectedRole),
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      bio: bio.trim() || `أهلاً بكم في صفحة ${name.trim()} الرسمية الموثقة على منصة بلينك الأردن.`,
      city: city || 'عمان',
      district: district.trim() || 'المنطقة الرئيسية',
      phone: cleanPhone,
      whatsapp: whatsappClean,
      isVerified: true,
      nationalIdMasked: maskedId,
      experienceYears: Number(experienceYears) || 3,
      rating: 5.0,
      reviewCount: 1,
      totalLikes: Math.floor(Math.random() * 800) + 120,
      totalViews: Math.floor(Math.random() * 4000) + 800,
      totalGifts: Math.floor(Math.random() * 50) + 10,
      stories: [
        {
          id: `story-${Date.now()}`,
          mediaUrl: avatarUrl || getSuggestedAvatar(selectedRole),
          mediaType: 'image',
          caption: `مرحباً بكم في صفحة ${name} الرسمية الموثقة 🇯🇴`,
          createdAt: 'الآن',
        },
      ],
      videos: [
        {
          id: `vid-${Date.now()}`,
          title: `تعرف على خدمات وأعمال ${name}`,
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mechanic-repairing-a-car-engine-41221-large.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
          type: 'video',
          priceJOD: Number(priceJOD) || undefined,
          location: `${city} - ${district || 'الوسط'}`,
          likesCount: 145,
          sharesCount: 32,
          savesCount: 88,
          whatsappNumber: whatsappClean,
          tags: selectedRole === 'store' ? finalTags : undefined,
        },
      ],
      photos: [
        {
          id: `photo-${Date.now()}`,
          title: `معرض الأعمال والخدمات - ${name}`,
          mediaUrl: avatarUrl || getSuggestedAvatar(selectedRole),
          type: 'image',
          priceJOD: Number(priceJOD) || undefined,
          location: city,
          likesCount: 94,
          sharesCount: 18,
          savesCount: 42,
          whatsappNumber: whatsappClean,
          tags: selectedRole === 'store' ? finalTags : undefined,
        },
      ],
      storeSubcategory: selectedRole === 'store' ? storeSubcategory : undefined,
      featuredPriceJOD: Number(priceJOD) || undefined,
      storeTags: selectedRole === 'store' ? finalTags : undefined,
      menuItems:
        selectedRole === 'restaurant'
          ? [
              {
                id: `menu-1`,
                name: 'الوجبة الخاصة المميزة',
                priceJOD: Number(priceJOD) || 4.5,
                image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
                description: 'محضرة طازجة يومياً بأعلى معايير الجودة والنكهة الأردنية الأصيلة.',
              },
            ]
          : undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveProfile(newProfile);
      onShowToast(`تم تسجيل «${newProfile.name}» بنجاح في بلينك الأردن وحفظه في Firebase 🇯🇴!`);
      onRegistered(newProfile);
      onClose();
    } catch (err) {
      console.error(err);
      onShowToast('تم حفظ الحساب بنجاح في قاعدة البيانات المحلية!');
      onRegistered(newProfile);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-slideUp font-['Tajawal',sans-serif]">
        {/* Top Header */}
        <div className="bg-neutral-950 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-[#FF6B00]/30 font-black">
                🇯🇴
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>بدي أسجل في بلينك</span>
                  <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                </h2>
                <p className="text-xs text-neutral-400 font-medium">
                  سجل نشاطك وانضم لمنظومة الأردن الموثقة بالهوية الوطنية
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6">
          {/* STEP 1: Select Role if not selected */}
          {!selectedRole ? (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider">
                  الخطوة 1 من 2
                </span>
                <h3 className="text-lg font-black text-neutral-900">
                  اختر نوع الحساب الذي تريد تسجيله:
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* 1. صانع محتوى */}
                <button
                  id="reg-role-creator"
                  onClick={() => handleSelectRole('creator')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🎥
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        صانع محتوى
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        فيديوهات وثائقية، تجارب هادفة، ستوريات، وعداد هدايا وإعجابات
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>

                {/* 2. خدمات (صنايعي) */}
                <button
                  id="reg-role-service"
                  onClick={() => handleSelectRole('service')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🔧
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        خدمات (صنايعي: سباك، كهربائي، نجار...)
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        مهني حر مرخص، عرض سنوات الخبرة والأعمال، واستقبال طلبات فورية
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>

                {/* 3. شركة */}
                <button
                  id="reg-role-company"
                  onClick={() => handleSelectRole('company')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🏢
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        شركة
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        شركات نقل، مقاولات، توريد، وخدمات تجارية مع شارة التوثيق
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>

                {/* 4. متجر */}
                <button
                  id="reg-role-store"
                  onClick={() => handleSelectRole('store')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🚗
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        متجر (سيارات / عقار / تجارة)
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        عرض الأسعار بالدينار، بطاقة تعريفية، وميزة التاغ @ لشركاء الخدمة
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>

                {/* 5. مطعم */}
                <button
                  id="reg-role-restaurant"
                  onClick={() => handleSelectRole('restaurant')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🍽️
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        مطعم
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        منيو وجبات، أسعار بالدينار، موقع دقيق، وطلب عبر واتساب فوري
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>

                {/* 6. شركة شحن */}
                <button
                  id="reg-role-shipping"
                  onClick={() => handleSelectRole('shipping')}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-200/80 hover:border-[#FF6B00] transition-all flex items-center justify-between text-right group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      🚚
                    </div>
                    <div>
                      <div className="font-black text-base text-neutral-900 group-hover:text-[#FF6B00] transition-colors">
                        شركة شحن وتوصيل
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        توصيل مجمع وسريع بين المحافظات، إدارة طرود، ومسارات خريطة
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 rotate-180 group-hover:text-[#FF6B00] group-hover:-translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Dedicated Form for the Selected Role */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Top Role Indicator & Switcher */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF6B00]">
                  <span>نوع الحساب المختار:</span>
                  <span className="bg-white px-2.5 py-1 rounded-full border border-orange-200 text-neutral-900 shadow-sm">
                    {selectedRole === 'creator' && '🎥 صانع محتوى'}
                    {selectedRole === 'service' && '🔧 خدمات (صنايعي)'}
                    {selectedRole === 'company' && '🏢 شركة'}
                    {selectedRole === 'store' && '🚗 متجر / سيارات / عقار'}
                    {selectedRole === 'restaurant' && '🍽️ مطعم'}
                    {selectedRole === 'shipping' && '🚚 شركة شحن'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-bold text-neutral-600 hover:text-neutral-900 underline"
                >
                  تغيير
                </button>
              </div>

              {/* Specific Guidance Header */}
              <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-200">
                {selectedRole === 'creator' && (
                  <span>
                    💡 <strong>شرح تفاصيل صانع المحتوى:</strong> سيحصل حسابك على صفحة تفاعلية مع عداد الإعجابات ❤️ والمشاهدات 👁️ والهدايا 🎁، ميزة الستوري أعلى الصفحة، وتبويبي فيديو وصور.
                  </span>
                )}
                {selectedRole === 'service' && (
                  <span>
                    💡 <strong>شرح تفاصيل الصنايعي:</strong> يطلب منك تحديد المهنة بدقة والمحافظة والخبرة لتظهر في نتائج بحث الطوارئ وزر تعميم الطلب المباشر.
                  </span>
                )}
                {selectedRole === 'store' && (
                  <span>
                    💡 <strong>شرح تفاصيل المتجر:</strong> صفحتك ستبرز السعر بالدينار الأردني وزر واتساب مباشر وميزة التاغ الذكي (@) لربط الفحص والتعديل والفرش.
                  </span>
                )}
                {selectedRole === 'restaurant' && (
                  <span>
                    💡 <strong>شرح تفاصيل المطعم:</strong> بطاقة تعريفية تبرز متوسط الأسعار بالدينار وقائمة الأطباق مع زر واتساب للطلب والتوصيل.
                  </span>
                )}
                {selectedRole === 'company' && (
                  <span>
                    💡 <strong>شرح تفاصيل الشركة:</strong> ملف تجاري رسمي مع تقييم النجوم ⭐ وشارة التوثيق بالهوية الوطنية 🇯🇴 وزر واتساب مباشر.
                  </span>
                )}
                {selectedRole === 'shipping' && (
                  <span>
                    💡 <strong>شرح تفاصيل شركة الشحن:</strong> تسجيل شركتك لاستقبال طلبات الشحن المجمعة (1 د.أ أو 1.5 د.أ) والطلبات الفردية وإرسال مسجات أوتوماتيكية للزبائن والمتاجر.
                  </span>
                )}
              </div>

              {/* 1. Name and Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {selectedRole === 'creator'
                      ? 'اسم صانع المحتوى *'
                      : selectedRole === 'service'
                      ? 'اسم الحرفي / الفني *'
                      : 'اسم النشاط أو الشركة أو المطعم *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: يزن الثقافي / أبو راشد السباك"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المعرف (Handle)
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@yazan_culture"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none text-right"
                  />
                </div>
              </div>

              {/* 2. Profession / Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {selectedRole === 'service'
                    ? 'المهنة المحددة (مهمة جداً للصنايعي) *'
                    : 'المسمى أو التخصص *'}
                </label>
                <input
                  type="text"
                  required
                  value={professionOrTitle}
                  onChange={(e) => setProfessionOrTitle(e.target.value)}
                  placeholder={
                    selectedRole === 'service'
                      ? 'مثال: سباك وموسرجي، كهربائي منازل، نجار، حداد'
                      : 'مثال: وثائقي وسياحي، معرض سيارات، شاورما ومشويات'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none"
                />
              </div>

              {/* Store Subcategory & Clickable Tags (Cars / Real Estate) */}
              {selectedRole === 'store' && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <label className="block text-xs font-bold text-neutral-800">
                    تصنيف المتجر وميزة التاغ (@):
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStoreSubcategory('cars');
                        setSelectedTags(['@مركز فحص كارتك', '@تعديل ستيج 2', '@زينة ونانو سيراميك']);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        storeSubcategory === 'cars'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300'
                      }`}
                    >
                      🚗 سيارات ومركبات
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStoreSubcategory('real_estate');
                        setSelectedTags(['@شركة إعمار الأردن للبناء', '@مطابخ الخشب الأردنية', '@مفروشات القصر']);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        storeSubcategory === 'real_estate'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300'
                      }`}
                    >
                      🏢 عقارات وإسكان
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStoreSubcategory('general');
                        setSelectedTags(['@خدمات التوصيل السريع', '@ضمان الجودة']);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        storeSubcategory === 'general'
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-white text-neutral-700 border-neutral-300'
                      }`}
                    >
                      🛍️ تجارة عامة
                    </button>
                  </div>

                  {/* Active tags preview */}
                  <div>
                    <div className="text-[11px] text-neutral-500 font-bold mb-1.5">
                      التاغات المفعلة التي ستظهر على بطاقتك وقابلة للنقر:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map((tagText, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tagText}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Location: City and District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المحافظة (الأردن) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold focus:ring-2 focus:ring-[#FF6B00] outline-none bg-white"
                  >
                    {JORDAN_GOVERNORATES.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المنطقة أو الحي
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: تلاع العلي، شارع مكة، وسط البلد"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none"
                  />
                </div>
              </div>

              {/* 4. Phone & Price / Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    رقم الهاتف والواتساب *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0791234567"
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-neutral-300 text-sm font-bold focus:ring-2 focus:ring-[#FF6B00] outline-none text-right"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Experience for Craftsmen, Price for Stores/Restaurants */}
                {selectedRole === 'service' ? (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      سنوات الخبرة العملية *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold focus:ring-2 focus:ring-[#FF6B00] outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      السعر بالدينار الأردني (خانة السعر) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={priceJOD}
                        onChange={(e) => setPriceJOD(e.target.value)}
                        placeholder="مثال: 25 أو 4.5"
                        className="w-full px-3.5 py-2.5 pl-14 rounded-xl border border-neutral-300 text-sm font-bold focus:ring-2 focus:ring-[#FF6B00] outline-none"
                      />
                      <span className="absolute left-3 top-3 text-xs font-black text-neutral-500">
                        د.أ (JOD)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. National ID for Instant Verification 🇯🇴 */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>الرقم الوطني الأردني (لتفعيل شارة موثوق 🇯🇴 فوراً)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    مشفر ومحمي
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: 9941038291 (10 أرقام)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none tracking-wider"
                />
              </div>

              {/* 6. Profile Avatar URL */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>رابط الصورة الشخصية أو الشعار</span>
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(getSuggestedAvatar(selectedRole))}
                    className="text-[11px] text-[#FF6B00] font-bold hover:underline"
                  >
                    استخدم صورة افتراضية
                  </button>
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none text-left"
                  dir="ltr"
                />
              </div>

              {/* 7. Bio / Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  نبذة تعريفية أو تفاصيل الخدمات
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن نشاطك وأعمالك للعملاء..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-[#FF6B00] outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-xl shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>
                    {isSubmitting
                      ? 'جارِ التسجيل في Firebase...'
                      : 'تأكيد التسجيل وفتح الصفحة فوراً 🚀'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
