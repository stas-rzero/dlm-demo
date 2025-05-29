import React from 'react';
import FloorplanCanvas from './components/FloorplanCanvas';
import FloorplanUpload from './components/FloorplanUpload';
import UIControls from './components/UIControls';
import { FloorplanProvider, useFloorplan } from './context/FloorplanContext';

const FloorplanApp: React.FC = () => {
  const { appState } = useFloorplan();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="h-[800px] w-[1280px] overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="relative h-full w-full">
          {!appState.floorplanImageUrl ? (
            <FloorplanUpload />
          ) : (
            <>
              <FloorplanCanvas />
              <UIControls />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <FloorplanProvider>
      <FloorplanApp />
    </FloorplanProvider>
  );
};

export default App;
