import React, { createContext } from 'react';
import { FloorplanAppState, AppUIState } from '../types';

interface FloorplanContextType {
  appState: FloorplanAppState | null;
  setAppState: React.Dispatch<React.SetStateAction<FloorplanAppState | null>>;
  uiState: AppUIState;
  setUIState: React.Dispatch<React.SetStateAction<AppUIState>>;
  handleImageUpload: (file: File) => void;
  handleImageScale: (delta: number) => void;
  handleImageRotation: (delta: number) => void;
  handleCalibrationComplete: () => void;
  handleZoom: (delta: number) => void;
}

export const FloorplanContext = createContext<FloorplanContextType | undefined>(undefined);
