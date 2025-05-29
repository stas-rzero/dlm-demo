import React from 'react';
import { useFloorplan } from '../../context/FloorplanContext';

const CalibrationControls: React.FC = () => {
  const {
    appState,
    setAppState,
    setUIState,
    handleImageScale,
    handleImageRotation,
    handleCalibrationComplete,
  } = useFloorplan();

  const handleComplete = () => {
    // Update app state
    setAppState(prev => ({
      ...prev,
      isCalibrating: false,
    }));
    // Update UI state
    setUIState(prev => ({
      ...prev,
      imageLocked: true,
    }));
    handleCalibrationComplete();
  };

  return (
    <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
      <div className="mb-4 text-center">
        <h2 className="mb-2 text-lg font-medium text-gray-800">Calibrate Floorplan</h2>
        <p className="text-sm text-gray-600">
          Adjust the image size and scale to match the grid (1 square = 1 foot)
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Image Scale Controls */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">Image Size:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleImageScale(-0.1)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-sm text-gray-800">{appState.imageScale.toFixed(1)}x</span>
            <button
              onClick={() => handleImageScale(0.1)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Scale Ratio Controls */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">Pixels per Foot:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={appState.scaleRatio || 50}
              onChange={e => {
                setAppState(prev => ({
                  ...prev,
                  scaleRatio: parseInt(e.target.value) || 50,
                }));
              }}
              className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-sm text-gray-600">px/ft</span>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">Rotation:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleImageRotation(-90)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              ↺
            </button>
            <span className="text-sm text-gray-800">{appState.imageRotation}°</span>
            <button
              onClick={() => handleImageRotation(90)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              ↻
            </button>
          </div>
        </div>

        {/* Complete Button */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleComplete}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-600"
          >
            Complete Calibration
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationControls;
