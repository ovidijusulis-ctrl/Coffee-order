import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from './lib/cart';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Kokubo Coffee — Order Fresh Roasted Beans',
  description:
    'Single origin, small batch specialty coffee roasted to order. Order online with local delivery and worldwide shipping.',
  openGraph: {
    title: 'Kokubo Coffee Roasters',
    description: 'Freshly roasted specialty coffee delivered to your door.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CartProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
