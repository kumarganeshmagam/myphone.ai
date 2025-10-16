import React from 'react';

const Services: React.FC = () => {
  return (
    <section className="bg-brand-background py-20 px-8 text-center">
      <h2 className="text-center text-3xl font-display font-normal tracking-[0.3em] mb-12 text-brand-text italic">Our Services</h2>
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-card rounded-2xl p-10 shadow-[0_5px_20px_rgba(139,90,60,0.1)]">
            <h3 className="text-4xl mb-4 text-brand-primary font-display font-normal">Coming Soon...</h3>
            <p className="leading-relaxed font-body font-normal text-brand-text max-w-2xl mx-auto">
              We are working hard to bring you new and exciting services. Stay tuned for updates on how Ria can further simplify your mobile discovery journey!
            </p>
        </div>
      </div>
    </section>
  );
};

export default Services;