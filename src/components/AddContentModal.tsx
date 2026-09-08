import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Layers,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { ContentPost, Language } from '../types';
import { translations } from '../locales/translations';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveContent: (post: Partial<ContentPost>) => void;
}

const CATEGORIES = [
  'سياحة وثقافة',
  'سيارات وصيانتها',
  'الذكاء الاصطناعي والبرمجة',
  'الزراعة والبيئة',
  'اللغات والترجمة',
  'التصميم والحرف',
  'التاريخ والآثار',
  'العلوم والهندسة',
  'الرياضة والصحة',
  'رحلات ومغامرات',
];

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveContent,
}) => {
  const t = translations[language];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+962791234567');
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorTagline, setSponsorTagline] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    topic: string;
    field: string;
    keywords: string[];
    level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'عام';
    targetAudience: string;
    contentType: 'تعليمي' | 'ثقافي' | 'سياحي' | 'مهاري' | 'ترفيه هادف';
    isSuspectedAd?: boolean;
    warning?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunAIClassifier = async () => {
    if (!title.trim()) return;
    setIsClassifying(true);
    try {
      const res = await fetch('/api/ai-gateway/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (aiAnalysis?.isSuspectedAd) {
      alert('تنبيه: يُمنع نشر الإعلانات التجارية في قسم المحتوى. يرجى التوجه لقسم «سوق البيع والشراء» أو «الإعلانات التجارية».');
      return;
    }

    onSaveContent({
      title: title.trim(),
      description: description.trim(),
      category,
      whatsappEnabled,
      whatsappNumber: whatsappEnabled ? whatsappNumber : undefined,
      isSponsored,
      sponsorTagline: isSponsored ? sponsorTagline : undefined,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screens-43093-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      aiClassification: aiAnalysis
        ? {
            topic: aiAnalysis.topic,
            field: aiAnalysis.field,
            keywords: aiAnalysis.keywords,
            level: aiAnalysis.level,
            targetAudience: aiAnalysis.targetAudience,
            contentType: aiAnalysis.contentType,
          }
        : {
            topic: title.trim(),
            field: category,
            keywords: [category, 'معرفة'],
            level: 'عام',
            targetAudience: 'الجمهور العام',
            contentType: 'تعليمي',
          },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 text-right flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">نشر محتوى مرئي هادف</h3>
              <p className="text-[11px] text-neutral-500">تعليمي، ثقافي، معرفي، أو سياحي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Strict Separation Notice (Specification #8: الفصل بين المحتوى والإعلان) */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-[11px] text-neutral-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>مبدأ بلينك: المحتوى = محتوى، والإعلان = إعلان.</strong> يُمنع نشر إعلانات البيع والشراء في هذا القسم للحفاظ على نقاء ونظافة خلاصة المحتوى.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              عنوان المحتوى:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: كيف تحافظ على شجرة الزيتون وتنتج زيتاً نقياً؟"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              وصف ومحاور الفيديو:
            </label>
            <textarea
              required
              rows={3}
              placeholder="اكتب نبذة عن المعرفة والمعلومات المقدمة في هذا الفيديو..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                المجال / القسم:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none font-semibold text-neutral-700"
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
                تفعيل التواصل السريع (واتساب):
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-whatsapp-creator"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="rounded text-neutral-900 w-4 h-4"
                />
                <label htmlFor="chk-whatsapp-creator" className="text-xs text-neutral-700 font-medium">
                  إظهار زر واتساب للمشاهدين
                </label>
              </div>
            </div>
          </div>

          {/* AI Auto-Classifier Button (Specification #7) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleRunAIClassifier}
              disabled={!title.trim() || isClassifying}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-900 text-xs font-bold py-2.5 px-4 rounded-xl border border-emerald-200 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{isClassifying ? 'جاري التصنيف الذكي...' : 'تصنيف ذكي فوري بالذكاء الاصطناعي'}</span>
            </button>
          </div>

          {/* AI Analysis Preview */}
          {aiAnalysis && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              aiAnalysis.isSuspectedAd
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}>
              {aiAnalysis.isSuspectedAd ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-800 block">تم اكتشاف طابع ترويجي أو بيع سلعة!</span>
                    <p className="text-[11px] text-rose-700 mt-0.5">{aiAnalysis.warning}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                    <span>الموضوع المستخرج: {aiAnalysis.topic}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {aiAnalysis.contentType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {aiAnalysis.keywords.map((kw, idx) => (
                      <span key={idx} className="bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded text-[10px]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Sponsorship Option (Specification #9) */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="chk-is-sponsored"
                checked={isSponsored}
                onChange={(e) => setIsSponsored(e.target.checked)}
                className="rounded text-neutral-900 w-4 h-4"
              />
              <label htmlFor="chk-is-sponsored" className="text-xs font-bold text-neutral-800">
                هذا المحتوى مدعوم من راعٍ رسمي (شركة / مؤسسة)
              </label>
            </div>

            {isSponsored && (
              <input
                type="text"
                placeholder="مثال: تاريخ مادبا — برعاية ودعم من شركة الرواد"
                value={sponsorTagline}
                onChange={(e) => setSponsorTagline(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
              />
            )}
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
              disabled={aiAnalysis?.isSuspectedAd}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              نشر المحتوى
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
