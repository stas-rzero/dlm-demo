import React, { useState, useEffect } from 'react';
import FloorplanCanvas from './components/FloorplanCanvas';
import FloorplanUpload from './components/FloorplanUpload';
import UIControls from './components/UIControls';
import { FloorplanAppState, AppUIState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<FloorplanAppState>({
    mode: 'planning',
    floorplanImageUrl: null,
    imageScale: 1,
    imageRotation: 0,
    scaleRatio: null,
    devices: [],
    unassignedDevices: [],
    selectedElementId: null,
    currentTypeToPlace: null,
    currentUnassignedDeviceIdToPlace: null,
    isMeasuring: false,
    isCalibrating: false,
  });

  const [uiState, setUIState] = useState<AppUIState>({
    showLeftPanel: false,
    showRightPanel: false,
    zoomLevel: 1,
    imageLocked: false,
    isCalibrating: false,
    gridSize: 1, // Default grid size is 1 foot
  });

  // Update right panel visibility when selectedElementId changes
  useEffect(() => {
    setUIState(prev => ({
      ...prev,
      showRightPanel: !!appState.selectedElementId,
    }));
  }, [appState.selectedElementId]);

  const handleFileInputUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload(file);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAppState(prev => ({
        ...prev,
        floorplanImageUrl: reader.result as string,
        imageScale: 1,
        imageRotation: 0,
        scaleRatio: null,
        isCalibrating: true,
      }));
      setUIState(prev => ({
        ...prev,
        zoomLevel: 1,
        imageLocked: false,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageScale = (delta: number) => {
    if (uiState.imageLocked) return;
    const newImageScale = Math.min(Math.max(appState.imageScale + delta, 0.1), 3);
    setAppState(prev => ({
      ...prev,
      imageScale: newImageScale,
    }));
  };

  const handleImageRotation = (delta: number) => {
    const newRotation = (appState.imageRotation + delta) % 360;
    setAppState(prev => ({
      ...prev,
      imageRotation: newRotation,
    }));
  };

  const handleCalibrationComplete = () => {
    setAppState(prev => ({
      ...prev,
      isCalibrating: false,
    }));
    setUIState(prev => ({
      ...prev,
      imageLocked: true,
    }));
  };

  const handleZoom = (delta: number) => {
    const newZoomLevel = Math.min(Math.max(uiState.zoomLevel + delta, 0.5), 2.5);
    setUIState(prev => ({
      ...prev,
      zoomLevel: newZoomLevel,
    }));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="h-[800px] w-[1280px] overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="relative h-full w-full">
          {!appState.floorplanImageUrl ? (
            <FloorplanUpload onImageUpload={handleImageUpload} />
          ) : (
            <>
              <FloorplanCanvas
                state={appState}
                uiState={uiState}
                onUIStateChange={setUIState}
                onImageScale={handleImageScale}
                onImageRotation={handleImageRotation}
                onCalibrationComplete={handleCalibrationComplete}
              />
              <UIControls
                state={appState}
                uiState={uiState}
                onUIStateChange={setUIState}
                onStateChange={setAppState}
                onImageUpload={handleFileInputUpload}
                onImageResize={handleImageScale}
                onImageRotation={handleImageRotation}
                onZoom={handleZoom}
                onCalibrationComplete={handleCalibrationComplete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
