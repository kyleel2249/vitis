'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Fashion Blogger', avatar: 'SM', rating: 5, text: 'Vitis is the most intuitive shopping platform I\'ve ever used. The recommendations are spot-on — it\'s like it reads my mind!', location: 'New York, USA' },
  { name: 'David Chen', role: 'Tech Enthusiast', avatar: 'DC', rating: 5, text: 'The search engine is incredible. Natural language queries actually work perfectly. Found exactly what I needed in seconds.', location: 'San Francisco, USA' },
  { name: 'Aisha Rahman', role: 'Small Business Owner', avatar: 'AR', rating: 5, text: 'As a vendor, the dashboard tools are powerful yet simple. My sales tripled in the first month after joining!', location: 'London, UK' },
  { name: 'Marco Rossi', role: 'Photography Enthusiast', avatar: 'MR', rating: 5, text: 'The visual search feature is a game-changer. I photographed a product and found the exact same item at a better price immediately.', location: 'Milan, Italy' },
  { name: 'Yuki Tanaka', role: 'Lifestyle Influencer', avatar: 'YT', rating: 5, text: 'The affiliate program is fantastic. I\'ve been earning significant commissions just by sharing products I love.', location: 'Tokyo, Japan' },
  { name: 'Emma Williams', role: 'Interior Designer', avatar: 'EW', rating: 5, text: 'AR preview for home products is a revolutionary feature. I can see how furniture looks in my room before buying!', location: 'Sydney, Australia' },
];

export default function TestimonialsSection() {
  return (
    <section className="section bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="section-title">Loved by Millions</h2>
          <p className="section-subtitle">See what our community has to say</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            <span className="text-gray-600 font-semibold ml-2">4.9 out of 5 (2M+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 hover:shadow-card-hover transition-all"
            >
              <Quote className="w-8 h-8 text-primary-200 mb-3" />
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.location}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
