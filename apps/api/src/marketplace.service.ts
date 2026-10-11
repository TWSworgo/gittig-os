export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'TEMPLATE' | 'AI_AGENT' | 'API';
  priceBdt: number;
  seller: string;
  rating: number;
  description: string;
}

export interface PurchaseReceipt {
  transactionId: string;
  itemTitle: string;
  priceBdt: number;
  platformCommissionBdt: number;
  sellerEarningsBdt: number;
  licenseKey: string;
  purchasedAt: string;
}

const ITEMS: MarketplaceItem[] = [
  {
    id: 'prod_1',
    title: 'SaaS Next.js AI Starter',
    category: 'TEMPLATE',
    priceBdt: 1500,
    seller: 'TwSworgo',
    rating: 4.9,
    description: 'Production-ready fullstack Next.js boilerplate with auth and Stripe.'
  },
  {
    id: 'prod_2',
    title: 'Automated Code Review AI Agent',
    category: 'AI_AGENT',
    priceBdt: 2500,
    seller: 'ai_architect',
    rating: 5.0,
    description: 'Autonomous AI agent that reviews pull requests and checks security flaws.'
  },
  {
    id: 'prod_3',
    title: 'Bangla NLP Grammar API',
    category: 'API',
    priceBdt: 500,
    seller: 'nlp_lab',
    rating: 4.8,
    description: 'High-speed REST API for Bengali grammar checking and spell correction.'
  }
];

export function getMarketplaceCatalog(): MarketplaceItem[] {
  return ITEMS;
}

export function processPurchase(itemId: string): PurchaseReceipt {
  const item = ITEMS.find(i => i.id === itemId) || ITEMS[0];
  const commission = Math.round(item.priceBdt * 0.10); // ১০% প্ল্যাটফর্ম কমিশন
  const sellerEarnings = item.priceBdt - commission;    // ৯০% সেলার আয়

  const randomHex = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  const licenseKey = `GITTIG-LIC-${randomHex()}-${randomHex()}-${randomHex()}`;

  return {
    transactionId: 'txn_' + Date.now().toString(36),
    itemTitle: item.title,
    priceBdt: item.priceBdt,
    platformCommissionBdt: commission,
    sellerEarningsBdt: sellerEarnings,
    licenseKey,
    purchasedAt: new Date().toLocaleTimeString()
  };
}
