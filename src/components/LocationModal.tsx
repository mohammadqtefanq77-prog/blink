import React, { useState } from 'react';
import { X, MapPin, Check, Navigation, Loader2 } from 'lucide-react';
import { UserLocation } from '../types';
import { AVAILABLE_LOCATIONS } from '../data/initialAds';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [customCity, setCustomCity] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          const newLoc: UserLocation = {
            city: 'موقعي الحالي',
            district: 'إحداثيات GPS',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            displayName: 'موقعي الحالي المباشر',
          };
          onSelectLocation(newLoc);
          onClose();
        },
        (err) => {
          setIsDetecting(false);
          alert('تعذر جلب موقعك الحالي تلقائياً. يرجى اختيار إحدى المدن المتاحة.');
          console.warn(err);
        },
        { timeout: 8000 }
      );
    } else {
      alert('المتصفح لا يدعم تحديد الموقع المباشر');
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim() && customDistrict.trim()) {
      onSelectLocation({
        city: customCity.trim(),
        district: customDistrict.trim(),
        lat: 24.7136,
        lng: 46.6753,
        displayName: `${customCity.trim()} - ${customDistrict.trim()}`,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-950">تحديد موقعك الجغرافي</h3>
              <p className="text-[11px] text-neutral-500">
                لحساب المسافة والقرب بدقة في نتائج البحث
              </p>
            </div>
          </div>

          <button
            id="btn-close-location-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-right">
          {/* GPS Button */}
          <button
            id="btn-use-gps-location"
            onClick={handleUseGPS}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-emerald-200/90 transition-all active:scale-98"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>جارِ تحديد إحداثيات موقعك...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-emerald-700" />
                <span>استخدام موقعي المباشر عبر GPS</span>
              </>
            )}
          </button>

          {/* Quick preset locations */}
          <div>
            <span className="block text-xs font-bold text-neutral-700 mb-2">
              أو اختر منطقة شائعة:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {AVAILABLE_LOCATIONS.map((loc, i) => {
                const isSelected =
                  currentLocation.city === loc.city &&
                  currentLocation.district === loc.district;
                return (
                  <button
                    key={i}
                    id={`btn-location-preset-${i}`}
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-neutral-400'}`} />
                      <span>{loc.displayName}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom location entry */}
          <form onSubmit={handleApplyCustom} className="pt-3 border-t border-neutral-100">
            <span className="block text-xs font-bold text-neutral-700 mb-1.5">
              أو أدخل مدينتك وحيك يدوياً:
            </span>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                id="input-custom-city"
                type="text"
                placeholder="المدينة (مثال: الدمام)"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
              />
              <input
                id="input-custom-district"
                type="text"
                placeholder="الحي (مثال: الشاطئ)"
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={!customCity.trim() || !customDistrict.trim()}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-900 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all"
            >
              تطبيق الموقع المخصص
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
