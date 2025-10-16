import React from 'react';
import { motion } from 'framer-motion';
import Questionnaire from './Questionnaire';

interface HeroProps {
  isPanelOpen: boolean;
  onOpenPanel: () => void;
  onClosePanel: () => void;
}

// Fix: Use React.ElementType for the 'el' prop to correctly type it as a renderable component or tag.
const AnimatedText: React.FC<{ text: string; el?: React.ElementType; className?: string; delay?: number; stagger?: number }> = ({ text, el: Wrapper = 'p', className, delay = 0, stagger = 0.04 }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: i * delay },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.01,
      },
    },
    hidden: {
      opacity: 0,
      y: 0,
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        style={{ display: 'inline-block', overflow: 'hidden' }}
        variants={container}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        {letters.map((letter, index) => (
          <motion.span style={{ display: 'inline-block' }} variants={child} key={index}>
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

const Hero: React.FC<HeroProps> = ({ isPanelOpen, onOpenPanel, onClosePanel }) => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen p-8 pt-16 bg-brand-background hero">
      <div className="text-center max-w-4xl hero-content">
        <h2 className="text-4xl md:text-6xl font-display font-normal mb-8 italic">
          <AnimatedText text="Hello, " el="span" className="text-brand-text" delay={0.1} />
          <AnimatedText text="I am " el="span" className="text-brand-primary" delay={0.4} />
          <span className="relative inline-block">
            <AnimatedText text="Ria!" el="span" className="text-brand-primary" delay={0.7} />
            <motion.svg
              className="absolute -top-4 -left-4 w-[140%] h-[160%]"
              viewBox="0 0 200 100"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M 169.3,7.1 C 122.8,-11.3 54.2,4.4 20.1,38.6 C -7.8,63.1 0.4,101.4 36.3,109.1 C 82.8,118.8 143.2,101.1 176.1,68.8 C 202.4,42.5 204.1,14.2 169.3,7.1 Z"
                fill="none"
                stroke="#2b2b2b"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { delay: 1.5, type: 'spring', duration: 1.5, bounce: 0 },
                      opacity: { delay: 1.5, duration: 0.01 },
                    },
                  },
                }}
              />
            </motion.svg>
          </span>
        </h2>
        <AnimatedText
          text="I believe finding the right mobile is everything. With Ria, our mobile recommender, we focus on minimalism and elegance in helping you discover the perfect phone."
          className="text-lg leading-loose font-body max-w-3xl mx-auto mb-12 text-brand-text"
          delay={1.8}
          stagger={0.015}
        />
      </div>

      {!isPanelOpen ? (
        <motion.div
          className="find-yours-btn-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4.7, duration: 0.5 }}
        >
          <button onClick={onOpenPanel} className="group inline-flex flex-col items-center transition duration-300 transform hover:-translate-y-1">
            <span className="text-brand-primary font-display italic text-xl relative pb-2">
              Find Yours
              <span className="absolute -bottom-1 left-0 w-full h-auto">
                <motion.svg
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.path
                    d="M 2,6 C 20,-2 80,-2 98,6 M 2,10 C 20,2 80,2 98,10"
                    stroke="#a0522d"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: {
                        pathLength: 1,
                        transition: {
                          delay: 5.2,
                          duration: 1.2,
                          ease: 'easeInOut',
                        },
                      },
                    }}
                  />
                </motion.svg>
              </span>
            </span>
          </button>
        </motion.div>
      ) : (
        <Questionnaire onReset={onClosePanel} />
      )}
    </section>
  );
};

export default Hero;