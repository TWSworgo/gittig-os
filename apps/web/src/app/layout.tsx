import './globals.css';

export const metadata = {
  title: 'GittiG Studio OS - Browser IDE',
  description: 'AI-Native Browser IDE with Strict Guardrails',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
