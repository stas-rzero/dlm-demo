import React from 'react';
import Toolbar from './Toolbar';
import ViewControls from './ViewControls';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import CalibrationControls from './CalibrationControls';
import { useFloorplan } from '../../context/FloorplanContext';

const UIControls: React.FC = () => {
  const { appState, uiState } = useFloorplan();

  return (
    <>
      {appState.isCalibrating ? (
        <CalibrationControls />
      ) : (
        <>
          {/* Top toolbar area - full width with left-aligned controls */}
          <div className="pointer-events-auto absolute top-0 right-0 left-0 h-[64px] p-4">
            <div className="flex h-full items-center justify-start gap-4">
              <Toolbar />
            </div>
          </div>

          {/* View controls in bottom right corner */}
          <div className="pointer-events-auto absolute right-4 bottom-4">
            <ViewControls />
          </div>

          {/* Left panel */}
          {uiState.showLeftPanel && (
            <div className="pointer-events-auto absolute top-[64px] bottom-0 left-0">
              <LeftPanel />
            </div>
          )}

          {/* Right panel */}
          {uiState.showRightPanel && (
            <div className="pointer-events-auto absolute top-[64px] right-0 bottom-0">
              <RightPanel />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UIControls;
