import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ServiceProvider } from '../types';

interface ServiceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ServiceProvider;
  onSubmitReview: (providerId: string, review: { reviewerName: string; rating: number; comment: string }) => void;
}

export const ServiceReviewModal: React.FC<ServiceReviewModalProps> = ({
  isOpen,
  onClose,
  provider,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState('أحمد العميل');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitReview(provider.id, {
      reviewerName: reviewerName.trim(),
      rating,
      comment: comment.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-white">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/60">
          <div>
            <h3 className="text-base font-bold">تقييم الخدمة المنجزة ⭐</h3>
            <p className="text-xs text-slate-400">تقييمك يبني الثقة ومتبادل بين الطرفين</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-emerald-400">شكراً لتقييمك!</h4>
            <p className="text-xs text-slate-300">تم تحديث تقييم مقدم الخدمة وإضافته لملف الثقة بنجاح.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-800">
              <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full object-cover border border-amber-500/30" />
              <div>
                <h4 className="text-sm font-bold text-slate-100">{provider.name}</h4>
                <p className="text-xs text-amber-400">{provider.profession}</p>
                <p className="text-[11px] text-slate-400">{provider.city} • {provider.completedJobsCount} خدمة منجزة</p>
              </div>
            </div>

            {/* Stars */}
            <div className="text-center py-2">
              <label className="text-xs text-slate-300 font-semibold mb-2 block">حدد التقييم</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-amber-400 font-bold mt-1 inline-block">
                {rating === 5 ? 'ممتاز ومتقن (5/5)' : rating === 4 ? 'جيد جداً (4/5)' : rating === 3 ? 'متوسط (3/5)' : 'دون التوقع'}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">اسمك</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">تعليقك ورأيك في جودة العمل</label>
              <textarea
                rows={3}
                placeholder="التزام بالمواعيد، نظافة بعد العمل، مهارة، سعر مناسب..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition"
              >
                إرسال التقييم
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300"
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
