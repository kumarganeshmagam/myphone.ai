
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Trending from './components/Trending';
import Services from './components/Services';
import Faq from './components/Faq';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenPanel = () => setIsPanelOpen(true);
  const handleClosePanel = () => setIsPanelOpen(false);

  useEffect(() => {
    if (isPanelOpen) {
      document.body.classList.add('panel-open');
    } else {
      document.body.classList.remove('panel-open');
    }
    return () => {
      document.body.classList.remove('panel-open');
    };
  }, [isPanelOpen]);

  return (
    <div className="page active">
      <Hero 
        isPanelOpen={isPanelOpen} 
        onOpenPanel={handleOpenPanel} 
        onClosePanel={handleClosePanel} 
      />
      <Trending />
      <Services />
      <Faq />
      <Contact />
    </div>
  );
};

export default App;
