import React, { useState } from 'react';
import { X, MapPin, Star, Phone, MessageCircle, Play, CheckCircle2, Video, Image as ImageIcon } from 'lucide-react';
import { AccountPage, ServiceProvider, Ad } from '../types';

interface UnifiedProfileModalProps {
  entity: any | null; // AccountPage | ServiceProvider | Ad
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedProfileModal: React.FC<UnifiedProfileModalProps> = ({ entity, isOpen, onClose }) => {
  if (!isOpen || !entity) return null;

  const getProfileData = () => {
    if ('type' in entity && 'ownerId' in entity) {
      // AccountPage
      const p = entity as AccountPage;
      return {
        name: p.name,
        handle: p.handle,
        avatar: p.logo,
        cover: p.coverImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        rating: p.rating || 5,
        reviewCount: p.reviewCount || 12,
        location: `${p.city} - ${p.district}`,
        description: p.bio,
        phone: p.contactPhone,
        whatsapp: p.whatsapp,
        category: p.category,
        photos: [] as string[],
        videos: [] as string[]
      };
    } else if ('profession' in entity) {
      // ServiceProvider
      const s = entity as ServiceProvider;
      return {
        name: s.name,
        handle: `@${s.name.replace(/\s+/g, '').toLowerCase()}`,
        avatar: s.avatar,
        cover: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
        rating: s.rating || 5,
        reviewCount: s.reviewCount || 15,
        location: `${s.city} - ${s.district}`,
        description: s.bio,
        phone: s.phone,
        whatsapp: s.whatsapp,
        category: s.profession,
        photos: s.portfolioImages || [],
        videos: [] as string[]
      };
    } else {
      // Ad
      const a = entity as Ad;
      return {
        name: a.businessName,
        handle: `@${a.businessName.replace(/\s+/g, '').toLowerCase()}`,
        avatar: a.images?.[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80',
        cover: a.images?.[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
        rating: a.rating || 5,
        reviewCount: a.reviewCount || 0,
        location: `${a.city} - ${a.district}`,
        description: a.description,
        phone: a.contactPhone,
        whatsapp: a.whatsapp,
        category: a.category,
        photos: a.images || [],
        videos: [] as string[]
      };
    }
  };

  const data = getProfileData();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full sm:max-w-3xl bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 bg-neutral-200 shrink-0">
          <img src={data.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 sm:pb-6">
          <div className="px-5 sm:px-8 relative -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white shadow-xl bg-white overflow-hidden shrink-0">
                <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900">{data.name}</h1>
                  <CheckCircle2 className="w-6 h-6 text-blue-500" fill="currentColor" stroke="white" />
                </div>
                <p className="text-neutral-500 font-medium mb-3">{data.handle} • {data.category}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{data.rating} ({data.reviewCount} تقييم)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <span>{data.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 mt-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-3">عن {data.name}</h2>
              <div className="bg-neutral-50 rounded-2xl p-5 text-neutral-700 leading-relaxed font-medium">
                {data.description || 'لا يوجد وصف متاح.'}
              </div>
            </div>

            {/* Gallery (Photos & Videos) */}
            <div>
              <h2 className="text-lg font-black text-neutral-900 mb-3">معرض الأعمال والصور</h2>
              {data.photos.length > 0 || data.videos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.videos.map((vid, i) => (
                    <div key={`v-${i}`} className="aspect-square rounded-2xl bg-neutral-100 overflow-hidden relative group cursor-pointer">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-5 h-5 text-black ml-1" />
                        </div>
                      </div>
                      <img src={data.cover} alt="Video thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {data.photos.map((photo, i) => (
                    <div key={`p-${i}`} className="aspect-square rounded-2xl bg-neutral-100 overflow-hidden relative group cursor-pointer">
                      <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed text-neutral-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                  <span className="font-bold">لا يوجد صور حتى الآن</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons (Sticky Bottom) */}
        <div className="p-4 sm:p-6 bg-white border-t border-neutral-100 flex gap-3 z-10">
          <a
            href={`https://wa.me/${data.whatsapp?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-base sm:text-lg font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            تواصل واتساب
          </a>
          <a
            href={`tel:${data.phone}`}
            className="w-14 sm:w-16 shrink-0 py-3.5 sm:py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition-colors flex items-center justify-center"
          >
            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};
