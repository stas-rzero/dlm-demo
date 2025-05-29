import React from 'react';
import { useFloorplan } from '../../context/useFloorplan';

const Toolbar: React.FC = () => {
  const { uiState, setUIState } = useFloorplan();

  const toggleLeftPanel = () => {
    setUIState(prev => ({
      ...prev,
      showLeftPanel: !prev.showLeftPanel,
    }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggleLeftPanel}
        className={`rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg ${
          uiState.showLeftPanel ? 'bg-gray-100' : ''
        }`}
      >
        Devices
      </button>
      <button
        onClick={() => setUIState(prev => ({ ...prev, isCalibrating: true }))}
        className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
      >
        Recalibrate
      </button>
    </div>
  );
};

export default Toolbar;
