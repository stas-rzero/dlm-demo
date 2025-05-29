import React from 'react';
import { useFloorplan } from '../../context/useFloorplan';

const LeftPanel: React.FC = () => {
  const { appState, setAppState } = useFloorplan();

  return (
    <div className="h-full w-64 rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Devices</h3>
      <div className="space-y-2">
        {appState.devices.map(device => (
          <div
            key={device.id}
            className={`cursor-pointer rounded p-2 ${
              appState.selectedElementId === device.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setAppState(prev => ({ ...prev, selectedElementId: device.id }))}
          >
            <div className="font-medium">{device.name}</div>
            <div className="text-sm text-gray-500">{device.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
