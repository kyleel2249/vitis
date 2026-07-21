import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import StatsSection from '@/components/home/StatsSection';
import BrandsSection from '@/components/home/BrandsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vitis — AI-Powered Commerce Platform',
  description: 'Shop millions of products with AI-powered recommendations, instant search, and personalized deals.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>
      <FlashSaleSection />
      <StatsSection />
      <BrandsSection />
      <TestimonialsSection />
    </>
  );
}
