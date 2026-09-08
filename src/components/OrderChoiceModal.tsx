import React, { useState } from 'react';
import { X, ShoppingCart, Zap, Users, Check, Sparkles, Plus, Minus } from 'lucide-react';
import { BlinkProductItem, CartItem } from '../types';

interface OrderChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BlinkProductItem | null;
  userCity?: string;
  onAddToCart: (item: CartItem) => void;
  onShowToast: (msg: string) => void;
}

export const OrderChoiceModal: React.FC<OrderChoiceModalProps> = ({
  isOpen,
  onClose,
  product,
  userCity = 'مادبا',
  onAddToCart,
  onShowToast,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : undefined);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : undefined);

  const handleSelectOption = (deliveryOption: 'grouped' | 'solo') => {
    const fee = deliveryOption === 'grouped' ? 1 : 5;
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      title: product.title,
      storeId: product.storeId || 'store-general',
      storeName: product.storeName || 'متجر بلينك',
      priceJOD: product.priceJOD,
      quantity,
      image: product.image,
      selectedSize,
      selectedColor,
      deliveryOption,
      deliveryFeeJOD: fee,
      customerCity: userCity,
    };

    onAddToCart(cartItem);
    onClose();

    if (deliveryOption === 'grouped') {
      onShowToast(`🎉 انضم طلبك لتجميع الشحن إلى ${userCity}! وفرت 4 دنانير (شحن 1 د.أ فقط)`);
    } else {
      onShowToast(`🚀 تم تسجيل طلبك الفردي السريع! سيصلك اليوم مع مندوب الشحن.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-black">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-neutral-900">طلب المنتج والشحن</h3>
              <p className="text-xs text-neutral-500">{product.storeName || 'بلينك الأردن'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex gap-3.5 bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm text-neutral-900 line-clamp-2 leading-tight">
                {product.title}
              </h4>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-black text-lg text-[#FF6B00]">{product.priceJOD} د.أ</span>
                <span className="text-[11px] text-neutral-400">دينار أردني</span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                📍 موقع المحل: {product.city} {product.district ? `(${product.district})` : ''}
              </div>
            </div>
          </div>

          {/* Clothes Customization (Sizes & Colors) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-black text-neutral-700 mb-1.5">اختر المقاس:</label>
              <div className="flex items-center gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      selectedSize === size
                        ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/30 ring-2 ring-[#FF6B00]/40'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-black text-neutral-700 mb-1.5">اختر اللون:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedColor === color
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-neutral-100">
            <span className="text-xs font-black text-neutral-800">الكمية المطلوبة:</span>
            <div className="flex items-center gap-3 bg-neutral-100 px-3 py-1 rounded-xl">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white text-neutral-700 flex items-center justify-center font-black shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm text-neutral-900 w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-black shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Decision: Solo vs Pooled Shipping */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-black text-neutral-600">كيف بدك يوصلك الطلب؟</div>

            {/* Option 1: مع التجميع (Recommended) */}
            <button
              onClick={() => handleSelectOption('grouped')}
              className="w-full p-4 rounded-2xl bg-gradient-to-l from-orange-50 to-amber-50/70 border-2 border-[#FF6B00] hover:bg-orange-100/70 transition-all text-right flex items-center justify-between group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                  👥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-neutral-900">مع التجميع الجغرافي</span>
                    <span className="text-[10px] font-black bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">
                      وفر 4 دنانير 🔥
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    توصيل مجمع بـ <b className="text-[#FF6B00]">1 دينار فقط</b> بدلاً من 5 دنانير! بوصلك بكرا مع أهل {userCity}.
                  </p>
                </div>
              </div>
              <div className="text-left shrink-0">
                <div className="font-black text-lg text-[#FF6B00]">1 د.أ</div>
                <div className="text-[10px] text-neutral-400 line-through">5 د.أ</div>
              </div>
            </button>

            {/* Option 2: لحالي سريع */}
            <button
              onClick={() => handleSelectOption('solo')}
              className="w-full p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-all text-right flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center text-xl shrink-0">
                  🚀
                </div>
                <div>
                  <span className="font-black text-sm text-neutral-900">لحالي - توصيل سريع اليوم</span>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    توصيل فوري ومباشر خلال ساعات عبر مندوب خاص لعنوانك.
                  </p>
                </div>
              </div>
              <div className="text-left shrink-0">
                <div className="font-black text-base text-neutral-900">5 د.أ</div>
                <div className="text-[10px] text-neutral-500">سريع اليوم</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
