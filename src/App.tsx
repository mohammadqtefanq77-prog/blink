import React, { useState, useEffect } from 'react';
import {
  Language,
  UserLocation,
  UserProfile,
  ContentPost,
  MarketItem,
  ServiceProvider,
  BuyerSearchRequest,
  VerifiedJordanUser,
  BlinkEntityProfile,
  RegistrationRole,
  BlinkStore,
  BlinkProductItem,
  CartItem,
  GroupedDeliveryPool,
  SoloDeliveryOrder,
  ShippingCompanyProfile,
} from './types';
import { translations } from './locales/translations';
import {
  INITIAL_CONTENT_POSTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_USER_PROFILE,
} from './data/initialData';
import { DEFAULT_USER_LOCATION } from './data/initialAds';
import { INITIAL_SERVICE_PROVIDERS } from './data/initialServices';
import { SEED_BLINK_PROFILES } from './data/blinkProfilesData';
import {
  INITIAL_BLINK_STORES,
  INITIAL_BLINK_PRODUCTS,
  INITIAL_GROUPED_POOLS as INITIAL_SHIPPING_POOLS,
  INITIAL_SHIPPING_COMPANIES,
} from './data/blinkMasterData';
import {
  loadSavedBuyerRequests,
  saveBuyerRequest,
  loadSavedVerifiedUsers,
  saveVerifiedUser,
  loadSavedMarketItems,
  saveMarketItem,
  loadSavedProfiles,
} from './lib/firebaseBlinkService';
import { JordanUberHome } from './components/JordanUberHome';
import { JordanSmartMarketView } from './components/JordanSmartMarketView';
import { SmartMarketSevenView } from './components/SmartMarketSevenView';
import { UnifiedStoreView } from './components/UnifiedStoreView';
import { ShippingPoolView } from './components/ShippingPoolView';
import { OrderChoiceModal } from './components/OrderChoiceModal';
import { CartPoolingModal } from './components/CartPoolingModal';
import { JordanContentFeedView } from './components/JordanContentFeedView';
import { JordanVerifiedTab } from './components/JordanVerifiedTab';
import { LocationModal } from './components/LocationModal';
import { PersonProfileModal } from './components/PersonProfileModal';
import { RegistrationModal } from './components/RegistrationModal';
import { BlinkProfileModal } from './components/BlinkProfileModal';
import { CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';

export type BlinkAppView =
  | 'home'
  | 'market'
  | 'content'
  | 'verified'
  | 'cars'
  | 'real_estate'
  | 'clothes'
  | 'restaurants'
  | 'shipping'
  | 'factories';

export default function App() {
  // Navigation & Locale
  const [currentView, setCurrentView] = useState<BlinkAppView>('home');
  const [language, setLanguage] = useState<Language>('ar');
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [currentUser] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Master Stores & Products
  const [stores, setStores] = useState<BlinkStore[]>(INITIAL_BLINK_STORES);
  const [products, setProducts] = useState<BlinkProductItem[]>(INITIAL_BLINK_PRODUCTS);

  // Shipping & Pooling
  const [shippingPools, setShippingPools] = useState<GroupedDeliveryPool[]>(INITIAL_SHIPPING_POOLS);
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompanyProfile[]>(INITIAL_SHIPPING_COMPANIES);
  const [soloOrders, setSoloOrders] = useState<SoloDeliveryOrder[]>([
    {
      id: 'solo-101',
      customerName: 'طارق الزعبي',
      customerPhone: '0795551234',
      originStoreName: 'معرض ليث العبادي للسيارات',
      originCity: 'عمان',
      destinationCity: 'إربد',
      itemName: 'قطع تعديل وفحص سيارات أصلية',
      feeJOD: 5,
      status: 'pending',
      createdAt: 'منذ 15 دقيقة',
    },
    {
      id: 'solo-102',
      customerName: 'ديما المجالي',
      customerPhone: '0778889911',
      originStoreName: 'بوتيك راقي للألبسة التركية',
      originCity: 'عمان',
      destinationCity: 'الكرك',
      itemName: 'فستان تركي حصري مقاس M',
      feeJOD: 5,
      status: 'accepted',
      assignedCompany: 'أرامكس الأردن Aramex',
      createdAt: 'منذ 40 دقيقة',
    },
  ]);

  // Cart & Order Choices
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<BlinkProductItem | null>(null);

  // Blink Jordan Persistent States
  const [buyerRequests, setBuyerRequests] = useState<BuyerSearchRequest[]>(loadSavedBuyerRequests);
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedJordanUser[]>(loadSavedVerifiedUsers);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => {
    const saved = loadSavedMarketItems();
    return saved.length > 0 ? saved : INITIAL_MARKET_ITEMS;
  });
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(INITIAL_SERVICE_PROVIDERS);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>(INITIAL_CONTENT_POSTS);

  // New Entity Profiles (Creator, Store, Restaurant, Service/Craftsman, Company, Shipping)
  const [entityProfiles, setEntityProfiles] = useState<BlinkEntityProfile[]>(() => {
    const saved = loadSavedProfiles();
    return saved.length > 0 ? saved : SEED_BLINK_PROFILES;
  });

  // Modals & Interactivity
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedPersonForProfile, setSelectedPersonForProfile] = useState<any | null>(null);
  const [selectedEntityProfile, setSelectedEntityProfile] = useState<BlinkEntityProfile | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registrationInitialRole, setRegistrationInitialRole] = useState<RegistrationRole | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle Language
  const toggleLanguage = () => {
    const nextLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    showToast(nextLang === 'ar' ? 'تم تحويل اللغة إلى العربية' : 'Switched to English');
  };

  // Toast Notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3800);
  };

  // Add Item to Cart
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);

    if (item.deliveryOption === 'grouped') {
      // Find or update grouped pool
      setShippingPools((prevPools) => {
        const poolIndex = prevPools.findIndex(
          (p) => p.destinationCity === (item.customerCity || userLocation.city) && p.status === 'collecting'
        );
        if (poolIndex >= 0) {
          const updated = [...prevPools];
          const cur = updated[poolIndex];
          const newCount = cur.currentCount + 1;
          updated[poolIndex] = {
            ...cur,
            currentCount: newCount,
            progressPercent: Math.min(100, Math.round((newCount / cur.targetCount) * 100)),
            orders: [
              ...cur.orders,
              {
                id: `ord-${Date.now()}`,
                customerName: currentUser.name || 'عميل بلينك',
                customerPhone: currentUser.phone || '079xxxxxxx',
                storeName: item.storeName,
                itemTitle: item.title,
                priceJOD: item.priceJOD,
                status: 'ready',
              },
            ],
          };
          return updated;
        }
        return prevPools;
      });

      showToast(`تمت إضافة «${item.title}» إلى سلة التجميع (شحن 1 د.أ)! 🚚`);
      setIsCartModalOpen(true);
    } else {
      // Solo delivery order (5 JOD)
      const newSoloOrder: SoloDeliveryOrder = {
        id: `solo-${Date.now()}`,
        customerName: currentUser.name || 'زبون بلينك',
        customerPhone: currentUser.phone || '079xxxxxxx',
        storeName: item.storeName,
        fromCity: 'عمان',
        toCity: item.customerCity || userLocation.city || 'عمان',
        itemsSummary: item.title,
        itemPriceJOD: item.priceJOD || 0,
        deliveryFeeJOD: 5,
        status: 'pending',
        createdAt: 'الآن',
      };
      setSoloOrders((prev) => [newSoloOrder, ...prev]);
      showToast(`تم إنشاء طلب شحن فوري خاص منفرد (5 دنانير) لـ «${item.title}»! ⚡`);
    }
  };

  // Handler: Add new market item & save to Firebase
  const handleAddNewMarketItem = async (newItem: MarketItem) => {
    setMarketItems((prev) => [newItem, ...prev]);
    await saveMarketItem(newItem);
    showToast(`تم نشر «${newItem.title}» بنجاح في سوق بلينك!`);
  };

  // Handler: Add new buyer request ("بدي") & save to Firebase
  const handleAddNewBuyerRequest = async (req: BuyerSearchRequest) => {
    setBuyerRequests((prev) => [req, ...prev]);
    await saveBuyerRequest(req);
    showToast(`تم تسجيل طلبك «${req.rawQuery}» وسيتم إشعار البائعين فوراً!`);
  };

  // Handler: Add new verified user & save to Firebase
  const handleAddNewVerifiedUser = async (user: VerifiedJordanUser) => {
    setVerifiedUsers((prev) => [user, ...prev]);
    await saveVerifiedUser(user);
    showToast(`أهلاً بك 🇯🇴! تم تدقيق هويتك الوطنية وتفعيل شارة التوثيق بنجاح.`);
  };

  // Handle Location change
  const handleSelectLocation = (city: string, district?: string) => {
    setUserLocation({
      city,
      district: district || 'الوسط',
      coordinates: [31.9539, 35.9106],
    });
    setIsLocationModalOpen(false);
    showToast(`تم ضبط موقعك على: ${city}${district ? ` - ${district}` : ''}`);
  };

  // Accept Grouped Pool by Shipping Company
  const handleAcceptGroupedPool = (poolId: string, companyName: string) => {
    setShippingPools((prev) =>
      prev.map((p) =>
        p.id === poolId
          ? {
              ...p,
              status: 'ready_for_dispatch',
              assignedCompany: companyName,
            }
          : p
      )
    );
    showToast(`تم استلام دفعة التجميع ${poolId} بواسطة «${companyName}»! 🚚`);
  };

  // Accept Solo Order by Shipping Company
  const handleAcceptSoloOrder = (orderId: string, companyName: string) => {
    setSoloOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'accepted',
              assignedCompany: companyName,
            }
          : o
      )
    );
    showToast(`تم قبول طلب التوصيل الفوري ${orderId} بواسطة «${companyName}»! ⚡`);
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-white text-neutral-900 font-['Tajawal',sans-serif] selection:bg-[#FF6B00] selection:text-white antialiased flex flex-col"
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
          <div className="bg-neutral-950 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#FF6B00] flex items-center gap-3 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-[#FF6B00] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* VIEW SWITCHER */}
      {currentView === 'home' && (
        <JordanUberHome
          userLocation={userLocation}
          language={language}
          onToggleLanguage={toggleLanguage}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onNavigateToMarket={() => setCurrentView('market')}
          onNavigateToContent={() => setCurrentView('content')}
          onNavigateToCategory={(cat) => setCurrentView(cat)}
          onNavigateToShipping={() => setCurrentView('shipping')}
          onOpenVerifiedModal={() => setCurrentView('verified')}
          professionals={serviceProviders}
          onOpenPersonProfile={(p) => setSelectedPersonForProfile(p)}
          onOpenRegistration={(role) => {
            setRegistrationInitialRole(role || null);
            setIsRegistrationModalOpen(true);
          }}
          onShowToast={showToast}
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          onOpenCart={() => setIsCartModalOpen(true)}
        />
      )}

      {/* SMART MARKET (Strict 7 Categories as requested) */}
      {currentView === 'market' && (
        <main className="flex-1 bg-neutral-50/50">
          <SmartMarketSevenView
            items={products.filter((p) =>
              ['appliances', 'furniture', 'pets', 'pet_supplies', 'tools', 'home_tools', 'wholesale'].includes(p.category)
            )}
            userLocation={userLocation}
            onAddItem={(newItem) => {
              setProducts((prev) => [newItem, ...prev]);
              showToast(`تم نشر «${newItem.title}» بنجاح في السوق الذكي!`);
            }}
            onBackToHome={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* UNIFIED STORE VIEWS (Cars, Real Estate, Clothes, Restaurants, Factories) */}
      {(currentView === 'cars' ||
        currentView === 'real_estate' ||
        currentView === 'clothes' ||
        currentView === 'restaurants' ||
        currentView === 'factories') && (
        <main className="flex-1 bg-neutral-50/50">
          <UnifiedStoreView
            category={currentView}
            stores={stores.filter((s) => s.category === currentView)}
            products={products}
            userLocation={userLocation}
            onOrderGrouped={(product) => setSelectedProductForOrder(product)}
            onBackToHome={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* SHIPPING & LOGISTICS POOL VIEW */}
      {currentView === 'shipping' && (
        <main className="flex-1 bg-neutral-50/50">
          <ShippingPoolView
            pools={shippingPools}
            soloOrders={soloOrders}
            shippingCompanies={shippingCompanies}
            onAcceptGroupedPool={handleAcceptGroupedPool}
            onAcceptSoloOrder={handleAcceptSoloOrder}
            onBackToHome={() => setCurrentView('home')}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* CONTENT PLATFORM */}
      {currentView === 'content' && (
        <main className="flex-1 p-4 sm:p-6 bg-neutral-50/50">
          <JordanContentFeedView
            posts={contentPosts}
            onBackToHome={() => setCurrentView('home')}
            onOpenCreatorProfile={(authorName) => {
              if (!authorName) return;
              const found =
                entityProfiles.find(
                  (p) =>
                    p.name &&
                    (p.name.toLowerCase().includes(authorName.toLowerCase()) ||
                      authorName.toLowerCase().includes(p.name.toLowerCase()))
                ) ||
                entityProfiles.find((p) => p.role === 'creator') ||
                entityProfiles[0];
              setSelectedEntityProfile(found);
            }}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* VERIFIED NATIONAL ID DIRECTORY */}
      {currentView === 'verified' && (
        <main className="flex-1 p-4 sm:p-6 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto">
            <JordanVerifiedTab
              verifiedUsers={verifiedUsers}
              userLocation={userLocation}
              onAddNewVerifiedUser={handleAddNewVerifiedUser}
              onOpenPersonProfile={(u) => {
                const match = entityProfiles.find((e) => e.name === u.fullName);
                if (match) {
                  setSelectedEntityProfile(match);
                } else {
                  setSelectedPersonForProfile({
                    id: u.id,
                    name: u.fullName,
                    avatar: u.avatar,
                    profession: u.professionOrBusiness,
                    city: u.city,
                    district: u.district,
                    rating: u.rating,
                    reviewCount: u.reviewCount,
                    isVerified: u.isVerified,
                  });
                }
              }}
              onBackToHome={() => setCurrentView('home')}
            />
          </div>
        </main>
      )}

      {/* --- GLOBAL MODALS --- */}

      {/* Order Choice Modal (Grouped 1 JOD vs Solo 5 JOD) */}
      <OrderChoiceModal
        isOpen={!!selectedProductForOrder}
        onClose={() => setSelectedProductForOrder(null)}
        product={selectedProductForOrder}
        userCity={userLocation.city}
        onAddToCart={handleAddToCart}
        onShowToast={showToast}
      />

      {/* Cart Pooling Modal */}
      <CartPoolingModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
        onClearCart={() => setCartItems([])}
        userCity={userLocation.city}
        onConfirmOrder={(destCity, phone) => {
          showToast(`تم تأكيد طلبات سلة التجميع بنجاح إلى ${destCity}! سيتم التوصيل بدينار واحد فقط.`);
          setCartItems([]);
          setIsCartModalOpen(false);
        }}
        onShowToast={showToast}
      />

      {/* Location Selection Modal (Jordan Cities) */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Person/Provider Profile Modal */}
      {selectedPersonForProfile && (
        <PersonProfileModal
          isOpen={!!selectedPersonForProfile}
          onClose={() => setSelectedPersonForProfile(null)}
          person={selectedPersonForProfile}
          allMarketItems={products}
          allContentPosts={contentPosts}
          currentSearchQuery=""
        />
      )}

      {/* Blink Comprehensive Profile Modal (Creator, Store, Restaurant, Service, Company) */}
      {selectedEntityProfile && (
        <BlinkProfileModal
          isOpen={!!selectedEntityProfile}
          onClose={() => setSelectedEntityProfile(null)}
          profile={selectedEntityProfile}
          onShowToast={showToast}
        />
      )}

      {/* Registration Modal (6 Roles with Detailed Fields & Guidance) */}
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        initialRole={registrationInitialRole}
        onRegistered={(newProfile) => {
          setEntityProfiles((prev) => [newProfile, ...prev]);
          setSelectedEntityProfile(newProfile);
        }}
        onShowToast={showToast}
      />
    </div>
  );
}