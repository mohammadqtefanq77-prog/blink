import React, { useState } from 'react';
import { Search, Sparkles, CornerDownLeft, Loader2, X } from 'lucide-react';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  currentQuery: string;
}

const EXAMPLE_PROMPTS = [
  'بدي دكتور أسنان قريب مني',
  'بدي مطعم شاورما في منطقتي',
  'بدي سيارة للبيع',
  'بدي شركة تقدم خدمة نقل',
  'بدي منتج معين قريب مني',
  'بدي صيانة مكيفات سبليت بالبيت',
];

export const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  isLoading,
  currentQuery,
}) => {
  const [inputVal, setInputVal] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSearch(inputVal.trim());
    }
  };

  const handleChipClick = (prompt: string) => {
    setInputVal(prompt);
    onSearch(prompt);
  };

  const handleClear = () => {
    setInputVal('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-emerald-500/30 focus-within:border-emerald-600 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden px-3.5 py-2.5">
          {/* AI Sparkle Icon */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 ml-2">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Large Conversational Input */}
          <input
            id="input-ai-search"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="اكتب طلبك باللغة الطبيعية (مثال: بدي دكتور أسنان قريب مني...)"
            disabled={isLoading}
            className="w-full bg-transparent border-none text-neutral-800 text-sm sm:text-base placeholder:text-neutral-400 focus:outline-none pr-1 pl-2 font-medium"
            dir="rtl"
          />

          {/* Clear button */}
          {inputVal && !isLoading && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={handleClear}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors ml-1 shrink-0"
              title="مسح النص"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            id="btn-submit-search"
            disabled={isLoading || !inputVal.trim()}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">جارِ الفهم...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>بحث ذكي</span>
                <CornerDownLeft className="w-3 h-3 opacity-70 hidden sm:inline" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Natural Language Chips */}
      <div className="mt-3">
        <div className="flex items-center gap-1.5 mb-1.5 text-xs text-neutral-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>نماذج أسئلة شائعة يمكنك تجربتها بضغطة واحدة:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              id={`chip-prompt-${idx}`}
              type="button"
              onClick={() => handleChipClick(prompt)}
              className="text-xs bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 border border-neutral-200/90 hover:border-emerald-300 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs active:scale-98 text-right flex items-center gap-1"
            >
              <span>«{prompt}»</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
