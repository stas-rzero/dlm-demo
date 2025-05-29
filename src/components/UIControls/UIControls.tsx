import React from 'react';
import Toolbar from './Toolbar';
import ViewControls from './ViewControls';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import CalibrationControls from './CalibrationControls';
import { FloorplanAppState, AppUIState } from '../../types';

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
  uiState: AppUIState;
  onUIStateChange: (newState: AppUIState) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageResize: (delta: number) => void;
  onImageRotation: (delta: number) => void;
  onZoom: (delta: number) => void;
  onCalibrationComplete: () => void;
};

const UIControls: React.FC<Props> = ({
  state,
  onStateChange,
  uiState,
  onUIStateChange,
  onImageUpload,
  onImageResize,
  onImageRotation,
  onZoom,
  onCalibrationComplete,
}) => {
  return (
    <>
      {state.isCalibrating ? (
        <CalibrationControls
          state={state}
          uiState={uiState}
          onStateChange={onStateChange}
          onUIStateChange={onUIStateChange}
          onImageScale={onImageResize}
          onImageRotation={onImageRotation}
          onCalibrationComplete={onCalibrationComplete}
        />
      ) : (
        <>
          {/* Top toolbar area - full width with left-aligned controls */}
          <div className="pointer-events-auto absolute top-0 right-0 left-0 h-[64px] p-4">
            <div className="flex h-full items-center justify-start gap-4">
              <Toolbar
                state={state}
                onStateChange={onStateChange}
                onImageUpload={onImageUpload}
                onImageResize={onImageResize}
                onLockImage={() => onUIStateChange({ ...uiState, imageLocked: true })}
                onCalibrate={() => onUIStateChange({ ...uiState, isCalibrating: true })}
                imageLocked={uiState.imageLocked}
                uiState={uiState}
                onUIStateChange={onUIStateChange}
              />
            </div>
          </div>

          {/* View controls in bottom right corner */}
          <div className="pointer-events-auto absolute right-4 bottom-4">
            <ViewControls
              state={state}
              uiState={uiState}
              onUIStateChange={onUIStateChange}
              onZoom={onZoom}
            />
          </div>

          {/* Left panel */}
          {uiState.showLeftPanel && (
            <div className="pointer-events-auto absolute top-[64px] bottom-0 left-0">
              <LeftPanel state={state} onStateChange={onStateChange} />
            </div>
          )}

          {/* Right panel */}
          {uiState.showRightPanel && (
            <div className="pointer-events-auto absolute top-[64px] right-0 bottom-0">
              <RightPanel state={state} onStateChange={onStateChange} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UIControls;
