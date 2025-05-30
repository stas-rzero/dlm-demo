import React, { useEffect, useState } from 'react';
import FloorplanCanvas from './components/FloorplanCanvas';
import FloorplanUpload from './components/FloorplanUpload';
import UIControls from './components/UIControls';
import { FloorplanProvider } from './context/FloorplanProvider';
import { useFloorplan } from './context/useFloorplan';
import { getFloorplanById, INITIAL_APP_STATE } from './utils/mockData';
import LoadingOverlay from './components/LoadingOverlay';

const FloorplanApp: React.FC = () => {
  const { appState, setAppState, uiState } = useFloorplan();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate API call to fetch data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get ID from hash (remove the # if present)
        const id = window.location.hash.replace('#', '');

        if (id) {
          const floorplanData = getFloorplanById(id);
          if (floorplanData) {
            setAppState(floorplanData);
          } else {
            // If floorplan not found, redirect to root
            window.location.hash = '';
            setAppState(INITIAL_APP_STATE);
          }
        } else {
          // If no ID provided, initialize with empty state
          setAppState(INITIAL_APP_STATE);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setAppState(INITIAL_APP_STATE);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setAppState]);

  if (isLoading) {
    return <LoadingOverlay fullScreen message="Loading application..." />;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 ${
        uiState.isFullscreen ? 'p-0' : 'p-6'
      }`}
    >
      <div
        className={`h-full w-full overflow-hidden bg-white ${
          uiState.isFullscreen ? 'rounded-none' : 'rounded-lg border border-gray-300'
        }`}
      >
        <div className="relative h-full w-full">
          {!appState?.floorplanImageUrl ? (
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
