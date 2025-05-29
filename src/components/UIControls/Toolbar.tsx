import React from 'react';
import { FloorplanAppState, AppUIState } from '../../types';

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageResize: (delta: number) => void;
  onLockImage: () => void;
  onCalibrate: () => void;
  imageLocked: boolean;
  uiState: AppUIState;
  onUIStateChange: (newState: AppUIState) => void;
};

const Toolbar: React.FC<Props> = ({
  state,
  onStateChange,
  onImageUpload,
  onImageResize,
  onLockImage,
  onCalibrate,
  imageLocked,
  uiState,
  onUIStateChange,
}) => {
  const toggleLeftPanel = () => {
    onUIStateChange({
      ...uiState,
      showLeftPanel: !uiState.showLeftPanel,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={toggleLeftPanel}
        className={`px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm ${
          uiState.showLeftPanel ? 'bg-gray-100' : ''
        }`}
      >
        Devices
      </button>
      <input type="file" accept="image/*" onChange={onImageUpload} className="text-sm" />
      {!imageLocked && (
        <>
          <button 
            onClick={() => onImageResize(0.2)} 
            className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
          >
            Image +
          </button>
          <button 
            onClick={() => onImageResize(-0.2)} 
            className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
          >
            Image -
          </button>
          <button 
            onClick={onLockImage} 
            className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
          >
            Fix Image Size
          </button>
        </>
      )}
      {imageLocked && (
        <button 
          onClick={onCalibrate} 
          className="px-3 py-1.5 bg-white text-gray-800 rounded-md shadow-md hover:shadow-lg transition-shadow text-sm"
        >
          Calibrate
        </button>
      )}
    </div>
  );
};

export default Toolbar; 