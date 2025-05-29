import React, { useState, useEffect, ReactNode } from 'react';
import { FloorplanContext } from './FloorplanContext';
import { FloorplanAppState, AppUIState } from '../types';

interface FloorplanProviderProps {
  children: ReactNode;
}

export const FloorplanProvider: React.FC<FloorplanProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<FloorplanAppState | null>(null);

  const [uiState, setUIState] = useState<AppUIState>({
    showLeftPanel: false,
    showRightPanel: false,
    zoomLevel: 1,
    isCalibrating: false,
    gridSizeIndex: 1,
  });

  useEffect(() => {
    if (appState?.selectedElementId) {
      setUIState(prev => ({
        ...prev,
        showRightPanel: true,
      }));
    } else {
      setUIState(prev => ({
        ...prev,
        showRightPanel: false,
      }));
    }
  }, [appState?.selectedElementId]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAppState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          floorplanImageUrl: reader.result as string,
          imageScale: 1,
          imageRotation: 0,
          scaleRatio: 50,
        };
      });
      setUIState(prev => ({
        ...prev,
        zoomLevel: 1,
        isCalibrating: true,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageScale = (delta: number) => {
    if (!appState) return;
    const newImageScale = Math.min(Math.max(appState.imageScale + delta, 0.1), 3);
    setAppState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        imageScale: newImageScale,
      };
    });
  };

  const handleImageRotation = (delta: number) => {
    if (!appState) return;
    const newRotation = (appState.imageRotation + delta) % 360;
    setAppState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        imageRotation: newRotation,
      };
    });
  };

  const handleCalibrationComplete = () => {
    setUIState(prev => ({
      ...prev,
      isCalibrating: false,
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
