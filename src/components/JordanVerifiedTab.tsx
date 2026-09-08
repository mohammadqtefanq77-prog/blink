import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Star,
  Phone,
  MessageCircle,
  MapPin,
  FileText,
  Upload,
  Sparkles,
  Search,
  X,
  Award,
  AlertCircle,
} from 'lucide-react';
import { VerifiedJordanUser, UserLocation } from '../types';

interface JordanVerifiedTabProps {
  verifiedUsers: VerifiedJordanUser[];
  userLocation: UserLocation;
  onAddNewVerifiedUser: (user: VerifiedJordanUser) => void;
  onOpenPersonProfile?: (user: any) => void;
  onBackToHome?: () => void;
}

export const JordanVerifiedTab: React.FC<JordanVerifiedTabProps> = ({
  verifiedUsers,
  userLocation,
  onAddNewVerifiedUser,
  onOpenPersonProfile,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'professional' | 'merchant'>('all');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: '',
    nationalNumber: '',
    role: 'professional' as 'professional' | 'merchant' | 'individual',
    profession: '',
    phone: '',
    city: userLocation.city || 'عمان',
    district: userLocation.district || 'وسط البلد',
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.nationalNumber.trim()) return;

    const masked =
      form.nationalNumber.length >= 6
        ? form.nationalNumber.slice(0, 6) + '****'
        : '998102****';

    const newUser: VerifiedJordanUser = {
      id: `ver-${Date.now()}`,
      name: form.fullName,
      role: form.role,
      professionOrBusiness: form.profession || 'مهني معتمد',
      nationalIdMasked: masked,
      idCardIssuedCity: form.city,
      verificationDate: new Date().toISOString().split('T')[0],
      trustScore: 99,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: form.phone || '0791234567',
      whatsapp: '962' + (form.phone || '0791234567').replace(/^0/, ''),
      city: form.city,
      district: form.district,
      experienceYears: 5,
      completedTransactions: 12,
      rating: 5.0,
      reviewCount: 3,
      bio: `حساب موثق رسمياً بالهوية الوطنية الأردنية في محافظة ${form.city}.`,
      badges: ['موثوق بالهوية الوطنية 🇯🇴', 'حساب مدقق حديثاً', 'ضمان الخدمة'],
    };

    onAddNewVerifiedUser(newUser);
    setVerificationSuccess(true);
    setTimeout(() => {
      setVerificationSuccess(false);
      setIsVerifyModalOpen(false);
    }, 1800);
  };

  const filteredUsers = verifiedUsers.filter((u) => {
    if (selectedRole !== 'all' && u.role !== selectedRole) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const combinedStr = `${u.name || ''} ${u.professionOrBusiness || ''} ${u.city || ''} ${u.district || ''}`;
    return combinedStr.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner - Jordanian Identity & Security */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {onBackToHome && (
                <button
                  onClick={onBackToHome}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                >
                  <span>العودة للرئيسية ←</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>نظام التوثيق بالهوية الوطنية الأردنية 🇯🇴</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              أصحاب الحسابات <span className="text-orange-500">الموثوقة</span> في الأردن
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1">
              تعامل بأمان مطلق مع مهنيين، وتجار، وبائعين تم التحقق من هوياتهم الشخصية وسجلاتهم.
            </p>
          </div>

          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="self-start sm:self-auto bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>وثّق حسابك بالهوية 🇯🇴</span>
          </button>
        </div>

        {/* Trust Guarantees */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-center">
          <div className="bg-neutral-900/80 p-2 rounded-xl border border-neutral-800">
            <div className="text-orange-400 font-black text-xs sm:text-sm">100%</div>
            <div className="text-[10px] text-neutral-400 font-medium">تدقيق أرقام وطنية</div>
          </div>
          <div className="bg-neutral-900/80 p-2 rounded-xl border border-neutral-800">
            <div className="text-emerald-400 font-black text-xs sm:text-sm">درجة أمان 99%</div>
            <div className="text-[10px] text-neutral-400 font-medium">سجل خالي من المخالفات</div>
          </div>
          <div className="bg-neutral-900/80 p-2 rounded-xl border border-neutral-800">
            <div className="text-white font-black text-xs sm:text-sm">كفالة بلينك</div>
            <div className="text-[10px] text-neutral-400 font-medium">ضمان سرعة واستجابة</div>
          </div>
        </div>
      </div>

      {/* Role Filters & Search */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedRole('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              selectedRole === 'all'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            الكل ({verifiedUsers.length})
          </button>
          <button
            onClick={() => setSelectedRole('professional')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              selectedRole === 'professional'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            مهنيون موثقون 🛠️
          </button>
          <button
            onClick={() => setSelectedRole('merchant')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              selectedRole === 'merchant'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            تجار ومعارض 🏢
          </button>
        </div>

        <div className="relative max-w-[180px] sm:max-w-xs w-full">
          <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو المهنة..."
            className="w-full bg-white border border-neutral-200 rounded-xl pr-8 pl-3 py-1.5 text-xs font-medium outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Verified Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full border-2 border-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      onClick={() => onOpenPersonProfile && onOpenPersonProfile(user)}
                      className="font-black text-sm sm:text-base text-neutral-900 truncate hover:text-orange-600 cursor-pointer"
                    >
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-black px-2 py-0.5 rounded-lg shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{user.rating}</span>
                      <span className="text-[10px] text-amber-700/80">({user.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-orange-600 mt-0.5">
                    {user.professionOrBusiness}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{user.city} - {user.district}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-neutral-700">
                      {user.completedTransactions} عملية منجزة
                    </span>
                  </div>
                </div>
              </div>

              {/* National ID Verification Badge Block */}
              <div className="mt-3 bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="font-black text-emerald-900 block">
                      موثق بالهوية الوطنية 🇯🇴
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700">
                      الرقم الوطني: {user.nationalIdMasked}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    أمان {user.trustScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                {user.bio}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {user.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md border border-neutral-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Direct WhatsApp & Call */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-neutral-100">
              <button
                onClick={() => {
                  const clean = user.whatsapp || '962' + user.phone.replace(/^0/, '');
                  const msg = encodeURIComponent(`مرحبا يا ${user.name}، شفت حسابك الموثق على بلينك وبدي أتواصل معك.`);
                  window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black py-2 rounded-xl shadow-xs transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب موثق 💬</span>
              </button>

              <a
                href={`tel:${user.phone}`}
                className="flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-black py-2 rounded-xl shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* VERIFY ID MODAL */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-neutral-900">
                  توثيق الحساب بالهوية الوطنية 🇯🇴
                </h2>
                <p className="text-xs text-neutral-500">احصل على شارة الثقة وزيادة مصداقية عملك</p>
              </div>
            </div>

            {verificationSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-black text-base text-neutral-900">
                  تم اعتماد وتوثيق هويتك بنجاح!
                </h3>
                <p className="text-xs text-neutral-600">
                  تم إضافة شارة «موثوق بالهوية الوطنية 🇯🇴» لحسابك الآن.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerifySubmit} className="space-y-3.5 text-xs font-bold">
                <div>
                  <label className="block text-neutral-700 mb-1">الاسم الرباعي كما في الهوية الشخصية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد علي العبداللات"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">الرقم الوطني الأردني (10 خانات) *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="مثال: 9982014521"
                    value={form.nationalNumber}
                    onChange={(e) => setForm({ ...form, nationalNumber: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-mono font-medium outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-700 mb-1">نوع الحساب</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="professional">مهني / حرفي</option>
                      <option value="merchant">تاجر / معرض</option>
                      <option value="individual">مستخدم / مشتري</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">المهنة أو النشاط</label>
                    <input
                      type="text"
                      placeholder="مثال: سباك وموسرجي"
                      value={form.profession}
                      onChange={(e) => setForm({ ...form, profession: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white"
                    >
                    </input>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-700 mb-1">المحافظة</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0791234567"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* ID photo mock upload */}
                <div>
                  <label className="block text-neutral-700 mb-1">صورة الهوية الوطنية (الواجهة الأمامية)</label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 text-center bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-neutral-600 block">انقر لرفع صورة الهوية</span>
                    <span className="text-[10px] text-neutral-400">تدقيق إلكتروني مشفر وآمن 100%</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد البيانات وتوثيق الحساب فوراً</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
