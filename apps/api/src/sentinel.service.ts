export interface SecurityFinding {
  rule: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  file: string;
  line: number;
  snippet: string;
  recommendation: string;
}

export interface SecurityReport {
  status: 'PASSED' | 'BLOCKED';
  totalFindings: number;
  securityScore: number;
  passportBadge: string;
  findings: SecurityFinding[];
}

export function scanCodebaseSecurity(files: { path: string; content: string }[]): SecurityReport {
  const findings: SecurityFinding[] = [];

  const SECRET_PATTERNS = [
    { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/g, severity: 'CRITICAL' as const, rec: 'Move secret key to server environment variables immediately.' },
    { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g, severity: 'CRITICAL' as const, rec: 'Revoke this AWS credential and use IAM roles.' },
    { name: 'Hardcoded Database Password', regex: /password\s*=\s*['"][a-zA-Z0-9_@#!$%^&*]{6,}['"]/gi, severity: 'HIGH' as const, rec: 'Never hardcode plain-text database credentials.' },
    { name: 'Dangerous eval() Execution', regex: /eval\s*\(/g, severity: 'HIGH' as const, rec: 'Avoid eval() due to arbitrary code injection vulnerabilities.' }
  ];

  for (const file of files) {
    const lines = file.content.split('\n');
    lines.forEach((lineText, idx) => {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(lineText)) {
          findings.push({
            rule: pattern.name,
            severity: pattern.severity,
            file: file.path,
            line: idx + 1,
            snippet: lineText.trim().substring(0, 50) + '...',
            recommendation: pattern.rec
          });
        }
      }
    });
  }

  const isBlocked = findings.length > 0;

  return {
    status: isBlocked ? 'BLOCKED' : 'PASSED',
    totalFindings: findings.length,
    securityScore: isBlocked ? Math.max(20, 100 - findings.length * 30) : 100,
    passportBadge: isBlocked ? '🛡️ Passport: REJECTED (Vulnerabilities Detected)' : '🛡️ Passport: VERIFIED & CLEAN (0 Leaks)',
    findings
  };
}
