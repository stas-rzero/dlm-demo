import React, { useState, useEffect } from "react";
import FloorplanCanvas from "./components/FloorplanCanvas";
import UIControls from "./components/UIControls";
import { FloorplanAppState, AppUIState } from "./types";
import { planningMockState } from "./utils/mockData";

const App: React.FC = () => {
  const [appState, setAppState] = useState<FloorplanAppState>(planningMockState);
  const [uiState, setUIState] = useState<AppUIState>({
    showLeftPanel: false,
    showRightPanel: false,
    imageScale: 1,
    imageLocked: false,
    isCalibrating: false,
  });

  // Update right panel visibility when selectedElementId changes
  useEffect(() => {
    setUIState(prev => ({
      ...prev,
      showRightPanel: !!appState.selectedElementId,
    }));
  }, [appState.selectedElementId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAppState({
        ...appState,
        floorplanImageUrl: reader.result as string,
        scaleRatio: null,
      });
      setUIState(prev => ({
        ...prev,
        imageScale: 1,
        imageLocked: false,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageResize = (delta: number) => {
    if (uiState.imageLocked) return;
    const newImageScale = Math.min(Math.max(uiState.imageScale + delta, 0.1), 3);
    setUIState(prev => ({
      ...prev,
      imageScale: newImageScale,
    }));
  };

  const handleZoom = (delta: number) => {
    const newZoomLevel = Math.min(Math.max(appState.zoomLevel + delta, 0.5), 2.5);
    setAppState({
      ...appState,
      zoomLevel: newZoomLevel,
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-[1280px] h-[800px] bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="relative w-full h-full">
          <FloorplanCanvas
            state={appState}
            onStateChange={setAppState}
            imageScale={uiState.imageScale}
            setImageScale={(scale) => setUIState(prev => ({ ...prev, imageScale: scale }))}
            imageLocked={uiState.imageLocked}
            setImageLocked={(locked) => setUIState(prev => ({ ...prev, imageLocked: locked }))}
            isCalibrating={uiState.isCalibrating}
            setIsCalibrating={(calibrating) => setUIState(prev => ({ ...prev, isCalibrating: calibrating }))}
          />
          <UIControls
            state={appState}
            onStateChange={setAppState}
            uiState={uiState}
            onUIStateChange={setUIState}
            onImageUpload={handleFileUpload}
            onImageResize={handleImageResize}
            onZoom={handleZoom}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
