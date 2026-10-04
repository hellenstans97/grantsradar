import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GrantsRadar',
  description: 'Live funding for AI builders.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
