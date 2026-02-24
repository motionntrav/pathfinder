import { useState } from 'react';
import LandingPage from './LandingPage';
import PathFinderApp from './pathfinder-app';

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return <PathFinderApp />;
}

export default App;
