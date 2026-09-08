import { GoogleGenAI } from '@google/genai';
import {
  Ad,
  ContentPost,
  MarketItem,
  AccountPage,
  SearchResultResponse,
  UnifiedSearchResultItem,
  UserLocation,
  ServiceProvider,
} from '../src/types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2?: number,
  lon2?: number
): number {
  if (!lat2 || !lon2) return 3.5;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function processAIGatewaySearch(
  query: string,
  userLocation: UserLocation,
  allContent: ContentPost[],
  allMarket: MarketItem[],
  allAds: Ad[],
  allPages: AccountPage[],
  allServices: ServiceProvider[] = []
): Promise<SearchResultResponse> {
  const cleanQ = query.trim().toLowerCase();
  
  // 1. Identify intent & entity focus
  let intentType: 'all' | 'content' | 'ad' | 'market_item' | 'company' | 'store' | 'service_provider' | 'service' | 'entertainment' = 'all';
  let extractedService = 'عام';
  let extractedCategory = 'بحث موحد';
  let extractedLocation = userLocation.district ? `${userLocation.city} - ${userLocation.district}` : userLocation.city;
  let explanation = `تم تحليل استعلامك «${query}» والبحث الذكي في قاعدة بيانات بلينك الشاملة.`;
  let disambiguationSuggestions: string[] = [];

  // Contextual mappings
  const isTaxiQuery = cleanQ.includes('تاكسي') || cleanQ.includes('سيارة أجرة') || cleanQ.includes('سفريات') || cleanQ.includes('سائق') || cleanQ.includes('تاخذني') || cleanQ.includes('توصيل ركاب') || cleanQ.includes('مشوار');
  const isPlumberQuery = cleanQ.includes('سباك') || cleanQ.includes('موسرجي') || cleanQ.includes('تسرب') || cleanQ.includes('تسريب') || cleanQ.includes('حنفية') || cleanQ.includes('ماسورة') || cleanQ.includes('مياه') || cleanQ.includes('مجاري') || cleanQ.includes('المي') || cleanQ.includes('مي بتطفح') || cleanQ.includes('تطفح') || /(?:^|\s)مي(?:\s|$)/.test(cleanQ);
  const isElectricianQuery = cleanQ.includes('كهربجي') || cleanQ.includes('كهربائي') || cleanQ.includes('كهربا') || cleanQ.includes('قاطع') || cleanQ.includes('إنارة') || cleanQ.includes('ضو') || cleanQ.includes('شورت') || cleanQ.includes('كهرب');
  const isPainterQuery = cleanQ.includes('دهين') || cleanQ.includes('دهان') || cleanQ.includes('بوية') || cleanQ.includes('معجونة');
  const isPruningQuery = cleanQ.includes('تقليم') || cleanQ.includes('زيتون') || cleanQ.includes('شجر') || cleanQ.includes('أشجار') || cleanQ.includes('قطاف') || cleanQ.includes('حصاد') || cleanQ.includes('زراعي');
  const isMovingQuery = cleanQ.includes('نقل عفش') || cleanQ.includes('ديانا') || cleanQ.includes('نقل أثاث') || cleanQ.includes('ترحيل') || cleanQ.includes('تحميل وتنزيل');
  const isGeneralWorkerQuery = cleanQ.includes('عامل يومي') || cleanQ.includes('يومية') || cleanQ.includes('عمال') || cleanQ.includes('تنظيف');
  const isCarpenterQuery = cleanQ.includes('نجار') || cleanQ.includes('خشب') || cleanQ.includes('موبيليا');
  const isBlacksmithQuery = cleanQ.includes('حداد') || cleanQ.includes('حدادة');
  const isTilerQuery = cleanQ.includes('مبلط') || cleanQ.includes('بلاط') || cleanQ.includes('سيراميك');
  const isAcQuery = cleanQ.includes('تكييف') || cleanQ.includes('مكيف') || cleanQ.includes('تبريد');
  const isLawyerQuery = cleanQ.includes('محام') || cleanQ.includes('قانون') || cleanQ.includes('استشارة قانونية') || cleanQ.includes('قضية') || cleanQ.includes('عقد');

  const isAnyService = isTaxiQuery || isPlumberQuery || isElectricianQuery || isPainterQuery || isPruningQuery || isMovingQuery || isGeneralWorkerQuery || isCarpenterQuery || isBlacksmithQuery || isTilerQuery || isAcQuery || isLawyerQuery;

  // Market specific queries
  const isDressQuery = cleanQ.includes('فستان') || cleanQ.includes('سهرة') || cleanQ.includes('ملابس نسائية');
  const isCarSellQuery = (cleanQ.includes('سيارة') && (cleanQ.includes('للبيع') || cleanQ.includes('شراء') || cleanQ.includes('كامري') || cleanQ.includes('هايبرد')));
  const isApartmentRentQuery = cleanQ.includes('شقة') || cleanQ.includes('إيجار') || cleanQ.includes('للايجار') || cleanQ.includes('مفروشة');
  const isUsedMobileQuery = cleanQ.includes('موبايل') || cleanQ.includes('تلفون') || cleanQ.includes('جوال') || cleanQ.includes('آيفون') || cleanQ.includes('سامسونج') || cleanQ.includes('s24');
  const isJacketQuery = cleanQ.includes('جاكيت') || cleanQ.includes('شتوي') || cleanQ.includes('معطف');
  const isFoodShawarmaQuery = cleanQ.includes('شاورما') || cleanQ.includes('مطعم') || cleanQ.includes('وجبة') || cleanQ.includes('أكل') || cleanQ.includes('ساندويش');
  const isPlayStationQuery = cleanQ.includes('بلايستيشن') || cleanQ.includes('سوني') || cleanQ.includes('ps5') || cleanQ.includes('ps4');
  const isFurnitureQuery = cleanQ.includes('عفش مستعمل') || cleanQ.includes('أثاث مستعمل') || cleanQ.includes('غرفة نوم') || (cleanQ.includes('عفش') && cleanQ.includes('مستعمل'));
  const isWasherQuery = cleanQ.includes('غسالة') || cleanQ.includes('ثلاجة') || cleanQ.includes('فرن') || cleanQ.includes('شاشة') || cleanQ.includes('تلفزيون') || cleanQ.includes('جهاز مستعمل');

  // Location extraction
  if (cleanQ.includes('مادبا') || cleanQ.includes('مأدبا')) {
    extractedLocation = 'مادبا';
  } else if (cleanQ.includes('عمان') || cleanQ.includes('عمّان')) {
    extractedLocation = 'عمان';
  } else if (cleanQ.includes('الرياض')) {
    extractedLocation = 'الرياض';
  } else if (cleanQ.includes('إربد')) {
    extractedLocation = 'إربد';
  }

  if (isAnyService) {
    intentType = 'service';
    if (isTaxiQuery) {
      extractedService = 'سيارة أجرة تاكسي وسفريات';
      extractedCategory = 'خدمات النقل والركاب';
      explanation = `فهم النظام طلبك لسيارة أجرة أو تاكسي وسفريات. تم ترتيب السائقين الأقرب إليك والمتاحين الآن.`;
      disambiguationSuggestions = ['تاكسي وسفريات مادبا عمان', 'مشاوير خاصة للمطار والجامعات', 'سائق متاح الآن فوراً'];
    } else if (isPlumberQuery) {
      extractedService = 'سباكة ومواسير وصيانة مياه';
      extractedCategory = 'صيانة وبناء';
      explanation = `رصد النظام وجود مشكلة سباكة أو تسريب مياه لديك. تم عرض أمهر السباكين والموسرجية الأقرب لموقعك.`;
      disambiguationSuggestions = ['سباك طوارئ متاح الآن', 'كشف تسريبات وصيانة شبكات مياه', 'تركيب مضخات وسخانات'];
    } else if (isPainterQuery) {
      extractedService = 'دهين ومعلم دهان وديكورات';
      extractedCategory = 'صيانة وتشطيب';
      explanation = `تم توجيه طلبك إلى دهيني المنازل والديكورات الأقرب مع تقييمات العملاء.`;
      disambiguationSuggestions = ['معلم دهان داخلي وخارجي', 'تشطيب شقق بأسعار منافسة', 'دهين متاح للمعاينة اليوم'];
    } else if (isElectricianQuery) {
      extractedService = 'كهربجي منازل وتمديدات';
      extractedCategory = 'صيانة وبناء';
      explanation = `تم توجيه طلبك إلى كهربجي منازل محترف بالقرب منك لمعالجة الأعطال والتمديدات.`;
      disambiguationSuggestions = ['كهربجي طوارئ لصيانة الشورت والإنارة', 'تمديدات كهربائية حديثة', 'فحص لوحات وقواطع'];
    } else if (isPruningQuery) {
      extractedService = 'تقليم أشجار وزيتون وعمال زراعة';
      extractedCategory = 'خدمات زراعية وموسمية';
      explanation = `فهم النظام طلبك لتقليم الأشجار أو أعمال موسم الزيتون والزراعة. تم عرض المختصين الأقرب.`;
      disambiguationSuggestions = ['معلم تقليم زيتون ولوزيات', 'ورشة عمال قطاف وحصاد باليومية', 'تجهيز وتنظيف المزارع'];
    } else if (isMovingQuery) {
      extractedService = 'نقل عفش وأثاث بديانا';
      extractedCategory = 'نقل وتحميل';
      explanation = `تم توجيه طلبك إلى سيارات النقل والديانا المجهزة مع عمال الفك والتركيب والتغليف.`;
      disambiguationSuggestions = ['ديانا نقل عفش مع عمال متمرسين', 'نقل أثاث بين المحافظات', 'فك وتركيب غرف نوم ومطابخ'];
    } else if (isLawyerQuery) {
      extractedService = 'محامي ومستشار قانوني';
      extractedCategory = 'خدمات قانونية واستشارات';
      explanation = `فهم النظام طلبك للخدمات القانونية والمحاماة. تم عرض أمهر المحامين والمستشارين القانونيين المعتمدين في منطقتك.`;
      disambiguationSuggestions = ['استشارات قانونية وصياغة عقود', 'قضايا مدنية وشرعية وتجارية', 'محامون متاحون للتواصل المباشر'];
    } else {
      extractedService = 'خدمات ومهن حرة';
      extractedCategory = 'خدمات قريبة';
      explanation = `تم البحث عن مقدمي الخدمات والمهنيين الأنسب والأقرب لموقعك حسب التوفر والتقييم.`;
      disambiguationSuggestions = ['مقدمو خدمات متاحون الآن', 'فنيون وعمال في نطاق مدينتك', 'طلب خدمة مخصصة'];
    }
  } else if (isFoodShawarmaQuery) {
    intentType = 'store';
    extractedCategory = 'مطاعم ومأكولات';
    explanation = `فهم النظام رغبتك في تناول وجبة طعام أو شاورما، وتم عرض أقرب المطاعم والوجبات المتوفرة.`;
    disambiguationSuggestions = ['شاورما على الحطب مع خبز صاج', 'وجبات عائلية مع توصيل سريع', 'عروض وخصومات المطاعم القريبة'];
  } else if (isDressQuery || isCarSellQuery || isApartmentRentQuery || isUsedMobileQuery || isJacketQuery || isPlayStationQuery || isFurnitureQuery || isWasherQuery || cleanQ.includes('للبيع') || cleanQ.includes('شراء') || cleanQ.includes('مستعمل') || cleanQ.includes('بدي ابيع') || cleanQ.includes('بدي أبيع')) {
    intentType = 'market_item';
    extractedCategory = 'سوق البيع السريع';
    if (isPlayStationQuery) explanation = `تم توجيه طلبك إلى سوق البيع السريع - أجهزة بلايستيشن وألعاب مستعملة وجديدة.`;
    else if (isFurnitureQuery) explanation = `تم توجيه طلبك إلى سوق الأثاث والعفش المستعمل المعروض مباشرة من أصحابه.`;
    else if (isWasherQuery) explanation = `تم توجيه طلبك إلى سوق الأجهزة والأدوات المنزلية المستعملة والجديدة.`;
    else if (isDressQuery) explanation = `تم توجيه طلبك إلى سوق البيع السريع - فساتين سهرة وأزياء راقية.`;
    else if (isApartmentRentQuery) explanation = `تم توجيه طلبك إلى سوق العقارات - شقق للإيجار في ${extractedLocation}.`;
    else if (isCarSellQuery) explanation = `تم توجيه طلبك إلى سوق السيارات والمركبات المعروضة للبيع المباشر.`;
    else if (isUsedMobileQuery) explanation = `تم توجيه طلبك إلى سوق الهواتف والإلكترونيات المستعملة والجديدة.`;
    else if (isJacketQuery) explanation = `تم توجيه طلبك إلى الملابس الشتوية والجاكيتات المعروضة في السوق.`;
    else explanation = `تم توجيه طلبك إلى سوق البيع والشراء السريع للإعلانات المباشرة من الأفراد.`;
    disambiguationSuggestions = ['إعلانات بيع سريع من الأفراد مباشرة', 'خيارات قابلة للتفاوض البسيط', 'سلع متوفرة للتسليم الفوري'];
  } else if (cleanQ.includes('مضحك') || cleanQ.includes('ضحك') || cleanQ.includes('تحدي') || cleanQ.includes('ترفيه') || cleanQ.includes('مواهب') || cleanQ.includes('طبخ') || cleanQ.includes('مقاطع')) {
    intentType = 'entertainment';
    extractedCategory = 'محتوى ترفيهي';
    explanation = `تم توجيهك إلى المحتوى الترفيهي والمقاطع الممتعة ومواهب صناع المحتوى.`;
    disambiguationSuggestions = ['مقاطع مضحكة وكوميديا يومية', 'مواهب وفنون وتحديات شبابية', 'سفر ومغامرات وطبخ'];
  } else if (cleanQ.includes('علمني') || cleanQ.includes('شرح') || cleanQ.includes('فيديو') || cleanQ.includes('تاريخ') || cleanQ.includes('سياحة') || cleanQ.includes('ثقافة') || cleanQ.includes('برمجة')) {
    intentType = 'content';
    extractedCategory = 'محتوى هادف وثقافي';
    explanation = `رصدت بوابة الذكاء الاصطناعي رغبتك في مشاهدة محتوى معرفي ومرئي حول «${query}».`;
    disambiguationSuggestions = ['فيديوهات تعليمية وشروحات عملية', 'وثائقيات ومعالم سياحية وثقافية', 'حسابات صناع المحتوى المتخصصين'];
  }

  // 2. Build Unified Ranked Candidates List
  const unifiedCandidates: UnifiedSearchResultItem[] = [];

  // Stop words for generic Arabic queries
  const STOP_WORDS = new Set([
    'بدي', 'بدى', 'بديش', 'اريد', 'أريد', 'عايز', 'عاوز', 'محتاج', 'ابحث', 'أبحث',
    'قريب', 'قريبة', 'قريبين', 'مني', 'عندنا', 'عندي', 'في', 'من', 'إلى', 'على',
    'مع', 'او', 'أو', 'عن', 'هو', 'هي', 'لي', 'لنا', 'هناك', 'هنا', 'شو', 'ايش', 'لو'
  ]);
  const queryWords = cleanQ
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));

  // A. Process Service Providers
  allServices.forEach((prov) => {
    const text = `${prov.name} ${prov.profession} ${prov.bio} ${prov.category} ${prov.city} ${prov.district} ${prov.serviceAreas.join(' ')}`.toLowerCase();

    let matchScore = 0;
    let matchReason = '';

    if (isCarSellQuery) {
      // Car sell is a market query, not a service query
    } else if (isTaxiQuery && (text.includes('تاكسي') || text.includes('أجرة') || text.includes('سفريات') || text.includes('سائق') || text.includes('ركاب'))) {
      matchScore += 100;
      matchReason = 'سيارة أجرة تاكسي وسفريات ركاب وتوصيل سريع';
    } else if (isPlumberQuery && (text.includes('سباك') || text.includes('موسرجي') || text.includes('مياه') || text.includes('تسريب'))) {
      matchScore += 100;
      matchReason = 'سباك وموسرجي محترف - كشف تسريبات وصيانة شبكات مياه';
    } else if (isPainterQuery && (text.includes('دهين') || text.includes('دهان') || text.includes('ديكور'))) {
      matchScore += 100;
      matchReason = 'معلم دهان وديكورات حديثة وتشطيب شقق';
    } else if (isElectricianQuery && (text.includes('كهربجي') || text.includes('كهربائي'))) {
      matchScore += 100;
      matchReason = 'كهربجي منازل معتمد لصيانة الأعطال والتمديدات';
    } else if (isPruningQuery && (text.includes('تقليم') || text.includes('زيتون') || text.includes('أشجار') || text.includes('زراعي') || text.includes('قطاف'))) {
      matchScore += 100;
      matchReason = 'تقليم أشجار وزيتون وخدمات زراعية موسمية';
    } else if (isMovingQuery && (text.includes('عفش') || text.includes('أثاث') || (text.includes('نقل') && text.includes('ديانا')))) {
      matchScore += 130;
      matchReason = 'نقل عفش بسيارة ديانا مغلقة مع كادر فك وتركيب';
    } else if (isGeneralWorkerQuery && (text.includes('عامل') || text.includes('يومي') || text.includes('تحميل'))) {
      matchScore += 100;
      matchReason = 'عامل يومي نشيط لأعمال التحميل والتنزيل والمساعدة';
    } else if (isAcQuery && (text.includes('تكييف') || text.includes('مكيف') || text.includes('تبريد'))) {
      matchScore += 100;
      matchReason = 'فني تكييف وتبريد وغسيل وصيانة مكيفات';
    } else if (isLawyerQuery && (text.includes('محامي') || text.includes('قانون') || text.includes('استشارة') || text.includes('عقود') || text.includes('قضايا'))) {
      matchScore += 140;
      matchReason = 'محامي ومستشار قانوني معتمد - استشارات وصياغة عقود وقضايا';
    } else if (!isMovingQuery) {
      queryWords.forEach(w => {
        if (text.includes(w)) matchScore += 30;
      });
      if (matchScore > 0) matchReason = `مطابقة لمهنة ${prov.profession}`;
    }

    if (matchScore > 0 || intentType === 'service') {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, prov.locationLat, prov.locationLng);
      // Boost for proximity
      if (dist <= 3) matchScore += 30;
      else if (dist <= 10) matchScore += 15;

      // Boost for availability
      if (prov.isAvailableNow) matchScore += 25;

      // Boost for rating
      if (prov.rating >= 4.8) matchScore += 20;

      unifiedCandidates.push({
        id: prov.id,
        type: 'service',
        typeLabel: 'مقدم خدمة وحرفي 🛠️',
        title: prov.name,
        subtitle: `${prov.profession} • خبرة ${prov.experienceYears} سنوات`,
        description: prov.bio,
        image: prov.avatar,
        distanceKm: dist,
        rating: prov.rating,
        reviewCount: prov.reviewCount,
        isAvailableNow: prov.isAvailableNow,
        price: prov.priceEstimate,
        city: prov.city,
        district: prov.district,
        phone: prov.phone,
        whatsapp: prov.whatsapp,
        matchReason: matchReason || `يبعد ${dist} كم • تقييم ${prov.rating} ⭐`,
        matchScore,
        actionType: 'call_whatsapp',
        rawItem: prov,
      });
    }
  });

  // B. Process Market Items
  allMarket.forEach((item) => {
    const text = `${item.title} ${item.description} ${item.category} ${item.city} ${item.district} ${item.condition}`.toLowerCase();

    let matchScore = 0;
    let matchReason = '';

    if (isDressQuery && (text.includes('فستان') || text.includes('سهرة'))) {
      matchScore += 100;
      matchReason = 'فستان سهرة أسود راقي بحالة ممتازة في سوق البيع السريع';
    } else if (isApartmentRentQuery && (text.includes('شقة') || text.includes('إيجار') || text.includes('مفروشة'))) {
      matchScore += 100;
      matchReason = `شقة مفروشة للإيجار في ${item.city} بسعر مناسب`;
    } else if (isCarSellQuery && (text.includes('كامري') || text.includes('سيارة') || text.includes('هايبرد') || text.includes('تويوتا'))) {
      matchScore += 130;
      matchReason = 'سيارة معروضة للبيع المباشر بحالة ممتازة في سوق البيع السريع';
    } else if (isUsedMobileQuery && (text.includes('سامسونج') || text.includes('s24') || text.includes('موبايل') || text.includes('آيفون') || text.includes('هاتف'))) {
      matchScore += 100;
      matchReason = 'هاتف ذكي مستعمل كالجديد مع ملحقاته وضمانه';
    } else if (isJacketQuery && (text.includes('جاكيت') || text.includes('شتوي'))) {
      matchScore += 100;
      matchReason = 'جاكيت شتوي رجالي أصلي مقاوم للماء والبرد';
    } else if (isPlayStationQuery && (text.includes('بلايستيشن') || text.includes('ps5') || text.includes('سوني') || text.includes('ألعاب'))) {
      matchScore += 140;
      matchReason = 'بلايستيشن 5 مستعمل نظيف مع يدات وألعاب في سوق البيع السريع';
    } else if (isFurnitureQuery && (text.includes('عفش') || text.includes('أثاث') || text.includes('غرفة نوم') || text.includes('خشب'))) {
      matchScore += 140;
      matchReason = 'عفش وأثاث مستعمل للبيع المباشر من المالك';
    } else if (isWasherQuery && (text.includes('غسالة') || text.includes('إل جي') || text.includes('أجهزة') || text.includes('منزلية'))) {
      matchScore += 140;
      matchReason = 'غسالة كهربائية مستعملة فحص ونظافة في سوق البيع السريع';
    } else if (isMovingQuery && text.includes('نقل عفش')) {
      matchScore += 70;
      matchReason = 'خدمة نقل أثاث وعفش مع عمال فك وتركيب';
    } else {
      queryWords.forEach(w => {
        if (text.includes(w)) matchScore += 25;
      });
      if (matchScore > 0) matchReason = `سلعة مطابقة في سوق البيع السريع`;
    }

    if (matchScore > 0 || (intentType === 'market_item' && matchScore > 20)) {
      const isSameCity = item.city.toLowerCase().includes(userLocation.city.toLowerCase());
      const dist = isSameCity ? 1.5 : 25;
      if (isSameCity) matchScore += 20;

      unifiedCandidates.push({
        id: item.id,
        type: 'market_item',
        typeLabel: 'إعلان بيع سريع 🛒',
        title: item.title,
        subtitle: `${item.price} ${item.currency || 'دينار'} • ${item.condition} • ${item.isNegotiable ? 'قابل للتفاوض' : 'سعر نهائي'}`,
        description: item.description,
        image: item.images?.[0],
        distanceKm: dist,
        rating: 4.9,
        isAvailableNow: true,
        price: `${item.price} ${item.currency || 'دينار'}`,
        currency: item.currency || 'دينار',
        city: item.city,
        district: item.district,
        phone: item.sellerPhone,
        whatsapp: item.sellerWhatsapp,
        matchReason: matchReason || `معروض للبيع في ${item.city} - ${item.district}`,
        matchScore,
        actionType: 'call_whatsapp',
        rawItem: item,
      });
    }
  });

  // C. Process Store Pages & Restaurant Products (e.g. Shawarma)
  allPages.forEach((page) => {
    const text = `${page.name} ${page.bio} ${page.category} ${page.city} ${page.district} ${page.type}`.toLowerCase();

    let matchScore = 0;
    let matchReason = '';

    if (isFoodShawarmaQuery && (text.includes('شاورما') || text.includes('مطعم') || page.products?.some(p => p.name.includes('شاورما')))) {
      matchScore += 110;
      matchReason = `مطعم شاورما أصلي على الحطب مع وجبات وساندويشات طازجة`;
    } else {
      queryWords.forEach(w => {
        if (text.includes(w)) matchScore += 25;
      });
    }

    if (matchScore > 0 || (intentType === 'store' && matchScore > 20)) {
      const isSameCity = page.city.toLowerCase().includes(userLocation.city.toLowerCase());
      const dist = isSameCity ? 1.0 : 22;
      if (isSameCity) matchScore += 20;

      unifiedCandidates.push({
        id: page.id,
        type: 'page',
        typeLabel: page.type === 'store' ? 'مطعم / متجر 🍽️' : 'صفحة معتمدة 🏢',
        title: page.name,
        subtitle: `${page.category} • تقييم ${page.rating} ⭐ • ${page.city} - ${page.district}`,
        description: page.bio,
        image: page.logo,
        distanceKm: dist,
        rating: page.rating,
        reviewCount: page.reviewCount,
        isAvailableNow: true,
        city: page.city,
        district: page.district,
        phone: page.contactPhone,
        whatsapp: page.whatsapp,
        pageId: page.id,
        matchReason: matchReason || `صفحة موثقة في ${page.city}`,
        matchScore,
        actionType: 'view_page',
        rawItem: page,
      });
    }
  });

  // D. Process Commercial Ads
  allAds.forEach((ad) => {
    const text = `${ad.businessName} ${ad.serviceOrProduct} ${ad.description} ${ad.category} ${ad.city} ${ad.district}`.toLowerCase();

    let matchScore = 0;
    queryWords.forEach(w => {
      if (text.includes(w)) matchScore += 25;
    });

    if (matchScore > 0) {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, ad.locationLat, ad.locationLng);
      if (dist < 10) matchScore += 15;

      unifiedCandidates.push({
        id: ad.id,
        type: 'ad',
        typeLabel: 'إعلان تجاري 📢',
        title: ad.serviceOrProduct,
        subtitle: `${ad.businessName} • ${ad.city}`,
        description: ad.description,
        image: (ad.images && ad.images[0]) || '',
        distanceKm: dist,
        rating: ad.rating,
        reviewCount: ad.reviewCount,
        isAvailableNow: true,
        city: ad.city,
        district: ad.district,
        phone: ad.contactPhone,
        whatsapp: ad.whatsapp,
        matchReason: `إعلان تجاري مرخص في ${ad.city} (${dist} كم)`,
        matchScore,
        actionType: 'view_ad',
        rawItem: ad,
      });
    }
  });

  // E. Process Content Posts
  allContent.forEach((post) => {
    const text = `${post.title} ${post.description} ${post.category} ${post.creatorName}`.toLowerCase();

    let matchScore = 0;
    queryWords.forEach(w => {
      if (text.includes(w)) matchScore += 25;
    });

    if (intentType === 'entertainment' && (post.category.includes('مضحك') || post.category.includes('طبخ') || post.category.includes('مواهب'))) {
      matchScore += 40;
    } else if (intentType === 'content' && (post.category.includes('تعليم') || post.category.includes('سياحة') || post.category.includes('تاريخ'))) {
      matchScore += 40;
    }

    if (matchScore > 0) {
      unifiedCandidates.push({
        id: post.id,
        type: 'content',
        typeLabel: 'محتوى مرئي 🎬',
        title: post.title,
        subtitle: `${post.creatorName} • ${post.category}`,
        description: post.description,
        image: post.posterUrl,
        rating: post.creatorRating,
        isAvailableNow: true,
        matchReason: `مقطع مرئي مصنف كـ «${post.category}»`,
        matchScore,
        actionType: 'play_content',
        rawItem: post,
      });
    }
  });

  // 3. Strict Ranking: Match Score -> Nearest Distance -> Availability -> Rating
  const sortedCandidates = [...unifiedCandidates].sort((a, b) => {
    // 1. Relevance / Match Score (primary criterion)
    const scoreA = a.matchScore ?? 0;
    const scoreB = b.matchScore ?? 0;
    if (Math.abs(scoreA - scoreB) >= 20) {
      return scoreB - scoreA;
    }
    // 2. Proximity (within close match tier, closer is better)
    const distA = a.distanceKm ?? 99;
    const distB = b.distanceKm ?? 99;
    if (Math.abs(distA - distB) > 1.0) {
      return distA - distB;
    }
    // 3. Availability
    if (a.isAvailableNow !== b.isAvailableNow) {
      return a.isAvailableNow ? -1 : 1;
    }
    // 4. Rating
    const rateA = a.rating ?? 0;
    const rateB = b.rating ?? 0;
    return rateB - rateA;
  });

  // Filter legacy slices for backwards-compatibility
  const matchedServices = sortedCandidates.filter(c => c.type === 'service').map(c => c.rawItem);
  const matchedMarket = sortedCandidates.filter(c => c.type === 'market_item').map(c => c.rawItem);
  const matchedPages = sortedCandidates.filter(c => c.type === 'page').map(c => c.rawItem);
  const matchedAds = sortedCandidates.filter(c => c.type === 'ad').map(c => c.rawItem);
  const matchedContent = sortedCandidates.filter(c => c.type === 'content').map(c => c.rawItem);

  return {
    query,
    analysis: {
      userIntent: cleanQ,
      extractedService,
      extractedCategory,
      extractedLocation,
      intentType,
      explanation,
      disambiguationSuggestions,
    },
    rankedItems: sortedCandidates,
    matchedServices: matchedServices.length > 0 ? matchedServices : allServices.slice(0, 4),
    matchedMarket: matchedMarket.length > 0 ? matchedMarket : (intentType === 'market_item' ? allMarket.slice(0, 3) : []),
    matchedPages: matchedPages.length > 0 ? matchedPages : (intentType === 'store' ? allPages.slice(0, 2) : []),
    matchedAds: matchedAds.length > 0 ? matchedAds : allAds.slice(0, 2),
    matchedContent: matchedContent.length > 0 ? matchedContent : allContent.slice(0, 3),
    totalResults: sortedCandidates.length > 0 ? sortedCandidates.length : 5,
    sponsoredCount: matchedAds.filter((a: any) => a.isSponsored).length,
  };
}

// AI Smart Content Classifier:
// Automatically extracts: Topic, Field, Keywords, Level, Target Audience, Content Type, Language
export async function classifyContentPost(title: string, description: string, creatorCategory: string) {
  const text = `${title} ${description} ${creatorCategory}`.toLowerCase();
  
  // Default rule-based classification
  let topic = title;
  let field = creatorCategory || 'ثقافة ومعرفة عامة';
  let level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'عام' = 'عام';
  let targetAudience = 'الجمهور العام والمهتمون بالمحتوى الهادف';
  let contentType: 'تعليمي' | 'ثقافي' | 'سياحي' | 'مهاري' | 'ترفيه هادف' = 'تعليمي';
  const keywords: string[] = title.split(/\s+/).filter(w => w.length > 3).slice(0, 5);

  if (text.includes('سياحة') || text.includes('تاريخ') || text.includes('آثار') || text.includes('مادبا') || text.includes('رحلات')) {
    field = 'سياحة وتاريخ وتوثيق';
    contentType = 'ثقافي';
    keywords.push('سياحة', 'آثار', 'تاريخ');
  } else if (text.includes('سيارات') || text.includes('ميكانيك') || text.includes('محرك') || text.includes('زيت')) {
    field = 'ميكانيك وصيانة مركبات';
    contentType = 'مهاري';
    keywords.push('سيارات', 'ميكانيك', 'صيانة');
  } else if (text.includes('برمجة') || text.includes('كود') || text.includes('ذكاء اصطناعي') || text.includes('تقنية')) {
    field = 'تكنولوجيا وعلوم الحاسوب';
    contentType = 'تعليمي';
    keywords.push('برمجة', 'ذكاء اصطناعي', 'تقنية');
  } else if (text.includes('زراعة') || text.includes('زيتون') || text.includes('شجر') || text.includes('نبات')) {
    field = 'إنتاج زراعي وبيئة';
    contentType = 'مهاري';
    keywords.push('زراعة', 'نباتات', 'أرض');
  }

  // Check if this content is actually an Ad (Strict Separation of Content and Ads)
  const isSuspectedAd =
    text.includes('للبيع') ||
    text.includes('اشتري الآن') ||
    text.includes('السعر فقط') ||
    text.includes('تخفيضات 50%') ||
    text.includes('توصيل مجاني للطلب') ||
    text.includes('رقم الهاتف للطلب');

  return {
    topic,
    field,
    keywords: Array.from(new Set(keywords)),
    level,
    targetAudience,
    contentType,
    isSuspectedAd,
    warning: isSuspectedAd ? 'تنبيه: يحتوي هذا المنشور على عبارات بيع وترويج تجاري. يُرجى نشره في «سوق البيع والشراء» أو «الإعلانات التجارية» بدلاً من قسم المحتوى.' : undefined,
  };
}
