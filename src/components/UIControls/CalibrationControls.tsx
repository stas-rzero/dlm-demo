import React from 'react';
import { FloorplanAppState, AppUIState } from '../../types';

type Props = {
  state: FloorplanAppState;
  uiState: AppUIState;
  onStateChange: (newState: FloorplanAppState) => void;
  onUIStateChange: (newState: AppUIState) => void;
  onImageScale: (delta: number) => void;
  onImageRotation: (delta: number) => void;
  onCalibrationComplete: () => void;
};

const CalibrationControls: React.FC<Props> = ({
  state,
  uiState,
  onStateChange,
  onUIStateChange,
  onImageScale,
  onImageRotation,
  onCalibrationComplete,
}) => {
  const handleScaleRatioChange = (delta: number) => {
    const currentRatio = state.scaleRatio || 50; // Default to 50px per foot if not set
    const newRatio = Number((currentRatio * (1 + delta)).toFixed(2));

    // Create a new state object with all existing properties
    const newState: FloorplanAppState = {
      ...state,
      scaleRatio: newRatio,
    };

    onStateChange(newState);
  };

  const handleComplete = () => {
    // Update app state
    onStateChange({
      ...state,
      isCalibrating: false,
    });
    // Update UI state
    onUIStateChange({
      ...uiState,
      imageLocked: true,
    });
    onCalibrationComplete();
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
              onClick={() => onImageScale(-0.1)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-sm text-gray-800">{state.imageScale.toFixed(1)}x</span>
            <button
              onClick={() => onImageScale(0.1)}
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
            <button
              onClick={() => handleScaleRatioChange(-0.1)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-sm text-gray-800">
              {(state.scaleRatio || 50).toFixed(2)} px/ft
            </span>
            <button
              onClick={() => handleScaleRatioChange(0.1)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-gray-600">Rotation:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onImageRotation(-90)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition-colors hover:bg-gray-200"
            >
              ↺
            </button>
            <span className="text-sm text-gray-800">{state.imageRotation}°</span>
            <button
              onClick={() => onImageRotation(90)}
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
