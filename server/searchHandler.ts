import { GoogleGenAI } from '@google/genai';
import { Ad, SearchAIAnalysis, SearchResultResponse, UserLocation } from '../src/types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2?: number,
  lon2?: number
): number {
  if (!lat2 || !lon2) return 5.0; // default estimated distance
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

// Fallback rule-based analysis if Gemini API is unavailable or key is missing
export function localAnalyzeQuery(
  query: string,
  userLocation: UserLocation,
  ads: Ad[]
): SearchResultResponse {
  const q = query.trim().toLowerCase();
  
  // Basic keyword associations in Arabic
  let extractedService = 'خدمات عامة';
  let extractedCategory = 'عام';
  let extractedLocation = userLocation.district || userLocation.city;

  if (q.includes('أسنان') || q.includes('دكتور') || q.includes('طبيب') || q.includes('عيادة') || q.includes('طب')) {
    extractedService = 'أطباء ورعاية صحية وعيادات';
    extractedCategory = 'أطباء';
  } else if (q.includes('شاورما') || q.includes('مطعم') || q.includes('محل') || q.includes('متجر') || q.includes('أكل') || q.includes('طعام') || q.includes('وجبة') || q.includes('هواتف')) {
    extractedService = 'محلات ومتاجر ومطاعم';
    extractedCategory = 'محلات';
  } else if (q.includes('شركة') || q.includes('نقل') || q.includes('عفش') || q.includes('أثاث') || q.includes('شحن') || q.includes('مؤسسة')) {
    extractedService = 'شركات ومؤسسات ونقل وشحن';
    extractedCategory = 'شركات';
  } else if (q.includes('تكييف') || q.includes('مكيف') || q.includes('صيانة') || q.includes('سبليت') || q.includes('فني') || q.includes('خدمة') || q.includes('حرفي')) {
    extractedService = 'مقدمو خدمات وفنيون وصيانة';
    extractedCategory = 'مقدمو خدمات';
  } else if (q.includes('سيارة') || q.includes('سيارات') || q.includes('بيع') || q.includes('كامري') || q.includes('منتج') || q.includes('سلعة') || q.includes('ايفون') || q.includes('آيفون')) {
    extractedService = 'منتجات وسيارات وأجهزة للبيع';
    extractedCategory = 'منتجات';
  } else if (q.includes('موقع') || q.includes('منصة') || q.includes('أونلاين') || q.includes('متجر إلكتروني') || q.includes('تطبيق') || q.includes('ويب')) {
    extractedService = 'مواقع إلكترونية ومنصات رقمية';
    extractedCategory = 'مواقع';
  }

  const scoredAds = ads.map((ad) => {
    let score = 20; // baseline
    const targetText = `${ad.businessName} ${ad.serviceOrProduct} ${ad.description} ${ad.category}`.toLowerCase();
    
    // Check keywords
    const keywords = q
      .replace(/بدي|محتاج|عاوز|ابغى|اريد|في|من|على|عن|قريب|مني|منطقتي/g, ' ')
      .split(/\s+/)
      .filter((k) => k.length > 2);

    let matchedKeywords = 0;
    for (const kw of keywords) {
      if (targetText.includes(kw)) {
        matchedKeywords++;
        score += 35;
      }
    }

    // Category match
    if (ad.category === extractedCategory) {
      score += 30;
    }

    // Proximity calculation
    const distanceKm = calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      ad.locationLat,
      ad.locationLng
    );

    // Location boost if same city or district
    if (q.includes(ad.district.toLowerCase()) || q.includes(ad.city.toLowerCase())) {
      score += 25;
    } else if (ad.district === userLocation.district) {
      score += 15;
    }

    // Cap score at 99
    score = Math.min(score, 99);

    let matchReason = `مطابق لبحث "${extractedService}"`;
    if (distanceKm <= 3.0) {
      matchReason += ` وقريب من منطقتك (${distanceKm} كم)`;
    }
    if (ad.isSponsored) {
      matchReason += ' • إعلان ممول معتمد';
    }

    return {
      ...ad,
      distanceKm,
      matchScore: score,
      matchReason,
    };
  });

  // Sort according to criteria:
  // 1. Match score (مدى تطابق الإعلان)
  // 2. Proximity / distance (الموقع والقرب)
  // 3. Sponsored ads priority (الإعلانات الممولة تظهر في أماكن بارزة)
  const sorted = scoredAds
    .filter((a) => (a.matchScore || 0) >= 30) // Only relevant ads
    .sort((a, b) => {
      // Prioritize sponsored ads if match score is reasonably high
      const aSponsored = a.isSponsored ? 15 : 0;
      const bSponsored = b.isSponsored ? 15 : 0;
      
      const aDistanceScore = Math.max(0, 30 - (a.distanceKm || 10) * 2);
      const bDistanceScore = Math.max(0, 30 - (b.distanceKm || 10) * 2);

      const aTotal = (a.matchScore || 0) + aSponsored + aDistanceScore;
      const bTotal = (b.matchScore || 0) + bSponsored + bDistanceScore;

      return bTotal - aTotal;
    });

  const finalResults = sorted.length > 0 ? sorted : ads.map(a => ({
    ...a,
    distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, a.locationLat, a.locationLng),
    matchScore: 35,
    matchReason: 'اقتراح بديل ذو تقييم عالٍ',
  }));

  const analysis: SearchAIAnalysis = {
    userIntent: `طلب المستخدم: ${query}`,
    extractedService,
    extractedCategory,
    extractedLocation,
    intentType: 'ad',
    explanation: `تم فهم طلبك بدقة: تبحث عن (${extractedService}) ${q.includes('قريب') || q.includes('منطقت') ? 'بالقرب من موقعك في ' + userLocation.displayName : ''}. قمنا بفرز النتائج وترتيب الإعلانات الأكثر تطابقاً وقرباً مع إبراز الإعلانات الممولة المعتمدة.`,
    matchedAdIds: finalResults.map((ad) => ({
      id: ad.id,
      score: ad.matchScore || 50,
      reason: ad.matchReason || '',
    })),
  };

  return {
    query,
    analysis,
    matchedAds: finalResults,
    totalResults: finalResults.length,
    sponsoredCount: finalResults.filter((r) => r.isSponsored).length,
  };
}

// Server-side Gemini AI search handler
export async function handleGeminiSearch(
  query: string,
  userLocation: UserLocation,
  ads: Ad[]
): Promise<SearchResultResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // If no real API key is configured yet, use our intelligent local Arabic analyzer
    return localAnalyzeQuery(query, userLocation, ads);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const adsSummary = ads.map((ad) => ({
      id: ad.id,
      businessName: ad.businessName,
      category: ad.category,
      serviceOrProduct: ad.serviceOrProduct,
      description: ad.description,
      city: ad.city,
      district: ad.district,
      isSponsored: ad.isSponsored,
      lat: ad.locationLat,
      lng: ad.locationLng,
    }));

    const prompt = `
أنت محرك بحث ذكي وخبير في تصنيف وتحليل الإعلانات والخدمات التجارية المحلية باللغة العربية.
مهمتك تحليل طلب المستخدم المكتوب باللغة الطبيعية أو اللهجات العربية الشائعة وفهم احتياجه بدقة، ثم تقييم وتصنيف الإعلانات المتاحة ومطابقتها.

معلومات المستخدم الحالية:
- موقع المستخدم الحالي: ${userLocation.city} - ${userLocation.district}
- الإحداثيات التقريبية: lat=${userLocation.lat}, lng=${userLocation.lng}

طلب المستخدم:
"${query}"

قائمة الإعلانات المتوفرة في النظام:
${JSON.stringify(adsSummary, null, 2)}

المطلوب:
1. استخراج الخدمة أو المنتج المطلوب (extractedService)
2. استخراج التصنيف الرئيسي (extractedCategory)
3. استخراج متطلبات الموقع أو القرب (extractedLocation)
4. كتابة شرح ذكي ومرحب بالعربية (explanation) يوضح للمستخدم ما تم فهمه وكيف رتبت الإعلانات له.
5. تقييم كل إعلان بـ (matchScore من 0 إلى 100) حسب مدى تطابق نوع النشاط والخدمة مع نية المستخدم.
6. كتابة سبب المطابقة لكل إعلان (matchReason).

يجب أن ترجع النتيجة بصيغة JSON فقط بالتنسيق التالي:
{
  "extractedService": "string",
  "extractedCategory": "string",
  "extractedLocation": "string",
  "explanation": "string",
  "matches": [
    {
      "id": "ad-id",
      "matchScore": 95,
      "matchReason": "عيادة أسنان متكاملة قريبة من موقعك تقدم تبييض وزراعة"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const rawText = response.text || '';
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // If parsing fails, fall back to local analyzer
      return localAnalyzeQuery(query, userLocation, ads);
    }

    const matchesMap = new Map<string, { score: number; reason: string }>();
    if (Array.isArray(parsed.matches)) {
      for (const m of parsed.matches) {
        if (m && m.id) {
          matchesMap.set(m.id, {
            score: typeof m.matchScore === 'number' ? m.matchScore : 50,
            reason: m.matchReason || '',
          });
        }
      }
    }

    // Attach distances and scores to all ads
    const processedAds: Ad[] = ads.map((ad) => {
      const match = matchesMap.get(ad.id);
      const matchScore = match ? match.score : 10;
      const distanceKm = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        ad.locationLat,
        ad.locationLng
      );
      const matchReason = match?.reason || (ad.category === parsed.extractedCategory ? 'إعلان في نفس التصنيف' : 'إعلان متوفر');

      return {
        ...ad,
        matchScore,
        distanceKm,
        matchReason,
      };
    });

    // Rank according to the rules:
    // 1. مدى تطابق الإعلان مع طلب المستخدم (High matchScore >= 40)
    // 2. الموقع والقرب (Distance penalty/bonus)
    // 3. الإعلانات الممولة (Sponsored ads receive prominent placement)
    const rankedAds = processedAds
      .filter((ad) => (ad.matchScore || 0) >= 30) // filter out irrelevant
      .sort((a, b) => {
        // Calculate composite ranking
        const aScore = a.matchScore || 0;
        const bScore = b.matchScore || 0;

        // Proximity score (closer gets higher points)
        const aDistanceBonus = Math.max(0, 25 - (a.distanceKm || 10) * 2);
        const bDistanceBonus = Math.max(0, 25 - (b.distanceKm || 10) * 2);

        // Sponsored bonus (15 points boost to highlight them)
        const aSponsoredBonus = a.isSponsored ? 15 : 0;
        const bSponsoredBonus = b.isSponsored ? 15 : 0;

        const aTotal = aScore + aDistanceBonus + aSponsoredBonus;
        const bTotal = bScore + bDistanceBonus + bSponsoredBonus;

        return bTotal - aTotal;
      });

    const finalAds = rankedAds.length > 0 ? rankedAds : processedAds.slice(0, 4);

    const analysis: SearchAIAnalysis = {
      userIntent: query,
      extractedService: parsed.extractedService || 'خدمة أو منتج',
      extractedCategory: parsed.extractedCategory || 'عام',
      extractedLocation: parsed.extractedLocation || userLocation.district,
      intentType: 'ad',
      explanation: parsed.explanation || `تم تحليل طلبك بواسطة ذكاء Gemini وعرض أفضل الإعلانات المطابقة لـ "${query}".`,
      matchedAdIds: finalAds.map((a) => ({
        id: a.id,
        score: a.matchScore || 50,
        reason: a.matchReason || '',
      })),
    };

    return {
      query,
      analysis,
      matchedAds: finalAds,
      totalResults: finalAds.length,
      sponsoredCount: finalAds.filter((a) => a.isSponsored).length,
    };
  } catch (error) {
    console.error('Gemini Search error, using fallback:', error);
    return localAnalyzeQuery(query, userLocation, ads);
  }
}
