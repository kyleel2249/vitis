'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 10_000_000, label: 'Products', suffix: '+', prefix: '' },
  { value: 500_000, label: 'Active Vendors', suffix: '+', prefix: '' },
  { value: 2_000_000, label: 'Happy Customers', suffix: '+', prefix: '' },
  { value: 98, label: 'Satisfaction Rate', suffix: '%', prefix: '' },
  { value: 150, label: 'Countries Served', suffix: '+', prefix: '' },
  { value: 4.8, label: 'Average Rating', suffix: '★', prefix: '' },
];

function AnimatedNumber({ target, suffix, prefix, decimals = 0 }: { target: number; suffix: string; prefix: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [inView, target]);

  const formatted = target >= 1_000_000
    ? (val / 1_000_000).toFixed(1) + 'M'
    : target >= 1_000
    ? (val / 1_000).toFixed(0) + 'K'
    : val.toFixed(decimals);

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Powering Global Commerce</h2>
          <p className="text-primary-200">Trusted by millions of buyers and sellers worldwide</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </div>
              <p className="text-primary-200 text-sm font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
