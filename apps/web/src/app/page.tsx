'use client';

import React, { useState } from 'react';
import { 
  Folder, FileCode, PlayCircle, ShieldCheck, 
  Globe2, ExternalLink, Rocket, Tag, Box, Check,
  Smartphone, Monitor, Package, Download, Terminal, CheckCircle2
} from 'lucide-react';

export default function MobileGitHubView() {
  const [activeTab, setActiveTab] = useState<'code' | 'actions' | 'security' | 'launch'>('launch');
  const [deploying, setDeploying] = useState(false);
  const [deployment, setDeployment] = useState<any>(null);

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeployment({
        previewUrl: '/preview',
        region: 'Edge Sandbox (SSL Active)',
        time: new Date().toLocaleTimeString()
      });
      setDeploying(false);
    }, 1200);
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

      {/* মোবাইল ট্যাব বার */}
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-2 text-xs overflow-x-auto scrollbar-none">
        <button onClick={() => setActiveTab('code')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'code' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Code</button>
        <button onClick={() => setActiveTab('actions')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'actions' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Flow (CI/CD)</button>
        <button onClick={() => setActiveTab('security')} className={`py-2.5 px-3 border-b-2 font-bold whitespace-nowrap ${activeTab === 'security' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>Sentinel</button>
        <button onClick={() => setActiveTab('launch')} className={`py-2.5 px-3 border-b-2 font-bold flex items-center space-x-1.5 whitespace-nowrap ${activeTab === 'launch' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}>
          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          <span>Launch & Registry</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* ৮. Launch & Registry ট্যাব */}
      {activeTab === 'launch' && (
        <div className="p-3.5 space-y-3">
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>GittiG Launch: Live Web Hosting</span>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Auto-HTTPS</span>
            </div>

            <p className="text-xs text-[#8b949e]">
              Deploy and provision instant sandbox previews for this repository with 1-click.
            </p>

            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded text-xs flex items-center justify-center space-x-1.5 transition active:scale-98 shadow"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{deploying ? 'Provisioning Edge Sandbox...' : 'Deploy Live Preview URL'}</span>
            </button>

            {deployment && (
              <div className="p-2.5 rounded bg-[#0d1117] border border-emerald-500/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Deployment Active</span>
                  </span>
                  <span className="text-[10px] text-[#8b949e]">{deployment.region}</span>
                </div>
                <div className="flex items-center justify-between bg-[#161b22] p-2 rounded border border-[#30363d]">
                  <span className="text-[11px] text-sky-400 font-mono truncate">{deployment.previewUrl}</span>
                  <a href={deployment.previewUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center space-x-0.5 text-xs ml-2 font-bold">
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* প্যাকেজ ও রিলিজ রেজিস্ট্রি */}
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-2.5 shadow-md">
            <div className="flex items-center justify-between border-b border-[#21262d] pb-2">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Box className="w-4 h-4 text-sky-400" />
                <span>GittiG Registry: Official Releases</span>
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-800">v1.0.0</span>
            </div>
            <div className="p-2 rounded bg-[#0d1117] border border-[#21262d] text-xs space-y-1">
              <div className="flex justify-between items-center font-bold text-white">
                <span className="flex items-center space-x-1 text-emerald-400"><Tag className="w-3 h-3" /> <span>v1.0.0-release</span></span>
                <span className="text-[10px] text-[#8b949e]">142 Downloads</span>
              </div>
              <p className="text-[11px] text-[#8b949e]">Initial Production release generated via GittiG Flow.</p>
              <div className="pt-1.5 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded text-sky-300">📦 APK (Android)</span>
                <span className="text-[10px] bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded text-sky-300">💻 EXE (Windows)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
