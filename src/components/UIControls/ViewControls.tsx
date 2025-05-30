import React from 'react';
import { GRID_SIZES } from '../../types';
import { useFloorplan } from '../../context/useFloorplan';

const ViewControls: React.FC = () => {
  const { uiState, setUIState, handleZoom, toggleFullscreen } = useFloorplan();

  const handleGridSizeChange = () => {
    const nextIndex = (uiState.gridSizeIndex + 1) % GRID_SIZES.length;
    setUIState(prev => ({
      ...prev,
      gridSizeIndex: nextIndex,
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md bg-white shadow-md transition-shadow hover:shadow-lg">
        <button
          onClick={() => handleZoom(-1)}
          className="cursor-pointer touch-manipulation px-3 py-1.5 text-sm text-gray-800 select-none"
        >
          -
        </button>
        <p className="min-w-[60px] border-x border-gray-200 text-center text-sm text-gray-600">
          {Math.round(uiState.zoomLevel * 100)}%
        </p>
        <button
          onClick={() => handleZoom(1)}
          className="cursor-pointer touch-manipulation px-3 py-1.5 text-sm text-gray-800 select-none"
        >
          +
        </button>
      </div>

      <button
        onClick={handleGridSizeChange}
        className="cursor-pointer touch-manipulation rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow select-none hover:shadow-lg"
      >
        Grid: {GRID_SIZES[uiState.gridSizeIndex]}ft
      </button>

      <button
        onClick={toggleFullscreen}
        className="cursor-pointer touch-manipulation rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow select-none hover:shadow-lg"
      >
        {uiState.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
    </div>
  );
};

export default ViewControls;
