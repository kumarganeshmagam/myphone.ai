import React from 'react';
import { faqItems } from '../data/faqData';

const Faq: React.FC = () => {
  return (
    <section className="bg-brand-background py-20 px-8">
      <h2 className="text-center text-3xl font-display font-normal tracking-[0.3em] mb-12 text-brand-text italic">FAQs</h2>
      <div className="max-w-4xl mx-auto space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-brand-card rounded-2xl p-8 transition-transform duration-300 shadow-[0_5px_20px_rgba(139,90,60,0.1)] hover:translate-x-2.5">
            <h3 className="text-brand-primary text-xl mb-4 font-display font-normal">{item.question}</h3>
            <p className="text-brand-text leading-relaxed font-body font-normal">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;