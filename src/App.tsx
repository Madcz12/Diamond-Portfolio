import { Suspense } from 'react';
import { usePanelNavigation } from './hooks/usePanelNavigation';
import DiamondCanvas from './components/DiamondCanvas';

// Global UI
import { Nav } from './components/ui/Nav';
import { FacetIndicator } from './components/ui/FacetIndicator';
import { ProgressBar } from './components/ui/ProgressBar';
import { ArrowButtons } from './components/ui/ArrowButtons';

// Sections
import { Hero } from './components/Hero/Hero';
import { About } from './components/sections/About';
import { Tech } from './components/sections/Tech';
import { Projects } from './components/sections/Projects';
import { Certifications } from './components/sections/Certifications';
import { Contact } from './components/sections/Contact';

function App() {
  const { currentPanel, setPanel, goNext, goPrev, containerRef } = usePanelNavigation();
  const totalPanels = 6;

  return (
    <>
      <Nav currentPanel={currentPanel} onNavigate={setPanel} />
      <FacetIndicator currentPanel={currentPanel} onNavigate={setPanel} totalPanels={totalPanels} />
      <ProgressBar currentPanel={currentPanel} totalPanels={totalPanels} />
      <ArrowButtons onNext={goNext} onPrev={goPrev} currentPanel={currentPanel} totalPanels={totalPanels} />

      <Suspense fallback={null}>
        <DiamondCanvas currentPanel={currentPanel} isHeroActive={currentPanel === 0} />
      </Suspense>

      <div className="panels-container" ref={containerRef}>
        <Hero isActive={currentPanel === 0} onExplore={goNext} />
        <About isActive={currentPanel === 1} />
        <Tech isActive={currentPanel === 2} />
        <Projects isActive={currentPanel === 3} />
        <Certifications isActive={currentPanel === 4} />
        <Contact isActive={currentPanel === 5} />
      </div>
    </>
  );
}

export default App;
