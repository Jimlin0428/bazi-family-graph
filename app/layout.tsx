import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '八字命盤與家庭關係圖譜 · BaZi Family Graph',
  description: '現代化、高度資料視覺化的八字命盤與家庭關係網絡 Web 應用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
        {children}
      </body>
    </html>
  );
}
