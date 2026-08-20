import { useState, useCallback } from 'react';
import Preloader from './components/Preloader';
import Landing from './components/Landing';
import Feed from './components/Feed';
import ParticleField from './components/ParticleField';
import ScanLines from './components/ScanLines';

type Screen = 'preloader' | 'landing' | 'feed';

export default function App() {
  const [screen, setScreen] = useState<Screen>('preloader');

  const handlePreloaderComplete = useCallback(() => {
    setScreen('landing');
  }, []);

  const handleEnterFeed = useCallback(() => {
    setScreen('feed');
  }, []);

  return (
    <>
      {screen === 'preloader' && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {screen === 'landing' && (
        <>
          <Landing onEnter={handleEnterFeed} />
          <ScanLines />
        </>
      )}

      {screen === 'feed' && (
        <>
          <ParticleField density={35} opacity={0.12} />
          <Feed />
          <ScanLines />
        </>
      )}
    </>
  );
}
