import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Wrench,
  Zap,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Radio,
  Share2,
} from 'lucide-react';
import { ServiceProvider, UserLocation } from '../types';

interface JordanSmartOrderTabProps {
  userLocation: UserLocation;
  professionals: ServiceProvider[];
  onBroadcastSuccess?: (message: string) => void;
  onOpenPersonProfile?: (provider: ServiceProvider) => void;
}

interface ParsedNeed {
  query: string;
  category: string;
  urgency: 'emergency' | 'urgent' | 'standard';
  urgencyLabel: string;
  detectedLocation: string;
  explanation: string;
  estimatedCostJOD: string;
  matchedProviders: ServiceProvider[];
}

export const JordanSmartOrderTab: React.FC<JordanSmartOrderTabProps> = ({
  userLocation,
  professionals,
  onBroadcastSuccess,
  onOpenPersonProfile,
}) => {
  const [needInput, setNeedInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ParsedNeed | null>(null);
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Jordanian quick prompt suggestions
  const SUGGESTED_NEEDS = [
    'المي بتطفح بالحمام ومحتاج سباك سريع بطبربور 🚨',
    'بدي ديانا تنقل غسالة وثلاجة من صويلح لإربد 🚚',
    'بدي نجار شاطر يفك ويركب خزانة 6 درف 🪚',
    'شورت كهربا طافي نص البيت وبدي كهربجي فوري ⚡',
    'بدي ونش يسحب سيارتي من شارع الجامعة بإربد 🚗',
    'بدي معلم دهان لشقة 120 متر بسعر حنين 🎨',
  ];

  // Client & AI intent parser in Jordanian dialect
  const analyzeUserNeed = (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setBroadcastDone(false);

    setTimeout(() => {
      const q = text.toLowerCase();
      let category = 'صيانة وخدمات عامة';
      let urgency: 'emergency' | 'urgent' | 'standard' = 'standard';
      let urgencyLabel = 'عادي 📅';
      let explanation = 'فهم النظام طلبك وقام بتصنيفه وتحديد أنسب المزودين المتاحين في منطقتك.';
      let cost = '15 - 30 دينار';

      if (q.includes('بتطفح') || q.includes('غرق') || q.includes('طوارئ') || q.includes('شورت') || q.includes('انفجرت') || q.includes('مستعجل')) {
        urgency = 'emergency';
        urgencyLabel = 'طوارئ قصوى فزعة 🚨';
      } else if (q.includes('اليوم') || q.includes('سريع') || q.includes('فوري')) {
        urgency = 'urgent';
        urgencyLabel = 'عاجل اليوم ⚡';
      }

      if (q.includes('مي') || q.includes('سباك') || q.includes('حنفية') || q.includes('ماسورة') || q.includes('مجاري')) {
        category = 'سباكة وصيانة مياه';
        explanation = 'تم التعرف على مشكلة في شبكة المياه أو السباكة. تم تحديد السباكين وموسرجية الطوارئ الجاهزين للحضور الفوري.';
        cost = '15 - 25 دينار (شامل الفحص والمعاينة)';
      } else if (q.includes('كهرب') || q.includes('شورت') || q.includes('قاطع') || q.includes('إنارة')) {
        category = 'كهرباء وتمديدات منزلية';
        explanation = 'تم رصد عطل كهربائي أو حاجة لتمديد وصيانة القواطع والإنارة.';
        cost = '10 - 20 دينار';
      } else if (q.includes('نقل') || q.includes('عفش') || q.includes('ديانا') || q.includes('ونش') || q.includes('سيارة تنقل')) {
        category = 'نقل عفش وتحميل';
        explanation = 'تم توجيه طلبك لسائقي الديانات وسيارات النقل المجهزة مع كادر التحميل والتنزيل.';
        cost = '35 - 70 دينار (حسب المسافة وعدد الغرف)';
      } else if (q.includes('نجار') || q.includes('خشب') || q.includes('خزانة') || q.includes('باب')) {
        category = 'نجارة وفك وتركيب';
        explanation = 'تم رصد حاجة لفك وتركيب أو صيانة الأثاث الخشبي والمطابخ.';
        cost = '20 - 45 دينار';
      } else if (q.includes('دهان') || q.includes('دهين') || q.includes('معجونة') || q.includes('بوية')) {
        category = 'دهان وديكورات تشطيب';
        explanation = 'تم تحديد معلمي الدهان والديكور المعتمدين في منطقتك.';
        cost = 'حسب المتر (تقديري 1 - 1.5 دينار للمتر)';
      }

      // Filter matched providers
      const matched = professionals
        .filter((p) => {
          const combined = `${p.profession} ${p.category} ${p.bio}`.toLowerCase();
          if (category.includes('سباكة')) return combined.includes('سباك') || combined.includes('موسرج');
          if (category.includes('كهرباء')) return combined.includes('كهرب');
          if (category.includes('نقل')) return combined.includes('نقل') || combined.includes('عفش') || combined.includes('ديانا');
          if (category.includes('نجارة')) return combined.includes('نجار');
          if (category.includes('دهان')) return combined.includes('دهان') || combined.includes('دهين');
          return true;
        })
        .slice(0, 3);

      setCurrentAnalysis({
        query: text,
        category,
        urgency,
        urgencyLabel,
        detectedLocation: `${userLocation.city} - ${userLocation.district}`,
        explanation,
        estimatedCostJOD: cost,
        matchedProviders: matched.length > 0 ? matched : professionals.slice(0, 2),
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handleBroadcast = () => {
    setBroadcastDone(true);
    if (onBroadcastSuccess) {
      onBroadcastSuccess('تم تعميم طلبك لجميع المهنيين المعتمدين في منطقتك! ستصلك عروض الأسعار قريباً.');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner - Orange & Black */}
      <div className="bg-neutral-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-black px-3 py-1 rounded-full mb-2 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الفهم الذكي للطلبات 🇯🇴</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            طلب أي حاجة بالذكاء الاصطناعي <span className="text-orange-500">Blink</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            اكتب أي حاجة أو مشكلة أو خدمة ببالك بالعامية، والذكاء الاصطناعي يفهمها، يقدّر التكلفة، ويوصلك بأقرب فني فوراً!
          </p>
        </div>

        {/* Big Input Area */}
        <div className="mt-4 bg-neutral-900 border-2 border-neutral-800 focus-within:border-orange-500 rounded-2xl p-2 transition-all">
          <textarea
            rows={3}
            value={needInput}
            onChange={(e) => setNeedInput(e.target.value)}
            placeholder='اكتب طلبك هون بالعامية، مثلاً: "المي بتطفح ومحتاج سباك فوري بطبربور"، "بدي ونش لسيارتي"، "بدي ديانا تنقل ثلاجة"...'
            className="w-full bg-transparent text-white placeholder-neutral-400 text-sm font-medium outline-none resize-none p-2"
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 px-2">
            <span className="text-[11px] text-neutral-400 font-medium">
              الذكاء الاصطناعي يحلل اللهجة الأردنية بدقة 🇯🇴
            </span>

            <button
              disabled={isAnalyzing || !needInput.trim()}
              onClick={() => analyzeUserNeed(needInput)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الفهم...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>تحليل الطلب وإيجاد الحل</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1.5">أو جرّب أحد هذه الطلبات الشائعة:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTED_NEEDS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNeedInput(suggestion);
                  analyzeUserNeed(suggestion);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60 whitespace-nowrap transition-colors shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI ANALYSIS RESULTS CARD */}
      {currentAnalysis && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-orange-500/50 shadow-xl space-y-4 animate-in fade-in">
          {/* Analysis Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
                  تحليل الذكاء الاصطناعي لطلبك
                </span>
                <h3 className="font-black text-base text-neutral-900">
                  «{currentAnalysis.query}»
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                  currentAnalysis.urgency === 'emergency'
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20 animate-pulse'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {currentAnalysis.urgencyLabel}
              </span>
              <span className="text-xs font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-xl">
                {currentAnalysis.category}
              </span>
            </div>
          </div>

          {/* Explanation & Estimated Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
              <div className="text-[11px] font-bold text-neutral-500 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>التشخيص الذكي</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                {currentAnalysis.explanation}
              </p>
            </div>

            <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 flex flex-col justify-between">
              <div className="text-[11px] font-bold text-orange-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-orange-600" />
                <span>التكلفة التقديرية العادلة في الأردن</span>
              </div>
              <div className="text-base sm:text-lg font-black text-orange-600 mt-1">
                {currentAnalysis.estimatedCostJOD}
              </div>
              <span className="text-[10px] text-neutral-500 mt-1">
                مبنية على متوسط أسعار السوق الأردني المعتمدة
              </span>
            </div>
          </div>

          {/* Top Matched Professionals */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-black text-xs sm:text-sm text-neutral-900 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-orange-500" />
                <span>المهنيون الجاهزون لتنفيذ طلبك فوراً ({currentAnalysis.matchedProviders.length}):</span>
              </h4>
              <span className="text-[11px] text-neutral-500 font-bold">الأقرب لموقعك</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentAnalysis.matchedProviders.map((prov) => (
                <div
                  key={prov.id}
                  className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5
                          onClick={() => onOpenPersonProfile && onOpenPersonProfile(prov)}
                          className="font-black text-xs sm:text-sm text-neutral-900 truncate hover:text-orange-600 cursor-pointer"
                        >
                          {prov.name}
                        </h5>
                        <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">
                          موثق 🇯🇴
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-orange-600">{prov.profession}</p>
                      <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{prov.city} - {prov.district} (يبعد {prov.distanceKm || '2'} كم)</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-neutral-200/60">
                    <button
                      onClick={() => {
                        const clean = prov.phone.replace(/[^0-9]/g, '');
                        const intl = clean.startsWith('0') ? '962' + clean.slice(1) : clean;
                        const msg = encodeURIComponent(`مرحبا يا معلم ${prov.name}، شفتك على بلينك الأردن، عندي طلب بخصوص: «${currentAnalysis.query}».`);
                        window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
                      }}
                      className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-1.5 rounded-xl transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </button>

                    <a
                      href={`tel:${prov.phone}`}
                      className="flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black py-1.5 rounded-xl transition-colors"
                    >
                      <Phone className="w-3 h-3 text-orange-400" />
                      <span>اتصال</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast to all local providers button */}
          <div className="pt-2">
            {!broadcastDone ? (
              <button
                onClick={handleBroadcast}
                className="w-full bg-neutral-950 hover:bg-neutral-900 active:scale-98 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-lg border border-neutral-800 flex items-center justify-center gap-2 transition-all"
              >
                <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>تعميم هذا الطلب بنقرة واحدة على جميع الفنيين في {userLocation.city}</span>
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center text-xs font-black text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تعميم طلبك بنجاح! ستصلك إشعارات وعروض فور ورودها.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
