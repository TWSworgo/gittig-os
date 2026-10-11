'use client';

import React, { useState } from 'react';
import { Rocket, CheckCircle2, ArrowLeft, Heart } from 'lucide-react';

export default function LivePreviewApp() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex flex-col items-center justify-center p-4 font-sans select-none">
      <div className="max-w-sm w-full bg-[#161b22] border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <Rocket className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[11px] bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono">
            🟢 LIVE ON GITTIG EDGE
          </span>
          <h1 className="text-xl font-bold mt-2">my-gittig-core-app</h1>
          <p className="text-xs text-[#8b949e] mt-1">
            Congratulations! Your web application has been successfully deployed and launched via GittiG OS.
          </p>
        </div>

        {/* ইন্টারঅ্যাক্টিভ লাইভ টেস্ট বাটন */}
        <div className="p-3 bg-[#0d1117] rounded-xl border border-[#30363d] space-y-2">
          <span className="text-xs text-[#8b949e] block">Live Application Interactive Test:</span>
          <button
            onClick={() => setLikes(l => l + 1)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Click to Test: {likes} Likes</span>
          </button>
        </div>

        <div className="text-[11px] text-[#8b949e] pt-2 border-t border-[#30363d] flex items-center justify-between">
          <span>SSL: TLS 1.3 Active</span>
          <span>Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
}
