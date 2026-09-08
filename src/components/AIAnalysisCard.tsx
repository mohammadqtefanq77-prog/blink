import React from 'react';
import { Sparkles, Compass, CheckCircle2, Award } from 'lucide-react';
import { SearchAIAnalysis } from '../types';

interface AIAnalysisCardProps {
  analysis: SearchAIAnalysis;
  totalFound: number;
  sponsoredCount: number;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  analysis,
  totalFound,
  sponsoredCount,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border border-emerald-200/90 rounded-2xl p-4 shadow-xs relative overflow-hidden">
      {/* Decorative top-right badge */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-100/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-emerald-950">
              تحليل الذكاء الاصطناعي Gemini لطلبك
            </h3>
            <p className="text-[11px] text-emerald-700">
              تم التعرف على نية البحث وتحديد الخدمة والموقع بدقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] bg-emerald-100/90 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
            {totalFound} إعلان مطابق
          </span>
          {sponsoredCount > 0 && (
            <span className="text-[11px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Award className="w-3 h-3 text-amber-600" />
              {sponsoredCount} ممول
            </span>
          )}
        </div>
      </div>

      {/* Extracted tags row */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 bg-white/80 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-900 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>الخدمة المطلوبة: </span>
          <strong className="text-emerald-950 font-bold">{analysis.extractedService}</strong>
        </div>

        <div className="flex items-center gap-1 bg-white/80 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-900 font-medium">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>الموقع والقرب: </span>
          <strong className="text-emerald-950 font-bold">{analysis.extractedLocation}</strong>
        </div>
      </div>

      {/* Explanation text */}
      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white/60 p-2.5 rounded-xl border border-emerald-100/60">
        {analysis.explanation}
      </p>

      {/* Criteria notification */}
      <div className="mt-2.5 pt-2 border-t border-emerald-100/60 flex items-center justify-between text-[11px] text-neutral-500">
        <span>الترتيب: التطابق العالي ← القرب الجغرافي ← الإعلانات الممولة أولاً</span>
      </div>
    </div>
  );
};
