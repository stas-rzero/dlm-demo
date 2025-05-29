import React from 'react';
import { FloorplanAppState, AppUIState } from '../../types';

type Props = {
  state: FloorplanAppState;
  uiState: AppUIState;
  onUIStateChange: (newState: AppUIState) => void;
  onZoom: (delta: number) => void;
};

const GRID_SIZE_OPTIONS = [0.5, 1, 2, 5, 10] as const;
type GridSize = (typeof GRID_SIZE_OPTIONS)[number];

const ViewControls: React.FC<Props> = ({ uiState, onUIStateChange, onZoom }) => {
  const handleGridSizeChange = () => {
    const currentIndex = GRID_SIZE_OPTIONS.indexOf(uiState.gridSize as GridSize);
    const nextIndex = (currentIndex + 1) % GRID_SIZE_OPTIONS.length;
    onUIStateChange({
      ...uiState,
      gridSize: GRID_SIZE_OPTIONS[nextIndex],
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onZoom(-0.2)}
          className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
        >
          -
        </button>
        <button
          onClick={() => onZoom(0.2)}
          className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
        >
          +
        </button>
      </div>

      <button
        onClick={handleGridSizeChange}
        className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
      >
        Grid: {uiState.gridSize}ft
      </button>

      <button
        onClick={() => document.documentElement.requestFullscreen()}
        className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
      >
        Fullscreen
      </button>
    </div>
  );
};

export default ViewControls;
