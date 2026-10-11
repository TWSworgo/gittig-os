'use client';

import React, { useState } from 'react';
import { 
  Folder, FileCode, PlayCircle, Star, GitFork, 
  Zap, Code2, Download, Terminal, CheckCircle2, 
  Smartphone, Monitor, Package, ShieldCheck
} from 'lucide-react';

const REPO_FILES = [
  { name: 'apps', type: 'dir', commit: 'feat: setup core & flow ci/cd', time: '5m ago' },
  { name: 'packages', type: 'dir', commit: 'feat: add ai engine & vector memory', time: '15m ago' },
  { name: 'docker-compose.yml', type: 'file', commit: 'feat: add gitea, postgres & qdrant', time: '20m ago' },
  { name: '.gitignore', type: 'file', commit: 'chore: exclude heavy binaries', time: '2m ago' },
  { name: 'README.md', type: 'file', commit: 'docs: initialize gittig blueprint', time: '1h ago' }
];

export default function MobileGitHubView() {
  const [activeTab, setActiveTab] = useState<'code' | 'actions'>('actions');
  const [buildTarget, setBuildTarget] = useState<'apk' | 'exe' | 'bundle'>('apk');
  const [runningBuild, setRunningBuild] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [artifactName, setArtifactName] = useState('');

  const handleRunPipeline = async () => {
    setRunningBuild(true);
    setBuildLogs(['[INFO] Connecting to GittiG Flow runner...']);
    setDownloadUrl('');
    setArtifactName('');

    try {
      const res = await fetch('/api/flow/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName: 'my-gittig-core-app', target: buildTarget })
      });
      const data = await res.json();
      if (data.success) {
        setBuildLogs(data.result.logs);
        setArtifactName(data.result.artifactFileName);
        setDownloadUrl(`/api/flow/artifacts/${data.result.artifactFileName}`);
      } else {
        setBuildLogs([`[ERROR] ${data.error || 'Pipeline execution failed.'}`]);
      }
    } catch {
      setBuildLogs(['[ERROR] Connection failed. Flow runner starting up...']);
    } finally {
      setRunningBuild(false);
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

      <div className="flex border-b border-[#30363d] bg-[#161b22] px-2 text-xs">
        <button 
          onClick={() => setActiveTab('code')}
          className={`py-2.5 px-4 border-b-2 font-bold ${activeTab === 'code' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}
        >
          Code
        </button>
        <button 
          onClick={() => setActiveTab('actions')}
          className={`py-2.5 px-4 border-b-2 font-bold flex items-center space-x-1.5 ${activeTab === 'actions' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Flow (CI/CD)</span>
        </button>
      </div>

      {activeTab === 'code' && (
        <div className="p-3 space-y-2">
          <div className="border border-[#30363d] rounded-lg bg-[#161b22] divide-y divide-[#21262d]">
            {REPO_FILES.map((file) => (
              <div key={file.name} className="px-3 py-2.5 flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2">
                  {file.type === 'dir' ? <Folder className="w-4 h-4 text-sky-400" /> : <FileCode className="w-4 h-4 text-[#8b949e]" />}
                  <span className="text-white font-medium">{file.name}</span>
                </span>
                <span className="text-[11px] text-[#8b949e]">{file.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="p-3.5 space-y-3">
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-3">
            <span className="text-xs font-bold text-white block">GittiG Flow: Build Real Artifacts</span>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBuildTarget('apk')}
                className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'apk' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android APK</span>
              </button>
              <button
                onClick={() => setBuildTarget('exe')}
                className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'exe' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}
              >
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>Windows EXE</span>
              </button>
              <button
                onClick={() => setBuildTarget('bundle')}
                className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'bundle' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>Zip Bundle</span>
              </button>
            </div>

            <button
              onClick={handleRunPipeline}
              disabled={runningBuild}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded text-xs transition active:scale-98 shadow"
            >
              {runningBuild ? 'Building Pipeline in Sandbox...' : 'Run Pipeline & Build Artifact'}
            </button>
          </div>

          {buildLogs.length > 0 && (
            <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117]">
              <div className="px-3 py-1.5 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-[11px] text-[#8b949e]">
                <span className="flex items-center space-x-1 font-semibold text-white">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Execution Console</span>
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Exit: 0</span>
                </span>
              </div>
              <div className="p-2.5 font-mono text-[11px] text-emerald-300 space-y-1 overflow-x-auto">
                {buildLogs.map((log, idx) => <div key={idx}>{log}</div>)}
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="border border-emerald-500/80 rounded-lg p-3 bg-emerald-950/40 flex items-center justify-between shadow-lg">
              <div>
                <span className="text-xs font-bold text-white block">Build Succeeded!</span>
                <span className="text-[11px] text-emerald-400 font-mono">{artifactName} (18.5 MB)</span>
              </div>
              <a 
                href={downloadUrl} 
                download 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
