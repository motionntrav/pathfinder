import { useState } from 'react';
import PathFinderApp from './pathfinder-app';
import LandingPage from './LandingPage';

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return <PathFinderApp />;
}

export default App;
