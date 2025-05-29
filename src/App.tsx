import React, { useEffect, useState } from 'react';
import FloorplanCanvas from './components/FloorplanCanvas';
import FloorplanUpload from './components/FloorplanUpload';
import UIControls from './components/UIControls';
import { FloorplanProvider } from './context/FloorplanProvider';
import { useFloorplan } from './context/useFloorplan';
import { planningMockState } from './utils/mockData';
import { FloorplanAppState } from './types';

const INITIAL_APP_STATE: FloorplanAppState = {
  mode: 'planning',
  floorplanImageUrl: null,
  imageScale: 1,
  imageRotation: 0,
  scaleRatio: 50,
  devices: [],
  unassignedDevices: [],
  selectedElementId: null,
  currentTypeToPlace: null,
  currentUnassignedDeviceIdToPlace: null,
  isMeasuring: false,
};

const LoadingOverlay: React.FC = () => (
  <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
  </div>
);

const FloorplanApp: React.FC = () => {
  const { appState, setAppState } = useFloorplan();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate API call to fetch data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you would check if there's existing data
        // For now, we'll use the mock data
        setAppState(planningMockState);
      } catch (error) {
        console.error('Failed to load data:', error);
        setAppState(INITIAL_APP_STATE);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="h-[800px] w-[1280px] overflow-hidden rounded-lg border border-gray-300 bg-white">
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
