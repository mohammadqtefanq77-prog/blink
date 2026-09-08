import {
  Ad,
  AccountPage,
  ContentPost,
  MarketItem,
  PaymentTransaction,
  UserProfile,
  ServiceProvider,
  ServiceRequest,
} from '../src/types';
import { INITIAL_ADS } from '../src/data/initialAds';
import {
  CURRENT_USER,
  INITIAL_CONTENT_POSTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_PAGES,
} from '../src/data/initialData';
import {
  INITIAL_SERVICE_PROVIDERS,
  INITIAL_SERVICE_REQUESTS,
} from '../src/data/initialServices';
import { INITIAL_ENTERTAINMENT_POSTS } from '../src/data/initialEntertainment';

let adsDatabase: Ad[] = [...INITIAL_ADS];
let contentDatabase: ContentPost[] = [...INITIAL_CONTENT_POSTS, ...INITIAL_ENTERTAINMENT_POSTS];
let marketDatabase: MarketItem[] = [...INITIAL_MARKET_ITEMS];
let pagesDatabase: AccountPage[] = [...INITIAL_PAGES];
let userProfile: UserProfile = { ...CURRENT_USER };
let transactionsDatabase: PaymentTransaction[] = [];
let serviceProvidersDatabase: ServiceProvider[] = [...INITIAL_SERVICE_PROVIDERS];
let serviceRequestsDatabase: ServiceRequest[] = [...INITIAL_SERVICE_REQUESTS];

// Service Providers & Requests
export function getAllServiceProviders(): ServiceProvider[] {
  return [...serviceProvidersDatabase];
}

export function saveServiceProvider(provider: ServiceProvider): ServiceProvider {
  serviceProvidersDatabase = [provider, ...serviceProvidersDatabase];
  return provider;
}

export function getAllServiceRequests(): ServiceRequest[] {
  return [...serviceRequestsDatabase];
}

export function saveServiceRequest(req: ServiceRequest): ServiceRequest {
  serviceRequestsDatabase = [req, ...serviceRequestsDatabase];
  return req;
}

export function addServiceProviderReview(
  providerId: string,
  review: { reviewerName: string; rating: number; comment: string }
): ServiceProvider | undefined {
  const prov = serviceProvidersDatabase.find((p) => p.id === providerId);
  if (prov) {
    if (!prov.reviews) prov.reviews = [];
    prov.reviews.unshift({
      id: `rev-${Date.now()}`,
      reviewerName: review.reviewerName,
      reviewerRole: 'عميل',
      rating: review.rating,
      comment: review.comment,
      date: 'الآن',
    });
    prov.reviewCount += 1;
    // recalculate average rating
    const total = prov.reviews.reduce((acc, r) => acc + r.rating, 0);
    prov.rating = Math.round((total / prov.reviews.length) * 10) / 10;
  }
  return prov;
}

// Ads
export function getAllAds(): Ad[] {
  return [...adsDatabase];
}

export function saveAd(newAd: Ad): Ad {
  adsDatabase = [newAd, ...adsDatabase];
  return newAd;
}

// Content
export function getAllContent(): ContentPost[] {
  return [...contentDatabase];
}

export function saveContent(post: ContentPost): ContentPost {
  contentDatabase = [post, ...contentDatabase];
  return post;
}

export function updateContentLikes(id: string, delta: number): ContentPost | undefined {
  const item = contentDatabase.find(c => c.id === id);
  if (item) {
    item.likes = Math.max(0, item.likes + delta);
  }
  return item;
}

export function addContentComment(id: string, comment: { userName: string; avatar: string; text: string; time: string }): ContentPost | undefined {
  const item = contentDatabase.find(c => c.id === id);
  if (item) {
    if (!item.comments) item.comments = [];
    item.comments.unshift({ id: `c-${Date.now()}`, ...comment });
    item.commentsCount += 1;
  }
  return item;
}

export function sendContentGift(postId: string, giftCoins: number, giftIcon: string, giftName: string): { success: boolean; newBalance?: number } {
  const item = contentDatabase.find(c => c.id === postId);
  if (!item) return { success: false };
  item.giftsReceivedCount += 1;

  // Add to creator wallet
  const creatorPage = pagesDatabase.find(p => p.id === item.creatorPageId);
  if (creatorPage && creatorPage.wallet) {
    const cashValue = giftCoins * 0.1; // 10 coins = 1 JOD
    creatorPage.wallet.balance += cashValue;
    creatorPage.wallet.totalEarnings += cashValue;
    creatorPage.wallet.giftsReceivedCount += 1;
    return { success: true, newBalance: creatorPage.wallet.balance };
  }
  return { success: true };
}

// Market
export function getAllMarketItems(): MarketItem[] {
  return [...marketDatabase];
}

export function saveMarketItem(item: MarketItem): MarketItem {
  marketDatabase = [item, ...marketDatabase];
  return item;
}

// Pages
export function getAllPages(): AccountPage[] {
  return [...pagesDatabase];
}

export function getPageById(id: string): AccountPage | undefined {
  return pagesDatabase.find(p => p.id === id);
}

export function savePage(page: AccountPage): AccountPage {
  pagesDatabase = [page, ...pagesDatabase];
  return page;
}

export function addPageItem(
  pageId: string,
  item: {
    type: 'product' | 'meal' | 'offer' | 'discount' | 'service';
    name: string;
    price: string;
    desc: string;
    image?: string;
    discount?: string;
  }
): AccountPage | undefined {
  const page = pagesDatabase.find((p) => p.id === pageId);
  if (page) {
    if (item.type === 'offer' || item.type === 'discount') {
      if (!page.offers) page.offers = [];
      page.offers.unshift({
        id: `off-${Date.now()}`,
        title: item.name,
        discount: item.discount || item.price || 'عرض مميز',
        expiresAt: '2026-12-31',
      });
    } else if (item.type === 'service') {
      if (!page.services) page.services = [];
      page.services.unshift({
        id: `srv-${Date.now()}`,
        name: item.name,
        price: item.price,
        desc: item.desc,
      });
    } else {
      if (!page.products) page.products = [];
      page.products.unshift({
        id: `prd-${Date.now()}`,
        name: item.name,
        price: item.price,
        desc: item.desc,
        image:
          item.image ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      });
    }
  }
  return page;
}

// User Profile
export function getUserProfile(): UserProfile {
  return { ...userProfile };
}

// Payment & Deposit Architecture (Foundational)
export function getTransactions(): PaymentTransaction[] {
  return [...transactionsDatabase];
}

export function createPaymentDeposit(tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): PaymentTransaction {
  const fullTx: PaymentTransaction = {
    ...tx,
    id: `tx-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  transactionsDatabase.push(fullTx);
  return fullTx;
}
