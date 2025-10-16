import React from 'react';
import { trendingItems } from '../data/trendingData';

const Trending: React.FC = () => {
  return (
    <section className="bg-brand-background py-20 px-8">
      <h2 className="text-center text-3xl font-display font-normal tracking-[0.3em] mb-12 text-brand-text italic">T R E N D I N G</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {trendingItems.map((item, index) => (
          <div key={index} className="bg-brand-card rounded-2xl p-8 text-center shadow-[0_5px_20px_rgba(139,90,60,0.1)] transition-transform duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_40px_rgba(139,90,60,0.2)]">
            <h3 className="text-2xl text-brand-text mb-2 font-display font-normal">{item.title}</h3>
            <span className="inline-block bg-brand-primary text-white py-1 px-4 rounded-full text-sm mt-4 font-body font-normal">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;