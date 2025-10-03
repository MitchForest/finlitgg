import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'finlit.gg - Financial Literacy for Kids',
  description: 'Learn money management through Sequence-inspired automation and gamification',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


