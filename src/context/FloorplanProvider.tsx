import React, { useState, useEffect, ReactNode } from 'react';
import { FloorplanContext } from './FloorplanContext';
import { FloorplanAppState, AppUIState } from '../types';

interface FloorplanProviderProps {
  children: ReactNode;
}

export const FloorplanProvider: React.FC<FloorplanProviderProps> = ({ children }) => {
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
    gridSizeIndex: 1,
  });

  useEffect(() => {
    setUIState(prev => ({
      ...prev,
      showRightPanel: !!appState.selectedElementId,
    }));
  }, [appState.selectedElementId]);

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

  const value = {
    appState,
    setAppState,
    uiState,
    setUIState,
    handleImageUpload,
    handleImageScale,
    handleImageRotation,
    handleCalibrationComplete,
    handleZoom,
  };

  return <FloorplanContext.Provider value={value}>{children}</FloorplanContext.Provider>;
};
