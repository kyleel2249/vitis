'use client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/home/AIAssistant';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <AIAssistant />
    </>
  );
}
