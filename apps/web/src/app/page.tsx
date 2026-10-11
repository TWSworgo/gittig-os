'use client';

import React, { useState } from 'react';
import { 
  Folder, FileCode, PlayCircle, Star, GitFork, 
  Zap, Download, Terminal, CheckCircle2, 
  Smartphone, Monitor, Package, ShieldCheck, ShieldAlert,
  Search, Lock, Check, AlertTriangle
} from 'lucide-react';

const REPO_FILES = [
  { name: 'apps', type: 'dir', commit: 'feat: add sentinel security scanner', time: '1m ago' },
  { name: 'packages', type: 'dir', commit: 'feat: add ai engine & vector memory', time: '15m ago' },
  { name: 'docker-compose.yml', type: 'file', commit: 'feat: add gitea, postgres & qdrant', time: '20m ago' },
  { name: '.gitignore', type: 'file', commit: 'chore: exclude heavy binaries', time: '2m ago' },
  { name: 'README.md', type: 'file', commit: 'docs: initialize gittig blueprint', time: '1h ago' }
];

export default function MobileGitHubView() {
  const [activeTab, setActiveTab] = useState<'code' | 'actions' | 'security'>('security');
  
  // Flow CI/CD স্টেট
  const [buildTarget, setBuildTarget] = useState<'apk' | 'exe' | 'bundle'>('apk');
  const [runningBuild, setRunningBuild] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [artifactName, setArtifactName] = useState('');

  // Sentinel Security স্টেট
  const [scanning, setScanning] = useState(false);
  const [simulateLeak, setSimulateLeak] = useState(false);
  const [securityReport, setSecurityReport] = useState<any>(null);

  const handleRunPipeline = async () => {
    setRunningBuild(true);
    setBuildLogs(['[INFO] Connecting to GittiG Flow runner...']);
    setDownloadUrl('');
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
        setDownloadUrl(data.downloadUrl);
      }
    } catch {
      setBuildLogs(['[ERROR] Flow engine error.']);
    } finally {
      setRunningBuild(false);
    }
  };

  const handleSecurityScan = async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/sentinel/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateLeak })
      });
      const data = await res.json();
      if (data.success) {
        setSecurityReport(data.report);
      }
    } catch {
      console.log('Scan error');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-16">
      {/* হেডার */}
      <header className="sticky top-0 z-20 bg-[#161b22] border-b border-[#30363d] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">G</div>
          <span className="font-bold text-white text-sm">GittiG OS</span>
        </div>
        <span className="text-[11px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
          ⚡ 29/30 AI Left
        </span>
      </header>

      {/* রিপোজিটরি টাইটেল */}
      <div className="px-3.5 py-3 border-b border-[#21262d] bg-[#161b22]/50">
        <div className="text-xs text-[#8b949e]">
          TwSworgo / <span className="font-bold text-white text-sm">my-gittig-core-app</span>
          <span className="text-[10px] border border-[#30363d] bg-[#21262d] px-1.5 py-0.2 rounded-full ml-1">Public</span>
        </div>
      </div>

      {/* মোবাইল ট্যাব বার */}
      <div className="flex border-b border-[#30363d] bg-[#161b22] px-2 text-xs overflow-x-auto">
        <button 
          onClick={() => setActiveTab('code')}
          className={`py-2.5 px-4 border-b-2 font-bold whitespace-nowrap ${activeTab === 'code' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}
        >
          Code
        </button>
        <button 
          onClick={() => setActiveTab('actions')}
          className={`py-2.5 px-4 border-b-2 font-bold flex items-center space-x-1.5 whitespace-nowrap ${activeTab === 'actions' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Flow (CI/CD)</span>
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`py-2.5 px-4 border-b-2 font-bold flex items-center space-x-1.5 whitespace-nowrap ${activeTab === 'security' ? 'border-emerald-500 text-white' : 'border-transparent text-[#8b949e]'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sentinel (Security)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      </div>

      {/* কোড ট্যাব */}
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

      {/* CI/CD Flow ট্যাব */}
      {activeTab === 'actions' && (
        <div className="p-3.5 space-y-3">
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-3">
            <span className="text-xs font-bold text-white block">GittiG Flow: Build Real Artifacts</span>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setBuildTarget('apk')} className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'apk' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}>
                <Smartphone className="w-4 h-4 text-emerald-400" /><span>Android APK</span>
              </button>
              <button onClick={() => setBuildTarget('exe')} className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'exe' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}>
                <Monitor className="w-4 h-4 text-sky-400" /><span>Windows EXE</span>
              </button>
              <button onClick={() => setBuildTarget('bundle')} className={`p-2 rounded border text-xs flex flex-col items-center space-y-1 ${buildTarget === 'bundle' ? 'border-emerald-500 bg-emerald-950 text-white font-bold' : 'border-[#30363d] text-[#8b949e]'}`}>
                <Package className="w-4 h-4 text-amber-400" /><span>Zip Bundle</span>
              </button>
            </div>
            <button onClick={handleRunPipeline} disabled={runningBuild} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded text-xs shadow">
              {runningBuild ? 'Building...' : 'Run Pipeline & Build Artifact'}
            </button>
          </div>
          {buildLogs.length > 0 && (
            <div className="border border-[#30363d] rounded-lg p-2.5 bg-[#0d1117] font-mono text-[11px] text-emerald-300 space-y-1">
              {buildLogs.map((log, idx) => <div key={idx}>{log}</div>)}
            </div>
          )}
          {downloadUrl && (
            <div className="border border-emerald-500 rounded-lg p-3 bg-emerald-950/40 flex items-center justify-between">
              <div><span className="text-xs font-bold text-white block">Build Succeeded!</span><span className="text-[11px] text-emerald-400 font-mono">{artifactName} (18.5 MB)</span></div>
              <a href={downloadUrl} download className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1 shadow"><Download className="w-3.5 h-3.5" /><span>Download</span></a>
            </div>
          )}
        </div>
      )}

      {/* Sentinel Security ট্যাব */}
      {activeTab === 'security' && (
        <div className="p-3.5 space-y-3">
          <div className="border border-[#30363d] rounded-lg p-3 bg-[#161b22] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GittiG Sentinel Defense Engine</span>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                SAST + Secrets
              </span>
            </div>

            <p className="text-xs text-[#8b949e]">
              Scans all commits, pull requests, and files for exposed API keys, private passwords, and security vulnerabilities.
            </p>

            {/* সিমুলেট লিক টগল (টেস্ট করার জন্য) */}
            <div className="p-2 rounded bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs">
              <span className="text-[#8b949e]">Simulate Leaked Secret (.env):</span>
              <button 
                onClick={() => setSimulateLeak(!simulateLeak)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                  simulateLeak ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                }`}
              >
                {simulateLeak ? '🚨 Leak Active' : '🟢 Safe Code'}
              </button>
            </div>

            <button
              onClick={handleSecurityScan}
              disabled={scanning}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded text-xs flex items-center justify-center space-x-1.5 shadow"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{scanning ? 'Scanning Files & Secrets...' : 'Run Sentinel Security Audit'}</span>
            </button>
          </div>

          {/* অডিট রেজাল্ট ও পাসপোর্ট */}
          {securityReport && (
            <div className="space-y-3">
              {/* পাসপোর্ট ব্যাজ */}
              <div className={`border rounded-lg p-3 ${
                securityReport.status === 'PASSED' 
                  ? 'border-emerald-500 bg-emerald-950/30' 
                  : 'border-rose-500 bg-rose-950/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-bold block ${securityReport.status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {securityReport.passportBadge}
                    </span>
                    <span className="text-[11px] text-[#8b949e]">
                      Trust Score: {securityReport.securityScore}/100 • Findings: {securityReport.totalFindings}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    securityReport.status === 'PASSED'
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                      : 'bg-rose-900/60 text-rose-300 border-rose-700'
                  }`}>
                    {securityReport.status}
                  </span>
                </div>
              </div>

              {/* ভালনারেবিলিটি লিস্ট (যদি লিক থাকে) */}
              {securityReport.findings.length > 0 && (
                <div className="border border-rose-900/50 rounded-lg p-2.5 bg-[#0d1117] space-y-2">
                  <span className="text-[11px] font-bold text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Security Threats Detected:</span>
                  </span>
                  {securityReport.findings.map((f: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-300 text-[11px]">
                        <span>{f.rule}</span>
                        <span className="text-rose-400">[{f.severity}]</span>
                      </div>
                      <div className="text-[10px] text-[#8b949e]">File: {f.file} (Line {f.line})</div>
                      <div className="text-[11px] text-rose-200 font-mono bg-black/40 p-1 rounded truncate">{f.snippet}</div>
                      <div className="text-[10px] text-amber-300">💡 {f.recommendation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
