import React from "react";
import Toolbar from "./Toolbar";
import ViewControls from "./ViewControls";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { FloorplanAppState, AppUIState } from "../../types";

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
  uiState: AppUIState;
  onUIStateChange: (newState: AppUIState) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageResize: (delta: number) => void;
  onZoom: (delta: number) => void;
};

const UIControls: React.FC<Props> = ({
  state,
  onStateChange,
  uiState,
  onUIStateChange,
  onImageUpload,
  onImageResize,
  onZoom,
}) => {
  return (
    <>
      {/* Top toolbar area - full width with left-aligned controls */}
      <div className="absolute top-0 left-0 right-0 h-[64px] p-4 pointer-events-auto">
        <div className="flex justify-start gap-4 h-full items-center">
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
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <ViewControls
          state={state}
          onStateChange={onStateChange}
          onZoom={onZoom}
        />
      </div>

      {/* Left panel */}
      {uiState.showLeftPanel && (
        <div className="absolute top-[64px] left-0 bottom-0 pointer-events-auto">
          <LeftPanel state={state} onStateChange={onStateChange} />
        </div>
      )}

      {/* Right panel */}
      {uiState.showRightPanel && (
        <div className="absolute top-[64px] right-0 bottom-0 pointer-events-auto">
          <RightPanel state={state} onStateChange={onStateChange} />
        </div>
      )}
    </>
  );
};

export default UIControls; 