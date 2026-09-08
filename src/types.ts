export type Language = 'ar' | 'en';

export type PageType = 'personal' | 'creator' | 'store' | 'company' | 'showroom' | 'service';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  bio?: string;
  createdAt: string;
}

export interface CommercialSubscription {
  plan: 'free_personal' | 'commercial_monthly';
  status: 'active' | 'trial' | 'inactive';
  trialEndsAt?: string;
  priceMonthly: number; // in USD or JOD/SAR
  currency: string;
}

export interface CreatorWallet {
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  giftsReceivedCount: number;
  stickersCount: number;
  currency: string;
}

export interface AccountPage {
  id: string;
  ownerId: string;
  type: PageType;
  name: string;
  handle: string;
  logo: string;
  coverImage?: string;
  bio: string;
  category: string;
  city: string;
  district: string;
  address?: string;
  workingHours?: string;
  rating: number;
  reviewCount: number;
  followersCount: number;
  viewsCount: number;
  contactPhone: string;
  whatsapp?: string;
  allowDirectContact: boolean;
  website?: string;
  isVerified: boolean;
  subscription: CommercialSubscription;
  wallet?: CreatorWallet; // For content creators
  products?: { id: string; name: string; price: string; image: string; desc: string }[];
  services?: { id: string; name: string; price?: string; desc: string }[];
  offers?: { id: string; title: string; discount: string; expiresAt: string }[];
  giftsReceived?: { id: string; giftName: string; icon: string; count: number }[];
  createdAt: string;
}

export interface ContentPost {
  id: string;
  creatorPageId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  creatorRating: number;
  creatorFollowers: number;
  title: string;
  description: string;
  videoUrl: string; // vertical video MP4 or animated loop
  posterUrl: string;
  category: string; // Education, Languages, Agriculture, Industry, Programming, AI, Sciences, Business, Engineering, Design, History & Culture, Tourism, Sports, Cars, Trips
  language: string; // ar, en, etc.
  durationSeconds: number;
  views: number;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorCompanyId?: string;
  sponsorTagline?: string; // e.g. "تاريخ مادبا — بدعم من شركة الرواد"
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
  giftsReceivedCount: number;
  stickersCount: number;
  aiClassification?: {
    topic: string;
    field: string;
    keywords: string[];
    level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'عام';
    targetAudience: string;
    contentType: 'تعليمي' | 'ثقافي' | 'سياحي' | 'مهاري' | 'ترفيه هادف';
    geolocation?: string;
  };
  comments?: { id: string; userName: string; avatar: string; text: string; time: string }[];
  createdAt: string;
}

export interface GiftItem {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  coins: number;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isNegotiable: boolean;
  category:
    | 'أجهزة وأدوات منزلية'
    | 'سيارات ومركبات'
    | 'أثاث ومفروشات'
    | 'هواتف وإلكترونيات'
    | 'طيور ومواشي وحلال'
    | 'منتجات زراعية'
    | 'منتجات مصانع وتجار'
    | 'خدمات ونقل'
    | 'أخرى';
  condition: 'جديد' | 'مستعمل بحالة ممتازة' | 'مستعمل' | 'خدمة';
  images: string[];
  city: string;
  district: string;
  sellerCity?: string;
  sellerDistrict?: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp?: string;
  sellerPageId?: string;
  sellerPageType?: PageType;
  isSponsored?: boolean;
  status?: 'active' | 'sold' | 'reserved';
  viewsCount?: number;
  distanceKm?: number;
  createdAt: string;
}

export interface Ad {
  id: string;
  businessName: string;
  category: string;
  serviceOrProduct: string;
  description: string;
  images: string[];
  city: string;
  district: string;
  locationLat?: number;
  locationLng?: number;
  contactPhone: string;
  whatsapp?: string;
  workingHours: string;
  isSponsored: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  priceTag?: string;
  pageId?: string;
  pageType?: PageType;
  // Computed during search:
  matchScore?: number;
  distanceKm?: number;
  matchReason?: string;
}

export interface UserLocation {
  city: string;
  district: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface ServiceReview {
  id: string;
  reviewerName: string;
  reviewerRole: 'عميل' | 'مقدم خدمة';
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  profession: string; // دهين, سباك, كهربجي, موسرجي, نجار, حداد, مبلط, فني تكييف, تقليم أشجار وزيتون, عامل زراعي, قطاف وحصاد, تحميل وتنزيل, نقل عفش, سيارة نقل, سائق, or custom
  category: 'صيانة وبناء' | 'خدمات زراعية وموسمية' | 'نقل وتحميل' | 'خدمات منزلية' | 'عمالة ومهن حرة' | 'أخرى';
  bio: string;
  experienceYears: number;
  completedJobsCount: number;
  rating: number;
  reviewCount: number;
  isAvailableNow: boolean;
  city: string;
  district: string;
  locationLat?: number;
  locationLng?: number;
  distanceKm?: number;
  priceEstimate?: string;
  phone: string;
  whatsapp?: string;
  portfolioImages: string[];
  serviceAreas: string[];
  isSeasonal?: boolean;
  isTransport?: boolean;
  isVerified?: boolean;
  pageId?: string;
  reviews?: ServiceReview[];
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requesterName: string;
  requesterPhone: string;
  requesterWhatsapp?: string;
  serviceType: string;
  category: string;
  city: string;
  district: string;
  locationDetails?: string;
  description: string;
  timing: 'الآن' | 'اليوم' | 'موعد لاحق';
  scheduledDate?: string;
  images: string[];
  agreedPrice?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  assignedProviderId?: string;
  assignedProviderName?: string;
  requesterRating?: { rating: number; comment: string };
  providerRating?: { rating: number; comment: string };
  createdAt: string;
}

export type EntertainmentCategory =
  | 'الكل'
  | 'مقاطع مضحكة'
  | 'مواهب'
  | 'تحديات'
  | 'سفر ومغامرات'
  | 'رياضة'
  | 'طبخ'
  | 'اجتماعي وترفيهي'
  | 'صناع محتوى';

export interface SearchAIAnalysis {
  userIntent: string;
  extractedService: string;
  extractedCategory: string;
  extractedLocation: string;
  intentType: 'all' | 'content' | 'ad' | 'market_item' | 'company' | 'store' | 'service_provider' | 'creator' | 'service' | 'entertainment';
  explanation: string;
  disambiguationSuggestions?: string[];
  matchedAdIds?: { id: string; score: number; reason: string }[];
}

export interface UnifiedSearchResultItem {
  id: string;
  type: 'service' | 'market_item' | 'store_product' | 'page' | 'content' | 'ad';
  typeLabel: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  distanceKm?: number;
  rating?: number;
  reviewCount?: number;
  isAvailableNow?: boolean;
  price?: string | number;
  currency?: string;
  city?: string;
  district?: string;
  phone?: string;
  whatsapp?: string;
  pageId?: string;
  matchReason?: string;
  matchScore?: number;
  actionType?: 'call_whatsapp' | 'view_page' | 'view_market' | 'play_content' | 'view_ad';
  rawItem?: any;
}

export interface SearchResultResponse {
  query: string;
  analysis?: SearchAIAnalysis;
  rankedItems?: UnifiedSearchResultItem[];
  matchedContent?: ContentPost[];
  matchedMarket?: MarketItem[];
  matchedAds?: Ad[];
  matchedPages?: AccountPage[];
  matchedServices?: ServiceProvider[];
  totalResults: number;
  sponsoredCount: number;
}

// Blink - Jordan 4 Main Tabs
export type BlinkMainTab = 'pro' | 'market' | 'order' | 'verified';

// Buyer Request ("بدي أشتري" - Core Logic)
export interface BuyerSearchRequest {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerWhatsapp: string;
  productKeyword: string; // e.g., "غسالة", "سيارة", "بلايستيشن", "ثلاجة"
  rawQuery: string; // e.g. "بدي غسالة إل جي حوضين نظيفة بسعر معقول"
  category: string;
  maxBudget?: number; // In JOD
  currency: string;
  city: string; // Amman, Irbid, Zarqa, Madaba, Salt, etc.
  district: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  createdAt: string;
  status: 'active' | 'matched' | 'fulfilled';
  isVerifiedWithId: boolean;
  nationalIdMasked?: string;
}

// Verified Jordan User with National ID ("موثوق")
export interface VerifiedJordanUser {
  id: string;
  name: string;
  role: 'professional' | 'merchant' | 'buyer' | 'individual';
  professionOrBusiness: string;
  nationalIdMasked: string; // e.g. 998201****
  nationalIdPhoto?: string;
  idCardIssuedCity: string;
  verificationDate: string;
  trustScore: number; // e.g. 98%
  avatar: string;
  phone: string;
  whatsapp: string;
  city: string;
  district: string;
  experienceYears?: number;
  completedTransactions: number;
  rating: number;
  reviewCount: number;
  bio: string;
  badges: string[];
}

// AI Order & Need Request ("طلب")
export interface SmartNeedOrder {
  id: string;
  userQuery: string;
  intentCategory: string; // سباكة، كهرباء، نقل عفش، صيانة سيارات، بيع/شراء
  urgencyLevel: 'emergency' | 'urgent' | 'standard'; // طوارئ قصوى، عاجل، عادي
  detectedLocation: string;
  aiExplanation: string;
  estimatedCostRangeJOD: { min: number; max: number };
  matchedProviderIds: string[];
  status: 'open' | 'assigned' | 'completed';
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  itemId?: string;
  itemType: 'ad' | 'market_item' | 'service';
  itemTitle: string;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  currency: string;
  status: 'pending_deposit' | 'deposit_paid' | 'fully_paid' | 'cancelled' | 'refunded';
  invoiceNumber: string;
  buyerPhone: string;
  sellerPhone: string;
  refundConditions: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationRole = 'creator' | 'service' | 'company' | 'store' | 'restaurant' | 'shipping' | 'factory';

export type StoreCategoryType = 'cars' | 'real_estate' | 'clothes' | 'restaurants' | 'smart_market' | 'shipping' | 'factories';

export interface ProfileTag {
  id: string;
  label: string; // e.g. "@مركز فحص كارتك"
  category: 'inspection' | 'tuning' | 'accessories' | 'upholstery' | 'construction' | 'kitchen' | 'furniture' | 'general';
  phone?: string;
  location?: string;
}

// Store Entity (e.g. Car showroom, Real estate office, Boutique, Restaurant, Factory)
export interface BlinkStore {
  id: string;
  name: string;
  category: 'cars' | 'real_estate' | 'clothes' | 'restaurants' | 'factories';
  logo: string;
  coverImage?: string;
  bio: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  rating: number;
  reviewCount: number;
  itemsCount: number;
  phone: string;
  whatsapp: string;
  isVerified: boolean;
  tags?: string[];
  createdAt: string;
}

// Universal Item for Cars, Real Estate, Clothes, Restaurants, Smart Market, Factories
export interface BlinkProductItem {
  id: string;
  storeId?: string;
  storeName?: string;
  category: 'cars' | 'real_estate' | 'clothes' | 'restaurants' | 'smart_market' | 'factories';
  title: string;
  description: string;
  priceJOD: number;
  image: string;
  galleryImages?: string[];
  condition?: 'جديد' | 'مستعمل';
  city: string;
  district: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  likesCount: number;
  sharesCount: number;
  whatsapp: string;
  tags?: string[]; // e.g. ["@مركز فحص كارتك", "@تعديل ستيج 2"]
  // Clothes specific:
  sizes?: string[]; // ['S', 'M', 'L', 'XL']
  colors?: string[]; // ['أسود', 'كحلي', 'أبيض']
  // Cars specific:
  carYear?: number;
  carMileage?: string;
  carMake?: string;
  // Real estate specific:
  propertyType?: 'شقة للايجار' | 'شقة للبيع' | 'فيلا' | 'أرض' | 'مكتب';
  propertyAreaSqm?: number;
  // Smart market specific (7 strict categories):
  smartCategory?:
    | 'أجهزة كهربائية'
    | 'عفش جديد ومستعمل'
    | 'حيوانات'
    | 'مستلزمات حيوانات'
    | 'عدد صناعية وزراعية'
    | 'أدوات بيت'
    | 'بيع جملة وبضاعة';
  createdAt: string;
}

// Cart Item for Grouped Pooling Cart
export interface CartItem {
  id: string;
  productId: string;
  title: string;
  storeId: string;
  storeName: string;
  priceJOD: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  deliveryOption: 'grouped' | 'solo';
  deliveryFeeJOD: number; // 1 JOD grouped vs 5 JOD solo
  customerCity?: string;
}

// Grouped Delivery Pool (e.g. مادبا - عمان 7/10)
export interface GroupedDeliveryPool {
  id: string;
  fromCity: string;
  toCity: string;
  currentCount: number;
  targetCount: number;
  pricePerItemJOD: number;
  soloPriceJOD: number;
  status: 'collecting' | 'ready' | 'shipped';
  orders: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    storeName: string;
    productTitle: string;
    priceJOD: number;
    destinationCity: string;
    time: string;
  }[];
  assignedCourierName?: string;
  assignedCourierPhone?: string;
  updatedAt: string;
}

// Solo Delivery Order
export interface SoloDeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  fromCity: string;
  toCity: string;
  storeName: string;
  itemsSummary: string;
  itemPriceJOD: number;
  deliveryFeeJOD: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered';
  assignedCourierName?: string;
  assignedCourierPhone?: string;
  createdAt: string;
}

// Registered Shipping Company
export interface ShippingCompanyProfile {
  id: string;
  name: string;
  logo?: string;
  coveredGovernorates: string[];
  pooledRateJOD: number;
  soloRateJOD: number;
  phone: string;
  whatsapp: string;
  rating: number;
  completedDeliveries: number;
  isVerified: boolean;
  totalEarningsJOD: number;
}

export interface ProfileStory {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  createdAt: string;
}

export interface ProfileMediaItem {
  id: string;
  title: string;
  mediaUrl: string;
  posterUrl?: string;
  type: 'video' | 'image';
  priceJOD?: number;
  location?: string;
  likesCount: number;
  sharesCount: number;
  savesCount: number;
  tags?: ProfileTag[];
  whatsappNumber?: string;
}

export interface BlinkEntityProfile {
  id: string;
  role: RegistrationRole;
  name: string;
  handle?: string;
  titleOrProfession: string; // e.g. "سباك وموسرجي", "صانع محتوى وثائقي", "معرض سيارات", "مطعم شاورما"
  avatar: string;
  coverImage?: string;
  bio: string;
  city: string;
  district: string;
  phone: string;
  whatsapp: string;
  isVerified: boolean;
  nationalIdMasked?: string;
  experienceYears?: number;
  rating: number;
  reviewCount: number;
  totalLikes: number;
  totalViews: number;
  totalGifts: number;
  stories: ProfileStory[];
  videos: ProfileMediaItem[];
  photos: ProfileMediaItem[];
  // For Store / Cars / Real estate:
  storeSubcategory?: 'cars' | 'real_estate' | 'general';
  featuredPriceJOD?: number;
  storeTags?: ProfileTag[];
  // For Restaurant:
  menuItems?: {
    id: string;
    name: string;
    priceJOD: number;
    image: string;
    description: string;
  }[];
  createdAt: string;
}


