import React from 'react';
import { FloorplanAppState, DeviceOrPlaceholder } from '../../types';

type Props = {
  state: FloorplanAppState;
  onStateChange: (newState: FloorplanAppState) => void;
};

const RightPanel: React.FC<Props> = ({ state }) => {
  const selectedDevice = state.devices.find(device => device.id === state.selectedElementId);

  if (!selectedDevice) {
    return (
      <div className="w-64 h-full bg-white shadow-sm rounded-md p-4">
        <div className="text-gray-500 text-center">No device selected</div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-white shadow-sm rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">{selectedDevice.name}</h3>
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