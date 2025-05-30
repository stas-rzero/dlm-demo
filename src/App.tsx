import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import FloorplanCanvas from './components/FloorplanCanvas';
import FloorplanUpload from './components/FloorplanUpload';
import UIControls from './components/UIControls';
import { FloorplanProvider } from './context/FloorplanProvider';
import { useFloorplan } from './context/useFloorplan';
import { getFloorplanById, INITIAL_APP_STATE } from './utils/mockData';
import LoadingOverlay from './components/LoadingOverlay';

interface AppProps {
  baseUrl: string;
}

const FloorplanApp: React.FC = () => {
  const { appState, setAppState } = useFloorplan();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate API call to fetch data
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (id) {
          const floorplanData = getFloorplanById(id);
          if (floorplanData) {
            setAppState(floorplanData);
          } else {
            // If floorplan not found, redirect to root
            navigate('/');
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
  }, [id, navigate, setAppState]);

  if (isLoading) {
    return <LoadingOverlay fullScreen message="Loading application..." />;
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

const App: React.FC<AppProps> = ({ baseUrl }) => {
  return (
    <BrowserRouter basename={baseUrl}>
      <FloorplanProvider>
        <Routes>
          <Route path="/" element={<FloorplanApp />} />
          <Route path="/:id" element={<FloorplanApp />} />
        </Routes>
      </FloorplanProvider>
    </BrowserRouter>
  );
};

export default App;
