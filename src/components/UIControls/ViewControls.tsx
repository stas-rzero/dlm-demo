import React from 'react';
import { FloorplanAppState, AppUIState, GRID_SIZES } from '../../types';

type Props = {
  state: FloorplanAppState;
  uiState: AppUIState;
  onUIStateChange: (newState: AppUIState) => void;
  onZoom: (delta: number) => void;
};

const ViewControls: React.FC<Props> = ({ uiState, onUIStateChange, onZoom }) => {
  const handleGridSizeChange = () => {
    const nextIndex = (uiState.gridSizeIndex + 1) % GRID_SIZES.length;
    onUIStateChange({
      ...uiState,
      gridSizeIndex: nextIndex,
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
        Grid: {GRID_SIZES[uiState.gridSizeIndex]}ft
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
