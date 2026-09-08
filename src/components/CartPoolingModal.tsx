import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Building2,
  Truck,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types';
import { JORDAN_GOVERNORATES } from '../data/jordanBlinkData';

interface CartPoolingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  userCity: string;
  onConfirmOrder: (destinationCity: string, customerPhone: string) => void;
  onShowToast: (msg: string) => void;
}

export const CartPoolingModal: React.FC<CartPoolingModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  userCity,
  onConfirmOrder,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [selectedGovernorate, setSelectedGovernorate] = useState(userCity || 'مادبا');
  const [customerPhone, setCustomerPhone] = useState('079');
  const [customerName, setCustomerName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Group items by store
  const storeGroups = cartItems.reduce(
    (acc: Record<string, { storeName: string; items: CartItem[] }>, item) => {
      if (!acc[item.storeId]) {
        acc[item.storeId] = { storeName: item.storeName, items: [] };
      }
      acc[item.storeId].items.push(item);
      return acc;
    },
    {} as Record<string, { storeName: string; items: CartItem[] }>
  );

  const totalPieces = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.priceJOD * item.quantity, 0);
  const deliverySubtotal = cartItems.reduce((sum, item) => sum + item.deliveryFeeJOD, 0);
  const grandTotal = itemsSubtotal + deliverySubtotal;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      onShowToast('سلة التجميع فارغة!');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      onShowToast('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }

    onConfirmOrder(selectedGovernorate, customerPhone);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 flex items-center gap-2">
                <span>سلة التجميع الموحدة 🛒</span>
                <span className="text-xs bg-orange-100 text-[#FF6B00] font-black px-2.5 py-0.5 rounded-full">
                  {totalPieces} قطع
                </span>
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                تجميع طلباتك من عدة متاجر وتوصيلها سوياً للتوفير
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900">تم تسجيل طلبك وتجميعه بنجاح!</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              تم إشعار المتاجر بتجهيز البضاعة، وتم إدراج طلبك في خط التجميع لمدينة <b>{selectedGovernorate}</b>.
              سيصلك إشعار ومسج من مندوب الشحن فور انطلاق الباص! 🚚
            </p>
            <div className="text-xs font-black text-[#FF6B00] bg-orange-50 py-2 px-4 rounded-xl inline-block border border-orange-200">
              وفرت في تكاليف الشحن من خلال بلينك الأردن 🇯🇴
            </div>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto text-2xl">
                    🛒
                  </div>
                  <h4 className="font-black text-base text-neutral-800">سلة التجميع فارغة حالياً</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    تصفح معارض السيارات، العقار، الألبسة، أو المطاعم واضغط على "طلب بتجمع 🛒" للإضافة والاستفادة من الشحن المجمع بدينار واحد!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 bg-[#FF6B00] text-white text-xs font-black px-5 py-2.5 rounded-xl hover:bg-[#e65c00] transition-colors"
                  >
                    تصفح المنتجات الآن
                  </button>
                </div>
              ) : (
                <>
                  {/* Items grouped by store */}
                  <div className="space-y-4">
                    {Object.entries(storeGroups).map(([storeId, groupAny]) => {
                      const group = groupAny as { storeName: string; items: CartItem[] };
                      const storeSubtotal = group.items.reduce(
                        (sum, it) => sum + it.priceJOD * it.quantity,
                        0
                      );

                      return (
                        <div
                          key={storeId}
                          className="rounded-2xl border border-neutral-200 overflow-hidden bg-white shadow-sm"
                        >
                          {/* Store Header */}
                          <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#FF6B00]" />
                              <span className="font-black text-xs sm:text-sm text-neutral-800">
                                {group.storeName}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-neutral-500">
                              المجموع من المتجر: <b className="text-neutral-900">{storeSubtotal} د.أ</b>
                            </span>
                          </div>

                          {/* Store Items List */}
                          <div className="divide-y divide-neutral-100 p-2 sm:p-3 space-y-2">
                            {group.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-neutral-50/70 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h5 className="font-black text-xs sm:text-sm text-neutral-900 truncate">
                                      {item.title}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                                      {item.selectedSize && <span>مقاس: {item.selectedSize}</span>}
                                      {item.selectedColor && <span>لون: {item.selectedColor}</span>}
                                      <span>الكمية: {item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="font-black text-xs text-[#FF6B00]">
                                        {item.priceJOD * item.quantity} د.أ
                                      </span>
                                      <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-md text-neutral-600 font-bold">
                                        {item.deliveryOption === 'grouped'
                                          ? 'شحن مجمع (1 د.أ)'
                                          : 'شحن سريع (5 د.أ)'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="w-8 h-8 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0"
                                  title="حذف من السلة"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer Information & Governorate selection */}
                  <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-neutral-900">
                      <MapPin className="w-4 h-4 text-[#FF6B00]" />
                      <span>تحديد منطقة التوصيل ومعلومات المستلم:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                          المحافظة / المدينة:
                        </label>
                        <select
                          value={selectedGovernorate}
                          onChange={(e) => setSelectedGovernorate(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                        >
                          {JORDAN_GOVERNORATES.map((gov) => (
                            <option key={gov.id} value={gov.name}>
                              {gov.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                          رقم الهاتف للتواصل:
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="079xxxxxxx"
                          className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary (Totals) */}
                  <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>مجموع قطع المنتجات ({totalPieces}):</span>
                      <span className="font-bold text-white">{itemsSubtotal} د.أ</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>أجور التوصيل والشحن:</span>
                      <span className="font-bold text-emerald-400">{deliverySubtotal} د.أ</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                      <span className="font-black text-sm text-white">المجموع الإجمالي المطلوب:</span>
                      <span className="font-black text-xl text-[#FF6B00]">{grandTotal} د.أ</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50">
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-500 hover:text-rose-600 font-bold px-3 py-2"
                >
                  تفريغ السلة
                </button>

                <button
                  onClick={handleCheckout}
                  className="flex-1 max-w-sm flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] active:scale-[0.98] text-white text-sm font-black py-3 px-6 rounded-2xl shadow-xl shadow-orange-500/30 transition-all"
                >
                  <span>تأكيد الطلب وانضمام للتجميع</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
