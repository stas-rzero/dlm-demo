import React from 'react';
import { useFloorplan } from '../../context/FloorplanContext';

const Toolbar: React.FC = () => {
  const { uiState, setUIState, handleImageScale, handleImageUpload } = useFloorplan();

  const toggleLeftPanel = () => {
    setUIState(prev => ({
      ...prev,
      showLeftPanel: !prev.showLeftPanel,
    }));
  };

  const handleFileInputUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload(file);
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
      <input type="file" accept="image/*" onChange={handleFileInputUpload} className="text-sm" />
      {!uiState.imageLocked && (
        <>
          <button
            onClick={() => handleImageScale(0.2)}
            className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
          >
            Image +
          </button>
          <button
            onClick={() => handleImageScale(-0.2)}
            className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
          >
            Image -
          </button>
          <button
            onClick={() => setUIState(prev => ({ ...prev, imageLocked: true }))}
            className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
          >
            Fix Image Size
          </button>
        </>
      )}
      {uiState.imageLocked && (
        <button
          onClick={() => setUIState(prev => ({ ...prev, isCalibrating: true }))}
          className="rounded-md bg-white px-3 py-1.5 text-sm text-gray-800 shadow-md transition-shadow hover:shadow-lg"
        >
          Calibrate
        </button>
      )}
    </div>
  );
};

export default Toolbar;
