import React from 'react';
import { useFloorplan } from '../../context/FloorplanContext';

const RightPanel: React.FC = () => {
  const { appState } = useFloorplan();
  const selectedDevice = appState.devices.find(device => device.id === appState.selectedElementId);

  if (!selectedDevice) {
    return (
      <div className="h-full w-64 rounded-md bg-white p-4 shadow-sm">
        <div className="text-center text-gray-500">No device selected</div>
      </div>
    );
  }

  return (
    <div className="h-full w-64 rounded-md bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">{selectedDevice.name}</h3>
      <div className="space-y-2">
        <div>
          <span className="text-gray-500">Type:</span>
          <span className="ml-2">{selectedDevice.type}</span>
        </div>
        {!selectedDevice.placeholder && (
          <>
            <div>
              <span className="text-gray-500">Label:</span>
              <span className="ml-2">{selectedDevice.label}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 ${selectedDevice.active ? 'text-green-500' : 'text-red-500'}`}>
                {selectedDevice.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Battery:</span>
              <span className="ml-2">{selectedDevice.battery}%</span>
            </div>
            <div>
              <span className="text-gray-500">Mounting Height:</span>
              <span className="ml-2">{selectedDevice.mountingHeight} ft</span>
            </div>
            <div>
              <span className="text-gray-500">Location:</span>
              <span className="ml-2">{selectedDevice.mountingLocation}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
