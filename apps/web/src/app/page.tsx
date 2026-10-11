'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  FolderGit2, 
  FileCode2, 
  Bot, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TerminalSquare 
} from 'lucide-react';

// Monaco Editor লোড করা (Client-Side)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const INITIAL_FILES: Record<string, { language: string; content: string }> = {
  'src/index.ts': {
    language: 'typescript',
    content: `// GittiG OS Main Engine\nimport express from 'express';\n\nconst app = express();\nconst PORT = process.env.PORT || 4000;\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Welcome to GittiG OS Core' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Engine listening on port \${PORT}\`);\n});\n`
  },
  'src/services/auth.service.ts': {
    language: 'typescript',
    content: `// Indexed in Qdrant Memory (Step 4)\nexport function verifyUserToken(jwtToken: string) {\n  console.log("Verifying token with GittiG Guardrails...");\n  return true;\n}\n`
  },
  'README.md': {
    language: 'markdown',
    content: `# GittiG OS\n\n**Build Beyond Code.**\n\n100% Free AI-Native Software Creation Platform.\n- Git Core: Active\n- AI Brain: Active\n- Vector Memory: Qdrant Connected\n`
  }
};

export default function GittiGStudio() {
  const [activeFile, setActiveFile] = useState('src/index.ts');
  const [files, setFiles] = useState(INITIAL_FILES);
  const [prompt, setPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Ready');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(prev => ({
        ...prev,
        [activeFile]: { ...prev[activeFile], content: value }
      }));
    }
  };

  const handleAskAi = async () => {
    if (!prompt.trim()) return;
    setLoadingAi(true);
    setStatusMsg('Consulting AI Brain & Vector Memory...');
    try {
      const res = await fetch('http://localhost:4000/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'dev_sworgo',
          prompt: `File: ${activeFile}\n\nTask: ${prompt}`
        })
      });
      const data = await res.json();
      setAiOutput(data.aiResult?.content || 'AI response received.');
      setStatusMsg('AI Response Ready');
    } catch (err: any) {
      setAiOutput(`[Simulated AI Assistant]: Updated code suggestion generated for "${prompt}"\n\n// GittiG Guardrails Active: 28/30 Calls Left`);
      setStatusMsg('AI Offline Fallback Active');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = () => {
    setStatusMsg('Saved & Committed to Git Core (main branch)!');
    setTimeout(() => setStatusMsg('Ready'), 3000);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d1117] text-[#c9d1d9] font-mono select-none">
      {/* ১. টপ হেডার বার */}
      <header className="h-12 border-b border-[#30363d] px-4 flex items-center justify-between bg-[#161b22]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-bold text-white text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="tracking-wide">GittiG STUDIO OS</span>
          </div>
          <span className="text-xs bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d] flex items-center space-x-1">
            <FolderGit2 className="w-3 h-3 text-emerald-400" />
            <span>my-gittig-core-app (main)</span>
          </span>
        </div>

        {/* কোটা বার */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#1f242c] text-emerald-300 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Quota: 29/30 Left Today</span>
          </div>
          <button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1 rounded flex items-center space-x-1 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Commit</span>
          </button>
        </div>
      </header>

      {/* ২. মূল বডি (File Explorer + Monaco Editor + AI Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        {/* ফাইল এক্সপ্লোরার */}
        <div className="w-52 border-r border-[#30363d] bg-[#0d1117] flex flex-col">
          <div className="p-2.5 text-[11px] font-bold text-[#8b949e] uppercase tracking-wider border-b border-[#21262d]">
            Files
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {Object.keys(files).map((filePath) => (
              <button
                key={filePath}
                onClick={() => setActiveFile(filePath)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 transition ${
                  activeFile === filePath
                    ? 'bg-[#1f242c] text-emerald-400 border-l-2 border-emerald-500 font-semibold'
                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span className="truncate">{filePath}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Monaco কোড এডিটর */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="h-8 bg-[#161b22] border-b border-[#30363d] px-3 flex items-center text-xs text-white">
            <span className="text-emerald-400 mr-2">●</span> {activeFile}
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={files[activeFile]?.language || 'typescript'}
              value={files[activeFile]?.content || ''}
              onChange={handleEditorChange}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* AI Copilot & Memory সাইডবার */}
        <div className="w-80 border-l border-[#30363d] bg-[#161b22] flex flex-col">
          <div className="p-2.5 text-xs font-bold text-white border-b border-[#30363d] flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>GittiG AI Copilot</span>
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
              RAG Active
            </span>
          </div>

          {/* AI আউটপুট এরিয়া */}
          <div className="flex-1 p-3 overflow-y-auto text-xs space-y-2">
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d] text-[#8b949e]">
              💡 Ask GittiG AI to write functions, refactor code, or generate unit tests using codebase context.
            </div>
            {aiOutput && (
              <div className="p-2.5 rounded bg-[#1f242c] border border-emerald-900/50 text-emerald-200 whitespace-pre-wrap">
                {aiOutput}
              </div>
            )}
          </div>

          {/* AI প্রম্পট ইনপুট */}
          <div className="p-2.5 border-t border-[#30363d] bg-[#0d1117]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Add JWT login function..."
              className="w-full h-16 bg-[#161b22] border border-[#30363d] rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={handleAskAi}
              disabled={loadingAi}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center space-x-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loadingAi ? 'AI Thinking...' : 'Generate with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ৩. বটম স্ট্যাটাস বার */}
      <footer className="h-6 bg-[#161b22] border-t border-[#30363d] px-3 flex items-center justify-between text-[11px] text-[#8b949e]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Strict Guardrails Active</span>
          </span>
          <span>Status: {statusMsg}</span>
        </div>
        <div>UTF-8 | TypeScript | GittiG OS v1.0</div>
      </footer>
    </div>
  );
}
