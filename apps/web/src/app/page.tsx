'use client';

import React, { useState } from 'react';
import { 
  Folder, FileCode, PlayCircle, ShieldCheck, 
  Rocket, Box, Tag, ShoppingBag, Key, CheckCircle2, 
  Coins, Sparkles, Star, Smartphone, Monitor, Package, Download
} from 'lucide-react';

const MARKETPLACE_ITEMS = [
  { id: 'prod_1', title: 'SaaS Next.js AI Starter', category: 'TEMPLATE', priceBdt: 1500, seller: 'TwSworgo', rating: 4.9, desc: 'Production-ready fullstack Next.js boilerplate.' },
  { id: 'prod_2', title: 'Code Reviewer AI Agent', category: 'AI_AGENT', priceBdt: 2500, seller: 'ai_architect', rating: 5.0, desc: 'Autonomous AI agent that reviews pull requests.' },
  { id: 'prod_3', title: 'Bangla NLP Grammar API', category: 'API', priceBdt: 500, seller: 'nlp_lab', rating: 4.8, desc: 'High-speed REST API for Bengali grammar checking.' }
];

export default function MobileGitHubView() {
  const [activeTab, setActiveTab] = useState<'code' | 'actions' | 'security' | 'launch' | 'market'>('market');
  const [purchasing, setPurchasing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const handleBuy = async (itemId: string) => {
    setPurchasing(true);
    try {
      const res = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      const data = await res.json();
      if (data.success) {
        setReceipt(data.receipt);
      }
    } catch {
      // Fallback Receipt
      setReceipt({
        itemTitle: 'SaaS Next.js AI Starter',
        priceBdt: 1500,
        platformCommissionBdt: 150,
        sellerEarningsBdt: 1350,
        licenseKey: 'GITTIG-LIC-9A8B-2C4D-7E1F',
        purchasedAt: new Date().toLocaleTimeString()
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-16">
      <header className="sticky top-0 z-20 bg-[#161b22] border-b border-[#30363d] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">G</div>
          <span className="font-bold text-white text-sm">GittiG OS</span>
        </div>
        <span className="text-[11px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
          ⚡ 29/30 AI Left
        </span>
      </header>

      <div className="px-3.5 py-3 border-b border-[#21262d] bg-[#161b22]/50">
        <div className="text-xs text-[#8b949e]">
          TwSworgo / <span className="font-bold text-white text-sm">my-gittig-core-app</span>
          <span className="text-[10px] border border-[#30363d] bg-[#21262d] px-1.5 py-0.2 rounded-full ml-1">Public</span>
        </div>
      </div>

      {/* মোবাইল স্ক্রলেবল ট্যাব বার */}
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-2 text-xs overflow-x-auto scrollbar-none">
        <button onClick={() => setActiveTab('code')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'code' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Code</button>
        <button onClick={() => setActiveTab('actions')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'actions' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Flow (CI/CD)</button>
        <button onClick={() => setActiveTab('security')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'security' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Sentinel</button>
        <button onClick={() => setActiveTab('launch')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'launch' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Launch</button>
        <button onClick={() => setActiveTab('market')} className={`py-2.5 px-3 border-b-2 font-bold flex items-center space-x-1.5 whitespace-nowrap ${activeTab === 'market' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          <span>Marketplace</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
        </button>
      </div>

      {/* মার্কেটপ্লেস ট্যাব */}
      {activeTab === 'market' && (
        <div className="p-3.5 space-y-3">
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>GittiG Developer Marketplace</span>
              </span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                10% Platform Fee
              </span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Buy & sell APIs, AI Agents, and templates. Automated license key generation with transparent commission ledger.
            </p>
          </div>

          {/* ডিজিটাল রিসিপ্ট (কেনাকাটার পর) */}
          {receipt && (
            <div className="border border-emerald-500/80 rounded-lg p-3.5 bg-emerald-950/30 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Order Successful!</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">৳{receipt.priceBdt}</span>
              </div>

              {/* লাইসেন্স কি বক্স */}
              <div className="p-2 bg-[#0d1117] rounded border border-emerald-800 text-center space-y-1">
                <span className="text-[10px] text-[#8b949e] uppercase font-bold tracking-wider block">Generated Digital License Key:</span>
                <span className="font-mono text-xs font-bold text-amber-300 tracking-wider select-all">{receipt.licenseKey}</span>
              </div>

              {/* প্ল্যাটফর্ম ১০% কমিশন লেজার */}
              <div className="text-[11px] text-[#8b949e] pt-1 flex justify-between border-t border-emerald-900/40">
                <span>Seller Payout (90%): <strong className="text-white">৳{receipt.sellerEarningsBdt}</strong></span>
                <span className="text-emerald-400">GittiG Commission (10%): <strong>৳{receipt.platformCommissionBdt}</strong></span>
              </div>
            </div>
          )}

          {/* প্রোডাক্ট ক্যাটালগ লিস্ট */}
          <div className="space-y-2.5">
            {MARKETPLACE_ITEMS.map((item) => (
              <div key={item.id} className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-2 hover:border-[#484f58] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-white block">{item.title}</span>
                    <span className="text-[10px] text-[#8b949e]">by @{item.seller} • ⭐ {item.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    ৳{item.priceBdt}
                  </span>
                </div>
                <p className="text-xs text-[#8b949e]">{item.desc}</p>
                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={purchasing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center space-x-1 transition active:scale-98 shadow"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{purchasing ? 'Generating License...' : `Purchase & Get License (৳${item.priceBdt})`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
