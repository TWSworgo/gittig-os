'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  GitBranch, 
  Folder, 
  FileCode, 
  AlertCircle, 
  GitPullRequest, 
  PlayCircle, 
  ShieldCheck, 
  Star, 
  GitFork, 
  Zap, 
  Code2, 
  ChevronRight, 
  Bot, 
  Save, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const REPO_FILES = [
  { name: 'apps', type: 'dir', commit: 'feat: setup core & api gateway', time: '10m ago' },
  { name: 'packages', type: 'dir', commit: 'feat: add ai engine & vector memory', time: '15m ago' },
  { name: 'docker-compose.yml', type: 'file', commit: 'feat: add gitea, postgres & qdrant', time: '20m ago' },
  { name: '.gitignore', type: 'file', commit: 'chore: exclude heavy binaries', time: '2m ago' },
  { name: 'README.md', type: 'file', commit: 'docs: initialize gittig blueprint', time: '1h ago' }
];

export default function MobileGitHubView() {
  const [activeTab, setActiveTab] = useState<'code' | 'issues' | 'prs' | 'actions' | 'security'>('code');
  const [studioOpen, setStudioOpen] = useState(false);
  const [editorCode, setEditorCode] = useState(`// GittiG OS - Mobile Studio Workspace\nexport function welcomeDeveloper() {\n  return "Build Beyond Code with GittiG OS!";\n}\n`);
  const [prompt, setPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleAskAi = async () => {
    if (!prompt.trim()) return;
    setLoadingAi(true);
    try {
      const res = await fetch('http://localhost:4000/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'dev_sworgo', prompt })
      });
      const data = await res.json();
      setAiResult(data.aiResult?.content || 'AI response received.');
    } catch {
      setAiResult(`[GittiG AI]: Generated mobile-optimized code snippet for "${prompt}"!`);
    } finally {
      setLoadingAi(false);
    }
  };

  // যদি ইউজার "Open Studio (IDE)" চাপ দেয়
  if (studioOpen) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-[#c9d1d9] font-mono">
        {/* স্টুডিও মোবাইল টপবার */}
        <div className="h-12 border-b border-[#30363d] px-3 bg-[#161b22] flex items-center justify-between">
          <button 
            onClick={() => setStudioOpen(false)}
            className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-[#21262d] px-2.5 py-1 rounded border border-[#30363d]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Repo</span>
          </button>
          <span className="text-xs font-bold text-white">GittiG Web Studio</span>
          <button 
            onClick={() => { setStatusMsg('Saved!'); setTimeout(() => setStatusMsg(''), 2000); }}
            className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded flex items-center space-x-1 font-semibold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{statusMsg || 'Save'}</span>
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="60%"
            theme="vs-dark"
            defaultLanguage="typescript"
            value={editorCode}
            onChange={(val) => setEditorCode(val || '')}
            options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on' }}
          />
          {/* মোবাইল AI চ্যাট সেকশন */}
          <div className="h-[40%] border-t border-[#30363d] bg-[#161b22] p-2 flex flex-col">
            <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>GittiG AI Copilot (RAG Memory Active)</span>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#0d1117] rounded p-2 text-xs border border-[#30363d] text-[#8b949e]">
              {aiResult || 'Ask AI to generate functions, explain code, or fix errors.'}
            </div>
            <div className="flex space-x-1 mt-1.5">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI Copilot..."
                className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleAskAi}
                disabled={loadingAi}
                className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{loadingAi ? '...' : 'Ask'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // আসল মোবাইল GitHub রিপোজিটরি ভিউ
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-16">
      {/* ১. মোবাইল অ্যাপ হেডার */}
      <header className="sticky top-0 z-20 bg-[#161b22] border-b border-[#30363d] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
            G
          </div>
          <span className="font-bold text-white text-sm tracking-wide">GittiG OS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>29/30 AI Left</span>
          </span>
        </div>
      </header>

      {/* ২. রিপোজিটরি টাইটেল কার্ড */}
      <div className="px-3.5 py-3 border-b border-[#21262d] bg-[#161b22]/50">
        <div className="flex items-center space-x-1.5 text-xs text-[#8b949e]">
          <span>TwSworgo</span>
          <span>/</span>
          <span className="font-bold text-white text-sm">my-gittig-core-app</span>
          <span className="text-[10px] border border-[#30363d] bg-[#21262d] px-1.5 py-0.2 rounded-full ml-1">
            Public
          </span>
        </div>
        <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
          The next-generation AI-native software creation ecosystem built with GittiG OS Core.
        </p>

        {/* স্টার ও ফর্ক স্ট্যাটস */}
        <div className="flex items-center space-x-4 mt-2.5 text-xs text-[#8b949e]">
          <span className="flex items-center space-x-1"><Star className="w-3.5 h-3.5 text-amber-400" /> <span className="text-white font-semibold">1</span> star</span>
          <span className="flex items-center space-x-1"><GitFork className="w-3.5 h-3.5" /> <span className="text-white font-semibold">0</span> forks</span>
          <span className="flex items-center space-x-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-emerald-400">Sentinel OK</span></span>
        </div>
      </div>

      {/* ৩. মোবাইল স্ক্রলেবল ট্যাব বার (গিটহাব স্টাইল) */}
      <div className="flex overflow-x-auto border-b border-[#30363d] bg-[#161b22] px-2 text-xs scrollbar-none">
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'code' ? 'border-emerald-500 text-white font-bold' : 'border-transparent text-[#8b949e]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>
        <button 
          onClick={() => setActiveTab('prs')}
          className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'prs' ? 'border-emerald-500 text-white font-bold' : 'border-transparent text-[#8b949e]'
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Pull requests</span>
          <span className="bg-[#30363d] text-[10px] px-1.5 rounded-full">0</span>
        </button>
        <button 
          onClick={() => setActiveTab('issues')}
          className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'issues' ? 'border-emerald-500 text-white font-bold' : 'border-transparent text-[#8b949e]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Issues</span>
          <span className="bg-[#30363d] text-[10px] px-1.5 rounded-full">0</span>
        </button>
        <button 
          onClick={() => setActiveTab('actions')}
          className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 whitespace-nowrap transition ${
            activeTab === 'actions' ? 'border-emerald-500 text-white font-bold' : 'border-transparent text-[#8b949e]'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Flow (CI/CD)</span>
        </button>
      </div>

      {/* ৪. ব্রাঞ্চ সিলেক্টর ও "Open in Studio" অ্যাকশন বার */}
      <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-[#21262d]">
        <button className="flex items-center space-x-1.5 bg-[#21262d] border border-[#30363d] px-2.5 py-1 rounded text-xs text-white font-semibold">
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
          <span>main</span>
        </button>

        {/* স্টুডিও খোলার আসল বাটন */}
        <button 
          onClick={() => setStudioOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded shadow flex items-center space-x-1.5 transition active:scale-95"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Open in Studio (IDE)</span>
        </button>
      </div>

      {/* ৫. মোবাইল ফাইল লিস্ট (Touch-Friendly List) */}
      <div className="px-3.5 py-2">
        <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#161b22]">
          <div className="px-3 py-2 bg-[#21262d]/60 border-b border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
            <span className="font-semibold text-white">TwSworgo</span>
            <span>feat: complete step 5</span>
          </div>

          <div className="divide-y divide-[#21262d]">
            {REPO_FILES.map((file) => (
              <div 
                key={file.name} 
                className="px-3 py-2.5 flex items-center justify-between text-xs hover:bg-[#21262d]/40 transition active:bg-[#21262d]"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {file.type === 'dir' ? (
                    <Folder className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  ) : (
                    <FileCode className="w-4 h-4 text-[#8b949e] flex-shrink-0" />
                  )}
                  <span className={`truncate font-medium ${file.type === 'dir' ? 'text-white' : 'text-[#c9d1d9]'}`}>
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-[#8b949e] flex-shrink-0">
                  <span className="hidden sm:inline truncate max-w-[120px]">{file.commit}</span>
                  <span>{file.time}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#484f58]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ৬. মোবাইল README.md কার্ড */}
      <div className="px-3.5 py-2">
        <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#161b22]">
          <div className="px-3 py-2 bg-[#21262d] border-b border-[#30363d] flex items-center space-x-2 text-xs font-bold text-white">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>README.md</span>
          </div>
          <div className="p-3.5 text-xs text-[#c9d1d9] space-y-2">
            <h1 className="text-base font-bold text-white border-b border-[#30363d] pb-1">
              GittiG OS: Zero to Empire
            </h1>
            <p className="text-[#8b949e] italic">Build Beyond Code.</p>
            <p>
              An AI-native software creation platform integrating Git Core, Vector Memory, and Browser Studio.
            </p>
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d] text-[11px] space-y-1">
              <div>🟢 <strong>Git Core:</strong> Gitea Headless Engine Active</div>
              <div>🟢 <strong>AI Brain:</strong> Groq & Gemini BYOK Active</div>
              <div>🟢 <strong>Vector Memory:</strong> Qdrant Search Active</div>
              <div>🟢 <strong>Guardrails:</strong> 30 AI Requests / 5 Repos Max</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
