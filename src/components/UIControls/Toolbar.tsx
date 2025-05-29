import React from 'react';
import { useFloorplan } from '../../context/useFloorplan';

const Toolbar: React.FC = () => {
  const { uiState, setUIState, setAppState } = useFloorplan();

  const toggleLeftPanel = () => {
    const newShowLeftPanel = !uiState.showLeftPanel;
    setUIState(prev => ({
      ...prev,
      showLeftPanel: newShowLeftPanel,
    }));

    // If we're closing the panel, deselect the current device type
    if (!newShowLeftPanel) {
      setAppState(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentTypeToPlace: null,
        };
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggleLeftPanel}
        className={`cursor-pointer rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow select-none hover:shadow-lg ${
          uiState.showLeftPanel ? 'bg-gray-100' : ''
        }`}
      >
        Devices
      </button>
      <button
        onClick={() => setUIState(prev => ({ ...prev, isCalibrating: true }))}
        className="cursor-pointer rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow select-none hover:shadow-lg"
      >
        Recalibrate
      </button>
    </div>
  );
};

export default Toolbar;
