import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './lib/cart';

export const metadata: Metadata = {
  title: 'the;kokubo — コーヒー豆のご注文',
  description: '手回し焙煎のスペシャルティコーヒー。ご注文を受けてから焙煎してお届けします。山梨県甲府市。',
  openGraph: {
    title: 'the;kokubo coffee',
    description: '手回し焙煎のスペシャルティコーヒー。ご注文後に焙煎してお届けします。',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
