'use client';
import Link from 'next/link';

const BRANDS = [
  { name: 'Apple', color: '#1d1d1f' },
  { name: 'Samsung', color: '#1428a0' },
  { name: 'Nike', color: '#111' },
  { name: 'Adidas', color: '#000' },
  { name: 'Sony', color: '#000' },
  { name: 'LG', color: '#a50034' },
  { name: 'IKEA', color: '#0058a3' },
  { name: 'Zara', color: '#000' },
  { name: 'H&M', color: '#e50010' },
  { name: 'Dyson', color: '#cc2027' },
  { name: "Levi's", color: '#c8102e' },
  { name: 'LEGO', color: '#d01012' },
];

export default function BrandsSection() {
  return (
    <section className="section border-t border-gray-100 overflow-hidden">
      <div className="container-max">
        <div className="text-center mb-8">
          <h2 className="section-title">Top Brands</h2>
          <p className="section-subtitle">Shop from hundreds of authentic global brands</p>
        </div>

        {/* Scrolling row */}
        <div className="relative">
          <div
            className="flex gap-6"
            style={{
              width: 'max-content',
              animation: 'brandScroll 24s linear infinite',
            }}
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-16 px-8 bg-white border border-gray-100 rounded-2xl flex items-center justify-center hover:border-primary-200 hover:shadow-card transition-all cursor-pointer"
              >
                <span
                  className="text-lg font-bold whitespace-nowrap"
                  style={{ color: brand.color }}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
